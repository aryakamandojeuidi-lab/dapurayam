import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { put as vercelBlobPut } from "@vercel/blob";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

/**
 * POST /api/upload
 *
 * Image upload endpoint (admin only) with multiple storage backends.
 *
 * Tries backends in this order, returns the first one that succeeds:
 * 1. **Vercel Blob** (PREFERRED) — if BLOB_READ_WRITE_TOKEN set.
 *    Works natively in Vercel, 1GB free tier.
 * 2. **Neon Object Storage (S3)** — fallback if Vercel Blob not configured.
 *    Note: Currently Neon S3 has 403 issue in ap-southeast-1.
 * 3. **Local filesystem** — last resort. Works in dev; in Vercel serverless
 *    files are ephemeral but URL works for the current request only.
 *
 * All uploads validate:
 * - Auth: admin only
 * - MIME: image/jpeg, image/png, image/webp
 * - Size: max 5MB
 *
 * Returns detailed error info on failure so the admin can debug.
 */
export async function POST(req: NextRequest) {
  // === Auth check — admin only ===
  let session;
  try {
    session = await getServerSession(authOptions);
  } catch (authErr: any) {
    console.error("[api/upload] Auth check failed:", authErr?.message);
    return NextResponse.json(
      {
        error: "Gagal cek autentikasi. Pastikan NEXTAUTH_SECRET dan NEXTAUTH_URL sudah di-set.",
        detail: authErr?.message,
      },
      { status: 500 },
    );
  }
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Tidak terautentikasi. Login admin dulu." },
      { status: 401 },
    );
  }

  // === Parse + validate the uploaded file ===
  let file: File | null = null;
  try {
    const formData = await req.formData();
    file = formData.get("file") as File | null;
  } catch (formErr: any) {
    console.error("[api/upload] FormData parse failed:", formErr?.message);
    return NextResponse.json(
      {
        error: "Gagal parse FormData. Pastikan request Content-Type: multipart/form-data.",
        detail: formErr?.message,
      },
      { status: 400 },
    );
  }

  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "File tidak ditemukan dalam permintaan." },
      { status: 400 },
    );
  }

  // Validate MIME type
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json(
      {
        error: `Tipe file tidak didukung: ${file.type}. Hanya JPEG, PNG, atau WebP.`,
      },
      { status: 400 },
    );
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json(
      {
        error: `Ukuran file ${file.size} bytes melebihi 5MB (${maxSize} bytes).`,
      },
      { status: 400 },
    );
  }

  // Build safe filename
  const safeName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.\-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  const filename = `${randomUUID().slice(0, 8)}-${safeName}`;
  const key = `products/${filename}`;

  // Read file into Buffer once
  let buffer: Buffer;
  try {
    const bytes = await file.arrayBuffer();
    buffer = Buffer.from(bytes);
  } catch (readErr: any) {
    console.error("[api/upload] File read failed:", readErr?.message);
    return NextResponse.json(
      { error: "Gagal baca file.", detail: readErr?.message },
      { status: 500 },
    );
  }

  // === Backend 1: Vercel Blob (PREFERRED) ===
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (blobToken) {
    try {
      const blob = await vercelBlobPut(key, file, {
        access: "public",
        contentType: file.type,
        addRandomSuffix: false,
        token: blobToken, // explicit token for safety
      });
      console.log("[api/upload] ✓ Saved to Vercel Blob:", blob.url);
      return NextResponse.json({
        url: blob.url,
        backend: "vercel-blob",
      });
    } catch (blobErr: any) {
      console.warn(
        "[api/upload] ✗ Vercel Blob failed:",
        blobErr?.message || blobErr?.name,
        "Status:", blobErr?.httpStatus || blobErr?.$metadata?.httpStatusCode,
      );
      // Continue to next backend
    }
  } else {
    console.warn("[api/upload] BLOB_READ_WRITE_TOKEN not set, skipping Vercel Blob.");
  }

  // === Backend 2: Neon Object Storage (S3) ===
  const s3Endpoint = process.env.AWS_ENDPOINT_URL_S3;
  const s3AccessKey = process.env.AWS_ACCESS_KEY_ID;
  const s3SecretKey = process.env.AWS_SECRET_ACCESS_KEY;
  const s3Region = process.env.AWS_REGION || "ap-southeast-1";
  const s3Bucket = process.env.NEON_BUCKET_NAME;

  if (s3Endpoint && s3AccessKey && s3SecretKey && s3Bucket) {
    try {
      const s3 = new S3Client({
        endpoint: s3Endpoint,
        region: s3Region,
        credentials: {
          accessKeyId: s3AccessKey,
          secretAccessKey: s3SecretKey,
        },
        forcePathStyle: true,
      });
      await s3.send(
        new PutObjectCommand({
          Bucket: s3Bucket,
          Key: key,
          Body: buffer,
          ContentType: file.type,
        }),
      );
      const url = `${s3Endpoint}/${s3Bucket}/${key}`;
      console.log("[api/upload] ✓ Saved to Neon Object Storage:", url);
      return NextResponse.json({ url, backend: "neon-s3" });
    } catch (s3Err: any) {
      console.warn(
        "[api/upload] ✗ Neon S3 failed:",
        s3Err?.message || s3Err?.name,
        "Status:", s3Err?.$metadata?.httpStatusCode,
      );
      // Continue to filesystem fallback
    }
  } else {
    console.warn("[api/upload] Neon S3 env vars incomplete, skipping.");
  }

  // === Backend 3: Local filesystem (fallback, dev only) ===
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
    await mkdir(uploadDir, { recursive: true });
    const fullPath = path.join(uploadDir, filename);
    await writeFile(fullPath, buffer);
    const url = `/uploads/products/${filename}`;
    console.log("[api/upload] ✓ Saved to local filesystem:", url);
    return NextResponse.json({
      url,
      backend: "local-fallback",
      warning:
        "File disimpan di local filesystem (fallback). Tidak persistent di Vercel production. Set BLOB_READ_WRITE_TOKEN untuk Vercel Blob.",
    });
  } catch (fsErr: any) {
    console.error("[api/upload] ✗ Local filesystem failed:", fsErr?.message);
  }

  // All backends failed
  console.error("[api/upload] ✗ All storage backends failed.");
  return NextResponse.json(
    {
      error:
        "Semua storage backend gagal. Cek Vercel logs untuk detail. Pastikan BLOB_READ_WRITE_TOKEN sudah di-set di Environment Variables.",
      debug: {
        hasBlobToken: Boolean(blobToken),
        hasS3Config: Boolean(s3Endpoint && s3AccessKey && s3SecretKey && s3Bucket),
        filename,
        key,
        fileSize: file.size,
        contentType: file.type,
      },
    },
    { status: 500 },
  );
}

/**
 * GET /api/upload — diagnostic endpoint
 * Returns current storage backend status (safe to expose, no secrets).
 */
export async function GET() {
  return NextResponse.json({
    backends: {
      vercelBlob: {
        configured: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
        note: process.env.BLOB_READ_WRITE_TOKEN
          ? "Token di-set, siap dipakai"
          : "BLOB_READ_WRITE_TOKEN tidak ada di env var",
      },
      neonS3: {
        configured: Boolean(
          process.env.AWS_ENDPOINT_URL_S3 &&
            process.env.AWS_ACCESS_KEY_ID &&
            process.env.AWS_SECRET_ACCESS_KEY &&
            process.env.NEON_BUCKET_NAME,
        ),
        endpoint: process.env.AWS_ENDPOINT_URL_S3 || null,
        bucket: process.env.NEON_BUCKET_NAME || null,
        note: "Note: Neon S3 currently returns 403 in ap-southeast-1 (Neon backend issue)",
      },
      filesystem: {
        configured: true, // Always available as last resort
        note: "Persistent in dev only. Ephemeral in Vercel serverless.",
      },
    },
  });
}
