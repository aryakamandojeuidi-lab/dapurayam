"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { productSchema } from "@/lib/validations";
import { safeStringifyArray } from "@/lib/prisma-helpers";

export async function createProductAction(formData: FormData) {
  await requireAdmin();

  const raw = {
    name: String(formData.get("name") || ""),
    slug: String(formData.get("slug") || ""),
    description: String(formData.get("description") || ""),
    shortDescription: String(formData.get("shortDescription") || "") || null,
    price: formData.get("price") ? Number(formData.get("price")) : null,
    packageSize: String(formData.get("packageSize") || "") || null,
    imageUrl: String(formData.get("imageUrl") || "") || null,
    ingredients: String(formData.get("ingredients") || "") || null,
    storageInstructions:
      String(formData.get("storageInstructions") || "") || null,
    servingSuggestion:
      String(formData.get("servingSuggestion") || "") || null,
    categoryId: String(formData.get("categoryId") || "") || null,
    isActive: formData.get("isActive") === "true",
    isFeatured: formData.get("isFeatured") === "true",
    featuredOrder: Number(formData.get("featuredOrder") || 0),
    relatedArticleIds: [] as string[],
    shopeeUrl: String(formData.get("shopeeUrl") || "") || null,
    tokopediaUrl: String(formData.get("tokopediaUrl") || "") || null,
    websiteOrderEnabled: formData.get("websiteOrderEnabled") === "true",
  };

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }

  try {
    await db.product.create({
      data: {
        ...parsed.data,
        price: parsed.data.price ?? null,
        categoryId: parsed.data.categoryId || null,
        imageUrl: parsed.data.imageUrl || null,
        shortDescription: parsed.data.shortDescription || null,
        packageSize: parsed.data.packageSize || null,
        ingredients: parsed.data.ingredients || null,
        storageInstructions: parsed.data.storageInstructions || null,
        servingSuggestion: parsed.data.servingSuggestion || null,
        shopeeUrl: parsed.data.shopeeUrl || null,
        tokopediaUrl: parsed.data.tokopediaUrl || null,
        websiteOrderEnabled: parsed.data.websiteOrderEnabled ?? true,
        relatedArticleIds: safeStringifyArray(parsed.data.relatedArticleIds || []),
      },
    });
    revalidatePath("/produk");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    if (err?.code === "P2002") {
      return {
        success: false,
        error: "Slug sudah digunakan. Mohon pilih slug lain.",
      };
    }
    return { success: false, error: "Gagal membuat produk. Coba lagi." };
  }
}

export async function updateProductAction(id: string, formData: FormData) {
  await requireAdmin();

  const raw = {
    name: String(formData.get("name") || ""),
    slug: String(formData.get("slug") || ""),
    description: String(formData.get("description") || ""),
    shortDescription: String(formData.get("shortDescription") || "") || null,
    price: formData.get("price") ? Number(formData.get("price")) : null,
    packageSize: String(formData.get("packageSize") || "") || null,
    imageUrl: String(formData.get("imageUrl") || "") || null,
    ingredients: String(formData.get("ingredients") || "") || null,
    storageInstructions:
      String(formData.get("storageInstructions") || "") || null,
    servingSuggestion:
      String(formData.get("servingSuggestion") || "") || null,
    categoryId: String(formData.get("categoryId") || "") || null,
    isActive: formData.get("isActive") === "true",
    isFeatured: formData.get("isFeatured") === "true",
    featuredOrder: Number(formData.get("featuredOrder") || 0),
    relatedArticleIds: [] as string[],
    shopeeUrl: String(formData.get("shopeeUrl") || "") || null,
    tokopediaUrl: String(formData.get("tokopediaUrl") || "") || null,
    websiteOrderEnabled: formData.get("websiteOrderEnabled") === "true",
  };

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }

  try {
    await db.product.update({
      where: { id },
      data: {
        ...parsed.data,
        price: parsed.data.price ?? null,
        categoryId: parsed.data.categoryId || null,
        imageUrl: parsed.data.imageUrl || null,
        shortDescription: parsed.data.shortDescription || null,
        packageSize: parsed.data.packageSize || null,
        ingredients: parsed.data.ingredients || null,
        storageInstructions: parsed.data.storageInstructions || null,
        servingSuggestion: parsed.data.servingSuggestion || null,
        shopeeUrl: parsed.data.shopeeUrl || null,
        tokopediaUrl: parsed.data.tokopediaUrl || null,
        websiteOrderEnabled: parsed.data.websiteOrderEnabled ?? true,
        relatedArticleIds: safeStringifyArray(parsed.data.relatedArticleIds || []),
      },
    });
    revalidatePath("/produk");
    revalidatePath(`/produk/${parsed.data.slug}`);
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    if (err?.code === "P2002") {
      return {
        success: false,
        error: "Slug sudah digunakan. Mohon pilih slug lain.",
      };
    }
    return { success: false, error: "Gagal memperbarui produk. Coba lagi." };
  }
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  try {
    await db.product.delete({ where: { id } });
    revalidatePath("/produk");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus produk." };
  }
}

export async function toggleProductActiveAction(id: string) {
  await requireAdmin();
  try {
    const p = await db.product.findUnique({ where: { id } });
    if (!p) return { success: false, error: "Produk tidak ditemukan." };
    await db.product.update({
      where: { id },
      data: { isActive: !p.isActive },
    });
    revalidatePath("/produk");
    revalidatePath(`/produk/${p.slug}`);
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal mengubah status produk." };
  }
}

export async function saveProductAction(formData: FormData) {
  await requireAdmin();
  const id = (formData.get("_id") as string) || "";
  return id ? updateProductAction(id, formData) : createProductAction(formData);
}
