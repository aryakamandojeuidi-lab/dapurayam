import { Sparkles, ShieldCheck, Clock, Heart } from "lucide-react";

const ADVANTAGES = [
  {
    icon: Sparkles,
    title: "Bahan Pilihan",
    description: "Disusun dengan bahan pilihan dan perhatian pada kualitas setiap produknya.",
  },
  {
    icon: Clock,
    title: "Praktis & Cepat",
    description: "Hemat waktu di dapur. Tinggal masak sebentar untuk hasil yang siap dinikmati.",
  },
  {
    icon: Heart,
    title: "Untuk Keluarga",
    description: "Cocok untuk berbagai momen makan bersama keluarga, dari sarapan hingga makan malam.",
  },
  {
    icon: ShieldCheck,
    title: "Diperhatikan Kualitasnya",
    description: "Dibuat dengan perhatian pada kebersihan dan kualitas pengolahan.",
  },
];

export function AdvantagesSection() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Mengapa Memilih Dapur Ayam
          </h2>
          <p className="mt-4 text-muted-foreground">
            Kami berkomitmen menghadirkan produk olahan ayam yang praktis untuk dinikmati kapan saja, bersama orang-orang terkasih.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ADVANTAGES.map((adv) => {
            const Icon = adv.icon;
            return (
              <div
                key={adv.title}
                className="rounded-xl border border-border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {adv.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {adv.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
