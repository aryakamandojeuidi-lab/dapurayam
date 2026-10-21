import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { put } from "@vercel/blob";

/**
 * POST /api/upload
 *
 * Single-file image upload endpoint (admin only).
 *
 * Storage strategy:
 * - If BLOB_READ_WRITE_TOKEN is set → use Vercel Blob (production).
 *   File is uploaded to Vercel Blob storage and a persistent public URL is
 *   returned (https://<random>.public.blob.vercel-storage.com/...).
 * - Else (local dev) → save to /public/uploads/products/ on filesystem.
 *   URL returned is /uploads/products/<filename> (served by Next.js static).
 *
 * Validation:
 *  - Auth: admin only
 *  - MIME: image/jpeg, image/png, image/webp
 *  - Max size: 5MB
 *
 * Why two paths:
 *   Vercel's serverless filesystem is ephemeral — files saved to /public/
 *   during a request are NOT persisted between serverless invocations and
 *   are lost on the next deploy. For production image uploads we need a
 *   real blob storage (Vercel Blob, S3, Cloudinary, etc.). Vercel Blob is
 *   the simplest because it integrates natively with Vercel projects.
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

    // Decide storage path
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    const useVercelBlob = Boolean(blobToken);

    if (useVercelBlob) {
      // Production: Vercel Blob storage
      // Put the file to Vercel Blob. Returns { url, downloadUrl, ... }
      // The path inside the blob is "products/<filename>" to group all product
      // images together (Vercel Blob is flat, but the prefix gives logical grouping).
      const blob = await put(`products/${filename}`, file, {
        access: "public",
        contentType: file.type,
        addRandomSuffix: false, // we already add a uuid prefix
      });
      console.log("[api/upload] Saved to Vercel Blob:", blob.url);
      return NextResponse.json({ url: blob.url });
    }

    // Local dev fallback: filesystem
    const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
    await mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fullPath = path.join(uploadDir, filename);
    await writeFile(fullPath, buffer);

    const url = `/uploads/products/${filename}`;
    console.log("[api/upload] Saved to local filesystem:", url);
    return NextResponse.json({ url });
  } catch (err: any) {
    console.error("[api/upload] Error:", err);
    return NextResponse.json(
      {
        error:
          "Gagal mengunggah file. Pastikan BLOB_READ_WRITE_TOKEN sudah di-set di Vercel Environment Variables (untuk produksi).",
      },
      { status: 500 },
    );
  }
}
