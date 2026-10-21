/**
 * Create the "uploads" bucket in Neon Object Storage if it doesn't exist yet.
 *
 * Run: `bun run scripts/create-neon-bucket.ts`
 */
import "dotenv/config";
import { S3Client, CreateBucketCommand, HeadBucketCommand } from "@aws-sdk/client-s3";

const endpoint = process.env.AWS_ENDPOINT_URL_S3;
const region = process.env.AWS_REGION || "ap-southeast-1";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.NEON_BUCKET_NAME || "uploads";

if (!endpoint || !accessKeyId || !secretAccessKey) {
  console.error("Missing required env vars. Check .env for AWS_ENDPOINT_URL_S3, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY");
  process.exit(1);
}

const s3 = new S3Client({
  endpoint,
  region,
  credentials: { accessKeyId, secretAccessKey },
  forcePathStyle: true,
});

async function main() {
  console.log(`Checking if bucket "${bucketName}" exists...`);
  let exists = false;
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucketName }));
    exists = true;
    console.log(`✓ Bucket "${bucketName}" already exists.`);
  } catch (err: any) {
    if (err?.name === "NotFound" || err?.$metadata?.httpStatusCode === 404) {
      exists = false;
    } else if (err?.$metadata?.httpStatusCode === 403) {
      exists = true;
      console.log(`✓ Bucket "${bucketName}" exists (403 = we don't have HeadBucket perm but bucket is there).`);
    } else {
      console.error("HeadBucket error:", err?.message || err);
      process.exit(1);
    }
  }

  if (!exists) {
    console.log(`Creating bucket "${bucketName}"...`);
    try {
      const result = await s3.send(
        new CreateBucketCommand({
          Bucket: bucketName,
          // Neon Object Storage is S3-compatible; region param may or may not
          // be required depending on the Neon API. We'll try without it first.
        }),
      );
      console.log("✓ Bucket created:", result);
    } catch (err: any) {
      console.error("CreateBucket failed:", err?.message || err);
      console.error("Full error:", err);
      process.exit(1);
    }
  }

  // Verify with a simple test PUT
  console.log("Testing upload via S3 API...");
  const { PutObjectCommand } = await import("@aws-sdk/client-s3");
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: "test/ping.txt",
        Body: "Dapur Ayam — Neon Object Storage test ping at " + new Date().toISOString(),
        ContentType: "text/plain",
        ACL: "public-read",
      }),
    );
    console.log(`✓ Test file uploaded to: ${endpoint}/${bucketName}/test/ping.txt`);
    console.log("\nBucket setup complete. You can now use /api/upload route.");
  } catch (err: any) {
    console.error("Test upload failed:", err?.message || err);
    console.error("Full error:", err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
