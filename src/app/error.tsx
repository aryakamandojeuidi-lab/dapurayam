"use client";

/**
 * Global error boundary.
 *
 * Triggered when any server component throws during render. Without this,
 * Vercel shows a generic "Application error: a server-side exception has
 * occurred" page that gives the user no clue what to do.
 *
 * This boundary catches the error and shows a friendly page with:
 * - A short headline (in Indonesian)
 * - The actual error message (in development only)
 * - A retry button + link to go home
 * - Setup hint if env vars (DATABASE_URL) might be missing
 */
import { useEffect } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to server logs so admins can see the actual cause
    console.error("[GlobalError] Uncaught error:", error);
  }, [error]);

  // Try to detect common setup-related errors so we can hint the owner
  const isDbEnvError =
    /DATABASE_URL|PrismaClientInitializationError|Environment variable not found/i.test(
      error.message || "",
    );
  const isAuthError = /NEXTAUTH_SECRET|NEXTAUTH_URL|missingSecret/i.test(
    error.message || "",
  );

  return (
    <html lang="id">
      <body
        style={{
          margin: 0,
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          background: "#fffdf5",
          color: "#3b2a1a",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <AlertCircle
          style={{
            width: 64,
            height: 64,
            color: "#c8102e",
            marginBottom: "1rem",
          }}
        />
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0 }}>
          Halaman tidak dapat dimuat
        </h1>
        <p
          style={{
            fontSize: "1rem",
            color: "#6b5544",
            marginTop: "0.75rem",
            maxWidth: "32rem",
            lineHeight: 1.6,
          }}
        >
          Terjadi kesalahan saat memuat halaman. Tim kami sudah diberi notifikasi
          otomatis. Silakan coba lagi atau hubungi admin.
        </p>

        {isDbEnvError && (
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem 1.25rem",
              borderRadius: "0.75rem",
              background: "#fff5e6",
              border: "1px solid #f5c518",
              maxWidth: "32rem",
              fontSize: "0.875rem",
              textAlign: "left",
              lineHeight: 1.6,
            }}
          >
            <strong>🔧 Petunjuk untuk Admin:</strong>
            <br />
            Error ini biasanya karena variabel environment <code>DATABASE_URL</code>{" "}
            belum di-set di Vercel. Buka Vercel → Settings → Environment Variables,
            tambahkan <code>DATABASE_URL</code> dengan connection string Neon
            Postgres Anda (tanpa <code>&amp;channel_binding=require</code>),
            lalu Redeploy.
          </div>
        )}

        {isAuthError && (
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem 1.25rem",
              borderRadius: "0.75rem",
              background: "#fff5e6",
              border: "1px solid #f5c518",
              maxWidth: "32rem",
              fontSize: "0.875rem",
              textAlign: "left",
              lineHeight: 1.6,
            }}
          >
            <strong>🔧 Petunjuk untuk Admin:</strong>
            <br />
            Variabel <code>NEXTAUTH_SECRET</code> atau <code>NEXTAUTH_URL</code>{" "}
            belum di-set di Vercel. Buka Vercel → Settings → Environment Variables
            dan set keduanya, lalu Redeploy.
          </div>
        )}

        {process.env.NODE_ENV === "development" && (
          <pre
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              background: "#1a1a1a",
              color: "#f5f5f5",
              borderRadius: "0.5rem",
              fontSize: "0.75rem",
              maxWidth: "40rem",
              overflow: "auto",
              textAlign: "left",
              maxHeight: "12rem",
            }}
          >
            {error.message}
            {error.digest ? `\n\nDigest: ${error.digest}` : ""}
          </pre>
        )}

        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button
            onClick={reset}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#c8102e",
              color: "#fff",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "9999px",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <RefreshCw style={{ width: 16, height: 16 }} />
            Coba Lagi
          </button>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "transparent",
              color: "#3b2a1a",
              border: "1px solid #e0d6c0",
              padding: "0.75rem 1.5rem",
              borderRadius: "9999px",
              fontSize: "0.875rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <Home style={{ width: 16, height: 16 }} />
            Ke Beranda
          </Link>
        </div>
      </body>
    </html>
  );
}
