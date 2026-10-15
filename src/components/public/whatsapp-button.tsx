"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type Props = {
  number: string;
  message?: string;
  label?: string;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "secondary" | "outline";
};

export function WhatsAppButton({
  number,
  message = "",
  label = "Pesan via WhatsApp",
  className,
  size = "default",
  variant = "default",
}: Props) {
  const url = number
    ? buildWhatsAppUrl(number, message || "Halo Dapur Ayam, saya ingin bertanya mengenai produk yang tersedia.")
    : "";

  if (!url) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              disabled
              variant={variant}
              size={size}
              className={cn("gap-2", className)}
            >
              <MessageCircle className="h-4 w-4" />
              {label}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Nomor WhatsApp belum dikonfigurasi oleh admin.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button
      type="button"
      asChild
      variant={variant}
      size={size}
      className={cn("gap-2", className)}
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
      >
        <MessageCircle className="h-4 w-4" />
        {label}
      </a>
    </Button>
  );
}
