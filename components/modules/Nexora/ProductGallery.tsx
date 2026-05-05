"use client";

import { useState } from "react";
import Image from "next/image";

import type { NxProduct } from "@/src/types/nexora.types";
import { cn } from "@/src/lib/utils";

interface Props {
  images: NxProduct["images"];
  fallback: string;
  name: string;
}

/**
 * Interactive product gallery used on `/shop/[slug]`.
 *
 * Behaviours:
 * - Clicking any thumbnail swaps the hero image.
 * - Keyboard support (Enter/Space activates the thumbnail).
 * - Falls back gracefully when a product has 0 or 1 images.
 */
export default function ProductGallery({ images, fallback, name }: Props) {
  const list = images && images.length > 0 ? images : [];
  const [activeIdx, setActiveIdx] = useState(0);

  const heroSrc = list[activeIdx]?.url ?? fallback;
  const heroAlt = list[activeIdx]?.alt ?? name;

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative aspect-square w-full overflow-hidden rounded-3xl bg-linear-to-br from-[#EFE9E3] via-[#F9F8F6] to-[#85C79A]/15 dark:from-[#281C59] dark:via-[#1c1c20] dark:to-[#4E8D9C]/15"
      >
        <Image
          key={heroSrc}
          src={heroSrc}
          alt={heroAlt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-opacity duration-300"
        />
        {list.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-background/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground/80 backdrop-blur">
            {activeIdx + 1} / {list.length}
          </span>
        )}
      </div>

      {list.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-5">
          {list.map((img, i) => {
            const active = i === activeIdx;
            return (
              <button
                type="button"
                key={img.id ?? `${img.url}-${i}`}
                onClick={() => setActiveIdx(i)}
                aria-label={`Show image ${i + 1} of ${list.length}`}
                aria-pressed={active}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-xl border bg-secondary transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "border-[#4E8D9C] ring-2 ring-[#4E8D9C]/40"
                    : "border-border hover:border-foreground/40",
                )}
              >
                <Image
                  src={img.url}
                  alt={img.alt ?? name}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
