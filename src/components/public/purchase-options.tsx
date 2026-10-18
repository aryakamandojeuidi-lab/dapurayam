"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  MessageCircle,
  ExternalLink,
  Plus,
  Minus,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/public/whatsapp-button";
import { buildProductOrderMessage } from "@/lib/whatsapp";
import { useCartStore } from "@/lib/cart-store";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/order-display";
import { cn } from "@/lib/utils";

type Props = {
  productId: string;
  productName: string;
  productSlug: string;
  productPrice: number | null;
  productImageUrl: string | null;
  whatsappNumber: string;
  shopeeUrl?: string | null;
  tokopediaUrl?: string | null;
  websiteOrderEnabled?: boolean | null;
};

export function PurchaseOptions({
  productId,
  productName,
  productSlug,
  productPrice,
  productImageUrl,
  whatsappNumber,
  shopeeUrl,
  websiteOrderEnabled,
}: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);

  const handleAddToCart = () => {
    addItem(
      {
        productId,
        productName,
        productSlug,
        productPrice: productPrice ?? 0,
        productImageUrl,
      },
      qty,
    );
    toast({
      title: "Ditambahkan ke keranjang",
      description: `${qty} × ${productName}`,
    });
  };

  const handleBuyNow = () => {
    addItem(
      {
        productId,
        productName,
        productSlug,
        productPrice: productPrice ?? 0,
        productImageUrl,
      },
      qty,
    );
    router.push("/checkout");
  };

  const websiteEnabled = websiteOrderEnabled !== false;

  return (
    <div className="mt-6 rounded-xl border border-border bg-secondary/40 p-5 md:p-6">
      <h3 className="text-base font-semibold text-foreground">Pilih Pembelian</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Produk dibuat{" "}
        <span className="font-medium text-foreground">fresh by order</span> —
        diproses setelah konfirmasi pesanan diterima.
      </p>

      {websiteEnabled && (
        <div className="mt-5 rounded-lg border border-border bg-background p-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground">Jumlah</span>
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                aria-label="Kurangi jumlah"
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) =>
                  setQty(Math.max(1, Number(e.target.value) || 1))
                }
                className="h-8 w-16 rounded-md border border-input bg-background px-2 text-center text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                aria-label="Jumlah produk"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQty((q) => q + 1)}
                aria-label="Tambah jumlah"
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="ml-auto text-right">
              {productPrice ? (
                <p className="text-sm">
                  <span className="text-muted-foreground">Subtotal </span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(productPrice * qty)}
                  </span>
                </p>
              ) : (
                <p className="text-xs italic text-muted-foreground">
                  Harga menyusul — konfirmasi via WA
                </p>
              )}
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              onClick={handleAddToCart}
              variant="outline"
              className="flex-1 gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Tambah ke Keranjang
            </Button>
            <Button
              type="button"
              onClick={handleBuyNow}
              className="flex-1 gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              Beli Sekarang
            </Button>
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ChannelCard
          title="Shopee"
          subtitle={
            shopeeUrl
              ? "Pembayaran & pengiriman via Shopee."
              : "Link Shopee akan diperbarui."
          }
          href={shopeeUrl || undefined}
          ctaLabel={shopeeUrl ? "Beli di Shopee" : "Belum Tersedia"}
          accentClass="border-[#ee4d2d]/30 bg-[#ee4d2d]/5"
          badge={
            <span className="grid h-6 w-6 place-items-center rounded bg-[#ee4d2d] text-xs font-bold text-white">
              S
            </span>
          }
        />
        <ChannelCard
          title="Konsul via WhatsApp"
          subtitle="Konsultasi langsung untuk pemesanan custom."
          href={whatsappNumber ? "#" : undefined}
          ctaLabel="Chat WhatsApp"
          accentClass="border-[#25d366]/30 bg-[#25d366]/5"
          badge={<MessageCircle className="h-4 w-4 text-[#25d366]" />}
          customButton={
            <WhatsAppButton
              number={whatsappNumber}
              message={buildProductOrderMessage(productName)}
              label="Chat WhatsApp"
              size="sm"
              className="mt-3 w-full"
            />
          }
        />
      </div>
    </div>
  );
}

function ChannelCard({
  title,
  subtitle,
  href,
  ctaLabel,
  accentClass,
  badge,
  customButton,
}: {
  title: string;
  subtitle: string;
  href?: string;
  ctaLabel: string;
  accentClass: string;
  badge: React.ReactNode;
  customButton?: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-lg border p-4", accentClass)}>
      <div className="flex items-center gap-2">
        {badge}
        <span className="text-sm font-semibold text-foreground">{title}</span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
        {subtitle}
      </p>
      {customButton ? (
        customButton
      ) : href ? (
        <Button asChild size="sm" className="mt-3 w-full gap-1.5" variant="outline">
          <a href={href} target="_blank" rel="noopener noreferrer">
            {ctaLabel}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Button>
      ) : (
        <Button disabled size="sm" className="mt-3 w-full" variant="outline">
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}
