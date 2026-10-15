"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { articleSchema } from "@/lib/validations";

function parsePublishedAt(value: string, status: string): Date | null {
  if (status === "DRAFT") return null;
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d;
}

export async function createArticleAction(formData: FormData) {
  await requireAdmin();

  const status = String(formData.get("status") || "DRAFT") as
    | "DRAFT"
    | "PUBLISHED"
    | "SCHEDULED"
    | "ARCHIVED";

  const publishedAtRaw = String(formData.get("publishedAt") || "");

  const raw = {
    title: String(formData.get("title") || ""),
    slug: String(formData.get("slug") || ""),
    excerpt: String(formData.get("excerpt") || "") || null,
    content: String(formData.get("content") || ""),
    coverImageUrl: String(formData.get("coverImageUrl") || "") || null,
    authorName: String(formData.get("authorName") || "Tim Dapur Ayam"),
    categoryId: String(formData.get("categoryId") || "") || null,
    tags: String(formData.get("tags") || "") || null,
    status,
    isFeatured: formData.get("isFeatured") === "true",
    seoTitle: String(formData.get("seoTitle") || "") || null,
    seoDescription: String(formData.get("seoDescription") || "") || null,
    publishedAt: parsePublishedAt(publishedAtRaw, status),
  };

  const parsed = articleSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }

  try {
    await db.article.create({
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        excerpt: parsed.data.excerpt || null,
        content: parsed.data.content,
        coverImageUrl: parsed.data.coverImageUrl || null,
        authorName: parsed.data.authorName,
        categoryId: parsed.data.categoryId || null,
        tags: parsed.data.tags || null,
        status: parsed.data.status,
        isFeatured: parsed.data.isFeatured,
        seoTitle: parsed.data.seoTitle || null,
        seoDescription: parsed.data.seoDescription || null,
        publishedAt: parsed.data.publishedAt,
      },
    });
    revalidatePath("/journal");
    return { success: true };
  } catch (err: any) {
    if (err?.code === "P2002") {
      return { success: false, error: "Slug sudah digunakan." };
    }
    return { success: false, error: "Gagal membuat artikel." };
  }
}

export async function updateArticleAction(id: string, formData: FormData) {
  await requireAdmin();

  const status = String(formData.get("status") || "DRAFT") as
    | "DRAFT"
    | "PUBLISHED"
    | "SCHEDULED"
    | "ARCHIVED";

  const publishedAtRaw = String(formData.get("publishedAt") || "");

  const raw = {
    title: String(formData.get("title") || ""),
    slug: String(formData.get("slug") || ""),
    excerpt: String(formData.get("excerpt") || "") || null,
    content: String(formData.get("content") || ""),
    coverImageUrl: String(formData.get("coverImageUrl") || "") || null,
    authorName: String(formData.get("authorName") || "Tim Dapur Ayam"),
    categoryId: String(formData.get("categoryId") || "") || null,
    tags: String(formData.get("tags") || "") || null,
    status,
    isFeatured: formData.get("isFeatured") === "true",
    seoTitle: String(formData.get("seoTitle") || "") || null,
    seoDescription: String(formData.get("seoDescription") || "") || null,
    publishedAt: parsePublishedAt(publishedAtRaw, status),
  };

  const parsed = articleSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }

  try {
    await db.article.update({
      where: { id },
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        excerpt: parsed.data.excerpt || null,
        content: parsed.data.content,
        coverImageUrl: parsed.data.coverImageUrl || null,
        authorName: parsed.data.authorName,
        categoryId: parsed.data.categoryId || null,
        tags: parsed.data.tags || null,
        status: parsed.data.status,
        isFeatured: parsed.data.isFeatured,
        seoTitle: parsed.data.seoTitle || null,
        seoDescription: parsed.data.seoDescription || null,
        publishedAt: parsed.data.publishedAt,
      },
    });
    revalidatePath("/journal");
    revalidatePath(`/journal/${parsed.data.slug}`);
    return { success: true };
  } catch (err: any) {
    if (err?.code === "P2002") {
      return { success: false, error: "Slug sudah digunakan." };
    }
    return { success: false, error: "Gagal memperbarui artikel." };
  }
}

export async function deleteArticleAction(id: string) {
  await requireAdmin();
  try {
    const article = await db.article.findUnique({ where: { id } });
    if (!article) return { success: false, error: "Artikel tidak ditemukan." };
    await db.article.delete({ where: { id } });
    revalidatePath("/journal");
    revalidatePath(`/journal/${article.slug}`);
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus artikel." };
  }
}

export async function toggleArticleStatusAction(id: string) {
  await requireAdmin();
  try {
    const article = await db.article.findUnique({ where: { id } });
    if (!article) return { success: false, error: "Artikel tidak ditemukan." };
    const next = article.status === "PUBLISHED" ? "ARCHIVED" : "PUBLISHED";
    await db.article.update({
      where: { id },
      data: {
        status: next,
        publishedAt:
          next === "PUBLISHED" && !article.publishedAt
            ? new Date()
            : article.publishedAt,
      },
    });
    revalidatePath("/journal");
    revalidatePath(`/journal/${article.slug}`);
    return { success: true };
  } catch {
    return { success: false, error: "Gagal mengubah status artikel." };
  }
}

export async function saveArticleAction(formData: FormData) {
  await requireAdmin();
  const id = (formData.get("_id") as string) || "";
  return id ? updateArticleAction(id, formData) : createArticleAction(formData);
}
