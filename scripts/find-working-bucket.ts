/**
 * Try upload to bucket "assets" (the one in user's example snippet).
 * User may have generated credentials for an existing "assets" bucket.
 */
import "dotenv/config";
import { S3Client, PutObjectCommand, HeadBucketCommand } from "@aws-sdk/client-s3";

const endpoint = process.env.AWS_ENDPOINT_URL_S3!;
const region = process.env.AWS_REGION || "ap-southeast-1";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID!;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;

const s3 = new S3Client({
  endpoint,
  region,
  credentials: { accessKeyId, secretAccessKey },
  forcePathStyle: true,
});

// Try multiple possible bucket names that user might have created
const possibleBuckets = ["assets", "uploads", "dapurayam", "default"];

async function tryBucket(bucket: string) {
  console.log(`\n=== Trying bucket "${bucket}" ===`);
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucket }));
    console.log(`✓ ${bucket}: EXISTS (HeadBucket OK)`);
    // Try upload
    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: `test/ping-${Date.now()}.txt`,
          Body: "Dapur Ayam ping " + new Date().toISOString(),
          ContentType: "text/plain",
        }),
      );
      console.log(`✓ ${bucket}: UPLOAD OK → ${endpoint}/${bucket}/test/ping-${Date.now()}.txt`);
      return true;
    } catch (err: any) {
      console.error(`✗ ${bucket}: upload failed — ${err?.message || err?.name} (status ${err?.$metadata?.httpStatusCode})`);
    }
  } catch (err: any) {
    console.error(`✗ ${bucket}: HeadBucket failed — ${err?.message || err?.name} (status ${err?.$metadata?.httpStatusCode})`);
  }
  return false;
}

async function main() {
  for (const b of possibleBuckets) {
    const ok = await tryBucket(b);
    if (ok) {
      console.log(`\n✓ WORKING BUCKET: ${b}`);
      return;
    }
  }
  console.log("\n✗ No working bucket found. Need user to create bucket via Neon Console.");
}

main();
