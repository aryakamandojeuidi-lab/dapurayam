import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/public/whatsapp-button";
import { buildProductOrderMessage } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type Props = {
  product: {
    id: string;
    name: string;
    slug: string;
    shortDescription: string | null;
    price: number | null;
    packageSize: string | null;
    imageUrl: string | null;
    category?: { name: string; slug: string } | null;
  };
  whatsappNumber: string;
  className?: string;
};

export function ProductCard({ product, whatsappNumber, className }: Props) {
  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/40",
        className,
      )}
    >
      <Link
        href={`/produk/${product.slug}`}
        className="relative block aspect-[3/4] overflow-hidden bg-secondary"
        aria-label={`Lihat detail ${product.name}`}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-muted-foreground">
            <Package className="h-10 w-10" />
          </div>
        )}
        {product.category && (
          <Badge className="absolute left-3 top-3 bg-background/95 text-foreground hover:bg-background/95">
            {product.category.name}
          </Badge>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4 md:p-5">
        <Link href={`/produk/${product.slug}`} className="block">
          <h3 className="text-base font-semibold text-foreground transition-colors group-hover:text-primary md:text-lg">
            {product.name}
          </h3>
        </Link>
        {product.shortDescription && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
            {product.shortDescription}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {product.price ? (
            <span className="font-semibold text-primary tabular-nums">
              Rp {product.price.toLocaleString("id-ID")}
            </span>
          ) : (
            <span className="italic text-muted-foreground">Harga menyusul</span>
          )}
          {product.packageSize && (
            <span className="rounded-md bg-secondary px-2 py-0.5">
              {product.packageSize}
            </span>
          )}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1 gap-1.5">
            <Link href={`/produk/${product.slug}`}>
              Lihat Detail
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <WhatsAppButton
            number={whatsappNumber}
            message={buildProductOrderMessage(product.name)}
            label="Pesan"
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}
