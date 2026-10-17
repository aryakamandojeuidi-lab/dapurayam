import { MessageCircle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/public/whatsapp-button";
import {
  buildWhatsAppUrl,
  buildConsultationMessage,
} from "@/lib/whatsapp";

type Props = {
  whatsappNumber: string;
  shopeeStoreUrl?: string | null;
};

export function CtaSection({ whatsappNumber, shopeeStoreUrl }: Props) {
  return (
    <section className="bg-primary py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl">
          Pesan Sekarang
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/85 leading-relaxed">
          Produk kami dibuat fresh by order — tanpa MSG, tanpa pengawet. Pilih kanal
          pemesanan yang paling nyaman untuk Anda.
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
                href={buildWhatsAppUrl(whatsappNumber, buildConsultationMessage())}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                Konsultasi via WhatsApp
              </a>
            </Button>
          ) : (
            <WhatsAppButton
              number=""
              label="Konsultasi via WhatsApp"
              size="lg"
              variant="secondary"
            />
          )}
          {shopeeStoreUrl ? (
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="gap-2 bg-[#ee4d2d] text-white hover:bg-[#ee4d2d]/90"
            >
              <a
                href={shopeeStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ShoppingBag className="h-4 w-4" />
                Belanja di Shopee
              </a>
            </Button>
          ) : (
            <Button disabled size="lg" variant="secondary" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              Toko Shopee segera hadir
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
