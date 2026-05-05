"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, ShoppingBag, Sparkles } from "lucide-react";

import {
  getFrequentlyBoughtTogether,
  getPersonalizedRecommendations,
  type NxRecommendedProduct,
} from "@/src/services/marketplaceExtras.service";
import { formatUSD } from "@/components/modules/Nexora/data";

interface RecommendationCarouselProps {
  productId?: string;
  variant: "fbt" | "for-you";
  title?: string;
  subtitle?: string;
}

export default function RecommendationCarousel({
  productId,
  variant,
  title,
  subtitle,
}: RecommendationCarouselProps) {
  const [items, setItems] = useState<NxRecommendedProduct[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data =
        variant === "fbt" && productId
          ? await getFrequentlyBoughtTogether(productId, 6)
          : variant === "for-you"
            ? await getPersonalizedRecommendations(8)
            : [];
      if (!cancelled) setItems(data);
    })();
    return () => {
      cancelled = true;
    };
  }, [productId, variant]);

  if (items == null) {
    return (
      <section className="border-t border-border">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-10 text-sm text-muted-foreground md:px-8">
          <Loader2 className="h-4 w-4 animate-spin" />
          Building personalised picks…
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  const heading =
    title ??
    (variant === "fbt"
      ? "Frequently bought together"
      : "Recommended for you");
  const sub =
    subtitle ??
    (variant === "fbt"
      ? "Pair this with what other buyers chose."
      : "Curated by Nexora AI based on your activity.");

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-(--nx-blue-deep) dark:text-(--nx-cyan)">
              <Sparkles className="h-3 w-3" />
              {variant === "fbt" ? "Better together" : "For you"}
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
              {heading}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {items.slice(0, 8).map((p) => (
            <Link
              key={p.id}
              href={p.slug ? `/shop/${p.slug}` : `/shop?q=${encodeURIComponent(p.name)}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative aspect-square overflow-hidden bg-secondary">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-muted-foreground">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                )}
                {p.badge && (
                  <span className="absolute left-2 top-2 rounded-full bg-(--nx-ink) px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    {p.badge}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-3">
                {p.category && (
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {p.category}
                  </p>
                )}
                <p className="mt-0.5 line-clamp-2 text-sm font-semibold tracking-tight">
                  {p.name}
                </p>
                {/* Add 2-line description if available */}
                {p.shortDesc && (
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.shortDesc}</p>
                )}
                {/* Meta info row: rating, reviews, sold */}
                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
                  {typeof p.rating === "number" && p.rating > 0 && (
                    <span className="inline-flex items-center gap-0.5">
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" className="text-yellow-400"><polygon points="10,1.5 12.6,7.5 19,8 14,12.5 15.5,18.5 10,15.5 4.5,18.5 6,12.5 1,8 7.4,7.5"/></svg>
                      {p.rating.toFixed(1)}
                    </span>
                  )}
                  {typeof p.reviewCount === "number" && p.reviewCount > 0 && (
                    <span>({p.reviewCount} reviews)</span>
                  )}
                  {typeof p.soldCount === "number" && p.soldCount > 0 && (
                    <span>{p.soldCount} sold</span>
                  )}
                </div>
                <p className="mt-2 text-sm font-semibold text-(--nx-blue-deep) dark:text-(--nx-cyan)">
                  {formatUSD(p.price)}
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground transition-colors group-hover:text-foreground">
                  View
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
