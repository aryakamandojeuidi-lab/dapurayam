import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
async function main() {
  const articles = await db.article.findMany({ select: { id: true, title: true, status: true, publishedAt: true, isFeatured: true } });
  console.log("ARTICLES:", JSON.stringify(articles, null, 2));
  const products = await db.product.findMany({ select: { name: true, slug: true, isActive: true, isFeatured: true } });
  console.log("PRODUCTS:", JSON.stringify(products, null, 2));
  const settings = await db.siteSettings.findUnique({ where: { id: "default" } });
  console.log("SETTINGS whatsappNumber:", settings?.whatsappNumber);
}
main().then(() => db.$disconnect());
