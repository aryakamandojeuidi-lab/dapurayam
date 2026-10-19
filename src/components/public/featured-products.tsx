import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/public/product-card";

type Props = {
  products: Array<{
    id: string;
    name: string;
    slug: string;
    shortDescription: string | null;
    price: number | null;
    packageSize: string | null;
    imageUrl: string | null;
    isFeatured?: boolean;
    featuredOrder?: number;
    category?: { name: string; slug: string } | null;
  }>;
  whatsappNumber: string;
};

export function FeaturedProducts({ products, whatsappNumber }: Props) {
  if (!products.length) {
    return (
      <section className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Produk Unggulan
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Produk Kami
          </h2>
          <p className="mt-4 text-muted-foreground">
            Produk sedang dalam proses penyiapan. Silakan kembali lagi nanti.
          </p>
        </div>
      </section>
    );
  }
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Section title with red underline (matches reference) */}
        <div className="flex flex-col items-center text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Produk Unggulan Kami
          </h2>
          <span className="mt-3 h-1 w-20 rounded-full bg-primary" />
          <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
            Olahan ayam pejantan premium dengan bumbu rempah asli. Praktis,
            lezat, dan dibuat fresh by order.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, idx) => (
            <ProductCard
              key={p.id}
              product={p}
              whatsappNumber={whatsappNumber}
              bestSeller={idx === 0}
            />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button asChild variant="outline" className="gap-2 rounded-full">
            <Link href="/produk">
              Lihat Semua Produk
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
