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
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Produk Unggulan
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Pilihan olahan ayam praktis yang siap menemani momen makan keluarga Anda.
            </p>
          </div>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/produk">
              Lihat Semua Produk
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} whatsappNumber={whatsappNumber} />
          ))}
        </div>
      </div>
    </section>
  );
}
