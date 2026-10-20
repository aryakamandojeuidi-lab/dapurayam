import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type PromoItem = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  description: string;
};

type Props = {
  items: PromoItem[];
};

export function PromoCards({ items }: Props) {
  if (!items.length) return null;

  return (
    <section className="bg-background pb-16 md:pb-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {items.map((item) => (
            <article
              key={item.id}
              className="relative overflow-hidden rounded-2xl bg-secondary shadow-sm ring-1 ring-border transition-all hover:shadow-md"
            >
              <div className="grid grid-cols-1 sm:grid-cols-5">
                <div className="relative aspect-[4/3] sm:col-span-2 sm:aspect-auto">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full min-h-[200px] w-full bg-secondary" />
                  )}
                </div>
                <div className="flex flex-col justify-center p-6 sm:col-span-3 md:p-8">
                  <h3 className="font-display text-xl font-bold tracking-tight text-foreground md:text-2xl">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                  <div className="mt-4">
                    <Button asChild size="sm" className="gap-1.5 rounded-full">
                      <Link href={`/produk/${item.slug}`}>
                        Lihat Produk
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
