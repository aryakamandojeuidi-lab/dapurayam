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
    default: "Dapur Ayam — Nugget Ayam Praktis untuk Momen Makan Bersama",
    template: "%s — Dapur Ayam",
  },
  description:
    "Dapur Ayam menghadirkan produk olahan ayam berkualitas yang praktis untuk dinikmati kapan saja. Nugget, ayam bumbu, dan ayam ungkep siap masak untuk keluarga Anda.",
  keywords: [
    "dapur ayam",
    "nugget ayam",
    "ayam bumbu",
    "ayam ungkep",
    "chicken nugget",
    "olahan ayam",
    "ayam siap masak",
  ],
  authors: [{ name: "Dapur Ayam" }],
  openGraph: {
    title: "Dapur Ayam — Nugget Ayam Praktis untuk Momen Makan Bersama",
    description:
      "Nikmati produk olahan ayam berkualitas yang siap diolah kapan saja. Praktis, lezat, dan dibuat dengan bahan pilihan.",
    siteName: "Dapur Ayam",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dapur Ayam",
    description:
      "Nugget Ayam Praktis untuk Momen Makan Bersama — produk olahan ayam berkualitas yang siap diolah.",
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
