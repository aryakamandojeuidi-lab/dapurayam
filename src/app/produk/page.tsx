import type { Metadata } from "next";
import { PackageOpen } from "lucide-react";
import { PublicShell } from "@/components/public/public-shell";
import { ProductSearch } from "@/components/public/product-search";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Produk",
  description:
    "Jelajahi katalog produk Dapur Ayam — nugget, ayam bumbu, dan ayam ungkep siap masak untuk keluarga Anda.",
  alternates: { canonical: "/produk" },
};

export default async function ProdukPage() {
  const [products, categories, settings] = await Promise.all([
    db.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: [{ isFeatured: "desc" }, { featuredOrder: "asc" }, { createdAt: "desc" }],
    }),
    db.category.findMany({
      orderBy: { name: "asc" },
    }),
    db.siteSettings.findUnique({ where: { id: "default" } }),
  ]);

  const whatsappNumber = settings?.whatsappNumber || "";

  return (
    <PublicShell>
      <section className="bg-gradient-to-b from-secondary/50 to-background py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Produk Dapur Ayam
            </h1>
            <p className="mt-4 text-muted-foreground">
              Pilihan olahan ayam praktis untuk berbagai momen makan. Pesan langsung via WhatsApp untuk informasi harga dan ketersediaan.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-background py-10 md:py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          {products.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-10 text-center">
              <PackageOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                Belum ada produk
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Silakan kembali lagi nanti atau hubungi kami via WhatsApp untuk pertanyaan terkait produk.
              </p>
            </div>
          ) : (
            <ProductSearch
              products={products.map((p) => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                shortDescription: p.shortDescription,
                price: p.price,
                packageSize: p.packageSize,
                imageUrl: p.imageUrl,
                category: p.category
                  ? { name: p.category.name, slug: p.category.slug }
                  : null,
              }))}
              categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
              whatsappNumber={whatsappNumber}
            />
          )}
        </div>
      </section>
    </PublicShell>
  );
}
