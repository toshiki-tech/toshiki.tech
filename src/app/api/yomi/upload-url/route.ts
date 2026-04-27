import { NextResponse } from 'next/server';
import { getSupabase, getAuthUser } from '@/lib/supabase-server-api';
import { getUploadPresignedUrl } from '@/lib/r2';
import {
  MAX_YOMI_FILE_SIZE,
  MAX_ZIP_FILE_SIZE,
  MAX_AUDIO_FILE_SIZE,
  ALLOWED_MEDIA_EXTENSIONS,
} from '@/lib/yomi-constants';

const MEDIA_CONTENT_TYPES: Record<string, string> = {
  mp3: 'audio/mpeg',
  m4a: 'audio/mp4',
  wav: 'audio/wav',
  mp4: 'video/mp4',
};

export async function POST(request: Request) {
  const supabase = getSupabase();
  const user = await getAuthUser(supabase);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { fileName, fileSize, isZip } = body;
  // `kind` is optional for backwards compatibility: 'yomi' | 'zip' | 'media'.
  // Falls back to inferring from `isZip` when omitted.
  const kind: 'yomi' | 'zip' | 'media' = body.kind ?? (isZip ? 'zip' : 'yomi');

  if (!fileName || typeof fileSize !== 'number') {
    return NextResponse.json({ error: 'Missing fileName or fileSize' }, { status: 400 });
  }

  const ext = (fileName.split('.').pop() || '').toLowerCase();

  if (kind === 'media') {
    const dotted = `.${ext}` as typeof ALLOWED_MEDIA_EXTENSIONS[number];
    if (!ALLOWED_MEDIA_EXTENSIONS.includes(dotted)) {
      return NextResponse.json(
        { error: `Unsupported media type. Allowed: ${ALLOWED_MEDIA_EXTENSIONS.join(', ')}` },
        { status: 400 }
      );
    }
    if (fileSize > MAX_AUDIO_FILE_SIZE) {
      return NextResponse.json(
        { error: `Media file too large (max ${MAX_AUDIO_FILE_SIZE / 1024 / 1024}MB)` },
        { status: 400 }
      );
    }
  } else if (kind === 'zip') {
    if (fileSize > MAX_ZIP_FILE_SIZE) {
      return NextResponse.json({ error: `ZIP file too large (max ${MAX_ZIP_FILE_SIZE / 1024 / 1024}MB)` }, { status: 400 });
    }
  } else {
    if (fileSize > MAX_YOMI_FILE_SIZE) {
      return NextResponse.json({ error: `.yomi file too large (max ${MAX_YOMI_FILE_SIZE / 1024 / 1024}MB)` }, { status: 400 });
    }
  }

  const uploadId = crypto.randomUUID();
  const safeExt = ext || (kind === 'zip' ? 'zip' : kind === 'media' ? 'mp3' : 'yomi');
  const prefix = kind === 'zip' ? 'zip' : kind === 'media' ? 'media' : 'yomi';
  const key = `${prefix}/${uploadId}/file.${safeExt}`;
  const contentType =
    kind === 'zip' ? 'application/zip'
    : kind === 'media' ? (MEDIA_CONTENT_TYPES[safeExt] || 'application/octet-stream')
    : 'text/plain';

  const presignedUrl = await getUploadPresignedUrl(key, contentType);

  return NextResponse.json({ uploadId, storagePath: key, presignedUrl, contentType });
}
