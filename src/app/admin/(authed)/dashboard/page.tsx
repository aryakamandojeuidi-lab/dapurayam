import Link from "next/link";
import {

  Package,
  Newspaper,
  CheckCircle2,
  FileEdit,
  Eye,
  EyeOff,
  ShoppingCart,
  Clock,
} from "lucide-react";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  formatCurrency,
} from "@/lib/order-display";


// Always dynamic — DB-required page, skip static prerender to avoid build crash when DATABASE_URL not available at build time
export const dynamic = "force-dynamic";
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

function formatDate(d: Date): string {
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export default async function DashboardPage() {
  const [
    totalProducts,
    activeProducts,
    inactiveProducts,
    totalArticles,
    publishedArticles,
    draftArticles,
    recentProducts,
    recentArticles,
    totalOrders,
    pendingOrders,
    recentOrders,
  ] = await Promise.all([
    db.product.count(),
    db.product.count({ where: { isActive: true } }),
    db.product.count({ where: { isActive: false } }),
    db.article.count(),
    db.article.count({ where: { status: "PUBLISHED" } }),
    db.article.count({ where: { status: "DRAFT" } }),
    db.product.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    db.article.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    db.order.count(),
    db.order.count({ where: { status: "PENDING" } }),
    db.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
  ]);

  const stats = [
    {
      label: "Total Pesanan",
      value: totalOrders,
      icon: ShoppingCart,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Pesanan Menunggu",
      value: pendingOrders,
      icon: Clock,
      color: "bg-amber-500/10 text-amber-700",
    },
    {
      label: "Total Produk",
      value: totalProducts,
      icon: Package,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Produk Aktif",
      value: activeProducts,
      icon: CheckCircle2,
      color: "bg-green-500/10 text-green-700",
    },
    {
      label: "Produk Nonaktif",
      value: inactiveProducts,
      icon: EyeOff,
      color: "bg-amber-500/10 text-amber-700",
    },
    {
      label: "Total Artikel",
      value: totalArticles,
      icon: Newspaper,
      color: "bg-blue-500/10 text-blue-700",
    },
    {
      label: "Artikel Published",
      value: publishedArticles,
      icon: Eye,
      color: "bg-green-500/10 text-green-700",
    },
    {
      label: "Artikel Draft",
      value: draftArticles,
      icon: FileEdit,
      color: "bg-secondary text-foreground",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ringkasan aktivitas pesanan, produk, dan konten Dapur Ayam.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div
                  className={`grid h-9 w-9 place-items-center rounded-lg ${stat.color}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{stat.label}</p>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground tabular-nums">
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-primary" />
              Pesanan Terbaru
            </CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/pesanan">Lihat Semua</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-6">
                <ShoppingCart className="mx-auto mb-2 h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Belum ada pesanan.</p>
                <p className="mt-1 text-xs text-muted-foreground/80">
                  Pesanan yang masuk melalui website akan muncul di sini secara
                  otomatis.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {recentOrders.map((o) => (
                  <li
                    key={o.id}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/admin/pesanan/${o.id}`}
                        className="text-sm font-medium text-foreground hover:text-primary"
                      >
                        <span className="font-mono text-xs text-muted-foreground mr-2">
                          {o.orderNumber}
                        </span>
                        {o.customerName}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                        {o.totalItems} item · {formatCurrency(o.totalAmount)} ·{" "}
                        {formatDate(o.createdAt)}
                      </p>
                    </div>
                    <Badge
                      className={`text-xs border ${
                        ORDER_STATUS_COLORS[o.status] || ""
                      }`}
                      variant="outline"
                    >
                      {ORDER_STATUS_LABELS[o.status] || o.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Produk Terbaru</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/produk">Lihat Semua</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada produk.</p>
            ) : (
              <ul className="divide-y divide-border">
                {recentProducts.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/admin/produk/${p.id}/edit`}
                        className="truncate text-sm font-medium text-foreground hover:text-primary"
                      >
                        {p.name}
                      </Link>
                      <p className="truncate text-xs text-muted-foreground">
                        {p.category?.name || "Tanpa Kategori"} • {formatDate(p.createdAt)}
                      </p>
                    </div>
                    <Badge
                      variant={p.isActive ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {p.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Artikel Terbaru</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/journal">Lihat Semua</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentArticles.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada artikel.</p>
            ) : (
              <ul className="divide-y divide-border">
                {recentArticles.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/admin/journal/${a.id}/edit`}
                        className="truncate text-sm font-medium text-foreground hover:text-primary"
                      >
                        {a.title}
                      </Link>
                      <p className="truncate text-xs text-muted-foreground">
                        {a.category?.name || "Tanpa Kategori"} • {formatDate(a.createdAt)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        a.status === "PUBLISHED"
                          ? "default"
                          : a.status === "ARCHIVED"
                            ? "secondary"
                            : "outline"
                      }
                      className="text-xs"
                    >
                      {a.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
