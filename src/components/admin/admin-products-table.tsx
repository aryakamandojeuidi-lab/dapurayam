"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Pencil, Trash2, Power, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  deleteProductAction,
  toggleProductActiveAction,
} from "@/actions/product-actions";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  isActive: boolean;
  imageUrl: string | null;
  category: { name: string } | null;
};

type Props = {
  products: Product[];
};

export function AdminProductsTable({ products }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, query]);

  const onDelete = async (id: string, name: string) => {
    const res = await deleteProductAction(id);
    if (res.success) {
      toast({ title: "Produk dihapus", description: name });
      router.refresh();
    } else {
      toast({
        title: "Gagal menghapus",
        description: res.error,
        variant: "destructive",
      });
    }
  };

  const onToggle = async (id: string, name: string) => {
    const res = await toggleProductActiveAction(id);
    if (res.success) {
      toast({ title: "Status produk diperbarui", description: name });
      router.refresh();
    } else {
      toast({
        title: "Gagal mengubah status",
        description: res.error,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari produk..."
            className="pl-9"
          />
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/produk/baru">
            <Plus className="h-4 w-4" />
            Tambah Produk
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Foto</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                  Belum ada produk. Klik "Tambah Produk" untuk membuat.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="h-12 w-12 overflow-hidden rounded-md bg-secondary">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    <Link
                      href={`/admin/produk/${p.id}/edit`}
                      className="hover:text-primary hover:underline"
                    >
                      {p.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {p.category?.name || "—"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {p.price ? (
                      <span className="text-foreground">
                        Rp {p.price.toLocaleString("id-ID")}
                      </span>
                    ) : (
                      <span className="italic text-muted-foreground">Menyusul</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={p.isActive}
                        onCheckedChange={() => onToggle(p.id, p.name)}
                        aria-label="Toggle aktif"
                      />
                      <Badge
                        variant={p.isActive ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {p.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="icon" aria-label="Edit">
                        <Link href={`/admin/produk/${p.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <ConfirmDialog
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Hapus"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        }
                        title="Hapus Produk?"
                        description={`Yakin ingin menghapus "${p.name}"? Tindakan ini tidak dapat dibatalkan.`}
                        confirmText="Hapus"
                        onConfirm={() => onDelete(p.id, p.name)}
                      />
                    </div>
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
