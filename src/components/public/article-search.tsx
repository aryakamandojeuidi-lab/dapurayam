"use client";

import { useMemo, useState } from "react";
import { Search, Newspaper, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "@/components/public/article-card";

type ArticleItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  authorName: string;
  publishedAt: Date | null;
  readingTime?: number;
  category?: { name: string; slug: string } | null;
};

type CategoryItem = { slug: string; name: string };

const PER_PAGE = 9;

type Props = {
  articles: ArticleItem[];
  categories: CategoryItem[];
};

export function ArticleSearch({ articles, categories }: Props) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      const matchesQuery =
        !q ||
        a.title.toLowerCase().includes(q) ||
        (a.excerpt?.toLowerCase().includes(q) ?? false);
      const matchesCategory =
        activeCategory === "all" || a.category?.slug === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }, [articles, query, activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Cari artikel..."
            className="pl-9"
            aria-label="Cari artikel"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={activeCategory === "all" ? "default" : "outline"}
          onClick={() => {
            setActiveCategory("all");
            setPage(1);
          }}
        >
          Semua
        </Button>
        {categories.map((c) => (
          <Button
            key={c.slug}
            size="sm"
            variant={activeCategory === c.slug ? "default" : "outline"}
            onClick={() => {
              setActiveCategory(c.slug);
              setPage(1);
            }}
          >
            {c.name}
          </Button>
        ))}
      </div>

      <div className="mt-8">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-10 text-center">
            <Newspaper className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Tidak ada artikel ditemukan
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {query || activeCategory !== "all"
                ? "Coba kata kunci lain atau pilih kategori berbeda."
                : "Belum ada artikel yang diterbitkan. Tim Dapur Ayam akan segera menerbitkan konten edukatif seputar ayam dan olahannya."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((a) => (
                <ArticleCard
                  key={a.id}
                  article={a}
                  readingTime={a.readingTime}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Sebelumnya
                </Button>
                <span className="text-sm text-muted-foreground">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Berikutnya
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

