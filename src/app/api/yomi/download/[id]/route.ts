import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { awardPoints } from '@/lib/supabase-server-api';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
      process.env.PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
      '',
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );

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

  // Award points to uploader for download received
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

  // Download file from storage
  const { data: fileData, error: downloadError } = await supabase.storage
    .from('toshiki-tech-yomi-files')
    .download(upload.yomi_storage_path);

  if (downloadError || !fileData) {
    console.error('Download error:', downloadError);
    return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
  }

  // Determine content type and original filename
  const originalName = upload.yomi_file_name || 'file.yomi';
  const isZip = upload.yomi_storage_path.startsWith('zip/');
  const contentType = isZip ? 'application/zip' : 'text/plain; charset=utf-8';

  // Encode filename for Content-Disposition (RFC 5987)
  // filename= must be ASCII-only, use percent-encoded form for non-ASCII
  const encodedName = encodeURIComponent(originalName).replace(/%20/g, '+');
  const asciiName = isZip ? 'download.zip' : 'download.yomi';

  return new NextResponse(fileData, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${asciiName}"; filename*=UTF-8''${encodedName}`,
      'Cache-Control': 'private, no-cache',
    },
  });
}
