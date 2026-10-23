import Link from "next/link";
import { ArrowRight, Leaf, Drumstick, Snowflake, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  headline?: string;
  subtext?: string;
  whatsappNumber: string;
  positioningLabel?: string | null;
  freshnessNote?: string | null;
};

const HERO_FEATURES = [
  { icon: Leaf, label: "Tanpa MSG" },
  { icon: Drumstick, label: "Ayam Pejantan Asli" },
  { icon: Snowflake, label: "Frozen Lebih Praktis" },
  { icon: Heart, label: "Rasa Rumah Sendiri" },
];

export function HeroSection({
  headline,
  subtext,
  whatsappNumber,
  positioningLabel,
  freshnessNote,
}: Props) {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Decorative soft red corner */}
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-12 md:px-6 md:py-16 lg:grid-cols-2 lg:gap-12 lg:py-20">
        {/* Left: copy */}
        <div className="order-2 lg:order-1">
          {positioningLabel && (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {positioningLabel}
            </p>
          )}
          <h1 className="font-display mt-3 text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Ayam Pejantan{" "}
            <span className="text-[oklch(0.55_0.13_145)]">Premium</span>
          </h1>
          <p className="mt-4 text-lg font-medium text-foreground/90 md:text-xl">
            {subtext || "Bumbu rempah asli, tanpa MSG"}
          </p>
          <p className="mt-2 text-base text-muted-foreground md:text-lg">
            {freshnessNote || "Praktis, lezat, siap saji."}
          </p>

          {/* 4 feature icons row */}
          <ul className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4 sm:gap-x-4">
            {HERO_FEATURES.map(({ icon: Icon, label }) => (
              <li key={label} className="flex flex-col items-center gap-2 text-center">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-semibold leading-tight text-foreground/80">
                  {label}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="gap-2 rounded-full px-6">
              <Link href="/produk">
                Lihat Semua Produk
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Right: hero image with badge */}
        <div className="relative order-1 lg:order-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-secondary shadow-xl ring-1 ring-border sm:aspect-[5/4] lg:aspect-[4/5]">
            {/*
              Hero image — clean appetizing roast chicken visual.
              Admin can replace /public/uploads/products/hero-ayam-premium.jpg
              with the real brand hero photo when available.
            */}
            <img
              src="/uploads/products/hero-ayam-premium.jpg"
              alt="Ayam Pejantan Premium oleh Dapur Ayam"
              className="h-full w-full object-cover"
            />
            {/* Soft gradient to ensure badge & text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          </div>

          {/* Yellow brush-stroke badge */}
          <div className="badge-brush absolute -top-4 right-4 sm:-right-6 sm:top-6">
            <div className="px-4 py-2 text-center">
              <p className="text-xs font-bold uppercase leading-tight tracking-wider text-foreground">
                Lezat
              </p>
              <p className="text-xs font-bold uppercase leading-tight tracking-wider text-foreground">
                Bergizi
              </p>
              <p className="text-xs font-bold uppercase leading-tight tracking-wider text-foreground">
                Praktis
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
