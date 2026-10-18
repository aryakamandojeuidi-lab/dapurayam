"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/order-display";

export function CartContent() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);
  const totalItems = useCartStore((s) => s.getTotalItems());
  const totalAmount = useCartStore((s) => s.getTotalAmount());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const hasItems = items.length > 0;

  return (
    <section className="bg-background py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Keranjang Belanja
        </h1>
        <p className="mt-2 text-muted-foreground">
          {hasItems
            ? `${totalItems} item dalam keranjang Anda.`
            : "Belum ada produk dalam keranjang."}
        </p>

        {!hasItems ? (
          <div className="mt-12 rounded-xl border border-dashed border-border bg-secondary/30 p-12 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Keranjang Kosong
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Jelajahi katalog produk kami dan tambahkan ke keranjang.
            </p>
            <Button asChild className="mt-6 gap-2">
              <Link href="/produk">
                Lihat Produk
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Items list */}
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => (
                <Card key={item.productId}>
                  <CardContent className="flex gap-4 p-4">
                    <Link
                      href={`/produk/${item.productSlug}`}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border bg-secondary"
                    >
                      {item.productImageUrl ? (
                        <img
                          src={item.productImageUrl}
                          alt={item.productName}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-muted-foreground">
                          <ShoppingBag className="h-6 w-6" />
                        </div>
                      )}
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <Link href={`/produk/${item.productSlug}`}>
                        <h3 className="text-sm font-semibold text-foreground hover:text-primary">
                          {item.productName}
                        </h3>
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.productPrice > 0
                          ? `${formatCurrency(item.productPrice)} / item`
                          : "Harga menyusul"}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            aria-label="Kurangi jumlah"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </Button>
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(
                                item.productId,
                                Math.max(1, Number(e.target.value) || 1),
                              )
                            }
                            className="h-8 w-14 rounded-md border border-input bg-background px-1 text-center text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                            aria-label={`Jumlah ${item.productName}`}
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            aria-label="Tambah jumlah"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-foreground tabular-nums">
                            {item.productPrice > 0
                              ? formatCurrency(item.productPrice * item.quantity)
                              : "—"}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.productId)}
                            aria-label={`Hapus ${item.productName}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clear}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Kosongkan Keranjang
                </Button>
              </div>
            </div>

            {/* Summary */}
            <div>
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle className="text-base">Ringkasan Pesanan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Item</span>
                    <span className="font-medium text-foreground tabular-nums">
                      {totalItems}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-foreground tabular-nums">
                      {totalAmount > 0 ? formatCurrency(totalAmount) : "—"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Harga final akan dikonfirmasi admin via WhatsApp karena
                    produk dibuat fresh by order.
                  </p>
                  <Separator />
                  <Button asChild size="lg" className="w-full gap-2">
                    <Link href="/checkout">
                      Lanjut ke Checkout
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/produk">Lanjut Belanja</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
