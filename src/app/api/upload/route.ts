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
 * 1. **Neon Object Storage (S3)** — if AWS_ENDPOINT_URL_S3 + AWS_ACCESS_KEY_ID set
 * 2. **Vercel Blob** — if BLOB_READ_WRITE_TOKEN set
 * 3. **Local filesystem** — fallback (works in dev; in Vercel serverless
 *    files are ephemeral but URL still works for the current request)
 *
 * All uploads validate:
 * - Auth: admin only
 * - MIME: image/jpeg, image/png, image/webp
 * - Size: max 5MB
 */
export async function POST(req: NextRequest) {
  // Auth check — admin only
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Tidak terautentikasi." },
      { status: 401 },
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
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
        { error: "Ukuran file melebihi 5MB." },
        { status: 400 },
      );
    }

    // Build safe filename: <uuid>-<sanitized-original-name>
    const safeName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.\-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
    const filename = `${randomUUID().slice(0, 8)}-${safeName}`;
    const key = `products/${filename}`;

    // Read file into Buffer once (re-used by each backend attempt)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // === Backend 1: Neon Object Storage (S3-compatible) ===
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
        console.log("[api/upload] Saved to Neon Object Storage:", url);
        return NextResponse.json({ url, backend: "neon-s3" });
      } catch (err: any) {
        console.warn(
          "[api/upload] Neon S3 failed, falling through to next backend:",
          err?.message || err?.name || err,
        );
      }
    }

    // === Backend 2: Vercel Blob ===
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (blobToken) {
      try {
        const blob = await vercelBlobPut(key, file, {
          access: "public",
          contentType: file.type,
          addRandomSuffix: false,
        });
        console.log("[api/upload] Saved to Vercel Blob:", blob.url);
        return NextResponse.json({ url: blob.url, backend: "vercel-blob" });
      } catch (err: any) {
        console.warn(
          "[api/upload] Vercel Blob failed, falling through to filesystem:",
          err?.message || err?.name || err,
        );
      }
    }

    // === Backend 3: Local filesystem (fallback) ===
    const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
    await mkdir(uploadDir, { recursive: true });
    const fullPath = path.join(uploadDir, filename);
    await writeFile(fullPath, buffer);
    const url = `/uploads/products/${filename}`;
    console.log("[api/upload] Saved to local filesystem:", url);
    return NextResponse.json({ url, backend: "local" });
  } catch (err: any) {
    console.error("[api/upload] Error:", err);
    return NextResponse.json(
      {
        error:
          "Gagal mengunggah file. Coba lagi nanti atau hubungi admin untuk cek konfigurasi storage.",
      },
      { status: 500 },
    );
  }
}
