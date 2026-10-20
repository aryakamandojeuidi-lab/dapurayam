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

export function GalleryUploader({
  value,
  onChange,
  label = "Galeri Foto Tambahan",
  max = 6,
}: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File) => {
    if (value.length >= max) {
      toast({
        title: "Batas foto tercapai",
        description: `Maksimal ${max} foto galeri.`,
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
      toast({ title: "Foto berhasil ditambahkan." });
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

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset file input value so same file can be re-added if needed
    e.target.value = "";
  };

  const addUrl = () => {
    if (value.length >= max) {
      toast({
        title: "Batas foto tercapai",
        description: `Maksimal ${max} foto galeri.`,
        variant: "destructive",
      });
      return;
    }
    onChange([...value, ""]);
  };

  const updateUrl = (idx: number, url: string) => {
    const next = [...value];
    next[idx] = url;
    onChange(next);
  };

  const removeAt = (idx: number) => {
    const next = value.filter((_, i) => i !== idx);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className="text-xs text-muted-foreground tabular-nums">
          {value.length} / {max}
        </span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Tambahkan hingga {max} foto tambahan. Foto pertama pada katalog produk
        tetap menggunakan foto utama di atas. Foto galeri akan tampil di halaman
        detail produk.
      </p>

      {/* Grid of gallery photos */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {value.map((url, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-lg border border-border bg-secondary"
            >
              <div className="aspect-square w-full">
                {url ? (
                  <img
                    src={url}
                    alt={`Galeri ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-muted-foreground">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeAt(idx)}
                className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-background/90 text-foreground shadow ring-1 ring-border transition-colors hover:bg-destructive hover:text-destructive-foreground"
                aria-label={`Hapus foto ${idx + 1}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
              {/* URL editor (small) */}
              <input
                type="text"
                value={url}
                onChange={(e) => updateUrl(idx, e.target.value)}
                placeholder="URL atau upload di bawah"
                className="w-full border-t border-border bg-background px-2 py-1 text-[10px] text-foreground outline-none"
              />
            </div>
          ))}
        </div>
      )}

      {/* Add new photo: file upload + add URL button */}
      {value.length < max && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onInputChange}
              disabled={loading}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              JPEG, PNG, atau WebP. Maks 5MB per file.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addUrl}
            disabled={value.length >= max || loading}
            className="gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Tambah URL
          </Button>
          {loading && (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          )}
        </div>
      )}
    </div>
  );
}
