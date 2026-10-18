import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("Updating products with real photos, prices, and weights...");

  const updates = [
    {
      slug: "ayam-bumbu-rujak",
      name: "Ayam Pejantan Bumbu Rujak",
      shortDescription: "Pedas, gurih, segar — bumbu rujak khas Nusantara. Fresh by order.",
      description:
        "Ayam Pejantan Bumbu Rujak — perpaduan rasa pedas, gurih, dan segar yang khas bumbu rujak Nusantara. Dibuat dari ayam pejantan pilihan dengan daging yang lebih padat dan kenyal, dibumbui rempah pilihan tanpa MSG dan tanpa pengawet. Diproses fresh by order setelah pesanan dikonfirmasi. Tinggal goreng dan siap dinikmati dengan nasi hangat.",
      price: 35000,
      packageSize: "±200-230 gr / pack",
      imageUrl: "/uploads/products/bumbu-rujak.jpg",
      ingredients:
        "Ayam pejantan, bumbu rujak (cabai, gula merah, terasi, asam jawa, kacang), bawang putih, bawang merah, garam, rempah pilihan. Tanpa MSG, tanpa pengawet.",
      storageInstructions:
        "Simpan di freezer (-18°C atau lebih dingin) hingga akan dimasak. Setelah dicairkan, masak segera dan jangan dibekukan ulang.",
    },
    {
      slug: "ayam-penjantan-bumbu-bali",
      name: "Ayam Pejantan Bumbu Bali",
      shortDescription: "Praktis, gurih, kaya rempah — bumbu Bali khas Pulau Dewata.",
      description:
        "Ayam Pejantan Bumbu Bali — karakter daging ayam pejantan yang padat berpadu dengan bumbu Bali kaya rempah yang pedas dan harum. Diproses fresh by order tanpa MSG dan tanpa pengawet. Cocok digoreng atau dipanggang, sajikan dengan sambal matah untuk hidangan khas Pulau Dewata di rumah Anda.",
      price: 32000,
      packageSize: "±200-230 gr / pack",
      imageUrl: "/uploads/products/bumbu-bali.jpg",
      ingredients:
        "Ayam pejantan, bumbu Bali (cabai merah, bawang merah, bawang putih, kunyit, jahe, lengkuas, serai, daun jeruk), garam, rempah pilihan. Tanpa MSG, tanpa pengawet.",
      storageInstructions:
        "Simpan di freezer (-18°C atau lebih dingin) hingga akan dimasak. Setelah dicairkan, masak segera dan jangan dibekukan ulang.",
    },
    {
      slug: "chicken-nugget",
      name: "Chicken Nugget Isi Keju",
      shortDescription: "Nugget ayam premium isi keju easy melt — gurih, lumer, anti MSG.",
      description:
        "Chicken Nugget Isi Keju Easy Melt — nugget ayam premium dengan isi keju yang lumer saat digigit. Dibuat dari daging ayam pilihan, lapisan luar yang renyah dan isi keju yang creamy. Tanpa MSG, tanpa pengawet, tanpa filler sintetis. Diproses fresh by order, tinggal goreng 3-5 menit dan siap disajikan sebagai camilan, lauk, atau bekal.",
      price: 30000,
      packageSize: "250 gr / pack",
      imageUrl: "/uploads/products/nugget-keju.jpg",
      ingredients:
        "Daging ayam pilihan, keju easy melt, tepung premium, bumbu alami, telur. Tanpa MSG, tanpa pengawet, tanpa pengawet sintetis.",
      storageInstructions:
        "Simpan di freezer (-18°C atau lebih dingin). Goreng langsung dari kondisi beku, tidak perlu dicairkan terlebih dahulu. Setelah kemasan dibuka, konsumsi dalam waktu 1 bulan.",
    },
    {
      slug: "ayam-penjantan-bumbu-ungkep",
      name: "Ayam Pejantan Bumbu Ungkep",
      shortDescription: "Empuk, gurih, meresap — ayam ungkep praktis tinggal goreng.",
      description:
        "Ayam Pejantan Bumbu Ungkep — ayam pejantan pilihan yang sudah diungkep dengan bumbu rempah alami hingga meresap sempurna. Setiap pack berisi 1 potong paha + 1 potong dada. Tinggal goreng 2-3 menit untuk hasil empuk, gurih, dan bumbu meresap hingga ke dalam. Tanpa MSG, tanpa pengawet. Diproses fresh by order.",
      price: 30000,
      packageSize: "1 paha + 1 dada / pack",
      imageUrl: "/uploads/products/bumbu-ungkep.jpg",
      ingredients:
        "Ayam pejantan (paha + dada), bumbu ungkep (bawang putih, bawang merah, ketumbar, kunyit, jahe, daun salam, serai), garam, rempah pilihan. Tanpa MSG, tanpa pengawet.",
      storageInstructions:
        "Simpan di freezer (-18°C atau lebih dingin) hingga akan dimasak. Setelah dicairkan, masak segera dan jangan dibekukan ulang.",
    },
  ];

  for (const u of updates) {
    const result = await db.product.update({
      where: { slug: u.slug },
      data: {
        name: u.name,
        shortDescription: u.shortDescription,
        description: u.description,
        price: u.price,
        packageSize: u.packageSize,
        imageUrl: u.imageUrl,
        ingredients: u.ingredients,
        storageInstructions: u.storageInstructions,
      },
    });
    console.log("Updated:", result.slug, "→", result.name, "| Rp", result.price, "|", result.packageSize);
  }

  console.log("\nAll products updated with real photos, prices, and weights.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
