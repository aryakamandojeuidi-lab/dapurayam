import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
async function main() {
  const result = await db.article.updateMany({
    where: { status: "PUBLISHED" },
    data: { status: "DRAFT", publishedAt: null, isFeatured: false },
  });
  console.log("Reset", result.count, "articles back to DRAFT.");
  const arts = await db.article.findMany({ select: { title: true, status: true } });
  console.log("Current state:", JSON.stringify(arts, null, 2));
}
main().then(() => db.$disconnect());
