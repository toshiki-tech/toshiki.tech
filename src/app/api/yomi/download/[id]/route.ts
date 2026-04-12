import { NextResponse } from 'next/server';
import { getSupabase, awardPoints } from '@/lib/supabase-server-api';
import { getDownloadPresignedUrl } from '@/lib/r2';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = getSupabase();

  // Fetch upload record
  const { data: upload, error } = await supabase
    .from('toshiki_tech_yomi_uploads')
    .select('*')
    .eq('id', params.id)
    .eq('status', 'approved')
    .eq('is_removed', false)
    .single();

  if (error || !upload) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Increment download count
  await supabase
    .from('toshiki_tech_yomi_uploads')
    .update({ download_count: (upload.download_count || 0) + 1 })
    .eq('id', params.id);

  // Award points to uploader for download received (skip if downloader is uploader)
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (upload.user_id && (!currentUser || currentUser.id !== upload.user_id)) {
    const { data: config } = await supabase
      .from('toshiki_tech_yomi_points_config')
      .select('value')
      .eq('key', 'download_received')
      .single();
    const pts = config?.value || 1;
    await awardPoints(supabase, upload.user_id, 'download_received', pts, `Content downloaded: ${params.id}`);
  }

  // Generate presigned download URL from R2
  const isZip = upload.yomi_storage_path.startsWith('zip/');
  const originalName = upload.yomi_file_name || (isZip ? 'download.zip' : 'download.yomi');

  try {
    const presignedUrl = await getDownloadPresignedUrl(upload.yomi_storage_path, originalName);
    return NextResponse.redirect(presignedUrl);
  } catch (err) {
    console.error('R2 presign error:', err);
    return NextResponse.json({ error: 'Failed to generate download URL' }, { status: 500 });
  }
}
