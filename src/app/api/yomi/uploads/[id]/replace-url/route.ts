import { NextResponse } from 'next/server';
import { getUploadPresignedUrl } from '@/lib/r2';
import { loadManageableUpload } from '@/lib/yomi-file-updates';
import {
  validateStoredFile,
  storedFileExtension,
  storedFileContentType,
  primaryFileKind,
  replacementKeyPrefix,
} from '@/lib/yomi-upload-files';

/**
 * Presigned PUT for a new version of an upload's file. `target` is 'primary'
 * (the .yomi / .zip / .yomibook) or 'media' (the separately uploaded audio).
 * The kind is taken from the existing upload, so a version can never change it.
 */
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const result = await loadManageableUpload(params.id);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  const { upload } = result;

  const { target, fileName, fileSize } = await request.json();
  if (!fileName || typeof fileName !== 'string' || typeof fileSize !== 'number') {
    return NextResponse.json({ error: 'Missing fileName or fileSize' }, { status: 400 });
  }

  let kind;
  if (target === 'media') {
    if (!upload.audio_storage_path) {
      return NextResponse.json({ error: 'This upload has no separate media file' }, { status: 400 });
    }
    kind = 'media' as const;
  } else {
    kind = primaryFileKind(upload);
    if (kind === 'zip' && !fileName.toLowerCase().endsWith('.zip')) {
      return NextResponse.json({ error: 'The new version must also be a .zip' }, { status: 400 });
    }
    if (kind === 'yomi' && !fileName.toLowerCase().endsWith('.yomi')) {
      return NextResponse.json({ error: 'The new version must also be a .yomi' }, { status: 400 });
    }
  }

  const invalid = validateStoredFile(kind, fileName, fileSize);
  if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });

  const ext = storedFileExtension(kind, fileName);
  const key = `${replacementKeyPrefix(kind, upload.id)}${crypto.randomUUID()}/file.${ext}`;
  const contentType = storedFileContentType(kind, ext);
  const presignedUrl = await getUploadPresignedUrl(key, contentType);

  return NextResponse.json({ storagePath: key, presignedUrl, contentType });
}
