import { NextResponse } from 'next/server';
import { getSupabase, getAuthUser } from '@/lib/supabase-server-api';
import { getUploadPresignedUrl } from '@/lib/r2';
import { MAX_YOMI_FILE_SIZE, MAX_ZIP_FILE_SIZE } from '@/lib/yomi-constants';

export async function POST(request: Request) {
  const supabase = getSupabase();
  const user = await getAuthUser(supabase);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { fileName, fileSize, isZip } = await request.json();
  if (!fileName || typeof fileSize !== 'number') {
    return NextResponse.json({ error: 'Missing fileName or fileSize' }, { status: 400 });
  }

  // Size validation
  if (isZip && fileSize > MAX_ZIP_FILE_SIZE) {
    return NextResponse.json({ error: `ZIP file too large (max ${MAX_ZIP_FILE_SIZE / 1024 / 1024}MB)` }, { status: 400 });
  }
  if (!isZip && fileSize > MAX_YOMI_FILE_SIZE) {
    return NextResponse.json({ error: `.yomi file too large (max ${MAX_YOMI_FILE_SIZE / 1024 / 1024}MB)` }, { status: 400 });
  }

  const uploadId = crypto.randomUUID();
  const ext = fileName.split('.').pop()?.toLowerCase() || (isZip ? 'zip' : 'yomi');
  const key = isZip ? `zip/${uploadId}/file.${ext}` : `yomi/${uploadId}/file.${ext}`;
  const contentType = isZip ? 'application/zip' : 'text/plain';

  const presignedUrl = await getUploadPresignedUrl(key, contentType);

  return NextResponse.json({ uploadId, storagePath: key, presignedUrl, contentType });
}
