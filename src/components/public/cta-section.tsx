import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/public/whatsapp-button";
import { buildWhatsAppUrl, buildGeneralInquiryMessage } from "@/lib/whatsapp";

type Props = {
  whatsappNumber: string;
};

export function CtaSection({ whatsappNumber }: Props) {
  return (
    <section className="bg-primary py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl">
          Pesan Sekarang
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/90">
          Hubungi kami via WhatsApp untuk memesan produk atau bertanya seputar ketersediaan, harga, dan pengiriman.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {whatsappNumber ? (
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="gap-2 bg-background text-foreground hover:bg-background/90"
            >
              <a
                href={buildWhatsAppUrl(
                  whatsappNumber,
                  buildGeneralInquiryMessage(),
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                Hubungi via WhatsApp
              </a>
            </Button>
          ) : (
            <WhatsAppButton
              number=""
              label="Hubungi via WhatsApp"
              size="lg"
              variant="secondary"
            />
          )}
        </div>
        {!whatsappNumber && (
          <p className="mt-4 text-sm text-primary-foreground/80">
            Nomor WhatsApp akan diperbarui segera oleh admin.
          </p>
        )}
      </div>
    </section>
  );
}
