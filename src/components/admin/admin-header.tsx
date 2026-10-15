"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Newspaper,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

type Props = {
  userName?: string | null;
};

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Produk", href: "/admin/produk", icon: Package },
  { label: "Kategori", href: "/admin/kategori", icon: FolderTree },
  { label: "Journal", href: "/admin/journal", icon: Newspaper },
  { label: "Pengaturan", href: "/admin/pengaturan", icon: Settings },
];

export function AdminHeader({ userName }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) =>
    href === "/admin/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/95 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="border-b px-6 py-4">
              <SheetTitle className="text-left">Menu Admin</SheetTitle>
            </SheetHeader>
            <nav className="p-4">
              <ul className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                          isActive(item.href)
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground/80 hover:bg-secondary",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full gap-2"
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-semibold text-foreground">Panel Admin</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-foreground">{userName || "Admin"}</p>
          <p className="text-xs text-muted-foreground">Administrator</p>
        </div>
        <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
          {(userName || "A").charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
