import { Truck, CalendarDays, ShieldCheck, Leaf } from "lucide-react";

const BADGES = [
  {
    icon: Truck,
    title: "Gratis Ongkir",
    desc: "Area Alam Sutera, Serpong, Gading Serpong, BSD.",
  },
  {
    icon: CalendarDays,
    title: "Pengiriman Setiap Hari",
    desc: "Produk selalu fresh by order, dikirim harian.",
  },
  {
    icon: ShieldCheck,
    title: "Kemasan Aman",
    desc: "Frozen, higienis, dan terjaga sampai tujuan.",
  },
  {
    icon: Leaf,
    title: "Bahan Berkualitas",
    desc: "Ayam pejantan pilihan dengan bumbu rempah asli.",
  },
];

export function TrustBadges() {
  return (
    <section className="border-y border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BADGES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex items-start gap-3 rounded-2xl bg-card p-4 ring-1 ring-border transition-shadow hover:shadow-sm"
            >
              <span className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15">
                <Icon className="h-7 w-7" />
              </span>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
