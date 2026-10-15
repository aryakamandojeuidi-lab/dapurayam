"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Drumstick, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { WhatsAppButton } from "@/components/public/whatsapp-button";

type Props = {
  whatsappNumber: string;
  businessName: string;
};

const NAV_ITEMS = [
  { label: "Beranda", href: "/" },
  { label: "Produk", href: "/produk" },
  { label: "Journal", href: "/journal" },
  { label: "Tentang Kami", href: "/tentang" },
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

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur transition-shadow",
        scrolled ? "shadow-sm" : "shadow-none",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold tracking-tight"
          aria-label={`${businessName} beranda`}
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Drumstick className="h-5 w-5" />
          </span>
          <span className="text-lg text-foreground">
            {businessName || "Dapur Ayam"}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Menu utama">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-secondary text-secondary-foreground"
                  : "text-foreground/80 hover:bg-secondary/60 hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <WhatsAppButton
            number={whatsappNumber}
            label="Pesan Sekarang"
            size="default"
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setOpen(true)}
          aria-label="Buka menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-[300px] sm:w-[360px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                <Drumstick className="h-4 w-4" />
              </span>
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
                    ? "bg-secondary text-secondary-foreground"
                    : "text-foreground/80 hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-6">
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
