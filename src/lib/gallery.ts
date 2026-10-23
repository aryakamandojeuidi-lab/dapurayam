/**
 * Helpers for working with the `galleryImages` field on Product.
 *
 * The field is stored as a JSON-encoded string (e.g. '["/uploads/a.jpg", "/uploads/b.jpg"]')
 * because SQLite + Prisma don't natively support array columns.
 *
 * These helpers parse the field safely (always returning `string[]`) and serialize
 * an array back to a JSON string for persistence.
 */

export function parseGalleryImages(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

export function serializeGalleryImages(images: string[]): string {
  // Filter empties + dedupe + cap at 8 photos
  const cleaned = Array.from(new Set(images.filter((s) => s && s.trim())));
  return JSON.stringify(cleaned.slice(0, 8));
}

/**
 * Returns all photos for a product: the main imageUrl first (if present),
 * followed by gallery images (excluding duplicates of the main image).
 */
export function getAllProductPhotos(
  imageUrl: string | null | undefined,
  galleryRaw: string | null | undefined,
): string[] {
  const main = imageUrl?.trim() || "";
  const gallery = parseGalleryImages(galleryRaw);
  const all: string[] = [];
  if (main) all.push(main);
  for (const g of gallery) {
    if (g && g !== main) all.push(g);
  }
  return all;
}
