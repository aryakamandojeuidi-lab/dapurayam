import Link from "next/link";
import { Calendar, Clock, ArrowRight, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props = {
  article: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    coverImageUrl: string | null;
    authorName: string;
    publishedAt: Date | null;
    category?: { name: string; slug: string } | null;
  };
  readingTime?: number;
  className?: string;
  variant?: "default" | "featured";
};

function formatDate(d: Date | null): string {
  if (!d) return "";
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function ArticleCard({ article, readingTime = 0, className, variant = "default" }: Props) {
  if (variant === "featured") {
    return (
      <Link
        href={`/journal/${article.slug}`}
        className={cn(
          "group relative grid grid-cols-1 overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md lg:grid-cols-2",
          className,
        )}
      >
        <div className="relative aspect-[16/9] overflow-hidden bg-secondary lg:aspect-auto lg:h-full lg:min-h-[320px]">
          {article.coverImageUrl ? (
            <img
              src={article.coverImageUrl}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-muted-foreground">
              <Newspaper className="h-12 w-12" />
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2">
            {article.category && (
              <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                {article.category.name}
              </Badge>
            )}
            <Badge variant="outline" className="bg-secondary text-foreground">
              Artikel Pilihan
            </Badge>
          </div>
          <h3 className="mt-4 text-balance text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary md:text-3xl">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="mt-3 line-clamp-3 text-muted-foreground">
              {article.excerpt}
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>{article.authorName}</span>
            {article.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(article.publishedAt)}
              </span>
            )}
            {readingTime > 0 && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {readingTime} menit baca
              </span>
            )}
          </div>
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            Baca Selengkapnya
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/journal/${article.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/40",
        className,
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
        {article.coverImageUrl ? (
          <img
            src={article.coverImageUrl}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-muted-foreground">
            <Newspaper className="h-10 w-10" />
          </div>
        )}
        {article.category && (
          <Badge className="absolute left-3 top-3 bg-background/90 text-foreground hover:bg-background/90">
            {article.category.name}
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary md:text-lg">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
            {article.excerpt}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {article.publishedAt && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(article.publishedAt)}
            </span>
          )}
          {readingTime > 0 && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {readingTime} menit baca
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
