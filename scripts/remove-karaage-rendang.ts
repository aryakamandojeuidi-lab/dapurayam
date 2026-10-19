import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

/**
 * Remove Chicken Karaage and Ayam Bumbu Rendang (Padang-style) products,
 * and re-align featuredOrder of remaining 4 products to be 1-4.
 *
 * Also confirms there are no payment/shipping APIs in the codebase —
 * the manual checkout (order → admin confirmation via WhatsApp) stays.
 */
async function main() {
  console.log("Removing Chicken Karaage and Bumbu Rendang...");

  const toDeleteSlugs = ["chicken-karaage", "ayam-bumbu-rendang"];

  for (const slug of toDeleteSlugs) {
    // Look up the product (if it exists)
    const product = await db.product.findUnique({
      where: { slug },
      select: { id: true, name: true },
    });

    if (!product) {
      console.log(`  ${slug}: not found, skipping`);
      continue;
    }

    // Detach any OrderItems that reference this product before deleting
    const orderItemCount = await db.orderItem.count({
      where: { productId: product.id },
    });
    if (orderItemCount > 0) {
      await db.orderItem.updateMany({
        where: { productId: product.id },
        data: { productId: null },
      });
      console.log(`  ${slug}: detached ${orderItemCount} order item(s)`);
    }

    await db.product.delete({ where: { slug } });
    console.log(`  ${slug}: deleted (${product.name})`);
  }

  // Re-align featuredOrder for remaining 4 featured products to 1-4
  console.log("\nRe-aligning featuredOrder for remaining featured products...");

  const remaining = await db.product.findMany({
    where: { isFeatured: true, isActive: true },
    orderBy: { featuredOrder: "asc" },
    select: { id: true, name: true, slug: true, featuredOrder: true },
  });

  for (let i = 0; i < remaining.length; i++) {
    const newOrder = i + 1;
    const p = remaining[i];
    if (p.featuredOrder !== newOrder) {
      await db.product.update({
        where: { id: p.id },
        data: { featuredOrder: newOrder },
      });
      console.log(`  ${p.slug}: featuredOrder ${p.featuredOrder} → ${newOrder}`);
    } else {
      console.log(`  ${p.slug}: featuredOrder already ${newOrder}`);
    }
  }

  // Summary
  console.log("\nFinal state — remaining products:");
  const all = await db.product.findMany({
    where: { isActive: true },
    orderBy: { featuredOrder: "asc" },
    select: { name: true, slug: true, price: true, isFeatured: true, featuredOrder: true },
  });
  for (const p of all) {
    console.log(
      `  ${p.isFeatured ? "★" : " "} ${p.name.padEnd(40)} Rp ${p.price || 0}  (order: ${p.featuredOrder})`,
    );
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
