"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { siteSettingsSchema } from "@/lib/validations";

export async function updateSettingsAction(formData: FormData) {
  await requireAdmin();

  const raw = {
    businessName: String(formData.get("businessName") || ""),
    tagline: String(formData.get("tagline") || "") || undefined,
    description: String(formData.get("description") || "") || null,
    whatsappNumber: String(formData.get("whatsappNumber") || "") || null,
    contactEmail: String(formData.get("contactEmail") || "") || null,
    address: String(formData.get("address") || "") || null,
    operationalHours: String(formData.get("operationalHours") || "") || null,
    instagramUrl: String(formData.get("instagramUrl") || "") || null,
    facebookUrl: String(formData.get("facebookUrl") || "") || null,
    tiktokUrl: String(formData.get("tiktokUrl") || "") || null,
    footerText: String(formData.get("footerText") || "") || null,
    heroHeadline: String(formData.get("heroHeadline") || "") || null,
    heroSubtext: String(formData.get("heroSubtext") || "") || null,
    shopeeStoreUrl: String(formData.get("shopeeStoreUrl") || "") || null,
    tokopediaStoreUrl: String(formData.get("tokopediaStoreUrl") || "") || null,
    positioningLabel: String(formData.get("positioningLabel") || "") || null,
    freshnessNote: String(formData.get("freshnessNote") || "") || null,
  };

  const parsed = siteSettingsSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }

  try {
    const data = {
      businessName: parsed.data.businessName,
      tagline: parsed.data.tagline ?? undefined,
      description: parsed.data.description ?? null,
      whatsappNumber: parsed.data.whatsappNumber ?? null,
      contactEmail: parsed.data.contactEmail ?? null,
      address: parsed.data.address ?? null,
      operationalHours: parsed.data.operationalHours ?? null,
      instagramUrl: parsed.data.instagramUrl ?? null,
      facebookUrl: parsed.data.facebookUrl ?? null,
      tiktokUrl: parsed.data.tiktokUrl ?? null,
      footerText: parsed.data.footerText ?? null,
      heroHeadline: parsed.data.heroHeadline ?? null,
      heroSubtext: parsed.data.heroSubtext ?? null,
      shopeeStoreUrl: parsed.data.shopeeStoreUrl ?? null,
      tokopediaStoreUrl: parsed.data.tokopediaStoreUrl ?? null,
      positioningLabel: parsed.data.positioningLabel ?? null,
      freshnessNote: parsed.data.freshnessNote ?? null,
    };

    await db.siteSettings.upsert({
      where: { id: "default" },
      update: data,
      create: { id: "default", ...data },
    });
    revalidatePath("/");
    revalidatePath("/produk");
    revalidatePath("/journal");
    revalidatePath("/tentang");
    revalidatePath("/kontak");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal memperbarui pengaturan." };
  }
}
