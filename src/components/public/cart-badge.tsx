"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/**
 * Cart button with item count badge.
 * Hydration-safe: renders empty on server, populated on client.
 */
export function CartBadge({ className }: Props) {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((s) => s.getTotalItems());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <Link
      href="/keranjang"
      className={cn(
        "relative inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary",
        className,
      )}
      aria-label={`Keranjang belanja${mounted && totalItems > 0 ? ` (${totalItems} item)` : ""}`}
    >
      <ShoppingBag className="h-4 w-4" />
      <span className="hidden sm:inline">Keranjang</span>
      {mounted && totalItems > 0 && (
        <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-[20px] place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}
