import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ChevronRight, Package } from "lucide-react";
import { PublicShell } from "@/components/public/public-shell";
import { ProductCard } from "@/components/public/product-card";
import { ArticleCard } from "@/components/public/article-card";
import { WhatsAppButton } from "@/components/public/whatsapp-button";
import { db } from "@/lib/db";
import { buildProductOrderMessage } from "@/lib/whatsapp";
import { safeParseArray } from "@/lib/prisma-helpers";
import { estimateReadingTime } from "@/lib/markdown";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription || product.description,
    alternates: { canonical: `/produk/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription || product.description,
      type: "website",
      ...(product.imageUrl ? { images: [product.imageUrl] } : {}),
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product || !product.isActive) notFound();

  const settings = await db.siteSettings.findUnique({ where: { id: "default" } });
  const whatsappNumber = settings?.whatsappNumber || "";

  const related = await db.product.findMany({
    where: {
      isActive: true,
      categoryId: product.categoryId,
      NOT: { id: product.id },
    },
    include: { category: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  const relatedArticleIds = safeParseArray(product.relatedArticleIds);
  let relatedArticles: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    coverImageUrl: string | null;
    authorName: string;
    publishedAt: Date | null;
    category: { name: string; slug: string } | null;
    content: string;
  }> = [];
  if (relatedArticleIds.length) {
    relatedArticles = await db.article.findMany({
      where: {
        id: { in: relatedArticleIds },
        status: "PUBLISHED",
        publishedAt: { lte: new Date() },
      },
      include: { category: true },
      take: 3,
    });
  }

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || product.description,
    ...(product.imageUrl ? { image: [product.imageUrl] } : {}),
    ...(product.category ? { category: product.category.name } : {}),
  };
  if (product.price) {
    jsonLd.offers = {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "IDR",
      availability: "https://schema.org/InStock",
    };
  }

  return (
    <PublicShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="bg-background py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
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
                  <Link href="/produk">Produk</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{product.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-secondary">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-muted-foreground">
                  <Package className="h-16 w-16" />
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                {product.category && (
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                    {product.category.name}
                  </Badge>
                )}
                <Badge variant="outline" className="bg-secondary text-foreground">
                  {product.isActive ? "Tersedia" : "Habis"}
                </Badge>
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {product.name}
              </h1>
              {product.shortDescription && (
                <p className="mt-3 text-lg text-muted-foreground">
                  {product.shortDescription}
                </p>
              )}

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Harga
                  </p>
                  {product.price ? (
                    <p className="mt-1 text-xl font-semibold text-primary">
                      Rp {product.price.toLocaleString("id-ID")}
                    </p>
                  ) : (
                    <p className="mt-1 text-sm italic text-muted-foreground">
                      Harga menyusul — hubungi via WhatsApp
                    </p>
                  )}
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Ukuran Kemasan
                  </p>
                  {product.packageSize ? (
                    <p className="mt-1 text-base font-medium text-foreground">
                      {product.packageSize}
                    </p>
                  ) : (
                    <p className="mt-1 text-sm italic text-muted-foreground">
                      Informasi akan diperbarui segera
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <WhatsAppButton
                  number={whatsappNumber}
                  message={buildProductOrderMessage(product.name)}
                  label="Pesan Produk Ini"
                  size="lg"
                  className="flex-1"
                />
                <Link
                  href="/produk"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  <ArrowLeft className="h-4 w-4" /> Kembali ke Produk
                </Link>
              </div>

              <Separator className="my-6" />

              <div className="prose-warm space-y-5 text-foreground">
                <h2 className="text-xl font-bold">Deskripsi Produk</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>

                <div>
                  <h3 className="text-base font-semibold">Saran Penyajian</h3>
                  {product.servingSuggestion ? (
                    <p className="mt-2 text-muted-foreground leading-relaxed">
                      {product.servingSuggestion}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm italic text-muted-foreground">
                      Informasi saran penyajian akan diperbarui segera.
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-semibold">Komposisi</h3>
                  {product.ingredients ? (
                    <p className="mt-2 text-muted-foreground leading-relaxed">
                      {product.ingredients}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm italic text-muted-foreground">
                      Informasi komposisi akan diperbarui segera.
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-semibold">Cara Penyimpanan</h3>
                  {product.storageInstructions ? (
                    <p className="mt-2 text-muted-foreground leading-relaxed">
                      {product.storageInstructions}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm italic text-muted-foreground">
                      Informasi penyimpanan akan diperbarui segera.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Produk Terkait
              </h2>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={{
                      id: p.id,
                      name: p.name,
                      slug: p.slug,
                      shortDescription: p.shortDescription,
                      price: p.price,
                      packageSize: p.packageSize,
                      imageUrl: p.imageUrl,
                      category: p.category
                        ? { name: p.category.name, slug: p.category.slug }
                        : null,
                    }}
                    whatsappNumber={whatsappNumber}
                  />
                ))}
              </div>
            </section>
          )}

          {relatedArticles.length > 0 && (
            <section className="mt-16">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  Artikel Terkait
                </h2>
                <Link
                  href="/journal"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Lihat semua <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedArticles.map((a) => (
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
