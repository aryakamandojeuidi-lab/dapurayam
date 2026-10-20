"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
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
import { GalleryUploader } from "@/components/admin/gallery-uploader";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/prisma-helpers";
import { parseGalleryImages, serializeGalleryImages } from "@/lib/gallery";

type Category = { id: string; name: string };

type Props = {
  action: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
  initialData?: {
    id?: string;
    name?: string;
    slug?: string;
    description?: string;
    shortDescription?: string | null;
    price?: number | null;
    packageSize?: string | null;
    imageUrl?: string | null;
    ingredients?: string | null;
    storageInstructions?: string | null;
    servingSuggestion?: string | null;
    categoryId?: string | null;
    isActive?: boolean;
    isFeatured?: boolean;
    featuredOrder?: number;
    shopeeUrl?: string | null;
    tokopediaUrl?: string | null;
    websiteOrderEnabled?: boolean | null;
    galleryImages?: string[] | null;
  };
  categories: Category[];
  submitLabel?: string;
};

export function ProductForm({
  action,
  initialData,
  categories,
  submitLabel = "Simpan Produk",
}: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [slugEdited, setSlugEdited] = useState(Boolean(initialData?.slug));

  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || "");
  const [price, setPrice] = useState(initialData?.price ? String(initialData.price) : "");
  const [packageSize, setPackageSize] = useState(initialData?.packageSize || "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [ingredients, setIngredients] = useState(initialData?.ingredients || "");
  const [storageInstructions, setStorageInstructions] = useState(initialData?.storageInstructions || "");
  const [servingSuggestion, setServingSuggestion] = useState(initialData?.servingSuggestion || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "__none__");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);
  const [featuredOrder, setFeaturedOrder] = useState(initialData?.featuredOrder ?? 0);
  const [shopeeUrl, setShopeeUrl] = useState(initialData?.shopeeUrl || "");
  const [tokopediaUrl, setTokopediaUrl] = useState(initialData?.tokopediaUrl || "");
  const [websiteOrderEnabled, setWebsiteOrderEnabled] = useState(
    initialData?.websiteOrderEnabled ?? true,
  );
  const [galleryImages, setGalleryImages] = useState<string[]>(
    parseGalleryImages(initialData?.galleryImages as unknown as string | null | undefined),
  );

  const onNameChange = (v: string) => {
    setName(v);
    if (!slugEdited) setSlug(slugify(v));
  };
  const onSlugChange = (v: string) => {
    setSlug(v);
    setSlugEdited(true);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    if (initialData?.id) {
      formData.set("_id", initialData.id);
    }
    formData.set("name", name);
    formData.set("slug", slug);
    formData.set("description", description);
    formData.set("shortDescription", shortDescription);
    formData.set("price", price);
    formData.set("packageSize", packageSize);
    formData.set("imageUrl", imageUrl);
    formData.set("ingredients", ingredients);
    formData.set("storageInstructions", storageInstructions);
    formData.set("servingSuggestion", servingSuggestion);
    formData.set("categoryId", categoryId === "__none__" ? "" : categoryId);
    formData.set("isActive", String(isActive));
    formData.set("isFeatured", String(isFeatured));
    formData.set("featuredOrder", String(featuredOrder));
    formData.set("shopeeUrl", shopeeUrl);
    formData.set("tokopediaUrl", tokopediaUrl);
    formData.set("websiteOrderEnabled", String(websiteOrderEnabled));
    // Gallery images stored as JSON string in DB
    formData.set("galleryImages", serializeGalleryImages(galleryImages));

    const res = await action(formData);
    setLoading(false);
    if (res.success) {
      toast({ title: "Produk berhasil disimpan." });
      router.push("/admin/produk");
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
            <CardTitle>Informasi Produk</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Produk *</Label>
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
                onChange={(e) => onSlugChange(e.target.value)}
                required
                placeholder="otomatis-dari-nama"
              />
              <p className="text-xs text-muted-foreground">
                Digunakan untuk URL: /produk/<span className="font-mono">{slug || "slug"}</span>
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shortDescription">Deskripsi Singkat</Label>
              <Input
                id="shortDescription"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Satu kalimat singkat untuk daftar produk"
                maxLength={200}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Deskripsi Lengkap *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={6}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="price">Harga (Rp) — opsional</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="100"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Kosongkan jika belum diketahui"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="packageSize">Ukuran Kemasan</Label>
                <Input
                  id="packageSize"
                  value={packageSize}
                  onChange={(e) => setPackageSize(e.target.value)}
                  placeholder="mis. 250 gr / 500 gr"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="grid gap-2 sm:col-span-2">
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
                <Label htmlFor="featuredOrder">Urutan Unggulan</Label>
                <Input
                  id="featuredOrder"
                  type="number"
                  value={featuredOrder}
                  onChange={(e) => setFeaturedOrder(Number(e.target.value))}
                  min={0}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <Label htmlFor="isActive">Aktif</Label>
                  <p className="text-xs text-muted-foreground">
                    Produk aktif tampil di katalog publik.
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <Label htmlFor="isFeatured">Unggulan</Label>
                  <p className="text-xs text-muted-foreground">
                    Tampil di bagian "Produk Unggulan" beranda.
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
              <CardTitle>Gambar Produk</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader value={imageUrl} onChange={setImageUrl} label="Foto Utama" />
              <div className="mt-6 border-t border-border pt-6">
                <GalleryUploader
                  value={galleryImages}
                  onChange={setGalleryImages}
                  label="Galeri Foto Tambahan"
                  max={6}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kanal Pembelian</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-secondary/30 p-3">
            <div>
              <Label htmlFor="websiteOrderEnabled">Pemesanan via Website</Label>
              <p className="text-xs text-muted-foreground">
                Aktifkan tampil tombol "Tambah ke Keranjang" pada halaman detail
                produk.
              </p>
            </div>
            <Switch
              id="websiteOrderEnabled"
              checked={websiteOrderEnabled}
              onCheckedChange={setWebsiteOrderEnabled}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="shopeeUrl">URL Produk di Shopee (opsional)</Label>
            <Input
              id="shopeeUrl"
              value={shopeeUrl}
              onChange={(e) => setShopeeUrl(e.target.value)}
              placeholder="https://shopee.co.id/product/..."
            />
            <p className="text-xs text-muted-foreground">
              Khusus untuk produk ini. Jika kosong, tombol Shopee akan tampil
              "Belum Tersedia". Untuk link toko global, atur di Pengaturan.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tokopediaUrl">URL Produk di Tokopedia (opsional)</Label>
            <Input
              id="tokopediaUrl"
              value={tokopediaUrl}
              onChange={(e) => setTokopediaUrl(e.target.value)}
              placeholder="https://www.tokopedia.com/..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detail Tambahan (Opsional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="ingredients">Komposisi</Label>
            <Textarea
              id="ingredients"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              rows={3}
              placeholder="Kosongkan jika belum diketahui"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="storageInstructions">Cara Penyimpanan</Label>
            <Textarea
              id="storageInstructions"
              value={storageInstructions}
              onChange={(e) => setStorageInstructions(e.target.value)}
              rows={3}
              placeholder="Kosongkan jika belum diketahui"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="servingSuggestion">Saran Penyajian</Label>
            <Textarea
              id="servingSuggestion"
              value={servingSuggestion}
              onChange={(e) => setServingSuggestion(e.target.value)}
              rows={3}
              placeholder="Kosongkan jika belum diketahui"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Batal
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
