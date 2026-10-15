import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/public/whatsapp-button";
import { buildWhatsAppUrl, buildGeneralInquiryMessage } from "@/lib/whatsapp";

type Props = {
  headline: string;
  subtext: string;
  whatsappNumber: string;
};

export function HeroSection({ headline, subtext, whatsappNumber }: Props) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary/60 via-background to-background">
      <div className="absolute inset-0 -z-10 opacity-60">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-accent/40 blur-3xl" />
        <div className="absolute top-40 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      </div>
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-secondary px-4 py-1.5 text-sm font-medium text-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Olahan Ayam Praktis untuk Keluarga
          </span>
          <h1 className="mt-6 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {headline || "Nugget Ayam Praktis untuk Momen Makan Bersama"}
          </h1>
          <p className="mt-6 text-balance text-base text-muted-foreground md:text-lg">
            {subtext ||
              "Nikmati produk olahan ayam berkualitas yang siap diolah kapan saja. Praktis, lezat, dan dibuat dengan bahan pilihan."}
          </p>
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
          <p className="mt-4 text-xs text-muted-foreground">
            Pesanan diproses langsung via WhatsApp. Hubungi kami untuk informasi ketersediaan.
          </p>
        </div>
      </div>
    </section>
  );
}
