import { NextResponse } from 'next/server';
import { getObjectSize, deleteObjects } from '@/lib/r2';
import { getServiceClient, loadManageableUpload } from '@/lib/yomi-file-updates';
import {
  replaceOutcome,
  validateStoredFile,
  primaryFileKind,
  replacementKeyPrefix,
  type StoredFileKind,
} from '@/lib/yomi-upload-files';

const MAX_NOTE_LENGTH = 500;

/** Checks a submitted path was issued for this upload and the object really arrived */
async function checkSubmittedFile(
  kind: StoredFileKind,
  uploadId: string,
  storagePath: unknown,
  fileName: unknown
): Promise<string | null> {
  if (typeof storagePath !== 'string' || typeof fileName !== 'string' || !fileName) {
    return 'Missing file name';
  }
  if (!storagePath.startsWith(replacementKeyPrefix(kind, uploadId))) {
    return 'File was not uploaded for this item';
  }
  const size = await getObjectSize(storagePath);
  if (size === null) return 'Uploaded file not found';
  return validateStoredFile(kind, fileName, size);
}

/**
 * Commits a new version of an upload's file(s), uploaded beforehand through
 * replace-url. The version goes live at once when an admin submits it, when the
 * upload has not been approved yet, or when its kind needs no review; otherwise
 * it is staged and the approved file keeps being served until an admin decides.
 */
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const result = await loadManageableUpload(params.id);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  const { upload, isAdmin } = result;

  const body = await request.json();
  const { storagePath, fileName, audioStoragePath, audioFileName } = body;
  const note = typeof body.note === 'string' ? body.note.trim().slice(0, MAX_NOTE_LENGTH) : '';

  if (!storagePath && !audioStoragePath) {
    return NextResponse.json({ error: 'No new file submitted' }, { status: 400 });
  }
  // A repeated submit of the same object must not clean it up as "old".
  if (
    (storagePath && storagePath === upload.yomi_storage_path) ||
    (audioStoragePath && audioStoragePath === upload.audio_storage_path)
  ) {
    return NextResponse.json({ error: 'This version is already live' }, { status: 409 });
  }
  if (audioStoragePath && !upload.audio_storage_path) {
    return NextResponse.json({ error: 'This upload has no separate media file' }, { status: 400 });
  }

  const checks = await Promise.all([
    storagePath ? checkSubmittedFile(primaryFileKind(upload), upload.id, storagePath, fileName) : null,
    audioStoragePath ? checkSubmittedFile('media', upload.id, audioStoragePath, audioFileName) : null,
  ]);
  const invalid = checks.find(Boolean);
  if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });

  const svc = getServiceClient();
  const now = new Date().toISOString();
  const clearPending = {
    pending_storage_path: null,
    pending_file_name: null,
    pending_audio_storage_path: null,
    pending_audio_file_name: null,
    pending_note: null,
    pending_submitted_at: null,
  };
  // An earlier version still waiting for review is superseded either way.
  const stalePending = [upload.pending_storage_path, upload.pending_audio_storage_path]
    .filter((path) => path !== storagePath && path !== audioStoragePath);

  const outcome = replaceOutcome(upload, isAdmin);

  if (outcome === 'review') {
    const { error } = await svc
      .from('toshiki_tech_yomi_uploads')
      .update({
        ...clearPending,
        pending_storage_path: storagePath || null,
        pending_file_name: storagePath ? fileName : null,
        pending_audio_storage_path: audioStoragePath || null,
        pending_audio_file_name: audioStoragePath ? audioFileName : null,
        pending_note: note || null,
        pending_submitted_at: now,
        file_update_rejected_at: null,
      })
      .eq('id', upload.id);
    if (error) {
      console.error('Stage file update error:', error);
      return NextResponse.json({ error: 'Failed to save the new version' }, { status: 500 });
    }
    await deleteObjects(stalePending);
    return NextResponse.json({ mode: 'pending' });
  }

  const { error } = await svc
    .from('toshiki_tech_yomi_uploads')
    .update({
      ...clearPending,
      ...(storagePath ? { yomi_storage_path: storagePath, yomi_file_name: fileName } : {}),
      ...(audioStoragePath ? { audio_storage_path: audioStoragePath, audio_file_name: audioFileName } : {}),
      // Nobody outside has seen an unapproved file, so it is not a new version yet.
      ...(upload.status === 'approved'
        ? { file_version: (upload.file_version || 1) + 1, file_updated_at: now }
        : {}),
      file_update_rejected_at: null,
      // A rejected upload goes back into the queue instead of reappearing.
      ...(outcome === 'resubmit' ? { status: 'pending' } : {}),
    })
    .eq('id', upload.id);
  if (error) {
    console.error('Apply file update error:', error);
    return NextResponse.json({ error: 'Failed to save the new version' }, { status: 500 });
  }

  await deleteObjects([
    ...stalePending,
    storagePath ? upload.yomi_storage_path : null,
    audioStoragePath ? upload.audio_storage_path : null,
  ]);
  return NextResponse.json({ mode: 'applied' });
}
