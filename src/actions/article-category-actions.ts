"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { articleCategorySchema } from "@/lib/validations";

export async function createArticleCategoryAction(formData: FormData) {
  await requireAdmin();
  const raw = {
    name: String(formData.get("name") || ""),
    slug: String(formData.get("slug") || ""),
    description: String(formData.get("description") || "") || null,
  };
  const parsed = articleCategorySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }
  try {
    await db.articleCategory.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description || null,
      },
    });
    revalidatePath("/journal");
    revalidatePath("/admin/journal");
    return { success: true };
  } catch (err: any) {
    if (err?.code === "P2002") {
      return { success: false, error: "Nama atau slug sudah digunakan." };
    }
    return { success: false, error: "Gagal membuat kategori artikel." };
  }
}

export async function updateArticleCategoryAction(id: string, formData: FormData) {
  await requireAdmin();
  const raw = {
    name: String(formData.get("name") || ""),
    slug: String(formData.get("slug") || ""),
    description: String(formData.get("description") || "") || null,
  };
  const parsed = articleCategorySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }
  try {
    await db.articleCategory.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description || null,
      },
    });
    revalidatePath("/journal");
    revalidatePath("/admin/journal");
    return { success: true };
  } catch (err: any) {
    if (err?.code === "P2002") {
      return { success: false, error: "Nama atau slug sudah digunakan." };
    }
    return { success: false, error: "Gagal memperbarui kategori artikel." };
  }
}

export async function deleteArticleCategoryAction(id: string) {
  await requireAdmin();
  try {
    const count = await db.article.count({ where: { categoryId: id } });
    if (count > 0) {
      return {
        success: false,
        error: `Masih ada ${count} artikel yang menggunakan kategori ini. Ubah kategori artikel terlebih dahulu.`,
      };
    }
    await db.articleCategory.delete({ where: { id } });
    revalidatePath("/journal");
    revalidatePath("/admin/journal");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus kategori artikel." };
  }
}
