import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Wand2, Star } from "lucide-react";
import {
  primaryImage,
  toNumberPrice,
  type NxProduct,
} from "@/src/types/nexora.types";
import { formatUSD } from "./data";
import WishlistButton from "./WishlistButton";

const FALLBACK_IMG = "/imges/nexora-img-2.jpg";

const pickBadge = (
  p: NxProduct,
): { label: string; cls: string; icon?: boolean } | null => {
  if (p.isOnSale) {
    return {
      label: "Sale",
      cls: "bg-[#F9FF56] text-[#281C59] shadow-[0_0_20px_rgba(249,255,86,0.45)]",
    };
  }
  if (p.isNewArrival) return { label: "New", cls: "bg-[#4E8D9C] text-white" };
  if (p.isFeatured)
    return { label: "AI pick", cls: "bg-[#F9FF56] text-[#281C59]", icon: true };
  if (p.isBestseller)
    return { label: "Bestseller", cls: "bg-[#281C59] text-[#F9F8F6]" };
  return null;
};

interface Props {
  product: NxProduct;
  /** Optional priority hint for above-the-fold cards. */
  priority?: boolean;
}

export default function ProductCard({ product: p, priority }: Props) {
  const img = primaryImage(p) ?? FALLBACK_IMG;
  const badge = pickBadge(p);
  const price = toNumberPrice(p.price);
  const old = toNumberPrice(p.compareAtPrice);
  const rating = p.avgRating ?? 0;

  return (
    <article className="nx-card group relative flex flex-col overflow-hidden p-4">
      <WishlistButton product={p} />
      <Link
        href={`/shop/${p.slug}`}
        aria-label={`View ${p.name}`}
        className="relative block aspect-square w-full overflow-hidden rounded-2xl bg-linear-to-br from-[#EFE9E3] via-[#F9F8F6] to-[#85C79A]/15 dark:from-[#281C59] dark:via-[#1c1c20] dark:to-[#4E8D9C]/15"
      >
        <Image
          src={img}
          alt={p.images?.[0]?.alt ?? p.name}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
        {badge && (
          <span
            className={[
              "absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
              badge.cls,
            ].join(" ")}
          >
            {badge.icon && <Wand2 className="h-3 w-3" />}
            {badge.label}
          </span>
        )}
        {p.stock <= 0 && (
          <span className="absolute bottom-3 left-3 rounded-full bg-[#281C59]/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
            Sold out
          </span>
        )}
      </Link>

      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {p.category?.name ?? p.brand?.name ?? "Tech"}
        </p>
        <Link
          href={`/shop/${p.slug}`}
          className="mt-1 line-clamp-1 text-base font-semibold tracking-tight text-foreground hover:text-[#4E8D9C]"
        >
          {p.name}
        </Link>
        {p.shortDesc && (
          <p className="mt-1 line-clamp-2 text-xs text-foreground/65">
            {p.shortDesc}
          </p>
        )}

        <div className="mt-4 flex items-end justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold tracking-tight">
              {formatUSD(price)}
            </span>
            {old > 0 && old > price && (
              <span className="text-xs text-muted-foreground line-through">
                {formatUSD(old)}
              </span>
            )}
          </div>
          {rating > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-[#4E8D9C] text-[#4E8D9C]" />
              {rating.toFixed(1)}
            </div>
          )}
        </div>

        <Link
          href={`/shop/${p.slug}`}
          className="mt-4 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-[#281C59] text-xs font-medium text-[#F9F8F6] transition-transform hover:-translate-y-0.5 hover:bg-black dark:bg-[#F9F8F6] dark:text-[#281C59] dark:hover:bg-white"
        >
          View product
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
