"use client";

import { useState } from "react";
import { MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { buildContactFormMessage } from "@/lib/whatsapp";

type Props = {
  whatsappNumber: string;
  contactEmail: string;
};

export function ContactForm({ whatsappNumber, contactEmail }: Props) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast({
        title: "Form belum lengkap",
        description: "Mohon isi semua kolom terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }
    if (whatsappNumber) {
      const url = `${buildContactFormMessage(name, email, message)}`;
      const waUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "").replace(/^0/, "62")}?text=${encodeURIComponent(url)}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
      toast({
        title: "Membuka WhatsApp",
        description: "Pesan Anda telah disiapkan. Silakan kirim chat WhatsApp Anda.",
      });
    } else if (contactEmail) {
      const subject = encodeURIComponent(`Pesan dari ${name}`);
      const body = encodeURIComponent(`${message}\n\nEmail: ${email}`);
      window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    } else {
      toast({
        title: "Belum dapat mengirim pesan",
        description: "Nomor WhatsApp dan email belum dikonfigurasi. Silakan coba kembali nanti.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Nama</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama lengkap Anda"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@contoh.com"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="message">Pesan</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tulis pertanyaan atau pesan Anda di sini..."
          rows={5}
          required
        />
      </div>
      <Button type="submit" className="w-full gap-2">
        {whatsappNumber ? (
          <>
            <MessageCircle className="h-4 w-4" />
            Kirim via WhatsApp
          </>
        ) : contactEmail ? (
          <>
            <Mail className="h-4 w-4" />
            Kirim via Email
          </>
        ) : (
          "Kirim"
        )}
      </Button>
      {!whatsappNumber && !contactEmail && (
        <p className="text-center text-xs text-muted-foreground">
          Nomor WhatsApp dan email belum dikonfigurasi. Hubungi admin untuk mengaktifkan.
        </p>
      )}
    </form>
  );
}
