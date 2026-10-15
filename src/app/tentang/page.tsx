import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Clock, Heart, ShieldCheck, Drumstick, ArrowRight } from "lucide-react";
import { PublicShell } from "@/components/public/public-shell";
import { CtaSection } from "@/components/public/cta-section";
import { WhatsAppButton } from "@/components/public/whatsapp-button";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Mengenal Dapur Ayam — kisah, nilai, dan komitmen kami menghadirkan produk olahan ayam praktis untuk keluarga.",
  alternates: { canonical: "/tentang" },
};

const VALUES = [
  {
    icon: Sparkles,
    title: "Kualitas",
    description:
      "Kami menyusun produk dengan perhatian pada kualitas bahan dan konsistensi pengolahan.",
  },
  {
    icon: ShieldCheck,
    title: "Perhatian pada Kebersihan",
    description:
      "Proses pengolahan dilakukan dengan memperhatikan kebersihan dan ketertiban dapur.",
  },
  {
    icon: Clock,
    title: "Pelayanan",
    description:
      "Kami siap membantu kebutuhan Anda via WhatsApp — dari pertanyaan hingga proses pemesanan.",
  },
  {
    icon: Heart,
    title: "Untuk Keluarga",
    description:
      "Setiap produk dirancang untuk dinikmati bersama orang terkasih di berbagai momen makan.",
  },
];

export default async function TentangPage() {
  const settings = await db.siteSettings.findUnique({ where: { id: "default" } });
  const whatsappNumber = settings?.whatsappNumber || "";

  return (
    <PublicShell>
      <section className="bg-gradient-to-b from-secondary/60 to-background py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background px-4 py-1.5 text-sm font-medium text-foreground">
            <Drumstick className="h-4 w-4 text-primary" />
            Tentang Dapur Ayam
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {settings?.businessName || "Dapur Ayam"}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {settings?.tagline}
          </p>
        </div>
      </section>

      <section className="bg-background py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Profil Bisnis
          </h2>
          <div className="mt-4 space-y-4 text-muted-foreground leading-relaxed">
            <p>
              {settings?.description ||
                "Dapur Ayam menghadirkan produk olahan ayam berkualitas yang praktis untuk dinikmati kapan saja."}
            </p>
            <p>
              Kami percaya makanan yang baik berasal dari bahan yang dipilih dengan perhatian dan diolah dengan konsistensi. Produk kami disusun untuk membantu keluarga menikmati olahan ayam tanpa harus repot menyiapkan bumbu dari awal.
            </p>
            <p>
              Dari nugget yang lembut hingga ayam berbumbu khas, setiap produk kami dibuat agar praktis untuk diolah di rumah. Tinggal masak sebentar, hidangan pun siap dinikmati bersama orang-orang terkasih.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-secondary/40 py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Cerita Brand
          </h2>
          <div className="mt-4 space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Dapur Ayam lahir dari keinginan untuk menyediakan olahan ayam praktis yang dapat dinikmati keluarga di rumah. Kami memahami bahwa waktu adalah hal yang berharga, dan menyiapkan makanan yang baik kadang memerlukan waktu yang tidak sedikit.
            </p>
            <p className="rounded-lg border border-dashed border-border bg-background p-4 italic">
              Informasi lebih lengkap mengenai cerita brand dan perjalanan Dapur Ayam akan diperbarui oleh pemilik bisnis dalam waktu dekat.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-background py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Nilai Usaha Kami
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="rounded-xl border border-border bg-card p-6 text-center shadow-sm"
                >
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-secondary/40 py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Produksi
          </h2>
          <div className="mt-4 space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Produk Dapur Ayam disusun dengan memperhatikan kebersihan, kualitas bahan, dan konsistensi pengolahan. Kami percaya tiga hal tersebut menjadi dasar penting dalam menghadirkan produk yang dapat dinikmati keluarga.
            </p>
            <p className="rounded-lg border border-dashed border-border bg-background p-4 italic">
              Informasi lebih lengkap mengenai proses produksi, standar pengolahan, dan kandungan setiap produk akan diperbarui oleh pemilik bisnis.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="gap-2">
              <Link href="/produk">
                Lihat Produk Kami
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <WhatsAppButton
              number={whatsappNumber}
              label="Hubungi via WhatsApp"
              size="lg"
              variant="outline"
            />
          </div>
        </div>
      </section>

      <CtaSection whatsappNumber={whatsappNumber} />
    </PublicShell>
  );
}
