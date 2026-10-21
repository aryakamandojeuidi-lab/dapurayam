/**
 * AWS SDK test with full debug output via middleware.
 */
import "dotenv/config";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const endpoint = process.env.AWS_ENDPOINT_URL_S3!;
const region = process.env.AWS_REGION || "ap-southeast-1";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID!;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;
const bucket = "mybucket";

const s3 = new S3Client({
  endpoint,
  region,
  credentials: { accessKeyId, secretAccessKey },
  forcePathStyle: true,
  logger: {
    debug: (msg) => console.log("[debug]", msg),
    info: (msg) => console.log("[info]", msg),
    warn: (msg) => console.log("[warn]", msg),
    error: (msg) => console.log("[error]", msg),
  },
});

async function main() {
  try {
    console.log("Attempting PutObject to bucket:", bucket);
    console.log("Endpoint:", endpoint);
    console.log("Region:", region);
    console.log("AccessKeyId (first 30 chars):", accessKeyId.slice(0, 30));
    console.log("SecretKey length:", secretAccessKey.length);
    console.log("");

    const result = await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: `test/dapur-ayam-${Date.now()}.txt`,
        Body: "Dapur Ayam ping",
        ContentType: "text/plain",
      }),
    );
    console.log("✓ PutObject success!");
    console.log("Result:", result);
  } catch (err: any) {
    console.error("\n✗ PutObject failed");
    console.error("Error name:", err?.name);
    console.error("Error message:", err?.message);
    console.error("Error Code:", err?.Code);
    console.error("Status:", err?.$metadata?.httpStatusCode);
    console.error("RequestId:", err?.$metadata?.requestId);
    console.error("Extended RequestId:", err?.$metadata?.extendedRequestId);
    console.error("Full error:", JSON.stringify(err, null, 2));
  }
}

main();
