import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, MessageCircle, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { PublicShell } from "@/components/public/public-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {

  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  ORDER_CHANNEL_LABELS,
  formatCurrency,
  formatDate,
} from "@/lib/order-display";
import { buildWhatsAppUrl, buildConsultationMessage } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";


// Always dynamic — DB-required page, skip static prerender to avoid build crash when DATABASE_URL not available at build time
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ orderNumber: string }> };

export default async function OrderSuccessPage({ params }: Props) {
  const { orderNumber } = await params;
  const order = await db.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });

  if (!order) notFound();

  const settings = await db.siteSettings.findUnique({ where: { id: "default" } });
  const waNumber = settings?.whatsappNumber || "";
  const waUrl = buildWhatsAppUrl(waNumber, buildConsultationMessage());

  return (
    <PublicShell>
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-4 md:px-6">
          <div className="text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-9 w-9 text-emerald-600" />
            </div>
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Pesanan Diterima
            </h1>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Terima kasih telah memesan di Dapur Ayam. Tim kami akan menghubungi
              Anda via WhatsApp untuk konfirmasi ketersediaan, harga final, dan
              pengiriman.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Nomor Pesanan
              </span>
              <span className="font-mono font-bold text-foreground">
                {order.orderNumber}
              </span>
            </p>
          </div>

          <Card className="mt-10">
            <CardHeader>
              <CardTitle className="text-base">Detail Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <span
                    className={`mt-1 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                      ORDER_STATUS_COLORS[order.status] || ""
                    }`}
                  >
                    {ORDER_STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Kanal</p>
                  <p className="mt-1 font-medium text-foreground">
                    {ORDER_CHANNEL_LABELS[order.channel] || order.channel}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tanggal</p>
                  <p className="mt-1 font-medium text-foreground">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Item</p>
                  <p className="mt-1 font-medium text-foreground tabular-nums">
                    {order.totalItems} produk
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Item Pesanan
                </p>
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm gap-3"
                  >
                    <div className="min-w-0">
                      {item.productSlug ? (
                        <Link
                          href={`/produk/${item.productSlug}`}
                          className="font-medium text-foreground hover:text-primary"
                        >
                          {item.productName}
                        </Link>
                      ) : (
                        <span className="font-medium text-foreground">
                          {item.productName}
                        </span>
                      )}
                      <p className="text-xs text-muted-foreground tabular-nums">
                        {item.quantity} × {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                    <span className="font-medium text-foreground tabular-nums shrink-0">
                      {formatCurrency(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex justify-between">
                <span className="text-sm font-medium text-foreground">
                  Total Pembelian
                </span>
                <span className="text-lg font-bold text-primary tabular-nums">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Data Pemesan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nama</span>
                <span className="font-medium text-foreground">
                  {order.customerName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">WhatsApp</span>
                <span className="font-medium text-foreground tabular-nums">
                  {order.customerPhone}
                </span>
              </div>
              {order.customerEmail && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium text-foreground">
                    {order.customerEmail}
                  </span>
                </div>
              )}
              {order.customerNote && (
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground">Catatan</p>
                  <p className="mt-1 text-foreground bg-secondary/40 rounded p-2 text-sm whitespace-pre-wrap">
                    {order.customerNote}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {waUrl ? (
              <Button asChild size="lg" className="gap-2">
                <a href={waUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  Hubungi Admin via WhatsApp
                </a>
              </Button>
            ) : null}
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link href="/produk">
                Kembali Belanja
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
