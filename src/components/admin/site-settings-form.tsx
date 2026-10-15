"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { updateSettingsAction } from "@/actions/settings-actions";

type Props = {
  initialData: {
    businessName: string;
    tagline: string | null;
    description: string | null;
    whatsappNumber: string | null;
    contactEmail: string | null;
    address: string | null;
    operationalHours: string | null;
    instagramUrl: string | null;
    facebookUrl: string | null;
    tiktokUrl: string | null;
    footerText: string | null;
    heroHeadline: string | null;
    heroSubtext: string | null;
  };
};

export function SiteSettingsForm({ initialData }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    businessName: initialData.businessName || "",
    tagline: initialData.tagline || "",
    description: initialData.description || "",
    whatsappNumber: initialData.whatsappNumber || "",
    contactEmail: initialData.contactEmail || "",
    address: initialData.address || "",
    operationalHours: initialData.operationalHours || "",
    instagramUrl: initialData.instagramUrl || "",
    facebookUrl: initialData.facebookUrl || "",
    tiktokUrl: initialData.tiktokUrl || "",
    footerText: initialData.footerText || "",
    heroHeadline: initialData.heroHeadline || "",
    heroSubtext: initialData.heroSubtext || "",
  });

  const set = (key: keyof typeof data, value: string) => {
    setData((d) => ({ ...d, [key]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => formData.set(k, v || ""));
    const res = await updateSettingsAction(formData);
    setLoading(false);
    if (res.success) {
      toast({ title: "Pengaturan berhasil disimpan." });
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
      <Card>
        <CardHeader>
          <CardTitle>Informasi Bisnis</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="businessName">Nama Bisnis *</Label>
            <Input
              id="businessName"
              value={data.businessName}
              onChange={(e) => set("businessName", e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={data.tagline}
              onChange={(e) => set("tagline", e.target.value)}
              placeholder="Satu kalimat singkat tentang bisnis"
            />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kontak</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="whatsappNumber">Nomor WhatsApp</Label>
            <Input
              id="whatsappNumber"
              value={data.whatsappNumber}
              onChange={(e) => set("whatsappNumber", e.target.value)}
              placeholder="62xxx atau 08xxx (tanpa spasi)"
            />
            <p className="text-xs text-muted-foreground">
              Format: 62xxx (internasional) atau 08xxx (lokal). Kosongkan jika belum tersedia.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contactEmail">Email Kontak</Label>
            <Input
              id="contactEmail"
              type="email"
              value={data.contactEmail}
              onChange={(e) => set("contactEmail", e.target.value)}
              placeholder="email@dapurayam.com"
            />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="address">Alamat</Label>
            <Textarea
              id="address"
              value={data.address}
              onChange={(e) => set("address", e.target.value)}
              rows={2}
            />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="operationalHours">Jam Operasional</Label>
            <Input
              id="operationalHours"
              value={data.operationalHours}
              onChange={(e) => set("operationalHours", e.target.value)}
              placeholder="mis. Senin–Sabtu 08.00–17.00 WIB"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Media Sosial</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="instagramUrl">Instagram URL</Label>
            <Input
              id="instagramUrl"
              value={data.instagramUrl}
              onChange={(e) => set("instagramUrl", e.target.value)}
              placeholder="https://instagram.com/..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="facebookUrl">Facebook URL</Label>
            <Input
              id="facebookUrl"
              value={data.facebookUrl}
              onChange={(e) => set("facebookUrl", e.target.value)}
              placeholder="https://facebook.com/..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tiktokUrl">TikTok URL</Label>
            <Input
              id="tiktokUrl"
              value={data.tiktokUrl}
              onChange={(e) => set("tiktokUrl", e.target.value)}
              placeholder="https://tiktok.com/@..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Beranda (Hero)</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="heroHeadline">Headline Beranda</Label>
            <Input
              id="heroHeadline"
              value={data.heroHeadline}
              onChange={(e) => set("heroHeadline", e.target.value)}
            />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="heroSubtext">Subtext Beranda</Label>
            <Textarea
              id="heroSubtext"
              value={data.heroSubtext}
              onChange={(e) => set("heroSubtext", e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Footer</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="footerText">Teks Footer</Label>
            <Input
              id="footerText"
              value={data.footerText}
              onChange={(e) => set("footerText", e.target.value)}
              placeholder="© 2026 Dapur Ayam. Semua hak cipta dilindungi."
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3">
        <Button type="submit" disabled={loading} className="gap-2">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Simpan Pengaturan
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
