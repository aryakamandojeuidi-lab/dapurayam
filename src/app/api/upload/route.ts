import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * POST /api/upload
 * Handles single-file image upload. Auth: admin only.
 *
 * Saves to /public/uploads/products/<uuid>-<filename>
 * Returns: { url: "/uploads/products/..." }
 *
 * Validation:
 *  - Auth required (admin only)
 *  - Only image MIME types (jpeg, png, webp)
 *  - Max file size 5MB
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

    // Ensure target directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
    await mkdir(uploadDir, { recursive: true });

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fullPath = path.join(uploadDir, filename);
    await writeFile(fullPath, buffer);

    // Return the public URL
    const url = `/uploads/products/${filename}`;
    return NextResponse.json({ url });
  } catch (err: any) {
    console.error("[api/upload] Error:", err);
    return NextResponse.json(
      { error: "Gagal mengunggah file. Coba lagi nanti." },
      { status: 500 },
    );
  }
}
