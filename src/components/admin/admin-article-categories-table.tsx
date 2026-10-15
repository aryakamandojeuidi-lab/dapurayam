"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
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
import { slugify } from "@/lib/prisma-helpers";
import {
  createArticleCategoryAction,
  updateArticleCategoryAction,
  deleteArticleCategoryAction,
} from "@/actions/article-category-actions";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count?: { articles: number };
};

export function AdminArticleCategoriesTable({ categories }: { categories: Category[] }) {
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditId(null);
    setName("");
    setSlug("");
    setDescription("");
    setSlugEdited(false);
    setOpen(true);
  };
  const openEdit = (id: string) => {
    const c = categories.find((cat) => cat.id === id);
    if (!c) return;
    setEditId(c.id);
    setName(c.name);
    setSlug(c.slug);
    setDescription(c.description || "");
    setSlugEdited(true);
    setOpen(true);
  };

  const onNameChange = (v: string) => {
    setName(v);
    if (!slugEdited) setSlug(slugify(v));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData();
    formData.set("name", name);
    formData.set("slug", slug);
    formData.set("description", description);
    const res = editId
      ? await updateArticleCategoryAction(editId, formData)
      : await createArticleCategoryAction(formData);
    setSaving(false);
    if (res.success) {
      toast({ title: editId ? "Kategori diperbarui" : "Kategori dibuat" });
      setOpen(false);
      router.refresh();
    } else {
      toast({ title: "Gagal menyimpan", description: res.error, variant: "destructive" });
    }
  };

  const onDelete = async (id: string, name: string) => {
    const res = await deleteArticleCategoryAction(id);
    if (res.success) {
      toast({ title: "Kategori dihapus", description: name });
      router.refresh();
    } else {
      toast({ title: "Gagal menghapus", description: res.error, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Kategori artikel Journal Dapur Ayam.
        </p>
        <Button onClick={openCreate} variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Kategori Artikel
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Jumlah Artikel</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                  Belum ada kategori artikel.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium text-foreground">{c.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{c.slug}</TableCell>
                  <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                    {c.description || "—"}
                  </TableCell>
                  <TableCell className="text-sm">{c._count?.articles ?? 0}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(c.id)} aria-label="Edit">
                        <Pencil className="h-4 w-4" />
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
                        title="Hapus Kategori Artikel?"
                        description={
                          c._count?.articles
                            ? `Masih ada ${c._count.articles} artikel yang menggunakan kategori ini.`
                            : `Yakin ingin menghapus kategori "${c.name}"?`
                        }
                        confirmText="Hapus"
                        onConfirm={() => onDelete(c.id, c.name)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle>{editId ? "Edit Kategori Artikel" : "Tambah Kategori Artikel"}</DialogTitle>
              <DialogDescription>
                {editId ? "Perbarui informasi kategori artikel." : "Buat kategori baru untuk artikel."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="art-name">Nama *</Label>
                <Input
                  id="art-name"
                  value={name}
                  onChange={(e) => onNameChange(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="art-slug">Slug *</Label>
                <Input
                  id="art-slug"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setSlugEdited(true);
                  }}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="art-desc">Deskripsi</Label>
                <Textarea
                  id="art-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={saving}>Batal</Button>
              </DialogClose>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : editId ? "Simpan" : "Tambah"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
