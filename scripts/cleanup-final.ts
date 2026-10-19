import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
async function main() {
  const r = await db.order.deleteMany({ where: { customerName: { in: ["Final Test", "Test Premium", "Test Customer", "Budi Test"] } } });
  console.log("Deleted", r.count, "test orders");
}
main().then(() => db.$disconnect());
