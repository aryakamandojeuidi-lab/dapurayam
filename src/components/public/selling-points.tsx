import { ChefHat, ThumbsUp, Leaf, Users } from "lucide-react";

const POINTS = [
  {
    icon: ChefHat,
    title: "Praktis",
    desc: "Tinggal panaskan, siap disajikan dalam hitungan menit.",
  },
  {
    icon: ThumbsUp,
    title: "Rasa Autentik",
    desc: "Bumbu rumahan asli, seperti buatan rumah sendiri.",
  },
  {
    icon: Leaf,
    title: "Tanpa MSG",
    desc: "Lebih sehat untuk keluarga, tanpa penambah rasa sintetis.",
  },
  {
    icon: Users,
    title: "Cocok untuk Keluarga & Usaha",
    desc: "Porsinya pas untuk konsumsi rumah maupun kebutuhan usaha kuliner.",
  },
];

export function SellingPoints() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-start gap-3">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-primary-foreground/15 text-primary-foreground ring-1 ring-primary-foreground/20">
                <Icon className="h-7 w-7" />
              </span>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="text-sm text-primary-foreground/85 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
