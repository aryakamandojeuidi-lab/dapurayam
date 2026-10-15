export function buildWhatsAppUrl(number: string, message: string): string {
  if (!number) return "";
  const clean = number.replace(/[^0-9]/g, "");
  // Convert leading 0 to 62 (Indonesia country code) if needed
  const normalized = clean.startsWith("0")
    ? "62" + clean.slice(1)
    : clean.startsWith("62")
      ? clean
      : clean;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export function buildProductOrderMessage(productName: string): string {
  return `Halo Dapur Ayam, saya ingin bertanya dan memesan ${productName}. Mohon informasi harga dan ketersediaannya.`;
}

export function buildGeneralInquiryMessage(): string {
  return `Halo Dapur Ayam, saya ingin bertanya mengenai produk yang tersedia.`;
}

export function buildContactFormMessage(
  name: string,
  email: string,
  message: string,
): string {
  return `Halo Dapur Ayam, saya ${name} (${email}). Pesan saya: ${message}`;
}
