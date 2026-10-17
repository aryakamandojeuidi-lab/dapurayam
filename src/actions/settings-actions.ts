"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { siteSettingsSchema } from "@/lib/validations";

export async function updateSettingsAction(formData: FormData) {
  await requireAdmin();

  const raw = {
    businessName: String(formData.get("businessName") || ""),
    tagline: String(formData.get("tagline") || "") || null,
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
    await db.siteSettings.upsert({
      where: { id: "default" },
      update: parsed.data,
      create: { id: "default", ...parsed.data },
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
