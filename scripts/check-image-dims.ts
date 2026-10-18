import sharp from "sharp";
import path from "path";

const files = [
  "public/uploads/products/bumbu-rujak.jpg",
  "public/uploads/products/bumbu-bali.jpg",
  "public/uploads/products/nugget-keju.jpg",
  "public/uploads/products/bumbu-ungkep.jpg",
  "public/logofav.jpg",
];

async function main() {
  for (const f of files) {
    try {
      const meta = await sharp(f).metadata();
      const ratio = (meta.width / meta.height).toFixed(3);
      const orientation = meta.width > meta.height ? "landscape" : meta.width < meta.height ? "portrait" : "square";
      console.log(`${f}: ${meta.width}x${meta.height} (ratio ${ratio}, ${orientation})`);
    } catch (e: any) {
      console.error(`${f}: ${e.message}`);
    }
  }
}
main();
