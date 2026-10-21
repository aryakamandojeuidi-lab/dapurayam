/**
 * Test with different S3 client configurations to find what works:
 * 1. forcePathStyle: true (default we used)
 * 2. forcePathStyle: false (virtual-hosted)
 * 3. Without specifying region in config (use endpoint URL only)
 * 4. Try with bucket as part of endpoint hostname
 */
import "dotenv/config";
import { S3Client, PutObjectCommand, HeadBucketCommand } from "@aws-sdk/client-s3";

const endpoint = process.env.AWS_ENDPOINT_URL_S3!;
const region = process.env.AWS_REGION || "ap-southeast-1";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID!;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;

async function tryConfig(label: string, config: any, bucket: string) {
  console.log(`\n=== ${label} ===`);
  const s3 = new S3Client({
    endpoint,
    region,
    credentials: { accessKeyId, secretAccessKey },
    ...config,
  });
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucket }));
    console.log(`✓ HeadBucket "${bucket}" OK`);
    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: `test/ping-${Date.now()}.txt`,
          Body: "test",
          ContentType: "text/plain",
        }),
      );
      console.log(`✓ Upload OK`);
      return true;
    } catch (err: any) {
      console.error(`✗ Upload failed: ${err?.message || err?.name} (status ${err?.$metadata?.httpStatusCode})`);
    }
  } catch (err: any) {
    console.error(`✗ HeadBucket failed: ${err?.message || err?.name} (status ${err?.$metadata?.httpStatusCode})`);
  }
  return false;
}

async function main() {
  const bucket = "mybucket";
  console.log(`Testing with bucket: ${bucket}`);

  // Approach 1: path-style (what we've been using)
  await tryConfig("forcePathStyle=true", { forcePathStyle: true }, bucket);

  // Approach 2: virtual-hosted (no path style)
  await tryConfig("forcePathStyle=false (virtual-hosted)", { forcePathStyle: false }, bucket);

  // Approach 3: without region (maybe Neon doesn't need it)
  const s3NoRegion = new S3Client({
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
  });
  console.log(`\n=== No region specified ===`);
  try {
    await s3NoRegion.send(new HeadBucketCommand({ Bucket: bucket }));
    console.log(`✓ HeadBucket "${bucket}" OK (no region)`);
  } catch (err: any) {
    console.error(`✗ HeadBucket failed (no region): ${err?.message || err?.name} (status ${err?.$metadata?.httpStatusCode})`);
  }

  // Approach 4: Maybe we need to use bucket endpoint as the URL itself
  // (some S3 providers give you a bucket-specific endpoint)
  console.log(`\n=== Try bucket-specific endpoint ===`);
  const bucketEndpoint = `${endpoint}/${bucket}`;
  console.log(`Endpoint: ${bucketEndpoint}`);
  const s3BucketEndpoint = new S3Client({
    endpoint: bucketEndpoint,
    region,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
  });
  try {
    // Without Bucket specified since it's in endpoint? No, S3 SDK still wants Bucket param.
    await s3BucketEndpoint.send(new HeadBucketCommand({ Bucket: bucket }));
    console.log(`✓ Bucket-specific endpoint OK`);
  } catch (err: any) {
    console.error(`✗ Bucket endpoint failed: ${err?.message || err?.name} (status ${err?.$metadata?.httpStatusCode})`);
  }

  // Approach 5: Try ListObjectsV2 instead of HeadBucket (sometimes one works when other doesn't)
  console.log(`\n=== Try ListObjectsV2 instead ===`);
  const { ListObjectsV2Command } = await import("@aws-sdk/client-s3");
  try {
    const result = await s3BucketEndpoint.send(new ListObjectsV2Command({ Bucket: bucket, MaxKeys: 5 }));
    console.log(`✓ ListObjectsV2 OK — found ${result.KeyCount || 0} objects`);
  } catch (err: any) {
    console.error(`✗ ListObjectsV2 failed: ${err?.message || err?.name} (status ${err?.$metadata?.httpStatusCode})`);
  }

  // Approach 6: Try GetObject on "test/ping.txt" — maybe bucket already has content
  console.log(`\n=== Try GetObject 'test/ping.txt' (maybe it exists) ===`);
  const { GetObjectCommand } = await import("@aws-sdk/client-s3");
  try {
    const result = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: "test/ping.txt" }));
    console.log(`✓ Object exists!`);
  } catch (err: any) {
    console.error(`✗ GetObject failed: ${err?.message || err?.name} (status ${err?.$metadata?.httpStatusCode})`);
  }
}

main();
