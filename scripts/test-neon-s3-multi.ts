/**
 * Try multiple approaches to setup/upload to Neon Object Storage:
 * 1. Try PutObject directly (maybe 403 was for missing bucket, not for perm issue)
 * 2. Try ListBuckets
 * 3. Try with different key prefix (no "test/" prefix)
 */
import "dotenv/config";
import {
  S3Client,
  PutObjectCommand,
  ListBucketsCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} from "@aws-sdk/client-s3";

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

async function tryStep(label: string, fn: () => Promise<any>) {
  try {
    const result = await fn();
    console.log(`✓ ${label}:`, result);
    return result;
  } catch (err: any) {
    console.error(`✗ ${label}:`, err?.message || err?.name || "Unknown error");
    console.error("  Status:", err?.$metadata?.httpStatusCode);
    if (err?.$response) {
      try {
        const bodyText = typeof err.$response.body?.text === "function"
          ? await err.$response.body.text()
          : JSON.stringify(err.$response.body);
        console.error("  Body:", bodyText.slice(0, 500));
      } catch {}
    }
    return null;
  }
}

async function main() {
  console.log(`Endpoint: ${endpoint}`);
  console.log(`Region: ${region}`);
  console.log(`Bucket: ${bucketName}`);
  console.log(`AccessKey: ${accessKeyId.slice(0, 20)}...`);
  console.log("");

  // Step 1: ListBuckets — see what buckets we have access to
  console.log("=== Step 1: ListBuckets ===");
  await tryStep("ListBuckets", async () => {
    const r = await s3.send(new ListBucketsCommand({}));
    return r.Buckets?.map((b) => `${b.Name} (created ${b.CreationDate})`) || [];
  });

  // Step 2: HeadBucket for "uploads"
  console.log("\n=== Step 2: HeadBucket 'uploads' ===");
  await tryStep("HeadBucket", async () => {
    await s3.send(new HeadBucketCommand({ Bucket: bucketName }));
    return "exists";
  });

  // Step 3: CreateBucket "uploads"
  console.log("\n=== Step 3: CreateBucket 'uploads' ===");
  await tryStep("CreateBucket", async () => {
    await s3.send(new CreateBucketCommand({ Bucket: bucketName }));
    return "created";
  });

  // Step 4: Try PutObject with key "ping.txt" (no path prefix)
  console.log("\n=== Step 4: PutObject to root 'ping.txt' ===");
  await tryStep("PutObject", async () => {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: "ping.txt",
        Body: "Dapur Ayam ping " + new Date().toISOString(),
        ContentType: "text/plain",
      }),
    );
    return `uploaded → ${endpoint}/${bucketName}/ping.txt`;
  });

  // Step 5: Try with ACL: "public-read"
  console.log("\n=== Step 5: PutObject with ACL=public-read ===");
  await tryStep("PutObject+ACL", async () => {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: "ping-public.txt",
        Body: "Dapur Ayam public ping " + new Date().toISOString(),
        ContentType: "text/plain",
        ACL: "public-read",
      }),
    );
    return `uploaded → ${endpoint}/${bucketName}/ping-public.txt`;
  });
}

main();
