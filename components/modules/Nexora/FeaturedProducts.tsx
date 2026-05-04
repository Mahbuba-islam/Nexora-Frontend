import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  primaryImage,
  toNumberPrice,
  type NxProduct,
} from "@/src/types/nexora.types";
import { getProducts } from "@/src/services/nexora.service";
import { formatUSD } from "./data";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80";

const ACCENTS = [
  "from-[#3B82F6]/15 via-[#4BBFF9]/10 to-transparent",
  "from-[#242424]/10 via-[#3B82F6]/10 to-transparent",
  "from-[#4BBFF9]/20 via-[#3B82F6]/10 to-transparent",
  "from-[#EFE9E3] via-[#F9F8F6] to-transparent",
  "from-[#3B82F6]/10 via-[#4BBFF9]/10 to-transparent",
  "from-[#242424]/15 via-[#3B82F6]/10 to-transparent",
];

const pickBadge = (
  p: NxProduct,
): { label: string; cls: string; icon?: boolean } | null => {
  if (p.isOnSale) {
    return {
      label: "Sale",
      cls: "bg-[#F9FF56] text-[#242424] shadow-[0_0_20px_rgba(249,255,86,0.45)]",
    };
  }
  if (p.isNewArrival) return { label: "New", cls: "bg-[#3B82F6] text-white" };
  if (p.isFeatured)
    return { label: "AI pick", cls: "bg-[#F9FF56] text-[#242424]", icon: true };
  if (p.isBestseller)
    return { label: "Bestseller", cls: "bg-[#242424] text-[#F9F8F6]" };
  return null;
};

export default async function FeaturedProducts() {
  // Server-side fetch — runs at request time on Vercel/Render edge.
  const res = await getProducts({
    limit: 6,
    sortBy: "soldCount",
    sortOrder: "desc",
  });
  const products = res.data;

  if (products.length === 0) {
    return null; // Don't render an empty section on hard backend outage.
  }

  return (
    <section id="featured" className="relative bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              Featured · Hand-picked by AI
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
              Today&rsquo;s edit.
              <span className="text-foreground/50"> Just for you.</span>
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden shrink-0 items-center gap-2 text-sm font-medium text-foreground/80 hover:text-foreground md:inline-flex"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => {
            const img = primaryImage(p) ?? FALLBACK_IMG;
            const accent = ACCENTS[i % ACCENTS.length];
            const badge = pickBadge(p);
            const price = toNumberPrice(p.price);
            const old = toNumberPrice(p.compareAtPrice);
            return (
              <article
                key={p.id}
                className={[
                  "nx-card group relative flex flex-col overflow-hidden p-5 md:p-6",
                  i === 0 ? "lg:col-span-2 lg:row-span-2" : "",
                ].join(" ")}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {p.category?.name ?? p.brand?.name ?? "Tech"}
                    </p>
                    <h3 className="mt-1.5 text-xl font-semibold tracking-tight md:text-2xl">
                      {p.name}
                    </h3>
                    {p.shortDesc && (
                      <p className="mt-1 line-clamp-2 text-sm text-foreground/70">
                        {p.shortDesc}
                      </p>
                    )}
                  </div>
                  {badge && (
                    <span
                      className={[
                        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
                        badge.cls,
                      ].join(" ")}
                    >
                      {badge.icon && <Sparkles className="h-3 w-3" />}
                      {badge.label}
                    </span>
                  )}
                </div>

                <Link
                  href={`/shop/${p.slug}`}
                  aria-label={`Shop ${p.name}`}
                  className={[
                    "relative mt-5 block w-full overflow-hidden rounded-2xl bg-linear-to-br",
                    accent,
                    i === 0 ? "aspect-16/11" : "aspect-4/3",
                  ].join(" ")}
                >
                  <Image
                    src={img}
                    alt={p.images?.[0]?.alt ?? p.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                </Link>

                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-semibold tracking-tight md:text-xl">
                      {formatUSD(price)}
                    </span>
                    {old > 0 && old > price && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatUSD(old)}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/shop/${p.slug}`}
                    className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#242424] px-4 text-xs font-medium text-[#F9F8F6] transition-transform hover:-translate-y-0.5 hover:bg-black dark:bg-[#F9F8F6] dark:text-[#242424] dark:hover:bg-white"
                  >
                    View
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center md:hidden">
          <Link
            href="/shop"
            className="nx-btn-ghost inline-flex h-11 items-center gap-2 px-6 text-sm font-medium"
          >
            View all products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
