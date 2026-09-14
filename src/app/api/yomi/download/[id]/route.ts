import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-server-api';
import { getDownloadPresignedUrl } from '@/lib/r2';
import { defaultDownloadName } from '@/lib/yomi-upload-files';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = getSupabase();
  const url = new URL(request.url);
  const downloadType = url.searchParams.get('type'); // 'media' or null
  // ?pending=1 serves a new version still waiting for review, not the live file.
  const wantsPending = url.searchParams.get('pending') === '1';

  // Fetch upload record
  const { data: upload, error } = await supabase
    .from('toshiki_tech_yomi_uploads')
    .select('*')
    .eq('id', params.id)
    .eq('is_removed', false)
    .single();

  if (error || !upload) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { data: { user: currentUser } } = await supabase.auth.getUser();

  // Hidden uploads, and anything still awaiting review (a first upload or a new
  // version of an approved one), can only be downloaded by the uploader or an
  // admin — the reviewer has to open the file to judge it.
  const isRestricted = upload.is_hidden || upload.status !== 'approved' || wantsPending;
  if (isRestricted) {
    let allowed = false;
    if (currentUser) {
      if (currentUser.id === upload.user_id) {
        allowed = true;
      } else {
        const { data: viewerProfile } = await supabase
          .from('toshiki_tech_yomi_profiles')
          .select('role')
          .eq('id', currentUser.id)
          .single();
        if (viewerProfile?.role === 'admin') allowed = true;
      }
    }
    if (!allowed) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
  }

  // Record download + award points atomically via SECURITY DEFINER function
  // (Works for both anonymous and authenticated users, bypassing RLS safely).
  // A review fetch is not a real download, so it neither counts nor pays out.
  if (upload.status === 'approved' && !wantsPending) {
    const { error: rpcError } = await supabase.rpc('record_yomi_download', {
      upload_id: params.id,
      downloader_id: currentUser?.id || null,
    });
    if (rpcError) {
      console.error('record_yomi_download error:', rpcError);
    }
  }

  // Resolve which file to serve. Default = subtitle/zip; ?type=media = media file.
  let storagePath: string;
  let originalName: string;
  if (wantsPending) {
    const pendingPath = downloadType === 'media' ? upload.pending_audio_storage_path : upload.pending_storage_path;
    if (!pendingPath) {
      return NextResponse.json({ error: 'No new version of this file is waiting for review' }, { status: 404 });
    }
    storagePath = pendingPath;
    originalName =
      (downloadType === 'media' ? upload.pending_audio_file_name : upload.pending_file_name) ||
      (downloadType === 'media' ? 'media' : defaultDownloadName(pendingPath));
  } else if (downloadType === 'media') {
    if (!upload.audio_storage_path) {
      return NextResponse.json({ error: 'No media file for this upload' }, { status: 404 });
    }
    storagePath = upload.audio_storage_path;
    originalName = upload.audio_file_name || 'media';
  } else {
    storagePath = upload.yomi_storage_path;
    originalName = upload.yomi_file_name || defaultDownloadName(upload.yomi_storage_path);
  }

  try {
    const presignedUrl = await getDownloadPresignedUrl(storagePath, originalName);
    return NextResponse.redirect(presignedUrl);
  } catch (err) {
    console.error('R2 presign error:', err);
    return NextResponse.json({ error: 'Failed to generate download URL' }, { status: 500 });
  }
}
