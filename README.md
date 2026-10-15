# Dapur Ayam — Website Resmi

Website produksi untuk **dapurayam.com**, bisnis yang menjual nugget ayam dan produk olahan ayam siap masak. Dibangun dengan Next.js 16 (App Router), TypeScript, Tailwind CSS 4 + shadcn/ui, Prisma 6 (SQLite), NextAuth.js v4, dan integrasi WhatsApp untuk pemesanan.

## Fitur Utama

- **Halaman Publik**
  - Beranda dengan hero, produk unggulan, keunggulan, proses, cara memesan, FAQ, dan CTA.
  - Katalog produk dengan pencarian dan filter kategori.
  - Detail produk dengan info lengkap, produk terkait, artikel terkait, dan tombol pesan WhatsApp.
  - Journal (artikel) dengan pencarian, filter kategori, paginasi, daftar isi otomatis, dan tombol bagikan.
  - Halaman Tentang Kami dan Kontak dengan form yang mengirim pesan via WhatsApp/email.
- **Panel Admin** (`/admin`)
  - Login aman dengan NextAuth.js (Credentials provider + bcrypt).
  - Dashboard dengan statistik produk dan artikel.
  - CRUD produk (dengan upload gambar, kategori, status aktif/unggulan).
  - CRUD kategori produk dan kategori artikel (dengan validasi referensi).
  - CRUD artikel dengan rich text editor (MDXEditor) dan scheduling.
  - Pengaturan situs (info bisnis, kontak, media sosial, hero, footer).
- **Integrasi WhatsApp**
  - Tombol "Pesan via WhatsApp" di seluruh produk dan halaman.
  - Pesan otomatis dengan template yang sudah disiapkan.
  - Form kontak yang mengirim pesan langsung ke WhatsApp admin (atau email).
- **SEO**
  - Metadata lengkap per halaman (OpenGraph, Twitter card, canonical).
  - Sitemap.xml dinamis.
  - Robots.txt yang mengizinkan indeks halaman publik dan memblokir `/admin` serta `/api`.
  - Structured data JSON-LD untuk Product dan BlogPosting.
- **Aksesibilitas & Responsif**
  - Mobile-first design dengan breakpoint Tailwind.
  - Semantic HTML, ARIA labels, keyboard navigation.
  - Footer sticky di bawah viewport.

## Tech Stack

| Lapis | Teknologi |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Bahasa | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Komponen UI | shadcn/ui (New York style) + Lucide icons |
| Database | Prisma 6 + SQLite (`file:./dev.db`) |
| Auth | NextAuth.js v4 (Credentials + JWT) |
| Form | react-hook-form + zod |
| Markdown | react-markdown (render), @mdxeditor/editor (admin) |
| Animasi | Framer Motion (jika diperlukan) |
| Hash Password | bcryptjs |

## Setup Lokal

### 1. Clone & Install Dependencies

```bash
bun install
```

### 2. Siapkan Environment Variables

Buat file `.env` di root:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="ganti-dengan-string-acak-min-32-karakter"
NEXTAUTH_URL="http://localhost:3000"
```

> Generate NEXTAUTH_SECRET: `openssl rand -base64 32`

### 3. Inisialisasi Database

```bash
bun run db:push      # Push schema ke SQLite
bun run db:seed      # Isi data awal (admin, kategori, produk, artikel, settings)
```

Seed akan membuat:
- 1 akun admin: `admin@dapurayam.com` / `dapurayam-admin-2026`
- 3 kategori produk + 4 produk unggulan
- 5 kategori artikel + 5 artikel draft
- 1 baris pengaturan situs

### 4. Jalankan Dev Server

```bash
bun run dev
```

Server tersedia di `http://localhost:3000`.

## Akun Admin Demo

Setelah seeding, Anda bisa login ke `/admin/login` dengan:

```
Email    : admin@dapurayam.com
Password : dapurayam-admin-2026
```

> **Penting**: Akun ini dibuat untuk keperluan demo/pengembangan. **Ganti kata sandi** sebelum deploy ke produksi (atau hapus seed dan buat admin baru via skrip terpisah).

## Struktur Proyek

```
src/
  app/
    layout.tsx                 # Root layout (fonts, providers)
    globals.css                # Brand colors (Dapur Ayam warm theme)
    page.tsx                   # Beranda
    produk/
      page.tsx                 # Katalog
      [slug]/page.tsx          # Detail produk
    journal/
      page.tsx                 # Daftar artikel
      [slug]/page.tsx          # Detail artikel (markdown)
    tentang/page.tsx           # Tentang kami
    kontak/page.tsx            # Kontak + form
    admin/
      layout.tsx               # Layout admin (no auth gate)
      page.tsx                 # Redirect ke /admin/dashboard
      login/page.tsx           # Login (client)
      (authed)/
        layout.tsx             # Auth-gated layout (sidebar + header)
        dashboard/page.tsx    # Statistik
        produk/                # CRUD produk
        kategori/page.tsx      # CRUD kategori produk
        journal/               # CRUD artikel + kategori artikel
        pengaturan/page.tsx    # Pengaturan situs
    sitemap.ts                 # Sitemap dinamis
    robots.ts                  # Robots.txt
    api/
      auth/[...nextauth]/route.ts  # NextAuth handler
      upload/route.ts           # Upload gambar
  components/
    providers.tsx              # SessionProvider + ThemeProvider
    public/                    # Komponen publik (navbar, footer, hero, dll.)
    admin/                      # Komponen admin (sidebar, form, table, dll.)
    ui/                         # shadcn/ui (jangan diubah)
  lib/
    db.ts                       # Prisma client singleton
    auth.ts                     # NextAuth config + requireAdmin
    whatsapp.ts                 # WhatsApp URL/message builder
    prisma-helpers.ts           # slugify, JSON array helpers
    validations.ts              # Zod schemas
    markdown.ts                 # TOC generator + reading time
  actions/                      # Server Actions (produk, kategori, artikel, settings)
prisma/
  schema.prisma                 # Skema database
  seed.ts                       # Data awal
public/
  uploads/                      # Upload gambar
  logo.svg
README.md
```

## Fitur Admin

### Produk
- Tabel produk dengan thumbnail, kategori, harga, status aktif (switch), aksi edit/hapus.
- Form produk lengkap: nama, slug (auto), deskripsi, harga (opsional), kemasan, kategori, gambar (upload), komposisi, penyimpanan, saran sajian, status, unggulan, urutan unggulan.
- Hapus dengan dialog konfirmasi.
- Toggle aktif/nonaktif langsung dari tabel.

### Kategori
- Tabel kategori produk + kategori artikel (tab terpisah di Journal).
- Tambah/edit/hapus dengan validasi referensi (tidak bisa hapus jika masih digunakan produk/artikel).

### Journal
- Tabel artikel dengan cover, judul, kategori, status, penulis, tanggal publikasi.
- Status: Draft / Published / Scheduled / Archived.
- Toggle Publish/Archive dengan satu klik.
- Form artikel dengan rich text editor (MDXEditor) mendukung heading, bold/italic, link, image, list, quote, table, thematic break.
- Cover image upload, kategori, tags, SEO fields, featured flag.

### Pengaturan
- Form tunggal untuk semua SiteSettings (info bisnis, kontak, media sosial, hero, footer).
- Perubahan langsung direvalidate di seluruh halaman publik.

## Konfigurasi WhatsApp

1. Login ke admin → **Pengaturan**.
2. Isi **Nomor WhatsApp** dengan format `62xxx` (internasional) atau `08xxx` (lokal). Sistem akan menormalkan otomatis.
3. Simpan. Tombol "Pesan via WhatsApp" di seluruh halaman publik akan aktif.

Jika nomor kosong, tombol dinonaktifkan dengan tooltip "Nomor WhatsApp belum dikonfigurasi oleh admin."

## Deployment

### Vercel (Direkomendasikan)

1. Push repo ke GitHub.
2. Import ke Vercel.
3. Tambahkan environment variables:
   - `DATABASE_URL` — gunakan Neon PostgreSQL untuk produksi (ubah `provider` di `schema.prisma` dari `sqlite` ke `postgresql` dan jalankan `bun run db:push` ulang).
   - `NEXTAUTH_SECRET` — generate string acak baru.
   - `NEXTAUTH_URL` — URL produksi (mis. `https://dapurayam.com`).
4. Vercel akan otomatis mendeteksi Next.js dan menjalankan build.

> **Catatan Produksi**: Untuk produksi, sebaiknya ganti SQLite dengan PostgreSQL (Neon, Supabase, atau database PostgreSQL pilihan Anda) agar mendukung koneksi serverless dan skalabilitas. Jangan lupa ubah `provider` di `prisma/schema.prisma` dan jalankan ulang `db:push` setelah mengganti.

### Build Manual

```bash
bun run build
bun run start
```

## Roadmap

- [ ] Sistem checkout dengan keranjang belanja
- [ ] Integrasi payment gateway (Midtrans, Xendit)
- [ ] Manajemen inventory & stok produk
- [ ] Dashboard analitik penjualan
- [ ] Email otomatis untuk order confirmation
- [ ] Multi-bahasa (Indonesia/Inggris)
- [ ] PWA / offline support

## Lisensi

© 2026 Dapur Ayam. Semua hak cipta dilindungi.
