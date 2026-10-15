"use client";

import { useMemo, useState } from "react";
import { Search, PackageOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/public/product-card";
import { cn } from "@/lib/utils";

type ProductItem = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  price: number | null;
  packageSize: string | null;
  imageUrl: string | null;
  category?: { name: string; slug: string } | null;
};

type CategoryItem = { slug: string; name: string };

type Props = {
  products: ProductItem[];
  categories: CategoryItem[];
  whatsappNumber: string;
};

export function ProductSearch({ products, categories, whatsappNumber }: Props) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.shortDescription?.toLowerCase().includes(q) ?? false);
      const matchesCategory =
        activeCategory === "all" ||
        p.category?.slug === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }, [products, query, activeCategory]);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari produk..."
            className="pl-9"
            aria-label="Cari produk"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={activeCategory === "all" ? "default" : "outline"}
          onClick={() => setActiveCategory("all")}
        >
          Semua
        </Button>
        {categories.map((c) => (
          <Button
            key={c.slug}
            size="sm"
            variant={activeCategory === c.slug ? "default" : "outline"}
            onClick={() => setActiveCategory(c.slug)}
          >
            {c.name}
          </Button>
        ))}
      </div>

      <div className="mt-8">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-10 text-center">
            <PackageOpen className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Tidak ada produk ditemukan
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {query || activeCategory !== "all"
                ? "Coba kata kunci lain atau pilih kategori berbeda."
                : "Belum ada produk. Silakan kembali lagi nanti atau hubungi kami via WhatsApp."}
            </p>
          </div>
        ) : (
          <div className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4")}>
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} whatsappNumber={whatsappNumber} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
