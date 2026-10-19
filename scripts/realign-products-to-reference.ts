import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

/**
 * Re-align products to match the reference design:
 *  - 4 main chicken products all at Rp 35.000:
 *    Ayam Pejantan Bumbu Kuning (Best Seller), Bumbu Bali, Bumbu Rujak, Bumbu Rendang
 *  - 2 promo products: Chicken Nugget Premium (78% chicken), Chicken Karaage
 *
 * The existing "Bumbu Ungkep" product is repurposed as "Bumbu Kuning"
 * (yellowish spice fits the existing photo).
 *
 * Bumbu Rendang and Chicken Karaage use newly AI-generated placeholder
 * photos. Admin can replace these via the admin dashboard at any time.
 */
async function main() {
  console.log("Realigning products to match reference design...");

  // 1. Update existing products (keep their slugs/URLs for backward compat)
  const updates = [
    {
      slug: "ayam-penjantan-bumbu-ungkep",
      newName: "Ayam Pejantan Bumbu Kuning",
      shortDescription:
        "Bumbu kuning rempah asli, daging ayam pejantan padat dan gurih.",
      description:
        "Ayam Pejantan Bumbu Kuning — ayam pejantan pilihan yang dibumbui kunyit dan rempah khas, menghasilkan warna kuning keemasan dan rasa gurih yang meresap hingga ke dalam. Dibuat fresh by order tanpa MSG dan tanpa pengawet. Tinggal goreng atau panggang 2-3 menit untuk hidangan keluarga yang lezat.",
      price: 35000,
      packageSize: "±200-230 gr / pack",
      imageUrl: "/uploads/products/bumbu-ungkep.jpg",
      ingredients:
        "Ayam pejantan, bumbu kuning (kunyit, bawang putih, bawang merah, ketumbar, jahe, daun salam, serai), garam, rempah pilihan. Tanpa MSG, tanpa pengawet.",
      storageInstructions:
        "Simpan di freezer (-18°C atau lebih dingin) hingga akan dimasak. Setelah dicairkan, masak segera dan jangan dibekukan ulang.",
      featuredOrder: 1,
    },
    {
      slug: "ayam-penjantan-bumbu-bali",
      newName: "Ayam Pejantan Bumbu Bali",
      shortDescription: "Pedas, gurih, kaya rempah — bumbu Bali khas Pulau Dewata.",
      description:
        "Ayam Pejantan Bumbu Bali — karakter daging ayam pejantan yang padat berpadu dengan bumbu Bali kaya rempah yang pedas dan harum. Diproses fresh by order tanpa MSG dan tanpa pengawet. Cocok digoreng atau dipanggang, sajikan dengan sambal matah untuk hidangan khas Pulau Dewata di rumah Anda.",
      price: 35000,
      packageSize: "±200-230 gr / pack",
      imageUrl: "/uploads/products/bumbu-bali.jpg",
      ingredients:
        "Ayam pejantan, bumbu Bali (cabai merah, bawang merah, bawang putih, kunyit, jahe, lengkuas, serai, daun jeruk), garam, rempah pilihan. Tanpa MSG, tanpa pengawet.",
      storageInstructions:
        "Simpan di freezer (-18°C atau lebih dingin) hingga akan dimasak. Setelah dicairkan, masak segera dan jangan dibekukan ulang.",
      featuredOrder: 2,
    },
    {
      slug: "ayam-bumbu-rujak",
      newName: "Ayam Pejantan Bumbu Rujak",
      shortDescription: "Pedas, gurih, segar — bumbu rujak khas Nusantara.",
      description:
        "Ayam Pejantan Bumbu Rujak — perpaduan rasa pedas, gurih, dan segar yang khas bumbu rujak Nusantara. Dibuat dari ayam pejantan pilihan dengan daging yang lebih padat dan kenyal, dibumbui rempah pilihan tanpa MSG dan tanpa pengawet. Diproses fresh by order setelah pesanan dikonfirmasi. Tinggal goreng dan siap dinikmati dengan nasi hangat.",
      price: 35000,
      packageSize: "±200-230 gr / pack",
      imageUrl: "/uploads/products/bumbu-rujak.jpg",
      ingredients:
        "Ayam pejantan, bumbu rujak (cabai, gula merah, terasi, asam jawa, kacang), bawang putih, bawang merah, garam, rempah pilihan. Tanpa MSG, tanpa pengawet.",
      storageInstructions:
        "Simpan di freezer (-18°C atau lebih dingin) hingga akan dimasak. Setelah dicairkan, masak segera dan jangan dibekukan ulang.",
      featuredOrder: 3,
    },
    {
      slug: "chicken-nugget",
      newName: "Chicken Nugget Premium",
      shortDescription:
        "Nugget ayam premium dengan 78% kandungan daging ayam, isi keju easy melt — lumer dan gurih.",
      description:
        "Chicken Nugget Premium — nugget ayam kelas atas dengan 78% kandungan daging ayam pilihan. Isi keju easy melt yang lumer saat digigit, lapisan luar yang renyah dan isi yang juicy. Tanpa MSG, tanpa pengawet, tanpa filler sintetis. Diproses fresh by order, tinggal goreng 3-5 menit dan siap disajikan sebagai camilan, lauk, atau bekal keluarga.",
      price: 35000,
      packageSize: "250 gr / pack",
      imageUrl: "/uploads/products/nugget-keju.jpg",
      ingredients:
        "78% daging ayam pilihan, keju easy melt, tepung premium, bumbu alami, telur. Tanpa MSG, tanpa pengawet.",
      storageInstructions:
        "Simpan di freezer (-18°C atau lebih dingin). Goreng langsung dari kondisi beku, tidak perlu dicairkan terlebih dahulu. Setelah kemasan dibuka, konsumsi dalam waktu 1 bulan.",
      featuredOrder: 5,
    },
  ];

  for (const u of updates) {
    const result = await db.product.update({
      where: { slug: u.slug },
      data: {
        name: u.newName,
        shortDescription: u.shortDescription,
        description: u.description,
        price: u.price,
        packageSize: u.packageSize,
        imageUrl: u.imageUrl,
        ingredients: u.ingredients,
        storageInstructions: u.storageInstructions,
        isFeatured: true,
        featuredOrder: u.featuredOrder,
      },
    });
    console.log(
      "Updated:",
      result.slug,
      "→",
      result.name,
      "| Rp",
      result.price,
      "|",
      result.packageSize,
      "| featuredOrder:",
      result.featuredOrder,
    );
  }

  // 2. Create "Ayam Pejantan Bumbu Rendang" (NEW)
  const existingRendang = await db.product.findUnique({
    where: { slug: "ayam-bumbu-rendang" },
  });
  if (!existingRendang) {
    const created = await db.product.create({
      data: {
        name: "Ayam Pejantan Bumbu Rendang",
        slug: "ayam-bumbu-rendang",
        shortDescription:
          "Bumbu rendang khas Padang yang kaya rempah, meresap hingga ke tulang.",
        description:
          "Ayam Pejantan Bumbu Rendang — ayam pejantan pilihan yang dibumbui rendang khas Padang, dengan rempah-rempah seperti cabai, kunyit, jahe, lengkuas, dan santan yang meresap perlaham hingga ke tulang. Daging padat dan berbumbu pekat, menghasilkan rasa gurih, pedas, dan harum yang khas. Tanpa MSG, tanpa pengawet. Diproses fresh by order.",
        price: 35000,
        packageSize: "±200-230 gr / pack",
        imageUrl: "/uploads/products/bumbu-rendang.jpg",
        ingredients:
          "Ayam pejantan, bumbu rendang (cabai, kunyit, jahe, lengkuas, serai, daun jeruk, santan), bawang merah, bawang putih, garam. Tanpa MSG, tanpa pengawet.",
        storageInstructions:
          "Simpan di freezer (-18°C atau lebih dingin) hingga akan dimasak. Setelah dicairkan, masak segera dan jangan dibekukan ulang.",
        isFeatured: true,
        featuredOrder: 4,
        isActive: true,
      },
    });
    console.log(
      "Created:",
      created.slug,
      "→",
      created.name,
      "| Rp",
      created.price,
      "| featuredOrder:",
      created.featuredOrder,
    );
  } else {
    const updated = await db.product.update({
      where: { slug: "ayam-bumbu-rendang" },
      data: {
        name: "Ayam Pejantan Bumbu Rendang",
        price: 35000,
        packageSize: "±200-230 gr / pack",
        imageUrl: "/uploads/products/bumbu-rendang.jpg",
        isFeatured: true,
        featuredOrder: 4,
      },
    });
    console.log("Rendang already exists — updated:", updated.name);
  }

  // 3. Create "Chicken Karaage" (NEW)
  const existingKaraage = await db.product.findUnique({
    where: { slug: "chicken-karaage" },
  });
  if (!existingKaraage) {
    const created = await db.product.create({
      data: {
        name: "Chicken Karaage",
        slug: "chicken-karaage",
        shortDescription:
          "Karaage ala Jepang, juicy di dalam dan renyah di luar — praktis untuk keluarga.",
        description:
          "Chicken Karaage — potongan daging ayam pilihan yang dibumbui khas Jepang dengan kecap, jahe, dan bawang putih, dilapisi tepung renyah. Hasilnya juicy di dalam dan renyah di luar, cocok untuk camilan, lauk, atau menu berkat keluarga. Tanpa MSG, tanpa pengawet. Diproses fresh by order, tinggal goreng 3-4 menit.",
        price: 35000,
        packageSize: "250 gr / pack",
        imageUrl: "/uploads/products/chicken-karaage.jpg",
        ingredients:
          "Daging ayam pilihan, kecap asin, jahe, bawang putih, tepung karaage, maizena, minyak goreng. Tanpa MSG, tanpa pengawet.",
        storageInstructions:
          "Simpan di freezer (-18°C atau lebih dingin). Goreng langsung dari kondisi beku, tidak perlu dicairkan terlebih dahulu. Setelah kemasan dibuka, konsumsi dalam waktu 1 bulan.",
        isFeatured: true,
        featuredOrder: 6,
        isActive: true,
      },
    });
    console.log(
      "Created:",
      created.slug,
      "→",
      created.name,
      "| Rp",
      created.price,
      "| featuredOrder:",
      created.featuredOrder,
    );
  } else {
    const updated = await db.product.update({
      where: { slug: "chicken-karaage" },
      data: {
        price: 35000,
        packageSize: "250 gr / pack",
        imageUrl: "/uploads/products/chicken-karaage.jpg",
        isFeatured: true,
        featuredOrder: 6,
      },
    });
    console.log("Karaage already exists — updated:", updated.name);
  }

  // 4. Update site settings hero text to match the reference
  await db.siteSettings.upsert({
    where: { id: "default" },
    update: {
      heroHeadline: "Ayam Pejantan Premium",
      heroSubtext: "Bumbu rempah asli, tanpa MSG",
      positioningLabel: "Dapur Ayam by Serabites",
      freshnessNote: "Praktis, lezat, siap saji.",
    },
    create: {
      id: "default",
      businessName: "Dapur Ayam",
      tagline: "Ayam Pejantan Premium oleh Serabites",
      heroHeadline: "Ayam Pejantan Premium",
      heroSubtext: "Bumbu rempah asli, tanpa MSG",
      positioningLabel: "Dapur Ayam by Serabites",
      freshnessNote: "Praktis, lezat, siap saji.",
    },
  });
  console.log("SiteSettings updated (hero text).");

  console.log("\nDone. Products now align with reference design.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
