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
    category?: { name: string; slug: string } | null;
  }>;
  whatsappNumber: string;
};

export function FeaturedProducts({ products, whatsappNumber }: Props) {
  if (!products.length) {
    return null;
  }
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Produk Unggulan
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Pilihan untuk Anda
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Olahan ayam praktis yang siap menemani momen makan keluarga Anda —
              dibuat fresh by order.
            </p>
          </div>
          <Button asChild variant="outline" className="gap-2 shrink-0">
            <Link href="/produk">
              Lihat Semua
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} whatsappNumber={whatsappNumber} />
          ))}
        </div>
      </div>
    </section>
  );
}
