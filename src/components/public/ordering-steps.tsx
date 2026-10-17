const STEPS = [
  {
    title: "Pilih Produk",
    description:
      "Jelajahi katalog dan temukan olahan ayam yang sesuai selera Anda.",
  },
  {
    title: "Tambah ke Keranjang",
    description:
      "Tambahkan produk ke keranjang, atau langsung pesan via Shopee / WhatsApp.",
  },
  {
    title: "Checkout & Konfirmasi",
    description:
      "Isi data pemesanan. Admin akan menghubungi Anda untuk konfirmasi ketersediaan.",
  },
  {
    title: "Terima Produk Fresh",
    description:
      "Produk diproses fresh by order dan dikirim sesuai jadwal yang disepakati.",
  },
];

export function OrderingSteps() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Cara Memesan
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Empat Langkah Sederhana
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Pemesanan mudah melalui website, Shopee, atau WhatsApp. Produk dibuat
            fresh setelah konfirmasi pesanan diterima.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-y-10 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, idx) => (
            <div key={step.title} className="border-l-2 border-primary/30 pl-5">
              <p className="font-mono text-sm font-semibold text-primary tabular-nums">
                {String(idx + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 text-base font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
