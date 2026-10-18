import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";
import { db } from "@/lib/db";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Dapur Ayam — Olahan Ayam Premium Fresh by Order",
    template: "%s — Dapur Ayam",
  },
  description:
    "Dapur Ayam menghadirkan produk olahan ayam premium yang dibuat fresh by order — tanpa MSG, tanpa pengawet. Bahan pilihan, resep racikan, dan proses terkontrol untuk standar hidangan kelas atas.",
  keywords: [
    "dapur ayam",
    "nugget ayam premium",
    "ayam bumbu premium",
    "ayam ungkep",
    "chicken nugget",
    "fresh by order",
    "olahan ayam tanpa msg",
    "olahan ayam tanpa pengawet",
    "ayam siap masak premium",
  ],
  authors: [{ name: "Dapur Ayam" }],
  icons: {
    icon: [
      { url: "/logofav.jpg", sizes: "any" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: "/logofav.jpg",
    shortcut: "/logofav.jpg",
  },
  openGraph: {
    title: "Dapur Ayam — Olahan Ayam Premium Fresh by Order",
    description:
      "Produk olahan ayam premium yang dibuat fresh by order — tanpa MSG, tanpa pengawet. Bahan pilihan, resep racikan, dan proses terkontrol untuk Anda yang menuntut standar tinggi.",
    siteName: "Dapur Ayam",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dapur Ayam",
    description:
      "Olahan Ayam Premium Fresh by Order — tanpa MSG, tanpa pengawet, dibuat setelah pesanan dikonfirmasi.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await db.siteSettings.findUnique({
    where: { id: "default" },
  });
  const waNumber = settings?.whatsappNumber || "";

  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: settings?.businessName || "Dapur Ayam",
              description: settings?.description || "",
              url: process.env.NEXTAUTH_URL || "http://localhost:3000",
              ...(waNumber
                ? { contactPoint: [{ telephone: waNumber, contactType: "customer service" }] }
                : {}),
            }),
          }}
        />
      </body>
    </html>
  );
}
