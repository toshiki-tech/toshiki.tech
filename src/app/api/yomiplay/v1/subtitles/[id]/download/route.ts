import { NextResponse } from 'next/server';
import { getAnonClient, extractBearerToken, getUserFromBearer } from '@/lib/supabase-bearer';
import { getFeatureFlags } from '@/lib/yomi-feature-flags';
import { getDownloadPresignedUrl } from '@/lib/r2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const url = new URL(request.url);
  const downloadType = url.searchParams.get('type'); // 'subtitle' (default) | 'media'
  const token = extractBearerToken(request);

  const supabase = getAnonClient();

  // Feature flag check — community_download is admin-controlled
  const flags = await getFeatureFlags(supabase);
  if (!flags.community_download) {
    return NextResponse.json(
      { error: 'Community downloads are temporarily disabled.' },
      { status: 503, headers: CORS }
    );
  }

  // Fetch upload record (public fields only via anon key + RLS)
  const { data: upload, error } = await supabase
    .from('toshiki_tech_yomi_uploads')
    .select('id, status, is_removed, visibility, is_hidden, user_id, yomi_storage_path, audio_storage_path, yomi_file_name, audio_file_name')
    .eq('id', params.id)
    .eq('status', 'approved')
    .eq('is_removed', false)
    .single();

  if (error || !upload) {
    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: CORS });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const u = upload as any;

  // Non-public uploads require ownership or admin
  if (u.is_hidden || u.visibility !== 'public') {
    const user = await getUserFromBearer(token);
    let allowed = user?.id === u.user_id;
    if (!allowed && user) {
      const { data: profile } = await supabase
        .from('toshiki_tech_yomi_profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      allowed = (profile as { role: string } | null)?.role === 'admin';
    }
    if (!allowed) {
      return NextResponse.json({ error: 'Not found' }, { status: 404, headers: CORS });
    }
  }

  // Resolve which file to serve
  const useMedia = downloadType === 'media';
  if (useMedia && !u.audio_storage_path) {
    return NextResponse.json({ error: 'No media file for this upload' }, { status: 404, headers: CORS });
  }

  const storagePath: string = useMedia ? u.audio_storage_path : u.yomi_storage_path;
  const fileName: string = useMedia
    ? (u.audio_file_name || 'media')
    : (u.yomi_file_name || (u.yomi_storage_path?.startsWith('zip/') ? 'download.zip' : 'download.yomi'));

  // Record download + award points atomically.
  // record_yomi_download is SECURITY DEFINER — works with anon key.
  // points_feature on/off is handled inside the RPC itself via the feature flags table.
  const user = await getUserFromBearer(token);
  const { error: rpcError } = await supabase.rpc('record_yomi_download', {
    upload_id:    params.id,
    downloader_id: user?.id ?? null,
  });
  if (rpcError) {
    console.error('[v1/download] record_yomi_download error:', rpcError);
  }

  // Generate a short-lived presigned URL (10 min)
  try {
    const presignedUrl = await getDownloadPresignedUrl(storagePath, fileName, 600);
    return NextResponse.json(
      {
        data: {
          url:        presignedUrl,
          file_name:  fileName,
          expires_in: 600,
        },
      },
      { headers: CORS }
    );
  } catch (err) {
    console.error('[v1/download] R2 presign error:', err);
    return NextResponse.json({ error: 'Failed to generate download URL' }, { status: 500, headers: CORS });
  }
}
