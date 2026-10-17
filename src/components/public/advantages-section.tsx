export function AdvantagesSection() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Premium Quality
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Mengapa Memilih Dapur Ayam
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Produk olahan ayam kelas atas yang dibuat dengan perhatian penuh pada
            kualitas bahan, resep, dan proses pengolahan — untuk Anda yang tidak
            mau berkompromi pada hidangan keluarga.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-y-10 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Fresh Made by Order
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Setiap produk dibuat setelah pesanan dikonfirmasi. Tidak ada stok
              yang mengendap — yang Anda terima adalah produk baru disiapkan.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Tanpa MSG &amp; Pengawet
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Rasa gurih alami dari bumbu dan bahan pilihan, bukan penambah rasa
              sintetis maupun bahan pengawet.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Bahan Pilihan
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Daging ayam pilihan dengan kualitas terjaga, dibumbui resep yang
              diracik dengan teliti.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Praktis &amp; Cepat
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Cukup masak sebentar di rumah, hasil hidangan setara kafe premium
              tanpa mengorbankan waktu.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
