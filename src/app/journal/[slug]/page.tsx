import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import {

  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft, Newspaper } from "lucide-react";
import { PublicShell } from "@/components/public/public-shell";
import { ArticleCard } from "@/components/public/article-card";
import { ShareButtons } from "@/components/public/share-buttons";
import { TableOfContents } from "@/components/public/toc";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { estimateReadingTime, generateToc } from "@/lib/markdown";
import { parseTags } from "@/lib/prisma-helpers";


// Always dynamic — DB-required page, skip static prerender to avoid build crash when DATABASE_URL not available at build time
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function formatDate(d: Date): string {
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await db.article.findUnique({ where: { slug } });
  if (!article) return {};
  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt || "",
    alternates: { canonical: `/journal/${article.slug}` },
    openGraph: {
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt || "",
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
      authors: [article.authorName],
      ...(article.coverImageUrl ? { images: [article.coverImageUrl] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt || "",
      ...(article.coverImageUrl ? { images: [article.coverImageUrl] } : {}),
    },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await db.article.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (
    !article ||
    article.status !== "PUBLISHED" ||
    !article.publishedAt ||
    article.publishedAt > new Date()
  ) {
    notFound();
  }

  const settings = await db.siteSettings.findUnique({ where: { id: "default" } });
  const whatsappNumber = settings?.whatsappNumber || "";
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const articleUrl = `${baseUrl}/journal/${article.slug}`;

  const tocItems = generateToc(article.content);
  const readingTime = estimateReadingTime(article.content);
  const tags = parseTags(article.tags);

  // Related articles (same category, exclude current)
  const related = await db.article.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: { lte: new Date() },
      categoryId: article.categoryId,
      NOT: { id: article.id },
    },
    include: { category: true },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt || "",
    author: {
      "@type": "Person",
      name: article.authorName,
    },
    datePublished: article.publishedAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    url: articleUrl,
    ...(article.coverImageUrl ? { image: article.coverImageUrl } : {}),
  };

  return (
    <PublicShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="bg-background py-8 md:py-12">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Beranda</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/journal">Journal</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{article.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-wrap items-center gap-2">
            {article.category && (
              <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                {article.category.name}
              </Badge>
            )}
            {tags.map((t) => (
              <Badge key={t} variant="outline" className="bg-secondary text-foreground">
                #{t}
              </Badge>
            ))}
          </div>

          <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="mt-4 text-lg text-muted-foreground">{article.excerpt}</p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-4 border-b border-border pb-6 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{article.authorName}</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(article.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {readingTime} menit baca
            </span>
          </div>

          {article.coverImageUrl && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-border">
              <img
                src={article.coverImageUrl}
                alt={article.title}
                className="h-auto w-full object-cover"
              />
            </div>
          )}

          {tocItems.length > 2 && (
            <div className="mt-8">
              <TableOfContents items={tocItems} />
            </div>
          )}

          <div className="prose-warm mt-8 max-w-none text-foreground">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="mt-8 text-2xl font-bold text-foreground md:text-3xl">
                    {children}
                  </h1>
                ),
                h2: ({ children, ...props }) => {
                  const text = String(children ?? "");
                  return (
                    <h2
                      id={slugifyHeading(text)}
                      className="mt-8 scroll-mt-24 text-xl font-bold text-foreground md:text-2xl"
                    >
                      {children}
                    </h2>
                  );
                },
                h3: ({ children, ...props }) => {
                  const text = String(children ?? "");
                  return (
                    <h3
                      id={slugifyHeading(text)}
                      className="mt-6 scroll-mt-24 text-lg font-semibold text-foreground"
                    >
                      {children}
                    </h3>
                  );
                },
                p: ({ children }) => (
                  <p className="mt-4 leading-relaxed text-muted-foreground">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="mt-4 list-disc space-y-1.5 pl-6 text-muted-foreground">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="mt-4 list-decimal space-y-1.5 pl-6 text-muted-foreground">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="mt-6 border-l-4 border-accent bg-secondary/50 px-4 py-3 italic text-foreground">
                    {children}
                  </blockquote>
                ),
                a: ({ children, href }) => (
                  <a
                    href={href}
                    target={href?.startsWith("http") ? "_blank" : undefined}
                    rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-primary underline underline-offset-2 hover:text-primary/80"
                  >
                    {children}
                  </a>
                ),
                code: ({ children }) => (
                  <code className="rounded bg-secondary px-1.5 py-0.5 text-sm">
                    {children}
                  </code>
                ),
                img: ({ src, alt }) =>
                  src ? (
                    <img
                      src={typeof src === "string" ? src : ""}
                      alt={alt || ""}
                      className="mt-6 rounded-lg border border-border"
                    />
                  ) : null,
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>

          <div className="mt-10 border-t border-border pt-6">
            <ShareButtons
              title={article.title}
              url={articleUrl}
              whatsappNumber={whatsappNumber}
            />
          </div>

          <div className="mt-8">
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <Link href="/journal">
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Journal
              </Link>
            </Button>
          </div>

          {related.length > 0 && (
            <section className="mt-16 border-t border-border pt-10">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Artikel Terkait
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((a) => (
                  <ArticleCard
                    key={a.id}
                    article={a}
                    readingTime={estimateReadingTime(a.content)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </PublicShell>
  );
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
