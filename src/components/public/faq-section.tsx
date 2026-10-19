"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    question: "Bagaimana cara memesan produk Dapur Ayam?",
    answer:
      "Anda dapat memesan melalui tiga kanal: (1) Pembelian via Website — tambahkan produk ke keranjang lalu checkout; (2) Pembelian via Shopee — kunjungi toko resmi kami untuk opsi pembayaran dan pengiriman terintegrasi; (3) Konsultasi langsung via WhatsApp — pilih produk lalu tekan tombol \"Pesan via WhatsApp\" untuk chat otomatis. Untuk kebutuhan khusus atau pemesanan custom, kanal WhatsApp adalah yang paling tepat.",
  },
  {
    question: "Apa arti \"fresh made by order\"?",
    answer:
      "Setiap produk Dapur Ayam dibuat setelah pesanan Anda dikonfirmasi, bukan diproduksi massal dan disimpan di rak. Filosofi ini memastikan produk yang Anda terima adalah produk yang baru saja disiapkan untuk Anda, dengan kualitas dan kelezatan yang optimal.",
  },
  {
    question: "Apakah produk Dapur Ayam menggunakan MSG atau pengawet?",
    answer:
      "Tidak. Produk Dapur Ayam dibuat tanpa tambahan MSG dan tanpa bahan pengawet. Rasa gurih dan aroma khas murni berasal dari rempah pilihan, bumbu racikan, serta kualitas daging ayam yang kami seleksi.",
  },
  {
    question: "Apakah produk selalu tersedia?",
    answer:
      "Karena produk dibuat fresh by order, ketersediaan bergantung pada bahan baku dan kapasitas produksi pada periode tertentu. Untuk pesanan jumlah besar atau untuk acara, sebaiknya konfirmasi melalui WhatsApp beberapa hari sebelumnya.",
  },
  {
    question: "Bagaimana cara penyimpanan produk?",
    answer:
      "Panduan umum: produk segar disimpan di kulkas (chiller) dan dimasak dalam 2-3 hari, sedangkan untuk penyimpanan lebih lama gunakan freezer. Informasi penyimpanan spesifik untuk tiap produk akan disertakan saat pengiriman atau dapat ditanyakan saat pemesanan via WhatsApp.",
  },
  {
    question: "Apakah ada pengiriman? Wilayah mana saja yang terjangkau?",
    answer:
      "Kami melayani pengiriman ke area Alam Sutera, BSD, dan Karawaci. Gratis ongkir berlaku untuk pembelian minimal Rp 150.000. Untuk pembelian via Shopee, opsi pengiriman mengikuti standar Shopee. Untuk pemesanan via WhatsApp, pengiriman dapat diatur sesuai kesepakatan. Hubungi kami untuk memastikan wilayah Anda terjangkau.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="bg-background py-20 md:py-28 scroll-mt-20">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Pertanyaan Umum
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Beberapa hal yang sering ditanyakan tentang produk dan pemesanan
            Dapur Ayam.
          </p>
        </div>
        <div className="mt-10">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="border border-border bg-card rounded-lg px-5 mb-3 shadow-sm"
              >
                <AccordionTrigger className="text-left text-base font-medium text-foreground hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
