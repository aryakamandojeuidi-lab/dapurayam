import type { Metadata } from "next";
import { MessageCircle, Mail, MapPin, Clock, Instagram, Facebook } from "lucide-react";
import { PublicShell } from "@/components/public/public-shell";
import { WhatsAppButton } from "@/components/public/whatsapp-button";
import { ContactForm } from "@/components/public/contact-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { buildGeneralInquiryMessage } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Kontak",
  description:
    "Hubungi Dapur Ayam melalui WhatsApp, email, atau media sosial. Kami siap membantu pertanyaan dan pemesanan Anda.",
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
            <p className="mt-4 text-muted-foreground">
              Kami senang mendengar dari Anda. Hubungi kami untuk pertanyaan, pemesanan, atau informasi lebih lanjut.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-background py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    WhatsApp
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {whatsappNumber ? (
                    <p className="text-sm text-muted-foreground">
                      Hubungi kami via WhatsApp untuk respons cepat terkait produk dan pemesanan.
                      <br />
                      <span className="font-medium text-foreground">
                        Nomor: {whatsappNumber}
                      </span>
                    </p>
                  ) : (
                    <p className="text-sm italic text-muted-foreground">
                      Nomor WhatsApp akan diperbarui segera oleh admin.
                    </p>
                  )}
                  <div className="mt-4">
                    <WhatsAppButton
                      number={whatsappNumber}
                      message={buildGeneralInquiryMessage()}
                      label="Chat WhatsApp"
                    />
                  </div>
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
                    Alamat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {settings?.address ? (
                    <p className="text-sm text-muted-foreground">{settings.address}</p>
                  ) : (
                    <p className="text-sm italic text-muted-foreground">
                      Alamat akan diperbarui segera oleh admin.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-primary" />
                    Jam Operasional
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {settings?.operationalHours ? (
                    <p className="text-sm text-muted-foreground">{settings.operationalHours}</p>
                  ) : (
                    <p className="text-sm italic text-muted-foreground">
                      Jam operasional akan diperbarui segera oleh admin.
                    </p>
                  )}
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
                    ) : (
                      <span className="text-sm text-muted-foreground">Belum tersedia</span>
                    )}
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
