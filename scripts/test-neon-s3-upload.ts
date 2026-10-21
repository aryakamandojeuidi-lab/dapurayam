/**
 * Try direct upload to Neon Object Storage — skip bucket check.
 * User must create the "uploads" bucket via Neon Console manually first.
 */
import "dotenv/config";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const endpoint = process.env.AWS_ENDPOINT_URL_S3!;
const region = process.env.AWS_REGION || "ap-southeast-1";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID!;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;
const bucketName = process.env.NEON_BUCKET_NAME || "uploads";

const s3 = new S3Client({
  endpoint,
  region,
  credentials: { accessKeyId, secretAccessKey },
  forcePathStyle: true,
});

async function main() {
  console.log(`Trying direct PUT to bucket "${bucketName}" at ${endpoint}...`);
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: "test/ping.txt",
        Body: "Dapur Ayam — test ping at " + new Date().toISOString(),
        ContentType: "text/plain",
        ACL: "public-read",
      }),
    );
    console.log(`✓ Test file uploaded to: ${endpoint}/${bucketName}/test/ping.txt`);
    console.log("\nBucket setup complete. You can now use /api/upload route.");
  } catch (err: any) {
    console.error("Upload failed:", err?.message || err);
    console.error("Status:", err?.$metadata?.httpStatusCode);
    console.error("Full error:", err?.name);
    if (err?.$response?.body) {
      console.error("Response body:", await err.$response.body.text?.());
    }
    process.exit(1);
  }
}

main();
