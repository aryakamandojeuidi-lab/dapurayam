"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { categorySchema } from "@/lib/validations";

export async function createCategoryAction(formData: FormData) {
  await requireAdmin();
  const raw = {
    name: String(formData.get("name") || ""),
    slug: String(formData.get("slug") || ""),
    description: String(formData.get("description") || "") || null,
  };
  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }
  try {
    await db.category.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description || null,
      },
    });
    revalidatePath("/produk");
    revalidatePath("/admin/kategori");
    return { success: true };
  } catch (err: any) {
    if (err?.code === "P2002") {
      return { success: false, error: "Nama atau slug sudah digunakan." };
    }
    return { success: false, error: "Gagal membuat kategori." };
  }
}

export async function updateCategoryAction(id: string, formData: FormData) {
  await requireAdmin();
  const raw = {
    name: String(formData.get("name") || ""),
    slug: String(formData.get("slug") || ""),
    description: String(formData.get("description") || "") || null,
  };
  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }
  try {
    await db.category.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description || null,
      },
    });
    revalidatePath("/produk");
    revalidatePath("/admin/kategori");
    return { success: true };
  } catch (err: any) {
    if (err?.code === "P2002") {
      return { success: false, error: "Nama atau slug sudah digunakan." };
    }
    return { success: false, error: "Gagal memperbarui kategori." };
  }
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin();
  try {
    const productsCount = await db.product.count({
      where: { categoryId: id },
    });
    if (productsCount > 0) {
      return {
        success: false,
        error: `Tidak dapat menghapus. Masih ada ${productsCount} produk yang menggunakan kategori ini. Set kategori produk ke "tanpa kategori" terlebih dahulu, atau pilih opsi set null.`,
      };
    }
    await db.category.delete({ where: { id } });
    revalidatePath("/produk");
    revalidatePath("/admin/kategori");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus kategori." };
  }
}
