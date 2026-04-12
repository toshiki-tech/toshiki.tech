import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
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

export { r2, BUCKET };
