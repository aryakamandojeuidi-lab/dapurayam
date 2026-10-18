"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, MessageCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  updateOrderStatusAction,
  deleteOrderAction,
} from "@/actions/order-actions";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type Props = {
  orderId: string;
  currentStatus: string;
  currentAdminNote: string;
  statusLabels: Record<string, string>;
  customerName: string;
  customerPhone: string;
  orderNumber: string;
};

export function OrderStatusUpdater({
  orderId,
  currentStatus,
  currentAdminNote,
  statusLabels,
  customerName,
  customerPhone,
  orderNumber,
}: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [adminNote, setAdminNote] = useState(currentAdminNote);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const onSave = async () => {
    setLoading(true);
    const res = await updateOrderStatusAction(orderId, status, adminNote);
    setLoading(false);
    if (res.success) {
      toast({ title: "Status pesanan diperbarui." });
      router.refresh();
    } else {
      toast({
        title: "Gagal memperbarui",
        description: res.error,
        variant: "destructive",
      });
    }
  };

  const onDelete = async () => {
    setDeleting(true);
    const res = await deleteOrderAction(orderId);
    setDeleting(false);
    if (res.success) {
      toast({ title: "Pesanan berhasil dihapus." });
      router.push("/admin/pesanan");
      router.refresh();
    } else {
      toast({
        title: "Gagal menghapus",
        description: res.error,
        variant: "destructive",
      });
    }
  };

  const waMessage = `Halo ${customerName}, kami dari Dapur Ayam menghubungi terkait pesanan Anda ${orderNumber}. Status pesanan saat ini: ${statusLabels[status] || status}. Mohon konfirmasi pemesanan Anda ya, terima kasih.`;
  const waUrl = buildWhatsAppUrl(customerPhone, waMessage);

  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h2 className="text-base font-semibold text-foreground">
        Manajemen Pesanan
      </h2>

      <div className="mt-4 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="status" className="text-xs font-medium">
            Status Pesanan
          </Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(statusLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="adminNote" className="text-xs font-medium">
            Catatan Internal Admin
          </Label>
          <Textarea
            id="adminNote"
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            rows={4}
            placeholder="Catatan internal — tidak ditampilkan ke pelanggan. Misal: 'sudah dihubungi via WA', 'menunggu pembayaran', dll."
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={onSave}
            disabled={
              loading || (status === currentStatus && adminNote === currentAdminNote)
            }
            className="gap-2 flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Simpan
              </>
            )}
          </Button>

          {waUrl ? (
            <Button
              asChild
              type="button"
              variant="outline"
              className="gap-2 bg-[#25d366]/5 border-[#25d366]/30 text-[#15803d] hover:bg-[#25d366]/10"
            >
              <a href={waUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                Chat
              </a>
            </Button>
          ) : null}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={deleting}
                className="border-rose-200 text-rose-600 hover:bg-rose-50"
                aria-label="Hapus pesanan"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus pesanan ini?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini tidak bisa dibatalkan. Pesanan{" "}
                  <span className="font-mono">{orderNumber}</span> beserta semua
                  item akan dihapus permanen dari database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-rose-600 hover:bg-rose-700"
                >
                  Ya, Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </section>
  );
}
