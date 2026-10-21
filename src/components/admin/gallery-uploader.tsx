"use client";

import { useState } from "react";
import { Upload, X, Loader2, ImageIcon, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type Props = {
  /** Current list of gallery image URLs (excluding the main imageUrl) */
  value: string[];
  /** Called with the new list whenever it changes */
  onChange: (urls: string[]) => void;
  label?: string;
  /** Max number of gallery photos. Default 6. */
  max?: number;
};

/**
 * Gallery Uploader — UI untuk upload beberapa foto tambahan per produk.
 *
 * Layout:
 *   [Foto 1] [Foto 2] [Foto 3] [Foto 4] [Foto 5] [Foto 6]   ← grid foto
 *   [+ Upload Foto] [Tambah URL]                            ← tombol tambah
 *
 * Setiap foto punya tombol (×) di pojok kanan atas untuk hapus.
 * Counter di header menunjukkan jumlah foto terisi vs kapasitas maks.
 */
export function GalleryUploader({
  value,
  onChange,
  label = "Foto Tambahan",
  max = 6,
}: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const handleFile = async (file: File) => {
    if (value.length >= max) {
      toast({
        title: "Batas foto tercapai",
        description: `Maksimal ${max} foto tambahan per produk.`,
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mengunggah");
      }
      onChange([...value, data.url]);
      toast({
        title: "Foto berhasil ditambahkan",
        description: `Sekarang ada ${value.length + 1} foto tambahan.`,
      });
    } catch (err: any) {
      toast({
        title: "Gagal mengunggah",
        description: err?.message || "Coba lagi nanti.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = ""; // reset input agar bisa upload file yang sama lagi
  };

  const addUrl = () => {
    const url = urlInput.trim();
    if (!url) {
      toast({
        title: "URL kosong",
        description: "Masukkan URL gambar yang valid.",
        variant: "destructive",
      });
      return;
    }
    if (value.length >= max) {
      toast({
        title: "Batas foto tercapai",
        description: `Maksimal ${max} foto tambahan per produk.`,
        variant: "destructive",
      });
      return;
    }
    onChange([...value, url]);
    setUrlInput("");
    toast({ title: "URL ditambahkan." });
  };

  const removeAt = (idx: number) => {
    const next = value.filter((_, i) => i !== idx);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {/* Header row: label + counter */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-semibold">{label}</Label>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Tambahkan hingga {max} foto tambahan. Akan tampil sebagai thumbnail di
            halaman detail produk (beserta foto utama).
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold tabular-nums ${
            value.length >= max
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-foreground"
          }`}
        >
          {value.length} / {max}
        </span>
      </div>

      {/* Grid of uploaded photos (only show if any photos exist) */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {value.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="group relative overflow-hidden rounded-xl border border-border bg-secondary transition-shadow hover:shadow-sm"
            >
              {/* Image preview */}
              <div className="aspect-square w-full overflow-hidden">
                {url ? (
                  <img
                    src={url}
                    alt={`Foto ${idx + 2} produk`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-muted-foreground">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                )}
              </div>
              {/* Label */}
              <div className="px-2 py-1 text-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Foto {idx + 2}
              </div>
              {/* Remove button (×) */}
              <button
                type="button"
                onClick={() => removeAt(idx)}
                className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-background/95 text-foreground shadow ring-1 ring-border transition-colors hover:bg-destructive hover:text-destructive-foreground"
                aria-label={`Hapus foto ${idx + 2}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Empty state hint when no photos yet */}
      {value.length === 0 && (
        <div className="rounded-lg border border-dashed border-border bg-secondary/30 px-4 py-6 text-center">
          <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground/60" />
          <p className="mt-2 text-xs text-muted-foreground">
            Belum ada foto tambahan. Upload atau tambahkan URL foto di bawah.
          </p>
        </div>
      )}

      {/* Add new photo: file upload + URL input */}
      {value.length < max && (
        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Input
                id="gallery-file-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={onFileChange}
                disabled={loading}
                className="cursor-pointer"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                JPEG, PNG, atau WebP. Maks 5MB per file.
              </p>
            </div>
            {loading && (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            )}
          </div>

          {/* OR divider */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            <span>atau paste URL gambar</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* URL input + add button */}
          <div className="flex gap-2">
            <Input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://... atau /uploads/products/..."
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addUrl();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addUrl}
              disabled={!urlInput.trim() || loading}
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Tambah
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
