"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploader } from "@/components/admin/image-uploader";
import { ArticleEditor } from "@/components/admin/article-editor";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/prisma-helpers";

type Category = { id: string; name: string };

type Props = {
  action: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
  initialData?: {
    id?: string;
    title?: string;
    slug?: string;
    excerpt?: string | null;
    content?: string;
    coverImageUrl?: string | null;
    authorName?: string;
    categoryId?: string | null;
    tags?: string | null;
    status?: string;
    isFeatured?: boolean;
    seoTitle?: string | null;
    seoDescription?: string | null;
    publishedAt?: Date | null;
  };
  categories: Category[];
  submitLabel?: string;
};

export function ArticleForm({
  action,
  initialData,
  categories,
  submitLabel = "Simpan Artikel",
}: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [slugEdited, setSlugEdited] = useState(Boolean(initialData?.slug));

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.coverImageUrl || "");
  const [authorName, setAuthorName] = useState(initialData?.authorName || "Tim Dapur Ayam");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "__none__");
  const [tags, setTags] = useState(initialData?.tags || "");
  const [status, setStatus] = useState(initialData?.status || "DRAFT");
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription || "");
  const [publishedAt, setPublishedAt] = useState(
    initialData?.publishedAt
      ? new Date(initialData.publishedAt).toISOString().slice(0, 16)
      : "",
  );

  const onTitleChange = (v: string) => {
    setTitle(v);
    if (!slugEdited) setSlug(slugify(v));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    if (initialData?.id) {
      formData.set("_id", initialData.id);
    }
    formData.set("title", title);
    formData.set("slug", slug);
    formData.set("excerpt", excerpt);
    formData.set("content", content);
    formData.set("coverImageUrl", coverImageUrl);
    formData.set("authorName", authorName);
    formData.set("categoryId", categoryId === "__none__" ? "" : categoryId);
    formData.set("tags", tags);
    formData.set("status", status);
    formData.set("isFeatured", String(isFeatured));
    formData.set("seoTitle", seoTitle);
    formData.set("seoDescription", seoDescription);
    if (status !== "DRAFT" && publishedAt) {
      formData.set("publishedAt", new Date(publishedAt).toISOString());
    } else if (status === "PUBLISHED" && !publishedAt) {
      formData.set("publishedAt", new Date().toISOString());
    } else {
      formData.set("publishedAt", "");
    }

    const res = await action(formData);
    setLoading(false);
    if (res.success) {
      toast({ title: "Artikel berhasil disimpan." });
      router.push("/admin/journal");
      router.refresh();
    } else {
      toast({
        title: "Gagal menyimpan",
        description: res.error,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Konten Artikel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Judul *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
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
              <p className="text-xs text-muted-foreground">
                URL: /journal/<span className="font-mono">{slug || "slug"}</span>
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="excerpt">Ringkasan</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                placeholder="Satu atau dua kalimat ringkasan untuk daftar artikel"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Konten (Markdown) *</Label>
              <ArticleEditor value={content} onChange={setContent} />
              <p className="text-xs text-muted-foreground">
                Mendukung heading, bold, italic, link, gambar, daftar, dan lainnya.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status & Publikasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="publishedAt">Tanggal Publikasi</Label>
                <Input
                  id="publishedAt"
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Untuk Scheduled, isi tanggal di masa depan. Untuk Published, kosongkan untuk sekarang.
                </p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <Label htmlFor="isFeatured">Artikel Pilihan</Label>
                  <p className="text-xs text-muted-foreground">
                    Tampil sebagai artikel utama di halaman Journal.
                  </p>
                </div>
                <Switch
                  id="isFeatured"
                  checked={isFeatured}
                  onCheckedChange={setIsFeatured}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Meta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="categoryId">Kategori</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger id="categoryId">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Tanpa Kategori</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="authorName">Penulis</Label>
                <Input
                  id="authorName"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Pisahkan dengan koma, mis. tips, resep, ayam"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cover</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader value={coverImageUrl} onChange={setCoverImageUrl} label="Gambar Cover" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Kosongkan untuk pakai judul artikel"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  rows={3}
                  placeholder="Kosongkan untuk pakai ringkasan"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" asChild disabled={loading}>
          <Link href="/admin/journal">Batal</Link>
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}
