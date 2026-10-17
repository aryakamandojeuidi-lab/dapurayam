/**
 * Generates a unique, human-readable order number.
 * Format: ORD-YYYYMMDD-XXXX  (where XXXX is a 4-char base36 suffix)
 */
export function generateOrderNumber(): string {
  const now = new Date();
  const ymd = now.toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ORD-${ymd}-${suffix}`;
}
