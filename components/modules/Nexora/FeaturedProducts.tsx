import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { FEATURED_PRODUCTS, formatUSD, type NxProduct } from "./data";

const badgeStyles: Record<NonNullable<NxProduct["badge"]>, string> = {
  new: "bg-[#3B82F6] text-white",
  "ai-pick":
    "bg-[#F9FF56] text-[#242424] shadow-[0_0_20px_rgba(249,255,86,0.45)]",
  limited: "bg-[#242424] text-[#F9F8F6]",
};

export default function FeaturedProducts() {
  return (
    <section
      id="featured"
      className="relative bg-background py-20 md:py-28"
    >
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
          {FEATURED_PRODUCTS.map((p, i) => (
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
                    {p.category}
                  </p>
                  <h3 className="mt-1.5 text-xl font-semibold tracking-tight md:text-2xl">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-sm text-foreground/70">{p.tagline}</p>
                </div>
                {p.badge && (
                  <span
                    className={[
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
                      badgeStyles[p.badge],
                    ].join(" ")}
                  >
                    {p.badge === "ai-pick" && <Sparkles className="h-3 w-3" />}
                    {p.badge === "ai-pick" ? "AI pick" : p.badge}
                  </span>
                )}
              </div>

              <Link
                href={`/shop/${p.id}`}
                aria-label={`Shop ${p.name}`}
                className={[
                  "relative mt-5 block w-full overflow-hidden rounded-2xl bg-linear-to-br",
                  p.accent,
                  i === 0 ? "aspect-16/11" : "aspect-4/3",
                ].join(" ")}
              >
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
              </Link>

              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-semibold tracking-tight md:text-xl">
                    {formatUSD(p.price)}
                  </span>
                  {p.oldPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatUSD(p.oldPrice)}
                    </span>
                  )}
                </div>
                <Link
                  href={`/shop/${p.id}`}
                  className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#242424] px-4 text-xs font-medium text-[#F9F8F6] transition-transform hover:-translate-y-0.5 hover:bg-black dark:bg-[#F9F8F6] dark:text-[#242424] dark:hover:bg-white"
                >
                  Add to bag
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
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
