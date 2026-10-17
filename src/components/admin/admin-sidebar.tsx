"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Newspaper,
  Settings,
  Drumstick,
  LogOut,
  ShoppingCart,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Pesanan", href: "/admin/pesanan", icon: ShoppingCart },
  { label: "Produk", href: "/admin/produk", icon: Package },
  { label: "Kategori", href: "/admin/kategori", icon: FolderTree },
  { label: "Journal", href: "/admin/journal", icon: Newspaper },
  { label: "Pengaturan", href: "/admin/pengaturan", icon: Settings },
];

type Props = {
  userName?: string | null;
  userEmail?: string | null;
};

export function AdminSidebar({ userName, userEmail }: Props) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/admin/dashboard"
      ? pathname === href
      : pathname.startsWith(href);

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-sidebar-border bg-sidebar md:flex md:flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
          <Drumstick className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-bold leading-tight text-sidebar-foreground">
            Dapur Ayam
          </p>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
            {(userName || "A").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {userName || "Admin"}
            </p>
            <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </Button>
      </div>
    </aside>
  );
}
