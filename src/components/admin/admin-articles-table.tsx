"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, Eye, EyeOff, Archive } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  deleteArticleAction,
  toggleArticleStatusAction,
} from "@/actions/article-actions";

type Article = {
  id: string;
  title: string;
  slug: string;
  status: string;
  authorName: string;
  publishedAt: Date | null;
  coverImageUrl: string | null;
  category: { name: string } | null;
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

function formatDate(d: Date | null): string {
  if (!d) return "—";
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function statusBadge(status: string) {
  switch (status) {
    case "PUBLISHED":
      return <Badge className="bg-green-600 text-white hover:bg-green-600">Published</Badge>;
    case "SCHEDULED":
      return <Badge className="bg-amber-500 text-white hover:bg-amber-500">Scheduled</Badge>;
    case "ARCHIVED":
      return <Badge variant="secondary">Archived</Badge>;
    default:
      return <Badge variant="outline">Draft</Badge>;
  }
}

export function AdminArticlesTable({ articles }: { articles: Article[] }) {
  const { toast } = useToast();
  const router = useRouter();

  const onToggle = async (id: string, title: string) => {
    const res = await toggleArticleStatusAction(id);
    if (res.success) {
      toast({ title: "Status artikel diperbarui", description: title });
      router.refresh();
    } else {
      toast({ title: "Gagal", description: res.error, variant: "destructive" });
    }
  };

  const onDelete = async (id: string, title: string) => {
    const res = await deleteArticleAction(id);
    if (res.success) {
      toast({ title: "Artikel dihapus", description: title });
      router.refresh();
    } else {
      toast({ title: "Gagal menghapus", description: res.error, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Kelola artikel Journal Dapur Ayam.
        </p>
        <Button asChild className="gap-2">
          <Link href="/admin/journal/baru">
            <Plus className="h-4 w-4" />
            Tambah Artikel
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Cover</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Penulis</TableHead>
              <TableHead>Tgl Publikasi</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                  Belum ada artikel. Klik "Tambah Artikel" untuk membuat.
                </TableCell>
              </TableRow>
            ) : (
              articles.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    <div className="h-12 w-16 overflow-hidden rounded-md bg-secondary">
                      {a.coverImageUrl ? (
                        <img
                          src={a.coverImageUrl}
                          alt={a.title}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <Link
                      href={`/admin/journal/${a.id}/edit`}
                      className="truncate text-sm font-medium text-foreground hover:text-primary hover:underline"
                    >
                      {a.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {a.category?.name || "—"}
                  </TableCell>
                  <TableCell>{statusBadge(a.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{a.authorName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(a.publishedAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Toggle status"
                        onClick={() => onToggle(a.id, a.title)}
                        title="Toggle Publish / Archive"
                      >
                        {a.status === "PUBLISHED" ? (
                          <Archive className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button asChild variant="ghost" size="icon" aria-label="Edit">
                        <Link href={`/admin/journal/${a.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <ConfirmDialog
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            aria-label="Hapus"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        }
                        title="Hapus Artikel?"
                        description={`Yakin ingin menghapus "${a.title}"? Tindakan ini tidak dapat dibatalkan.`}
                        confirmText="Hapus"
                        onConfirm={() => onDelete(a.id, a.title)}
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
