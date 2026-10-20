"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  /** Ordered list of photo URLs. First item is the main photo. */
  photos: string[];
  alt: string;
};

export function ProductGallery({ photos, alt }: Props) {
  // Active image is the first one by default; user can switch by clicking thumbnails.
  const [activeIdx, setActiveIdx] = useState(0);

  // Guard against empty array
  if (!photos.length) {
    return (
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-secondary">
        <div className="grid h-full w-full place-items-center text-muted-foreground">
          <Package className="h-16 w-16" />
        </div>
      </div>
    );
  }

  // Clamp activeIdx in case photos length changes
  const safeIdx = Math.min(activeIdx, photos.length - 1);
  const active = photos[safeIdx];
  const hasMultiple = photos.length > 1;

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-secondary">
        <img
          src={active}
          alt={alt}
          className="h-full w-full object-contain"
        />
      </div>

      {/* Thumbnails (only if more than 1 photo) */}
      {hasMultiple && (
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-5">
          {photos.map((url, idx) => (
            <button
              key={`${url}-${idx}`}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border bg-secondary transition-all",
                idx === safeIdx
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border hover:border-primary/40",
              )}
              aria-label={`Lihat foto ${idx + 1}`}
              aria-pressed={idx === safeIdx}
            >
              <img
                src={url}
                alt={`${alt} — foto ${idx + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
