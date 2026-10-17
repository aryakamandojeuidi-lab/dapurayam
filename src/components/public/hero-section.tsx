import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/public/whatsapp-button";
import { buildWhatsAppUrl, buildGeneralInquiryMessage } from "@/lib/whatsapp";

type Props = {
  headline: string;
  subtext: string;
  whatsappNumber: string;
  positioningLabel?: string | null;
  freshnessNote?: string | null;
};

export function HeroSection({
  headline,
  subtext,
  whatsappNumber,
  positioningLabel,
  freshnessNote,
}: Props) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary/50 via-background to-background">
      <div className="absolute inset-0 -z-10 opacity-40">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute top-40 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      </div>
      <div className="mx-auto max-w-3xl px-4 py-20 text-center md:px-6 md:py-28 lg:py-32">
        {positioningLabel && (
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            {positioningLabel}
          </p>
        )}
        <h1 className="mt-4 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
          {headline || "Nugget Ayam Praktis untuk Momen Makan Bersama"}
        </h1>
        <p className="mt-6 text-balance text-base text-muted-foreground md:text-lg leading-relaxed">
          {subtext ||
            "Nikmati produk olahan ayam berkualitas yang siap diolah kapan saja. Praktis, lezat, dan dibuat dengan bahan pilihan."}
        </p>
        {freshnessNote && (
          <p className="mt-4 text-sm font-medium uppercase tracking-wider text-primary">
            {freshnessNote}
          </p>
        )}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="gap-2">
            <Link href="/produk">
              Lihat Produk
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          {whatsappNumber ? (
            <Button asChild size="lg" variant="outline" className="gap-2">
              <a
                href={buildWhatsAppUrl(
                  whatsappNumber,
                  buildGeneralInquiryMessage(),
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                Pesan via WhatsApp
              </a>
            </Button>
          ) : (
            <WhatsAppButton
              number=""
              label="Pesan via WhatsApp"
              size="lg"
              variant="outline"
            />
          )}
        </div>
      </div>
    </section>
  );
}
