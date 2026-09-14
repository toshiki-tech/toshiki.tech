import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME!;

/** Generate a presigned PUT URL for uploading a file directly from the browser */
export async function getUploadPresignedUrl(key: string, contentType: string, expiresIn = 3600) {
  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });
  return await getSignedUrl(r2, cmd, { expiresIn });
}

/** Generate a presigned GET URL for downloading. `downloadName` triggers attachment download */
export async function getDownloadPresignedUrl(key: string, downloadName?: string, expiresIn = 600) {
  const cmd = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ResponseContentDisposition: downloadName
      ? `attachment; filename="${downloadName.replace(/[^\x20-\x7E]/g, '_')}"; filename*=UTF-8''${encodeURIComponent(downloadName)}`
      : undefined,
  });
  return await getSignedUrl(r2, cmd, { expiresIn });
}

/** Size in bytes of a stored object, or null when it does not exist */
export async function getObjectSize(key: string): Promise<number | null> {
  try {
    const res = await r2.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return res.ContentLength ?? 0;
  } catch {
    return null;
  }
}

/** Best-effort removal of objects that are no longer referenced; failures are only logged */
export async function deleteObjects(keys: (string | null | undefined)[]) {
  for (const key of keys) {
    if (!key) continue;
    try {
      await r2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
    } catch (err) {
      console.error('R2 delete error:', key, err);
    }
  }
}

export { r2, BUCKET };
