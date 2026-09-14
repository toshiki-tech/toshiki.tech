import { NextResponse } from 'next/server';
import { getSupabase, getAuthUser } from '@/lib/supabase-server-api';
import { getUploadPresignedUrl } from '@/lib/r2';
import {
  validateStoredFile,
  storedFileExtension,
  storedFileContentType,
  type StoredFileKind,
} from '@/lib/yomi-upload-files';

export async function POST(request: Request) {
  const supabase = getSupabase();
  const user = await getAuthUser(supabase);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { fileName, fileSize, isZip } = body;
  // `kind` is optional for backwards compatibility: 'yomi' | 'zip' | 'media' |
  // 'yomibook'. Falls back to inferring from `isZip` when omitted.
  const requestedKind = body.kind ?? (isZip ? 'zip' : 'yomi');
  const kind: StoredFileKind = ['zip', 'media', 'yomibook'].includes(requestedKind) ? requestedKind : 'yomi';

  if (!fileName || typeof fileSize !== 'number') {
    return NextResponse.json({ error: 'Missing fileName or fileSize' }, { status: 400 });
  }

  const invalid = validateStoredFile(kind, fileName, fileSize);
  if (invalid) {
    return NextResponse.json({ error: invalid }, { status: 400 });
  }

  const uploadId = crypto.randomUUID();
  const safeExt = storedFileExtension(kind, fileName);
  const key = `${kind}/${uploadId}/file.${safeExt}`;
  const contentType = storedFileContentType(kind, safeExt);

  const presignedUrl = await getUploadPresignedUrl(key, contentType);

  return NextResponse.json({ uploadId, storagePath: key, presignedUrl, contentType });
}
