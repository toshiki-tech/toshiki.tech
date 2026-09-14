import { NextResponse } from 'next/server';
import { getSupabase, requireAdmin } from '@/lib/supabase-server-api';
import { deleteObjects } from '@/lib/r2';
import { getServiceClient, FILE_UPDATE_COLUMNS, type FileUpdateRow } from '@/lib/yomi-file-updates';

/**
 * Approve or reject a new version an uploader submitted for an approved upload.
 * Unlike a first review this never awards points. `submittedAt` is the version
 * the admin looked at: if the uploader has submitted another one since, the
 * decision is refused rather than applied to a file nobody reviewed.
 */
export async function POST(request: Request) {
  const admin = await requireAdmin(getSupabase());
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { uploadId, action, submittedAt } = await request.json();
  if (!uploadId || !submittedAt || !['approved', 'rejected'].includes(action)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const svc = getServiceClient();
  const { data } = await svc
    .from('toshiki_tech_yomi_uploads')
    .select(FILE_UPDATE_COLUMNS)
    .eq('id', uploadId)
    .maybeSingle();
  const upload = data as unknown as FileUpdateRow | null;

  if (!upload?.pending_submitted_at) {
    return NextResponse.json({ error: 'No new version is waiting for review' }, { status: 404 });
  }
  if (new Date(upload.pending_submitted_at).getTime() !== new Date(submittedAt).getTime()) {
    return NextResponse.json(
      { error: 'The uploader submitted another version in the meantime. Reload and review it again.' },
      { status: 409 }
    );
  }

  const clearPending = {
    pending_storage_path: null,
    pending_file_name: null,
    pending_audio_storage_path: null,
    pending_audio_file_name: null,
    pending_note: null,
    pending_submitted_at: null,
  };

  const update =
    action === 'approved'
      ? {
          ...clearPending,
          ...(upload.pending_storage_path
            ? { yomi_storage_path: upload.pending_storage_path, yomi_file_name: upload.pending_file_name }
            : {}),
          ...(upload.pending_audio_storage_path
            ? { audio_storage_path: upload.pending_audio_storage_path, audio_file_name: upload.pending_audio_file_name }
            : {}),
          file_version: (upload.file_version || 1) + 1,
          file_updated_at: new Date().toISOString(),
          file_update_rejected_at: null,
        }
      : { ...clearPending, file_update_rejected_at: new Date().toISOString() };

  // Matching on pending_submitted_at again closes the gap between read and write.
  const { data: updated, error } = await svc
    .from('toshiki_tech_yomi_uploads')
    .update(update)
    .eq('id', uploadId)
    .eq('pending_submitted_at', upload.pending_submitted_at)
    .select('id');

  if (error) {
    console.error('Review file update error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
  if (!updated || updated.length === 0) {
    return NextResponse.json(
      { error: 'The uploader submitted another version in the meantime. Reload and review it again.' },
      { status: 409 }
    );
  }

  await deleteObjects(
    action === 'approved'
      ? [
          upload.pending_storage_path ? upload.yomi_storage_path : null,
          upload.pending_audio_storage_path ? upload.audio_storage_path : null,
        ]
      : [upload.pending_storage_path, upload.pending_audio_storage_path]
  );

  return NextResponse.json({ success: true });
}
