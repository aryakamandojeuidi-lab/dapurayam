"use client";

import { useState } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
};

export function ImageUploader({ value, onChange, label = "Gambar" }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(value);

  const handleFile = async (file: File) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mengunggah");
      }
      onChange(data.url);
      setPreview(data.url);
      toast({ title: "Gambar berhasil diunggah." });
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
  };

  const onUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setPreview(e.target.value);
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="relative h-32 w-full overflow-hidden rounded-lg border border-border bg-secondary sm:w-48">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-muted-foreground">
              <ImageIcon className="h-8 w-8" />
            </div>
          )}
          {loading && (
            <div className="absolute inset-0 grid place-items-center bg-background/70">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <Label htmlFor="upload" className="sr-only">
              Unggah file
            </Label>
            <Input
              id="upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onInputChange}
              disabled={loading}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              JPEG, PNG, atau WebP. Maks 5MB.
            </p>
          </div>
          <div>
            <Label htmlFor="url" className="text-xs">
              Atau URL gambar:
            </Label>
            <div className="flex gap-2">
              <Input
                id="url"
                value={value}
                onChange={onUrlChange}
                placeholder="https://..."
              />
              {value && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    onChange("");
                    setPreview("");
                  }}
                  aria-label="Hapus gambar"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
