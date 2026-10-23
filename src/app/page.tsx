import { PublicShell } from "@/components/public/public-shell";
import { HeroSection } from "@/components/public/hero-section";
import { TrustBadges } from "@/components/public/trust-badges";
import { FeaturedProducts } from "@/components/public/featured-products";
import { PromoCards } from "@/components/public/promo-cards";
import { SellingPoints } from "@/components/public/selling-points";
import { ProcessSection } from "@/components/public/process-section";
import { OrderingSteps } from "@/components/public/ordering-steps";
import { FaqSection } from "@/components/public/faq-section";
import { CtaSection } from "@/components/public/cta-section";
import { db } from "@/lib/db";


// Always dynamic — DB-required page, skip static prerender to avoid build crash when DATABASE_URL not available at build time
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Defensive: if DB is unreachable (e.g. DATABASE_URL not set, network error,
  // Prisma client not initialized), fall back to empty arrays/null so the page
  // still renders with empty state instead of throwing 500.
  let allFeatured: Awaited<ReturnType<typeof db.product.findMany>> = [];
  let settings: Awaited<ReturnType<typeof db.siteSettings.findUnique>> = null;
  try {
    [allFeatured, settings] = await Promise.all([
      db.product.findMany({
        where: { isActive: true, isFeatured: true },
        include: { category: true },
        orderBy: { featuredOrder: "asc" },
        take: 12,
      }),
      db.siteSettings.findUnique({ where: { id: "default" } }),
    ]);
  } catch (err) {
    console.error(
      "[homepage] DB call failed. Rendering with empty state.",
      err instanceof Error ? err.message : err,
    );
  }

  const whatsappNumber = settings?.whatsappNumber || "";
  const headline = settings?.heroHeadline || "Ayam Pejantan Premium";
  const subtext = settings?.heroSubtext || "Bumbu rempah asli, tanpa MSG";
  const positioningLabel = settings?.positioningLabel || "Dapur Ayam by Serabites";
  const freshnessNote = settings?.freshnessNote || "Praktis, lezat, siap saji.";

  // Split: first 4 = product grid; rest with promo-style categories = promo cards
  const products = allFeatured.slice(0, 4);
  const promo = allFeatured
    .slice(4)
    .filter((p) => p.shortDescription && p.shortDescription.length > 0)
    .slice(0, 2)
    .map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      imageUrl: p.imageUrl,
      description:
        p.shortDescription ||
        "Olahan ayam premium untuk keluarga dan usaha Anda.",
    }));

  return (
    <PublicShell>
      <HeroSection
        headline={headline}
        subtext={subtext}
        whatsappNumber={whatsappNumber}
        positioningLabel={positioningLabel}
        freshnessNote={freshnessNote}
      />
      <TrustBadges />
      <FeaturedProducts
        products={products.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          shortDescription: p.shortDescription,
          price: p.price,
          packageSize: p.packageSize,
          imageUrl: p.imageUrl,
          isFeatured: p.isFeatured,
          featuredOrder: p.featuredOrder,
          category: p.category
            ? { name: p.category.name, slug: p.category.slug }
            : null,
        }))}
        whatsappNumber={whatsappNumber}
      />
      <PromoCards items={promo} />
      <SellingPoints />
      <ProcessSection />
      <OrderingSteps />
      <FaqSection />
      <CtaSection
        whatsappNumber={whatsappNumber}
        shopeeStoreUrl={settings?.shopeeStoreUrl}
      />
    </PublicShell>
  );
}
