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
  DialogTrigger,
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
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/actions/category-actions";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count?: { products: number };
};

type Props = {
  categories: Category[];
};

export function AdminCategoriesTable({ categories }: Props) {
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
      ? await updateCategoryAction(editId, formData)
      : await createCategoryAction(formData);
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
    const res = await deleteCategoryAction(id);
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
          Kelola kategori produk untuk mengelompokkan produk di katalog.
        </p>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Kategori
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Jumlah Produk</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                  Belum ada kategori. Klik "Tambah Kategori" untuk membuat.
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
                  <TableCell className="text-sm">{c._count?.products ?? 0}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(c.id)}
                        aria-label="Edit"
                      >
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
                        title="Hapus Kategori?"
                        description={
                          c._count?.products
                            ? `Kategori "${c.name}" masih digunakan oleh ${c._count.products} produk. Hapus atau ubah kategori produk terlebih dahulu.`
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
              <DialogTitle>{editId ? "Edit Kategori" : "Tambah Kategori Baru"}</DialogTitle>
              <DialogDescription>
                {editId
                  ? "Perbarui informasi kategori."
                  : "Buat kategori baru untuk produk."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Kategori *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => onNameChange(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setSlugEdited(true);
                  }}
                  required
                />
                <p className="text-xs text-muted-foreground">URL: /produk?kategori={slug || "slug"}</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={saving}>
                  Batal
                </Button>
              </DialogClose>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : editId ? (
                  "Simpan"
                ) : (
                  "Tambah"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
