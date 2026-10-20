import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

/**
 * Update SiteSettings with real business information:
 *  - WhatsApp: 082310759060 (stored as 6282310759060 for wa.me URL format)
 *  - Address: Mie Jawa Seramie area (per the Google Maps embed coordinates)
 *  - Map embed URL
 *  - Operational hours (default for a food business, can be edited in admin)
 */

// Google Maps embed URL provided by user
const MAPS_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.067152393857!2d106.56874288497076!3d-6.254883645066539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e4201b41c687ab7%3A0xd429bcf58aa4a714!2sMie%20Jawa%20Seramie!5e0!3m2!1sid!2sid!4v1792439714568!5m2!1sid!2sid";

async function main() {
  console.log("Updating SiteSettings with real business info...");

  // Convert 0823... to 62823... for wa.me URL format
  const localWa = "082310759060";
  const intlWa = "6282310759060";

  await db.siteSettings.upsert({
    where: { id: "default" },
    update: {
      whatsappNumber: intlWa,
      address:
        "Mie Jawa Seramie, Jl. Raya Serpong, Kec. Serpong, Tangerang Selatan, Banten",
      operationalHours: "Senin–Minggu, 08.00–20.00 WIB",
      contactEmail: "dapurayam@serabites.com",
      footerText:
        "© 2026 Dapur Ayam by Serabites · Fresh by Order · Tanpa MSG · Tanpa Pengawet",
    },
    create: {
      id: "default",
      businessName: "Dapur Ayam",
      tagline: "Ayam Pejantan Premium oleh Serabites",
      whatsappNumber: intlWa,
      address:
        "Mie Jawa Seramie, Jl. Raya Serpong, Kec. Serpong, Tangerang Selatan, Banten",
      operationalHours: "Senin–Minggu, 08.00–20.00 WIB",
      contactEmail: "dapurayam@serabites.com",
      heroHeadline: "Ayam Pejantan Premium",
      heroSubtext: "Bumbu rempah asli, tanpa MSG",
      positioningLabel: "Dapur Ayam by Serabites",
      freshnessNote: "Praktis, lezat, siap saji.",
      footerText:
        "© 2026 Dapur Ayam by Serabites · Fresh by Order · Tanpa MSG · Tanpa Pengawet",
    },
  });

  const updated = await db.siteSettings.findUnique({ where: { id: "default" } });
  console.log("SiteSettings updated:");
  console.log("  WhatsApp:", updated?.whatsappNumber);
  console.log("  Address:", updated?.address);
  console.log("  Hours:", updated?.operationalHours);
  console.log("  Email:", updated?.contactEmail);
  console.log("  Footer:", updated?.footerText);
  console.log("\nNOTE: Maps embed URL needs to be stored in env or hardcoded");
  console.log("Map URL:", MAPS_EMBED_URL);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
