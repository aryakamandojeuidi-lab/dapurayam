import Link from "next/link";
import { ArrowRight, Package, Star } from "lucide-react";
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
  bestSeller?: boolean;
};

export function ProductCard({ product, whatsappNumber, className, bestSeller }: Props) {
  return (
    <div
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/40",
        className,
      )}
    >
      {/* Image area — fixed aspect ratio with consistent background.
          object-cover crops images to fit, ensuring all cards look identical in size.
          object-cover is preferred over object-contain here because uneven photo aspect
          ratios (mixed 1:1 and 2:3) caused visual height differences between cards. */}
      <Link
        href={`/produk/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-secondary"
        aria-label={`Lihat detail ${product.name}`}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-muted-foreground">
            <Package className="h-10 w-10" />
          </div>
        )}
        {/* Top-left badges */}
        {bestSeller && (
          <Badge className="absolute left-3 top-3 gap-1 bg-primary text-primary-foreground hover:bg-primary">
            <Star className="h-3 w-3 fill-current" />
            Best Seller
          </Badge>
        )}
        {!bestSeller && product.category && (
          <Badge className="absolute left-3 top-3 bg-background/95 text-foreground hover:bg-background/95">
            {product.category.name}
          </Badge>
        )}
      </Link>

      {/* Body — fixed content blocks for consistent height */}
      <div className="flex flex-1 flex-col p-4 md:p-5">
        {/* Title — fixed-height (2 lines max, line-clamp) */}
        <Link href={`/produk/${product.slug}`} className="block">
          <h3 className="line-clamp-2 min-h-[2.5rem] text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary md:text-lg">
            {product.name}
          </h3>
        </Link>

        {/* Description — fixed-height (always 2 lines via min-h) */}
        <p
          className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-muted-foreground"
        >
          {product.shortDescription || "Produk olahan ayam premium, dibuat fresh by order."}
        </p>

        {/* Price row — fixed-height */}
        <div className="mt-3 flex min-h-[1.75rem] flex-wrap items-baseline gap-2">
          {product.price ? (
            <span className="text-lg font-bold tabular-nums text-primary">
              Rp {product.price.toLocaleString("id-ID")}
            </span>
          ) : (
            <span className="italic text-muted-foreground">Harga menyusul</span>
          )}
          {product.packageSize && (
            <span className="text-xs text-muted-foreground">· {product.packageSize}</span>
          )}
        </div>

        {/* Actions — pushed to bottom via mt-auto so all cards align buttons at same line */}
        <div className="mt-auto flex items-center gap-2 pt-4">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5 rounded-full"
          >
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
            className="rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
