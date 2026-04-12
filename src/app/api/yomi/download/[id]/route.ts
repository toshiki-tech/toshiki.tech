import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-server-api';
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

  // Record download + award points atomically via SECURITY DEFINER function
  // (Works for both anonymous and authenticated users, bypassing RLS safely)
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  const { error: rpcError } = await supabase.rpc('record_yomi_download', {
    upload_id: params.id,
    downloader_id: currentUser?.id || null,
  });
  if (rpcError) {
    console.error('record_yomi_download error:', rpcError);
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
