import Link from "next/link";
import { Wand2, Star, Truck } from "lucide-react";
import {
  primaryImage,
  toNumberPrice,
  type NxProduct,
} from "@/src/types/nexora.types";
import { formatUSD } from "./data";
import WishlistButton from "./WishlistButton";
import SmartImage from "./SmartImage";

const FALLBACK_IMG = "/imges/nexora-img-2.jpg";

/* ---------------------------------------------
   BADGE PICKER
--------------------------------------------- */
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

/* ---------------------------------------------
   PREMIUM DESCRIPTION GENERATOR
   (Dami, professional, product‑specific)
--------------------------------------------- */
function getProDescription(p: NxProduct): string {
  const name = p.name?.toLowerCase() || "";
  const cat = p.category?.name?.toLowerCase() || "";
  const brand = p.brand?.name?.toLowerCase() || "";

  // If seller already added a good description
  if (p.shortDesc && p.shortDesc.length > 40) return p.shortDesc;

  // Electronics — laptops, macbooks, ultrabooks
  if (cat.includes("laptop") || name.includes("macbook") || name.includes("notebook")) {
    return "A high‑performance machine crafted for creators and professionals who demand speed, clarity, and all‑day reliability.";
  }

  // Audio — headphones, earbuds, speakers
  if (cat.includes("audio") || name.includes("headphone") || name.includes("earbud") || name.includes("speaker")) {
    return "Engineered for immersive clarity and deep, balanced sound—perfect for music lovers, travelers, and focused work.";
  }

  // Smartphones — iPhone, Galaxy, Pixel
  if (cat.includes("smartphone") || name.includes("iphone") || name.includes("galaxy") || name.includes("pixel")) {
    return "A flagship‑grade smartphone delivering stunning visuals, advanced AI features, and seamless everyday performance.";
  }

  // Home appliances — Dyson, vacuum, kitchen
  if (cat.includes("home") || name.includes("vacuum") || brand.includes("dyson")) {
    return "A modern home essential built for powerful performance, effortless usability, and long‑lasting durability.";
  }

  // Fashion — clothing, shoes, bags
  if (cat.includes("fashion") || cat.includes("clothing") || cat.includes("shoe") || cat.includes("bag")) {
    return "A refined, modern essential crafted with premium materials for comfort, confidence, and everyday style.";
  }

  // Beauty — skincare, makeup, haircare
  if (cat.includes("beauty") || cat.includes("skincare") || cat.includes("makeup")) {
    return "A premium formula designed to elevate your daily routine with visible, long‑lasting results.";
  }

  // Toys & Kids
  if (cat.includes("toy") || cat.includes("kids")) {
    return "A fun, safe, and engaging essential designed to spark creativity and joyful play.";
  }

  // Sports & Fitness
  if (cat.includes("fitness") || cat.includes("sport")) {
    return "A performance‑driven essential built for durability, comfort, and everyday training.";
  }

  // Generic fallback
  return "A thoughtfully crafted essential blending modern design with reliable performance for everyday use.";
}

interface Props {
  product: NxProduct;
  priority?: boolean;
}

/* ---------------------------------------------
   PRODUCT CARD COMPONENT
--------------------------------------------- */
export default function ProductCard({ product: p, priority }: Props) {
  const img = primaryImage(p) ?? FALLBACK_IMG;
  const badge = pickBadge(p);
  const price = toNumberPrice(p.price);
  const old = toNumberPrice(p.compareAtPrice);
  const onSale = old > 0 && old > price;
  const discountPct = onSale ? Math.round(((old - price) / old) * 100) : 0;
  const rating = Number(p.avgRating ?? 0) || 0;
  const reviewCount = Number(p.reviewCount ?? 0) || 0;
  const sold = Number(p.soldCount ?? 0) || 0;
  const lowStock =
    p.trackInventory && !p.allowBackorder && p.stock > 0 && p.stock <= 5;

  return (
    <article className="nx-card group relative flex flex-col overflow-hidden p-3 transition-shadow hover:shadow-lg">
      <WishlistButton product={p} />

      {/* IMAGE */}
      <Link
        href={`/shop/${p.slug}`}
        aria-label={`View ${p.name}`}
        className="relative block aspect-square w-full overflow-hidden rounded-2xl bg-linear-to-br from-[#EFE9E3] via-[#F9F8F6] to-[#85C79A]/15 dark:from-[#281C59] dark:via-[#1c1c20] dark:to-[#4E8D9C]/15"
      >
        <SmartImage
          src={img}
          alt={p.images?.[0]?.alt ?? p.name}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />

        {/* BADGES */}
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

        {onSale && (
          <span className="absolute right-3 top-3 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg">
            -{discountPct}%
          </span>
        )}

        {p.stock <= 0 && (
          <span className="absolute bottom-3 left-3 rounded-full bg-[#281C59]/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
            Sold out
          </span>
        )}

        {lowStock && (
          <span className="absolute bottom-3 left-3 rounded-full bg-orange-500/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
            Only {p.stock} left
          </span>
        )}
      </Link>

      {/* CONTENT */}
      <div className="mt-3 flex flex-1 flex-col">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {p.brand?.name ?? p.category?.name ?? "Tech"}
        </p>

        <Link
          href={`/shop/${p.slug}`}
          className="mt-1 line-clamp-2 min-h-10 text-sm font-semibold leading-tight tracking-tight text-foreground hover:text-[#4E8D9C]"
        >
          {p.name}
        </Link>

        {/* RATING */}
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          {rating > 0 ? (
            <>
              <div className="flex items-center gap-0.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    className={[
                      "h-3.5 w-3.5",
                      i < Math.round(rating)
                        ? "fill-[#F9B900] text-[#F9B900]"
                        : "text-foreground/20",
                    ].join(" ")}
                  />
                ))}
              </div>
              <span className="font-semibold tabular-nums text-foreground">
                {rating.toFixed(1)}
              </span>
              {reviewCount > 0 && (
                <span className="text-muted-foreground">
                  ({reviewCount.toLocaleString()})
                </span>
              )}
            </>
          ) : (
            <span className="text-[11px] text-muted-foreground">No reviews yet</span>
          )}
        </div>

        {/* PREMIUM DESCRIPTION */}
        <p className="mt-1 line-clamp-2 min-h-[2.7em] text-xs text-muted-foreground">
          {getProDescription(p)}
        </p>

        {/* PRICE */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-semibold tracking-tight">
            {formatUSD(price)}
          </span>
          {onSale && (
            <span className="text-xs text-muted-foreground line-through">
              {formatUSD(old)}
            </span>
          )}
          {onSale && (
            <span className="text-[10px] font-bold uppercase tracking-wide text-red-500">
              Save {formatUSD(old - price)}
            </span>
          )}
        </div>

        {/* TRUST STRIP */}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
          {sold > 0 && (
            <span className="font-medium">
              {sold >= 1000
                ? `${(sold / 1000).toFixed(1).replace(/\.0$/, "")}k+ sold`
                : `${sold} sold`}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Truck className="h-3 w-3" />
            Free shipping
          </span>
        </div>

        {/* CTA */}
        <Link
          href={`/shop/${p.slug}`}
          className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-full bg-[#281C59] text-xs font-semibold text-[#F9F8F6] transition-all hover:-translate-y-0.5 hover:bg-black dark:bg-[#F9F8F6] dark:text-[#281C59] dark:hover:bg-white"
        >
          View product
        </Link>
      </div>
    </article>
  );
}
