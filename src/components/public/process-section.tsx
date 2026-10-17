export function ProcessSection() {
  return (
    <section className="bg-secondary/40 py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Proses Produksi
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Dibuat Setelah Pesanan — Tidak Diproduksi Massal
            </h2>
            <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Berbeda dari produk olahan massal yang ditaruh di rak berhari-hari,
                setiap produk Dapur Ayam dibuat setelah pesanan Anda diterima.
                Filosofi <strong className="text-foreground">fresh made by order</strong>{" "}
                ini memastikan yang Anda terima adalah produk yang baru saja
                disiapkan.
              </p>
              <p>
                Tanpa MSG, tanpa bahan pengawet, dan tanpa perisa sintetis — rasa
                gurih dan aroma khas murni berasal dari rempah pilihan dan kualitas
                daging ayam yang kami seleksi.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
            <h3 className="text-base font-semibold text-foreground">
              Komitmen Kami
            </h3>
            <ul className="mt-5 space-y-4">
              <li className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-semibold text-primary tabular-nums">
                  01
                </span>
                <div>
                  <p className="font-medium text-foreground">Fresh by Order</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Diproses setelah konfirmasi pesanan — tidak ada stok siap pakai.
                  </p>
                </div>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-semibold text-primary tabular-nums">
                  02
                </span>
                <div>
                  <p className="font-medium text-foreground">
                    Tanpa MSG &amp; Pengawet
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Bumbu dari rempah pilihan tanpa tambahan MSG atau bahan
                    pengawet sintetis.
                  </p>
                </div>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-semibold text-primary tabular-nums">
                  03
                </span>
                <div>
                  <p className="font-medium text-foreground">Pengolahan Terkontrol</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Perhatian pada waktu, suhu, dan konsistensi bumbu di setiap
                    batch.
                  </p>
                </div>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-semibold text-primary tabular-nums">
                  04
                </span>
                <div>
                  <p className="font-medium text-foreground">Kemasan Higienis</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Dikemas tertutup rapat untuk menjaga kualitas hingga tiba di
                    tangan Anda.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
