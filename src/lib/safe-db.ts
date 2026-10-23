/**
 * Safe DB query wrapper for Next.js Server Components.
 *
 * Why this exists:
 * - During `next build`, Next.js tries to statically prerender pages.
 * - If a page calls Prisma directly, the build will crash if DATABASE_URL is
 *   not set in the build environment (common on Vercel where DB env vars are
 *   only available at runtime, not build time).
 * - Solution: wrap DB calls with `safeQuery` so that during build (when DB
 *   is unavailable) we get a graceful fallback instead of a build error.
 *
 * At runtime in production, DB is available, so this passes through cleanly.
 *
 * Usage:
 *   const settings = await safeQuery(
 *     () => db.siteSettings.findUnique({ where: { id: "default" } }),
 *     null,
 *   );
 *
 *   const products = await safeQuery(
 *     () => db.product.findMany({ where: { isActive: true } }),
 *     [],
 *   );
 */
export async function safeQuery<T>(
  fn: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.warn(
      "[safeQuery] DB call failed. Using fallback. Error:",
      err instanceof Error ? err.message : err,
    );
    return fallback;
  }
}
