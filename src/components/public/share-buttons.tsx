"use client";

import { useState } from "react";
import { MessageCircle, Facebook, Twitter, Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  title: string;
  url: string;
  whatsappNumber: string;
};

export function ShareButtons({ title, url, whatsappNumber }: Props) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-foreground">Bagikan:</span>
        {whatsappNumber ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild variant="outline" size="sm" className="gap-1.5">
                <a
                  href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Bagikan ke WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bagikan ke WhatsApp</TooltipContent>
          </Tooltip>
        ) : null}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Bagikan ke Facebook"
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Bagikan ke Facebook</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Bagikan ke Twitter / X"
              >
                <Twitter className="h-4 w-4" />
                Twitter
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Bagikan ke Twitter / X</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={handleCopy}
              aria-label="Salin tautan"
            >
              {copied ? (
                <Check className="h-4 w-4 text-primary" />
              ) : (
                <Link2 className="h-4 w-4" />
              )}
              {copied ? "Tersalin" : "Salin"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Salin tautan artikel</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
