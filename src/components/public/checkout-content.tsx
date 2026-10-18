"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Loader2,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { createOrderAction } from "@/actions/order-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/order-display";

export function CheckoutContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const items = useCartStore((s) => s.items);
  const totalItems = useCartStore((s) => s.getTotalItems());
  const totalAmount = useCartStore((s) => s.getTotalAmount());
  const clear = useCartStore((s) => s.clear);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (items.length === 0) {
    return (
      <section className="bg-background py-20">
        <div className="mx-auto max-w-3xl px-4 md:px-6 text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h1 className="mt-4 text-2xl font-bold text-foreground">
            Keranjang Kosong
          </h1>
          <p className="mt-2 text-muted-foreground">
            Tambahkan produk ke keranjang sebelum checkout.
          </p>
          <Button asChild className="mt-6 gap-2">
            <Link href="/produk">
              Lihat Produk
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast({
        title: "Lengkapi data",
        description: "Nama dan nomor telepon wajib diisi.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    const res = await createOrderAction({
      customerName: form.name,
      customerPhone: form.phone,
      customerEmail: form.email || null,
      customerAddress: form.address || null,
      customerNote: form.note || null,
      channel: "WEBSITE",
      items: items.map((i) => ({
        productId: i.productId,
        productName: i.productName,
        productSlug: i.productSlug,
        productImageUrl: i.productImageUrl,
        unitPrice: i.productPrice,
        quantity: i.quantity,
      })),
    });
    setLoading(false);
    if (res.success && res.orderNumber) {
      clear();
      toast({
        title: "Pesanan dikirim!",
        description: `Nomor pesanan: ${res.orderNumber}`,
      });
      router.push(`/pesanan/${res.orderNumber}/sukses`);
    } else {
      toast({
        title: "Gagal mengirim pesanan",
        description: res.error || "Coba lagi nanti.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="bg-background py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Link
          href="/keranjang"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Kembali ke Keranjang
        </Link>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Checkout
        </h1>
        <p className="mt-2 text-muted-foreground">
          Lengkapi data pemesanan. Admin akan menghubungi Anda via WhatsApp
          untuk konfirmasi ketersediaan, harga final, dan pengiriman.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3"
        >
          {/* Form fields */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Data Pemesan</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-medium">
                    Nama Lengkap *
                  </Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="Nama Anda"
                    autoComplete="name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-medium">
                    Nomor WhatsApp *
                  </Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                    placeholder="08xxx atau 62xxx"
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="email" className="text-xs font-medium">
                    Email (opsional)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="email@contoh.com"
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="address" className="text-xs font-medium">
                    Alamat Pengiriman (opsional)
                  </Label>
                  <Textarea
                    id="address"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    rows={2}
                    placeholder="Alamat lengkap untuk pengiriman"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="note" className="text-xs font-medium">
                    Catatan (opsional)
                  </Label>
                  <Textarea
                    id="note"
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    rows={2}
                    placeholder="Mis: jadwal pengiriman, kebutuhan khusus, dll."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order summary */}
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="text-base">Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <li key={item.productId} className="flex gap-3">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-border bg-secondary">
                        {item.productImageUrl ? (
                          <img
                            src={item.productImageUrl}
                            alt={item.productName}
                            className="h-full w-full object-contain"
                          />
                        ) : null}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-1">
                          {item.productName}
                        </p>
                        <p className="text-xs text-muted-foreground tabular-nums">
                          {item.quantity} ×{" "}
                          {item.productPrice > 0
                            ? formatCurrency(item.productPrice)
                            : "harga menyusul"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground tabular-nums">
                          {item.productPrice > 0
                            ? formatCurrency(item.productPrice * item.quantity)
                            : "—"}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Item</span>
                  <span className="font-medium text-foreground tabular-nums">
                    {totalItems}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-lg font-bold text-primary tabular-nums">
                    {totalAmount > 0 ? formatCurrency(totalAmount) : "—"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Harga final akan dikonfirmasi admin via WhatsApp karena produk
                  dibuat fresh by order.
                </p>
                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="w-full gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Kirim Pesanan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </section>
  );
}
