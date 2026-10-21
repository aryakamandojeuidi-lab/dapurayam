/**
 * Test upload to bucket "mybucket" using credentials extracted from screenshot.
 * If this works, we know credentials + bucket are valid.
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

async function main() {
  const bucket = "mybucket";
  console.log(`Endpoint: ${endpoint}`);
  console.log(`Region: ${region}`);
  console.log(`Bucket: ${bucket}`);
  console.log(`AccessKey: ${accessKeyId.slice(0, 25)}...`);
  console.log("");

  // Step 1: HeadBucket
  console.log("=== Step 1: HeadBucket 'mybucket' ===");
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucket }));
    console.log("✓ Bucket exists & accessible");
  } catch (err: any) {
    console.error(`✗ HeadBucket failed: ${err?.message || err?.name} (status ${err?.$metadata?.httpStatusCode})`);
    process.exit(1);
  }

  // Step 2: PutObject — small text file
  console.log("\n=== Step 2: PutObject 'test/ping.txt' ===");
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: "test/ping.txt",
        Body: "Dapur Ayam ping at " + new Date().toISOString(),
        ContentType: "text/plain",
      }),
    );
    console.log(`✓ Uploaded! Public URL: ${endpoint}/${bucket}/test/ping.txt`);
  } catch (err: any) {
    console.error(`✗ PutObject failed: ${err?.message || err?.name} (status ${err?.$metadata?.httpStatusCode})`);
    process.exit(1);
  }

  // Step 3: Verify file is publicly accessible
  console.log("\n=== Step 3: Verify public GET ===");
  try {
    const url = `${endpoint}/${bucket}/test/ping.txt`;
    const response = await fetch(url);
    if (response.ok) {
      const text = await response.text();
      console.log(`✓ Public GET works!`);
      console.log(`  URL: ${url}`);
      console.log(`  Body: ${text.slice(0, 80)}...`);
    } else {
      console.error(`✗ Public GET failed: HTTP ${response.status}`);
      console.log("  (Bucket may need to be set to public_read access level)");
    }
  } catch (err: any) {
    console.error(`✗ Fetch failed: ${err?.message}`);
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
