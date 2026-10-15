"use client";

import { useEffect, useState } from "react";
import { List } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TocItem } from "@/lib/markdown";

type Props = {
  items: TocItem[];
  className?: string;
};

export function TableOfContents({ items, className }: Props) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!items.length) return;
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <nav
      className={cn(
        "rounded-xl border border-border bg-secondary/30 p-4 md:p-5",
        className,
      )}
      aria-label="Daftar isi"
    >
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
        <List className="h-4 w-4 text-primary" />
        Daftar Isi
      </div>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn(
              "text-sm leading-snug",
              item.level === 3 && "ml-4",
            )}
          >
            <a
              href={`#${item.id}`}
              className={cn(
                "block rounded px-2 py-1 transition-colors",
                activeId === item.id
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary",
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
