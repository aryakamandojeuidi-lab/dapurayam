import Link from "next/link";
import { Mail, MapPin, Clock, ShoppingBag } from "lucide-react";
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
  shopeeStoreUrl?: string | null;
  tokopediaStoreUrl?: string | null;
};

const NAV_ITEMS = [
  { label: "Beranda", href: "/" },
  { label: "Produk", href: "/produk" },
  { label: "Journal", href: "/journal" },
  { label: "Tentang Kami", href: "/tentang" },
  { label: "Cara Pemesanan", href: "/#cara-pemesanan" },
  { label: "FAQ", href: "/#faq" },
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
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/logofav.jpg"
                alt={`${s?.businessName || "Dapur Ayam"} logo`}
                width={32}
                height={32}
                className="h-8 w-8 rounded-lg object-cover"
              />
              <span className="font-bold text-foreground">
                {s?.businessName || "Dapur Ayam"}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {s?.tagline}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Navigasi
            </h3>
            <ul className="space-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-foreground/80 transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Kontak
            </h3>
            <ul className="space-y-2.5 text-sm text-foreground/80">
              <li>
                {s?.whatsappNumber
                  ? `WhatsApp: ${s.whatsappNumber}`
                  : "Nomor WhatsApp akan diperbarui"}
              </li>
              <li>{s?.contactEmail || "Email akan diperbarui"}</li>
              <li className="flex items-start gap-1.5">
                <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                <span>{s?.address || "Alamat akan diperbarui"}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Clock className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                <span>{s?.operationalHours || "Jam operasional akan diperbarui"}</span>
              </li>
            </ul>
          </div>

          {/* Marketplace */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Belanja
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                {s?.shopeeStoreUrl ? (
                  <a
                    href={s.shopeeStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-foreground/80 transition-colors hover:text-primary"
                  >
                    <ShoppingBag className="h-3.5 w-3.5 text-muted-foreground" />
                    Belanja di Shopee
                  </a>
                ) : (
                  <span className="text-foreground/60">Toko Shopee segera hadir</span>
                )}
              </li>
              {s?.tokopediaStoreUrl && (
                <li>
                  <a
                    href={s.tokopediaStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-foreground/80 transition-colors hover:text-primary"
                  >
                    <ShoppingBag className="h-3.5 w-3.5 text-muted-foreground" />
                    Belanja di Tokopedia
                  </a>
                </li>
              )}
              <li>
                <a
                  href={`mailto:${s?.contactEmail || "#"}`}
                  className="inline-flex items-center gap-1.5 text-foreground/80 transition-colors hover:text-primary"
                >
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  Hubungi via Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          {s?.footerText || "© 2026 Dapur Ayam. Fresh by Order · Tanpa MSG · Tanpa Pengawet."}
        </div>
      </div>
    </footer>
  );
}
