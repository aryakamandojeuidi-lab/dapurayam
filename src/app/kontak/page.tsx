import type { Metadata } from "next";
import { MessageCircle, Mail, MapPin, Clock, Instagram, Facebook, ShoppingBag } from "lucide-react";
import { PublicShell } from "@/components/public/public-shell";
import { WhatsAppButton } from "@/components/public/whatsapp-button";
import { ContactForm } from "@/components/public/contact-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { buildConsultationMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Kontak",
  description:
    "Hubungi Dapur Ayam melalui WhatsApp, Shopee, email, atau media sosial. Kami siap membantu pertanyaan, konsultasi, dan pemesanan Anda.",
  alternates: { canonical: "/kontak" },
};

export default async function KontakPage() {
  const settings = await db.siteSettings.findUnique({ where: { id: "default" } });
  const whatsappNumber = settings?.whatsappNumber || "";
  const contactEmail = settings?.contactEmail || "";

  return (
    <PublicShell>
      <section className="bg-gradient-to-b from-secondary/50 to-background py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Hubungi Kami
            </h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Kami senang mendengar dari Anda. Hubungi kami untuk pertanyaan,
              konsultasi, pemesanan custom, atau informasi lebih lanjut. Produk
              kami dibuat{" "}
              <span className="font-medium text-foreground">fresh by order</span> —
              tanpa MSG dan tanpa pengawet.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-background py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    Konsultasi WhatsApp
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {whatsappNumber ? (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Hubungi kami via WhatsApp untuk konsultasi langsung,
                      pemesanan custom, dan kebutuhan khusus. Diproses fresh by
                      order setelah konfirmasi pesanan.
                      <br />
                      <span className="font-medium text-foreground tabular-nums">
                        Nomor: {whatsappNumber}
                      </span>
                    </p>
                  ) : (
                    <p className="text-sm italic text-muted-foreground">
                      Nomor WhatsApp akan diperbarui segera oleh admin.
                    </p>
                  )}
                  <div className="mt-4">
                    {whatsappNumber ? (
                      <Button asChild className="gap-2">
                        <a
                          href={buildWhatsAppUrl(whatsappNumber, buildConsultationMessage())}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Mulai Konsultasi
                        </a>
                      </Button>
                    ) : (
                      <WhatsAppButton
                        number={whatsappNumber}
                        message={buildConsultationMessage()}
                        label="Mulai Konsultasi"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShoppingBag className="h-5 w-5 text-[#ee4d2d]" />
                    Toko Shopee
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {settings?.shopeeStoreUrl ? (
                    <>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Kunjungi toko resmi kami di Shopee untuk pembelian dengan
                        opsi pembayaran dan pengiriman terintegrasi.
                      </p>
                      <Button
                        asChild
                        className="mt-4 gap-2 bg-[#ee4d2d] text-white hover:bg-[#ee4d2d]/90"
                      >
                        <a
                          href={settings.shopeeStoreUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ShoppingBag className="h-4 w-4" />
                          Belanja di Shopee
                        </a>
                      </Button>
                    </>
                  ) : (
                    <p className="text-sm italic text-muted-foreground">
                      Toko Shopee akan diperbarui segera oleh admin.
                    </p>
                  )}
                  {settings?.tokopediaStoreUrl && (
                    <div className="mt-4 border-t border-border pt-4">
                      <p className="text-xs text-muted-foreground">
                        Tersedia juga di Tokopedia:
                      </p>
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="mt-2 gap-2"
                      >
                        <a
                          href={settings.tokopediaStoreUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Belanja di Tokopedia
                        </a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Mail className="h-5 w-5 text-primary" />
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {contactEmail ? (
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {contactEmail}
                    </a>
                  ) : (
                    <p className="text-sm italic text-muted-foreground">
                      Email akan diperbarui segera oleh admin.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                    Alamat &amp; Jam Operasional
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Alamat</p>
                    {settings?.address ? (
                      <p className="mt-1 text-sm text-foreground">{settings.address}</p>
                    ) : (
                      <p className="mt-1 text-sm italic text-muted-foreground">
                        Alamat akan diperbarui segera oleh admin.
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Jam Operasional
                    </p>
                    {settings?.operationalHours ? (
                      <p className="mt-1 text-sm text-foreground">{settings.operationalHours}</p>
                    ) : (
                      <p className="mt-1 text-sm italic text-muted-foreground">
                        Jam operasional akan diperbarui segera oleh admin.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Media Sosial</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {settings?.instagramUrl ? (
                      <a
                        href={settings.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-primary hover:text-primary"
                        aria-label="Instagram"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    ) : null}
                    {settings?.facebookUrl ? (
                      <a
                        href={settings.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-primary hover:text-primary"
                        aria-label="Facebook"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                    ) : null}
                    {settings?.tiktokUrl ? (
                      <a
                        href={settings.tiktokUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-primary hover:text-primary"
                        aria-label="TikTok"
                      >
                        <span className="text-xs font-bold">TT</span>
                      </a>
                    ) : null}
                    {!settings?.instagramUrl &&
                      !settings?.facebookUrl &&
                      !settings?.tiktokUrl && (
                        <p className="text-sm italic text-muted-foreground">
                          Media sosial akan diperbarui segera oleh admin.
                        </p>
                      )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Kirim Pesan</CardTitle>
                </CardHeader>
                <CardContent>
                  <ContactForm
                    whatsappNumber={whatsappNumber}
                    contactEmail={contactEmail}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
