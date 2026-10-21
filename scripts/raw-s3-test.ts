/**
 * Raw HTTP test to Neon Object Storage — bypass AWS SDK to see the actual
 * error response body. AWS SDK swallows the response body and only shows
 * "UnknownError" + status 403.
 *
 * This script:
 * 1. Uses raw fetch() with manually-signed requests (SigV4)
 * 2. Captures the full response body to see what Neon is actually saying
 */
import "dotenv/config";
import { SignatureV4 } from "@smithy/signature-v4";
import { Sha256 } from "@aws-crypto/sha256-js";
import { HttpRequest } from "@smithy/protocol-http";

const endpoint = process.env.AWS_ENDPOINT_URL_S3!;
const region = process.env.AWS_REGION || "ap-southeast-1";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID!;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;
const bucket = "mybucket";

const signer = new SignatureV4({
  credentials: { accessKeyId, secretAccessKey },
  region,
  service: "s3",
  sha256: Sha256,
});

async function rawRequest(method: string, path: string, body?: Buffer) {
  const url = new URL(`${endpoint}${path}`);
  const req = new HttpRequest({
    method,
    protocol: url.protocol,
    hostname: url.hostname,
    port: url.port ? Number(url.port) : undefined,
    path: url.pathname,
    query: {},
    headers: {
      host: url.hostname,
      "x-amz-date": new Date().toISOString().replace(/[:-]|\.\d{3}/g, ""),
      "x-amz-content-sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", // empty body SHA256
    },
    body: body || "",
  });

  const signed = await signer.sign(req);
  const response = await fetch(`${url.origin}${url.pathname}`, {
    method: signed.method,
    headers: signed.headers as any,
    body,
  });

  const text = await response.text();
  return { status: response.status, body: text, headers: Object.fromEntries(response.headers.entries()) };
}

async function main() {
  console.log("=== HEAD bucket/mybucket/ (signed) ===");
  const head = await rawRequest("HEAD", "/mybucket/");
  console.log("Status:", head.status);
  console.log("Headers:", JSON.stringify(head.headers, null, 2));
  console.log("Body:", head.body || "(empty)");

  console.log("\n=== PUT bucket/mybucket/test-ping.txt ===");
  const body = Buffer.from("Dapur Ayam ping at " + new Date().toISOString());
  const put = await rawRequest("PUT", "/mybucket/test-ping.txt", body);
  console.log("Status:", put.status);
  console.log("Body:", put.body.slice(0, 500) || "(empty)");

  console.log("\n=== GET service/ (ListAllMyBucketsResult) — see if we have ANY bucket access ===");
  const list = await rawRequest("GET", "/");
  console.log("Status:", list.status);
  console.log("Body:", list.body.slice(0, 1000));
}

main().catch((err) => {
  console.error("Error:", err?.message || err);
  process.exit(1);
});
