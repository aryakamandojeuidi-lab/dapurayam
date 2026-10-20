"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { WhatsAppButton } from "@/components/public/whatsapp-button";
import { CartBadge } from "@/components/public/cart-badge";

type Props = {
  whatsappNumber: string;
  businessName: string;
};

const NAV_ITEMS = [
  { label: "Beranda", href: "/" },
  { label: "Produk", href: "/produk" },
  { label: "Tentang Kami", href: "/tentang" },
  { label: "Cara Pemesanan", href: "/#cara-pemesanan" },
  { label: "FAQ", href: "/#faq" },
  { label: "Kontak", href: "/kontak" },
];

export function Navbar({ whatsappNumber, businessName }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false; // anchor links
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur transition-shadow",
        scrolled ? "shadow-sm" : "shadow-none",
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label={`${businessName} beranda`}
        >
          <img
            src="/logofav.jpg"
            alt={`${businessName || "Dapur Ayam"} logo`}
            width={56}
            height={56}
            className="h-14 w-14 rounded-xl object-cover ring-1 ring-primary/20"
          />
          <span className="text-xl font-bold tracking-tight text-foreground">
            {businessName || "Dapur Ayam"}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Menu utama">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "text-primary"
                  : "text-foreground/80 hover:text-primary",
              )}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex"
            aria-label="Cari"
          >
            <Search className="h-5 w-5" />
          </Button>
          <CartBadge className="hidden sm:inline-flex" />
          <div className="hidden md:block">
            <WhatsAppButton
              number={whatsappNumber}
              label="Pesan Sekarang"
              size="default"
              className="gap-1.5"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Buka menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-[300px] sm:w-[360px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-3">
              <img
                src="/logofav.jpg"
                alt={`${businessName || "Dapur Ayam"} logo`}
                width={44}
                height={44}
                className="h-11 w-11 rounded-xl object-cover"
              />
              {businessName || "Dapur Ayam"}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-3 text-base font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:bg-secondary hover:text-primary",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <CartBadge className="w-full justify-center" />
            <WhatsAppButton
              number={whatsappNumber}
              label="Pesan Sekarang"
              className="w-full"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 self-end"
            onClick={() => setOpen(false)}
          >
            <X className="mr-1 h-4 w-4" /> Tutup
          </Button>
        </SheetContent>
      </Sheet>
    </header>
  );
}
