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
      "Pemesanan dilakukan melalui WhatsApp. Pilih produk yang Anda inginkan di halaman Produk, lalu tekan tombol \"Pesan via WhatsApp\". Anda akan diarahkan ke chat WhatsApp dengan pesan otomatis. Informasi lebih lengkap akan diberikan saat pemesanan via WhatsApp.",
  },
  {
    question: "Apakah produk selalu tersedia?",
    answer:
      "Ketersediaan produk dapat berubah-ubah tergantung stok dan permintaan. Untuk memastikan produk yang Anda inginkan tersedia, sebaiknya konfirmasi terlebih dahulu melalui WhatsApp sebelum membuat pesanan.",
  },
  {
    question: "Bagaimana cara penyimpanan produk?",
    answer:
      "Panduan penyimpanan umum: produk segar sebaiknya disimpan di kulkas dan dimasak dalam 2-3 hari, sedangkan produk beku disimpan di freezer. Informasi lebih lengkap mengenai penyimpanan setiap produk dapat ditanyakan saat pemesanan via WhatsApp.",
  },
  {
    question: "Apakah ada minimum order?",
    answer:
      "Informasi mengenai minimum order, harga, dan ketersediaan akan diberikan langsung oleh admin kami melalui WhatsApp. Silakan hubungi kami untuk pertanyaan spesifik.",
  },
  {
    question: "Apakah ada pengiriman?",
    answer:
      "Informasi mengenai pengiriman dan wilayah layanan akan diberikan saat pemesanan via WhatsApp. Hubungi kami untuk memastikan wilayah Anda terjangkau.",
  },
];

export function FaqSection() {
  return (
    <section className="bg-secondary/40 py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Pertanyaan Umum
          </h2>
          <p className="mt-4 text-muted-foreground">
            Beberapa hal yang sering ditanyakan tentang produk dan pemesanan Dapur Ayam.
          </p>
        </div>
        <div className="mt-10">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="border border-border bg-card rounded-lg px-4 mb-3 shadow-sm"
              >
                <AccordionTrigger className="text-left text-base font-medium text-foreground hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
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
