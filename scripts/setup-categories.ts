import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

/**
 * Setup kategori baru sesuai permintaan user:
 *   - "Ayam Bumbu Nusantara" (untuk produk ayam berbumbu Nusantara)
 *   - "Olahan Ayam" (untuk produk olahan ayam seperti nugget, karaage, dll)
 *
 * Produk ditaruh ke kategori yang sesuai:
 *   - Bumbu Kuning, Bumbu Bali, Bumbu Rujak → Ayam Bumbu Nusantara
 *   - Chicken Nugget Premium → Olahan Ayam
 *
 * Kategori lama (Ayam Bumbu, Ayam Ungkep, Nugget) di-rename/dihapus agar tidak
 * duplikat. Produk di kategori yang dihapus akan dipindahkan dulu ke kategori
 * baru sebelum hapus.
 */
async function main() {
  console.log("Setting up new categories...");

  // 1. Create or update "Ayam Bumbu Nusantara"
  const catNusantara = await db.category.upsert({
    where: { slug: "ayam-bumbu-nusantara" },
    update: {
      name: "Ayam Bumbu Nusantara",
      description:
        "Ayam berbumbu khas Nusantara — Kuning, Bali, Rujak, dan varian lainnya.",
    },
    create: {
      name: "Ayam Bumbu Nusantara",
      slug: "ayam-bumbu-nusantara",
      description:
        "Ayam berbumbu khas Nusantara — Kuning, Bali, Rujak, dan varian lainnya.",
    },
  });
  console.log(`Category: ${catNusantara.name} (id: ${catNusantara.id})`);

  // 2. Create or update "Olahan Ayam"
  const catOlahan = await db.category.upsert({
    where: { slug: "olahan-ayam" },
    update: {
      name: "Olahan Ayam",
      description:
        "Produk olahan ayam siap masak — nugget, karaage, dan varian lainnya.",
    },
    create: {
      name: "Olahan Ayam",
      slug: "olahan-ayam",
      description:
        "Produk olahan ayam siap masak — nugget, karaage, dan varian lainnya.",
    },
  });
  console.log(`Category: ${catOlahan.name} (id: ${catOlahan.id})`);

  // 3. Assign products to new categories based on their slug
  const assignments = [
    { slug: "ayam-penjantan-bumbu-ungkep", categoryId: catNusantara.id }, // Bumbu Kuning
    { slug: "ayam-penjantan-bumbu-bali", categoryId: catNusantara.id },
    { slug: "ayam-bumbu-rujak", categoryId: catNusantara.id },
    { slug: "chicken-nugget", categoryId: catOlahan.id },
  ];

  console.log("\nAssigning products to new categories...");
  for (const a of assignments) {
    const updated = await db.product.update({
      where: { slug: a.slug },
      data: { categoryId: a.categoryId },
      select: { name: true, slug: true, category: { select: { name: true } } },
    });
    console.log(
      `  ${updated.name} → ${updated.category?.name || "(tidak ada kategori)"}`,
    );
  }

  // 4. Delete old categories (Ayam Bumbu, Ayam Ungkep, Nugget) — produk sudah dipindahkan
  const oldSlugs = ["ayam-bumbu", "ayam-ungkep", "nugget"];
  console.log("\nDeleting old categories...");
  for (const slug of oldSlugs) {
    const existing = await db.category.findUnique({ where: { slug } });
    if (!existing) {
      console.log(`  ${slug}: tidak ditemukan, skip`);
      continue;
    }
    // Detach any products still attached (set categoryId null)
    const detached = await db.product.updateMany({
      where: { categoryId: existing.id },
      data: { categoryId: null },
    });
    if (detached.count > 0) {
      console.log(`  ${slug}: detach ${detached.count} produk`);
    }
    await db.category.delete({ where: { slug } });
    console.log(`  ${slug}: dihapus`);
  }

  // 5. Summary
  console.log("\n=== FINAL STATE ===");
  const allCats = await db.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
  for (const c of allCats) {
    console.log(`  ${c.name} — ${c._count.products} produk`);
  }

  const products = await db.product.findMany({
    include: { category: true },
    orderBy: { featuredOrder: "asc" },
  });
  console.log("\n=== PRODUCTS ===");
  for (const p of products) {
    console.log(`  ${p.name} → ${p.category?.name || "(no category)"}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
