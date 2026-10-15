"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

export function ArticlePagination({ currentPage, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null;
  const prev = currentPage > 1 ? `${basePath}?page=${currentPage - 1}` : null;
  const next = currentPage < totalPages ? `${basePath}?page=${currentPage + 1}` : null;

  return (
    <div className="mt-10 flex items-center justify-center gap-4">
      <Button asChild variant="outline" size="sm" disabled={!prev} className="gap-1.5">
        {prev ? (
          <a href={prev} aria-label="Halaman sebelumnya">
            <ChevronLeft className="h-4 w-4" />
            Sebelumnya
          </a>
        ) : (
          <span>
            <ChevronLeft className="h-4 w-4" />
            Sebelumnya
          </span>
        )}
      </Button>
      <span className="text-sm text-muted-foreground">
        Halaman {currentPage} dari {totalPages}
      </span>
      <Button asChild variant="outline" size="sm" disabled={!next} className="gap-1.5">
        {next ? (
          <a href={next} aria-label="Halaman berikutnya">
            Berikutnya
            <ChevronRight className="h-4 w-4" />
          </a>
        ) : (
          <span>
            Berikutnya
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </Button>
    </div>
  );
}
