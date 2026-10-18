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
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ChevronRight, Package } from "lucide-react";
import { PublicShell } from "@/components/public/public-shell";
import { ProductCard } from "@/components/public/product-card";
import { ArticleCard } from "@/components/public/article-card";
import { PurchaseOptions } from "@/components/public/purchase-options";
import { db } from "@/lib/db";
import { safeParseArray } from "@/lib/prisma-helpers";
import { estimateReadingTime } from "@/lib/markdown";
import { formatCurrency } from "@/lib/order-display";
import { cn } from "@/lib/utils";

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
            {/* Product image */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-secondary">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-muted-foreground">
                  <Package className="h-16 w-16" />
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="flex flex-col">
              {/* Inline meta row — minimal, separator-based */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                {product.category && (
                  <span className="font-medium text-foreground">
                    {product.category.name}
                  </span>
                )}
                <span aria-hidden className="text-border">·</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Fresh by Order
                </span>
                <span aria-hidden className="text-border">·</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Tanpa MSG &amp; Pengawet
                </span>
                <span aria-hidden className="text-border">·</span>
                <span
                  className={cn(
                    "text-xs font-semibold",
                    product.isActive ? "text-emerald-700" : "text-rose-700",
                  )}
                >
                  {product.isActive ? "Tersedia" : "Habis"}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {product.name}
              </h1>
              {product.shortDescription && (
                <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
                  {product.shortDescription}
                </p>
              )}

              {/* Price + Package — cleaner single row, prominent price */}
              <div className="mt-6 rounded-lg border border-border bg-card p-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Harga
                    </p>
                    {product.price ? (
                      <p className="mt-1 text-2xl font-bold text-foreground tabular-nums">
                        {formatCurrency(product.price)}
                      </p>
                    ) : (
                      <p className="mt-1 text-sm italic text-muted-foreground">
                        Harga menyusul — hubungi via WhatsApp
                      </p>
                    )}
                  </div>
                  {product.packageSize && (
                    <div className="text-right">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Kemasan
                      </p>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {product.packageSize}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Purchase options block */}
              <PurchaseOptions
                productId={product.id}
                productName={product.name}
                productSlug={product.slug}
                productPrice={product.price}
                productImageUrl={product.imageUrl}
                whatsappNumber={whatsappNumber}
                shopeeUrl={product.shopeeUrl}
                tokopediaUrl={product.tokopediaUrl}
                websiteOrderEnabled={product.websiteOrderEnabled}
              />

              <div className="mt-4">
                <Link
                  href="/produk"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Kembali ke Produk
                </Link>
              </div>

              <Separator className="my-8" />

              {/* Product description */}
              <div className="space-y-6">
                <section>
                  <h2 className="text-lg font-semibold text-foreground">
                    Deskripsi Produk
                  </h2>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </section>

                <section>
                  <h3 className="text-base font-semibold text-foreground">
                    Saran Penyajian
                  </h3>
                  {product.servingSuggestion ? (
                    <p className="mt-2 text-muted-foreground leading-relaxed">
                      {product.servingSuggestion}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm italic text-muted-foreground">
                      Informasi saran penyajian akan diperbarui segera.
                    </p>
                  )}
                </section>

                <section>
                  <h3 className="text-base font-semibold text-foreground">
                    Komposisi
                  </h3>
                  {product.ingredients ? (
                    <p className="mt-2 text-muted-foreground leading-relaxed">
                      {product.ingredients}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm italic text-muted-foreground">
                      Informasi komposisi akan diperbarui segera.
                    </p>
                  )}
                </section>

                <section>
                  <h3 className="text-base font-semibold text-foreground">
                    Cara Penyimpanan
                  </h3>
                  {product.storageInstructions ? (
                    <p className="mt-2 text-muted-foreground leading-relaxed">
                      {product.storageInstructions}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm italic text-muted-foreground">
                      Informasi penyimpanan akan diperbarui segera.
                    </p>
                  )}
                </section>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <section className="mt-20">
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
            <section className="mt-20">
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
