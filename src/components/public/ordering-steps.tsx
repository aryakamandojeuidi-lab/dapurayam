import { ClipboardList, MousePointerClick, ClipboardCheck, PackageCheck } from "lucide-react";

const STEPS = [
  {
    icon: ClipboardList,
    title: "Pilih Produk",
    description: "Jelajahi katalog produk kami dan temukan olahan ayam yang Anda inginkan.",
  },
  {
    icon: MousePointerClick,
    title: "Klik Pesan via WhatsApp",
    description: "Tekan tombol pesan pada produk untuk membuka chat WhatsApp dengan pesan otomatis.",
  },
  {
    icon: ClipboardCheck,
    title: "Konfirmasi Pesanan",
    description: "Sampaikan jumlah dan kebutuhan Anda kepada admin kami melalui chat WhatsApp.",
  },
  {
    icon: PackageCheck,
    title: "Terima Pesanan",
    description: "Pesanan akan diproses dan dikirim sesuai konfirmasi yang disepakati bersama.",
  },
];

export function OrderingSteps() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Cara Memesan
          </h2>
          <p className="mt-4 text-muted-foreground">
            Memesan produk Dapur Ayam sangat mudah. Cukup empat langkah sederhana berikut.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="relative rounded-xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="absolute right-4 top-4 text-5xl font-bold text-primary/15">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
