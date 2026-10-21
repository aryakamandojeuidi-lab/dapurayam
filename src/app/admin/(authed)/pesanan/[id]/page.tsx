import { notFound } from "next/navigation";
import Link from "next/link";
import {

  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { db } from "@/lib/db";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  ORDER_CHANNEL_LABELS,
  ORDER_CHANNEL_COLORS,
  formatCurrency,
  formatDate,
} from "@/lib/order-display";
import { OrderStatusUpdater } from "@/components/admin/order-status-updater";
import { ArrowLeft, Mail, MapPin, Phone, StickyNote, User } from "lucide-react";


// Always dynamic — DB-required page, skip static prerender to avoid build crash when DATABASE_URL not available at build time
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ id: string }> };

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/pesanan">Pesanan</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{order.orderNumber}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link
            href="/admin/pesanan"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke daftar pesanan
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {order.orderNumber}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Dibuat pada {formatDate(order.createdAt)} · Diperbarui{" "}
            {formatDate(order.updatedAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
              ORDER_STATUS_COLORS[order.status] || ""
            }`}
          >
            {ORDER_STATUS_LABELS[order.status] || order.status}
          </span>
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
              ORDER_CHANNEL_COLORS[order.channel] || ""
            }`}
          >
            Kanal: {ORDER_CHANNEL_LABELS[order.channel] || order.channel}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Order items */}
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-lg border border-border bg-card p-5">
            <h2 className="text-base font-semibold text-foreground">
              Item Pesanan
            </h2>
            <div className="mt-4 space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 rounded-md border border-border bg-secondary/30 p-3"
                >
                  <div className="flex-1 min-w-0">
                    {item.productSlug ? (
                      <Link
                        href={`/produk/${item.productSlug}`}
                        className="font-medium text-foreground hover:text-primary"
                        target="_blank"
                      >
                        {item.productName}
                      </Link>
                    ) : (
                      <p className="font-medium text-foreground">
                        {item.productName}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                      {item.quantity} × {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-medium text-foreground tabular-nums">
                      {formatCurrency(item.subtotal)}
                    </p>
                  </div>
                </div>
              ))}
              {order.items.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  Tidak ada item dalam pesanan ini.
                </p>
              )}
            </div>
            <div className="mt-5 border-t border-border pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Item</span>
                <span className="font-medium text-foreground tabular-nums">
                  {order.totalItems}
                </span>
              </div>
              <div className="mt-2 flex justify-between">
                <span className="text-base font-medium text-foreground">
                  Total Pembelian
                </span>
                <span className="text-lg font-bold text-primary tabular-nums">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </section>

          {/* Customer note */}
          {order.customerNote && (
            <section className="rounded-lg border border-border bg-card p-5">
              <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                <StickyNote className="h-4 w-4 text-primary" />
                Catatan dari Pelanggan
              </h2>
              <p className="mt-3 whitespace-pre-wrap rounded-md bg-secondary/40 p-3 text-sm text-foreground">
                {order.customerNote}
              </p>
            </section>
          )}
        </div>

        {/* Customer info + status updater */}
        <div className="space-y-6">
          <section className="rounded-lg border border-border bg-card p-5">
            <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
              <User className="h-4 w-4 text-primary" />
              Data Pelanggan
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <User className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Nama</p>
                  <p className="font-medium text-foreground">
                    {order.customerName}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Telepon</p>
                  <a
                    href={`tel:${order.customerPhone}`}
                    className="font-medium text-primary hover:underline tabular-nums"
                  >
                    {order.customerPhone}
                  </a>
                </div>
              </li>
              {order.customerEmail && (
                <li className="flex items-start gap-2">
                  <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <a
                      href={`mailto:${order.customerEmail}`}
                      className="font-medium text-primary hover:underline break-all"
                    >
                      {order.customerEmail}
                    </a>
                  </div>
                </li>
              )}
              {order.customerAddress && (
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Alamat</p>
                    <p className="font-medium text-foreground whitespace-pre-wrap">
                      {order.customerAddress}
                    </p>
                  </div>
                </li>
              )}
            </ul>
          </section>

          <OrderStatusUpdater
            orderId={order.id}
            currentStatus={order.status}
            currentAdminNote={order.adminNote || ""}
            statusLabels={ORDER_STATUS_LABELS}
            customerName={order.customerName}
            customerPhone={order.customerPhone}
            orderNumber={order.orderNumber}
          />
        </div>
      </div>
    </div>
  );
}
