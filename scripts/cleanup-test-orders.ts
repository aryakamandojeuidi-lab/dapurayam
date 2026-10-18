import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
async function main() {
  const r = await db.order.deleteMany({ where: { customerName: { startsWith: "Test" } } });
  console.log("Deleted", r.count, "test orders");
}
main().then(() => db.$disconnect());
