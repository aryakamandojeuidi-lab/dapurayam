import { ChefHat } from "lucide-react";

export function ProcessSection() {
  return (
    <section className="bg-secondary/40 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background px-4 py-1.5 text-sm font-medium text-foreground">
              <ChefHat className="h-4 w-4 text-primary" />
              Proses Produksi
            </span>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Dibuat dengan Perhatian pada Detail
            </h2>
            <div className="mt-6 space-y-4 text-muted-foreground">
              <p>
                Setiap produk Dapur Ayam disusun dengan perhatian pada kualitas bahan dan kebersihan proses pengolahan. Kami percaya kualitas dimulai dari pemilihan bahan yang baik dan proses yang konsisten.
              </p>
              <p>
                Informasi lebih lengkap mengenai proses produksi, standar pengolahan, dan cara penyimpanan akan diperbarui oleh pemilik bisnis. Untuk pertanyaan spesifik, jangan ragu menghubungi kami via WhatsApp.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
            <h3 className="text-lg font-semibold text-foreground">
              Komitmen Kami
            </h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                <div>
                  <p className="font-medium text-foreground">Pemilihan Bahan</p>
                  <p className="text-sm text-muted-foreground">
                    Dibuat dengan bahan pilihan sesuai jenis produk.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                <div>
                  <p className="font-medium text-foreground">Pengolahan yang Diperhatikan</p>
                  <p className="text-sm text-muted-foreground">
                    Proses pengolahan dilakukan dengan memperhatikan kebersihan dan konsistensi.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                <div>
                  <p className="font-medium text-foreground">Kemasan yang Tertutup Rapat</p>
                  <p className="text-sm text-muted-foreground">
                    Produk dikemas agar tiba dalam kondisi baik di tangan Anda.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                <div>
                  <p className="font-medium text-foreground">Informasi Penyimpanan</p>
                  <p className="text-sm text-muted-foreground">
                    Panduan penyimpanan disertakan agar produk tetap berkualitas hingga dimasak.
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
