import { PublicShell } from "@/components/public/public-shell";
import { HeroSection } from "@/components/public/hero-section";
import { FeaturedProducts } from "@/components/public/featured-products";
import { AdvantagesSection } from "@/components/public/advantages-section";
import { ProcessSection } from "@/components/public/process-section";
import { OrderingSteps } from "@/components/public/ordering-steps";
import { FaqSection } from "@/components/public/faq-section";
import { CtaSection } from "@/components/public/cta-section";
import { db } from "@/lib/db";

export default async function HomePage() {
  const [featured, settings] = await Promise.all([
    db.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: { category: true },
      orderBy: { featuredOrder: "asc" },
      take: 8,
    }),
    db.siteSettings.findUnique({ where: { id: "default" } }),
  ]);

  const whatsappNumber = settings?.whatsappNumber || "";
  const headline = settings?.heroHeadline || "Nugget Ayam Praktis untuk Momen Makan Bersama";
  const subtext = settings?.heroSubtext ||
    "Nikmati produk olahan ayam berkualitas yang siap diolah kapan saja. Praktis, lezat, dan dibuat dengan bahan pilihan.";

  return (
    <PublicShell>
      <HeroSection
        headline={headline}
        subtext={subtext}
        whatsappNumber={whatsappNumber}
        positioningLabel={settings?.positioningLabel}
        freshnessNote={settings?.freshnessNote}
      />
      <FeaturedProducts
        products={featured.map((p) => ({
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
        }))}
        whatsappNumber={whatsappNumber}
      />
      <AdvantagesSection />
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
