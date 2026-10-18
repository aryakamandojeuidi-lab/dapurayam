"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, Search, Filter, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/order-display";

type OrderRow = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  channel: string;
  status: string;
  totalItems: number;
  totalAmount: number;
  createdAt: Date | string;
  itemsCount: number;
};

type Props = {
  orders: OrderRow[];
  statusFilter: string;
  channelFilter: string;
  statusLabels: Record<string, string>;
  statusColors: Record<string, string>;
  channelLabels: Record<string, string>;
  channelColors: Record<string, string>;
};

export function AdminOrdersTable({
  orders,
  statusFilter,
  channelFilter,
  statusLabels,
  statusColors,
  channelLabels,
  channelColors,
}: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(statusFilter);
  const [channel, setChannel] = useState(channelFilter);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (status !== "ALL") params.set("status", status);
    if (channel !== "ALL") params.set("channel", channel);
    router.push(`/admin/pesanan?${params.toString()}`);
  };

  const filtered = orders.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Cari pesanan
          </label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari nomor pesanan, nama, atau telepon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Status
          </label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Semua status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Status</SelectItem>
              {Object.entries(statusLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Kanal
          </label>
          <Select value={channel} onValueChange={setChannel}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Semua kanal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Kanal</SelectItem>
              {Object.entries(channelLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="button" onClick={applyFilters} className="gap-2">
          <Filter className="h-4 w-4" />
          Terapkan
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[160px]">Nomor Pesanan</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead className="hidden md:table-cell">Kanal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right hidden sm:table-cell">
                Items
              </TableHead>
              <TableHead className="text-right hidden md:table-cell">
                Total
              </TableHead>
              <TableHead className="hidden lg:table-cell">Tanggal</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-muted-foreground py-12"
                >
                  <Package className="mx-auto mb-2 h-10 w-10 text-muted-foreground/50" />
                  <p className="font-medium">Belum ada pesanan</p>
                  <p className="text-sm mt-1">
                    Pesanan dari halaman publik akan muncul di sini secara
                    otomatis.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs font-medium text-foreground">
                    {o.orderNumber}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-foreground">
                      {o.customerName}
                    </div>
                    <div className="text-xs text-muted-foreground tabular-nums">
                      {o.customerPhone}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge
                      className={`border ${channelColors[o.channel] || ""}`}
                      variant="outline"
                    >
                      {channelLabels[o.channel] || o.channel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`border ${statusColors[o.status] || ""}`}
                      variant="outline"
                    >
                      {statusLabels[o.status] || o.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right hidden sm:table-cell tabular-nums">
                    {o.totalItems} ({o.itemsCount} produk)
                  </TableCell>
                  <TableCell className="text-right hidden md:table-cell font-medium tabular-nums">
                    {formatCurrency(o.totalAmount)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                    {formatDate(o.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/pesanan/${o.id}`}>
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        Detail
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
