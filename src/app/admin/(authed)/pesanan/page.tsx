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
} from "@/lib/order-display";
import { AdminOrdersTable } from "@/components/admin/admin-orders-table";

export default async function AdminPesananPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; channel?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = params.status || "ALL";
  const channelFilter = params.channel || "ALL";

  const where: { status?: string; channel?: string } = {};
  if (statusFilter !== "ALL") where.status = statusFilter;
  if (channelFilter !== "ALL") where.channel = channelFilter;

  const [orders, totalOrders, pendingCount, confirmedCount, completedCount] =
    await Promise.all([
      db.order.findMany({
        where,
        include: { items: true },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
      db.order.count(),
      db.order.count({ where: { status: "PENDING" } }),
      db.order.count({ where: { status: "CONFIRMED" } }),
      db.order.count({ where: { status: "COMPLETED" } }),
    ]);

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Pesanan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Kelola Pesanan
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Daftar pesanan yang masuk melalui website. Admin dapat memperbarui
          status, menambahkan catatan internal, dan menghapus pesanan.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Total Pesanan
          </p>
          <p className="mt-1 text-2xl font-bold text-foreground tabular-nums">
            {totalOrders}
          </p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs uppercase tracking-wide text-amber-700">
            Menunggu
          </p>
          <p className="mt-1 text-2xl font-bold text-amber-700 tabular-nums">
            {pendingCount}
          </p>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-xs uppercase tracking-wide text-blue-700">
            Dikonfirmasi
          </p>
          <p className="mt-1 text-2xl font-bold text-blue-700 tabular-nums">
            {confirmedCount}
          </p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs uppercase tracking-wide text-emerald-700">
            Selesai
          </p>
          <p className="mt-1 text-2xl font-bold text-emerald-700 tabular-nums">
            {completedCount}
          </p>
        </div>
      </div>

      <AdminOrdersTable
        orders={orders.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          customerName: o.customerName,
          customerPhone: o.customerPhone,
          channel: o.channel,
          status: o.status,
          totalItems: o.totalItems,
          totalAmount: o.totalAmount,
          createdAt: o.createdAt,
          itemsCount: o.items.length,
        }))}
        statusFilter={statusFilter}
        channelFilter={channelFilter}
        statusLabels={ORDER_STATUS_LABELS}
        statusColors={ORDER_STATUS_COLORS}
        channelLabels={ORDER_CHANNEL_LABELS}
        channelColors={ORDER_CHANNEL_COLORS}
      />
    </div>
  );
}
