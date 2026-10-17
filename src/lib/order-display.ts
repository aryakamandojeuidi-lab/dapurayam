export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Menunggu Konfirmasi",
  CONFIRMED: "Dikonfirmasi",
  PROCESSING: "Sedang Diproses",
  SHIPPED: "Dikirim",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-purple-50 text-purple-700 border-purple-200",
  SHIPPED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
};

export const ORDER_CHANNEL_LABELS: Record<string, string> = {
  WEBSITE: "Website",
  SHOPEE: "Shopee",
  TOKOPEDIA: "Tokopedia",
  WHATSAPP: "WhatsApp",
};

export const ORDER_CHANNEL_COLORS: Record<string, string> = {
  WEBSITE: "bg-primary/10 text-primary border-primary/30",
  SHOPEE: "bg-[#ee4d2d]/10 text-[#ee4d2d] border-[#ee4d2d]/30",
  TOKOPEDIA: "bg-emerald-50 text-emerald-700 border-emerald-200",
  WHATSAPP: "bg-[#25d366]/10 text-[#15803d] border-[#25d366]/30",
};

export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return "Rp -";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}
