import Link from "next/link";
import { Drumstick, Instagram, Facebook, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Settings = {
  businessName: string;
  tagline: string | null;
  description: string | null;
  whatsappNumber: string | null;
  contactEmail: string | null;
  address: string | null;
  operationalHours: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  tiktokUrl: string | null;
  footerText: string | null;
};

const NAV_ITEMS = [
  { label: "Beranda", href: "/" },
  { label: "Produk", href: "/produk" },
  { label: "Journal", href: "/journal" },
  { label: "Tentang Kami", href: "/tentang" },
  { label: "Kontak", href: "/kontak" },
];

export function Footer({ settings, className }: { settings: Settings | null; className?: string }) {
  const s = settings;
  return (
    <footer
      className={cn(
        "mt-auto w-full border-t border-border bg-secondary/40",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                <Drumstick className="h-4 w-4" />
              </span>
              <span className="font-bold text-foreground">
                {s?.businessName || "Dapur Ayam"}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">{s?.tagline}</p>
            {s?.description && (
              <p className="text-sm text-muted-foreground line-clamp-3">{s.description}</p>
            )}
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Navigasi</h3>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Kontak</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MessageCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>
                  {s?.whatsappNumber ? `WhatsApp: ${s.whatsappNumber}` : "Nomor WhatsApp akan diperbarui segera"}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>{s?.contactEmail || "Email akan diperbarui segera"}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>{s?.address || "Alamat akan diperbarui segera"}</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>{s?.operationalHours || "Jam operasional akan diperbarui segera"}</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Media Sosial</h3>
            <div className="flex flex-wrap gap-3">
              {s?.instagramUrl ? (
                <a
                  href={s.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-primary hover:text-primary"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              ) : (
                <span className="grid h-10 w-10 place-items-center rounded-full border border-border bg-muted text-muted-foreground/60" aria-hidden>
                  <Instagram className="h-5 w-5" />
                </span>
              )}
              {s?.facebookUrl ? (
                <a
                  href={s.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-primary hover:text-primary"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              ) : (
                <span className="grid h-10 w-10 place-items-center rounded-full border border-border bg-muted text-muted-foreground/60" aria-hidden>
                  <Facebook className="h-5 w-5" />
                </span>
              )}
              {s?.tiktokUrl ? (
                <a
                  href={s.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-primary hover:text-primary"
                  aria-label="TikTok"
                >
                  <span className="text-xs font-bold">TT</span>
                </a>
              ) : (
                <span className="grid h-10 w-10 place-items-center rounded-full border border-border bg-muted text-muted-foreground/60" aria-hidden>
                  <span className="text-xs font-bold">TT</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          {s?.footerText || "© 2026 Dapur Ayam. Semua hak cipta dilindungi."}
        </div>
      </div>
    </footer>
  );
}
