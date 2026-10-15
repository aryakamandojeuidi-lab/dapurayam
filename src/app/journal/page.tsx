import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper } from "lucide-react";
import { PublicShell } from "@/components/public/public-shell";
import { ArticleCard } from "@/components/public/article-card";
import { ArticleSearch } from "@/components/public/article-search";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { estimateReadingTime } from "@/lib/markdown";

export const metadata: Metadata = {
  title: "Journal Dapur Ayam",
  description:
    "Edukasi, resep, dan tips seputar ayam dan olahannya dari Tim Dapur Ayam.",
  alternates: { canonical: "/journal" },
};

export default async function JournalPage() {
  const now = new Date();
  const articles = await db.article.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: { lte: now },
    },
    include: { category: true },
    orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
  });

  const categories = await db.articleCategory.findMany({
    orderBy: { name: "asc" },
  });
  // Only show categories with at least 1 published article
  const categoriesWithArticles = categories.filter((c) =>
    articles.some((a) => a.category?.slug === c.slug),
  );

  const featured = articles.find((a) => a.isFeatured) || articles[0] || null;
  const rest = featured ? articles.filter((a) => a.id !== featured.id) : articles;

  return (
    <PublicShell>
      <section className="bg-gradient-to-b from-secondary/50 to-background py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Journal Dapur Ayam
            </h1>
            <p className="mt-4 text-muted-foreground">
              Edukasi, resep, dan tips seputar ayam dan olahannya dari Tim Dapur Ayam.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-background py-10 md:py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          {articles.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-12 text-center">
              <Newspaper className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                Belum ada artikel diterbitkan
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Tim Dapur Ayam akan segera menerbitkan konten edukatif seputar ayam dan olahannya. Silakan kembali lagi nanti.
              </p>
              <Button asChild variant="outline" className="mt-6">
                <Link href="/">Kembali ke Beranda</Link>
              </Button>
            </div>
          ) : (
            <>
              {featured && (
                <div className="mb-12">
                  <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Artikel Pilihan
                  </h2>
                  <ArticleCard
                    article={featured}
                    readingTime={estimateReadingTime(featured.content)}
                    variant="featured"
                  />
                </div>
              )}
              <ArticleSearch
                articles={rest.map((a) => ({
                  ...a,
                  readingTime: estimateReadingTime(a.content),
                }))}
                categories={categoriesWithArticles.map((c) => ({
                  slug: c.slug,
                  name: c.name,
                }))}
              />
            </>
          )}
        </div>
      </section>
    </PublicShell>
  );
}
