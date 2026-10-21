import { S3Client, PutObjectCommand, HeadBucketCommand } from "@aws-sdk/client-s3";

/**
 * Neon Object Storage (S3-compatible) helper.
 *
 * Credentials come from env vars:
 *   AWS_ENDPOINT_URL_S3 — e.g. https://br-snowy-shadow-xxx.storage.region.aws.neon.tech
 *   AWS_ACCESS_KEY_ID    — nak_live_xxx
 *   AWS_SECRET_ACCESS_KEY — nsk_live_xxx
 *   AWS_REGION           — e.g. ap-southeast-1
 *   NEON_BUCKET_NAME     — bucket name (must be created via Neon Console or API)
 *
 * Why forcePathStyle: true:
 *   Neon Object Storage doesn't support virtual-hosted-style addressing
 *   (bucket.host), only path-style (host/bucket). AWS SDK v3 uses virtual-hosted
 *   by default; forcePathStyle switches to path-style.
 */

let cachedClient: S3Client | null = null;

export function getS3Client(): S3Client {
  if (cachedClient) return cachedClient;

  const endpoint = process.env.AWS_ENDPOINT_URL_S3;
  const region = process.env.AWS_REGION || "ap-southeast-1";
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "Neon Object Storage credentials missing. Set AWS_ENDPOINT_URL_S3, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY in env.",
    );
  }

  cachedClient = new S3Client({
    endpoint,
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true,
  });
  return cachedClient;
}

export function getBucketName(): string {
  const bucket = process.env.NEON_BUCKET_NAME;
  if (!bucket) {
    throw new Error("NEON_BUCKET_NAME env var not set");
  }
  return bucket;
}

/**
 * Check if a bucket exists (and is accessible).
 * Useful as a startup health check.
 */
export async function checkBucketExists(bucketName: string): Promise<boolean> {
  const s3 = getS3Client();
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucketName }));
    return true;
  } catch (err: any) {
    // 404 = bucket doesn't exist; 403 = exists but no access (still counts as exists)
    if (err?.name === "NotFound" || err?.$metadata?.httpStatusCode === 404) {
      return false;
    }
    if (err?.$metadata?.httpStatusCode === 403) {
      // We don't have permission to HeadBucket, but bucket exists
      return true;
    }
    throw err;
  }
}

/**
 * Upload a file to Neon Object Storage.
 * Returns the public URL (path-style).
 *
 * @param key   Object key (e.g. "products/abc-photo.jpg")
 * @param body  File content (Buffer or stream)
 * @param contentType MIME type (e.g. image/jpeg)
 */
export async function uploadToObjectStorage(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string,
): Promise<{ url: string; key: string; bucket: string }> {
  const s3 = getS3Client();
  const bucket = getBucketName();

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      // Public read for the bucket means anyone with the URL can GET the object
      // without needing a presigned URL.
      ACL: "public-read",
    }),
  );

  // Build the public URL (path-style: endpoint/bucket/key)
  const endpoint = process.env.AWS_ENDPOINT_URL_S3!;
  const url = `${endpoint}/${bucket}/${key}`;

  return { url, key, bucket };
}
