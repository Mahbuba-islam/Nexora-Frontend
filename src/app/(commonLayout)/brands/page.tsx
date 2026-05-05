import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  Compass,
  Crown,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
} from "lucide-react";

import {
  BRANDS,
  CATEGORIES,
  FEATURED_PRODUCTS,
} from "@/components/modules/Nexora/data";
import FollowButton from "@/components/modules/Nexora/FollowButton";

export const metadata = { title: "Brands · Nexora" };

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Synthesise stable, deterministic stats per brand for the directory cards
function brandMeta(name: string, idx: number) {
  const productsCount = 24 + ((name.length * 7 + idx * 11) % 220);
  const rating = (4.4 + (((idx * 13) % 6) / 10)).toFixed(1);
  const followers =
    name.length * 1200 + ((idx * 4321) % 8000) + 1500;
  const tier =
    idx % 5 === 0 ? "elite" : idx % 3 === 0 ? "verified" : "rising";
  return { productsCount, rating, followers, tier } as const;
}

const TIER_LABEL: Record<string, { label: string; tone: string; icon: typeof Crown }> = {
  elite: {
    label: "Elite partner",
    tone: "from-amber-400 to-rose-500 text-white",
    icon: Crown,
  },
  verified: {
    label: "Verified seller",
    tone: "from-(--nx-ink) to-(--nx-blue-deep) text-white",
    icon: BadgeCheck,
  },
  rising: {
    label: "Rising label",
    tone: "from-(--nx-blue-deep) to-(--nx-cyan) text-white",
    icon: Sparkles,
  },
};

const SPOTLIGHT = BRANDS.slice(0, 3).map((name, i) => ({
  name,
  meta: brandMeta(name, i),
  product: FEATURED_PRODUCTS[i % FEATURED_PRODUCTS.length],
}));

export default function BrandsPage() {
  return (
    <div className="relative isolate overflow-hidden bg-background">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="nx-pulse-soft absolute -left-32 top-10 h-72 w-72 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(111,182,204,0.45) 0%, transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="nx-pulse-soft absolute -right-32 top-72 h-80 w-80 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(168,220,184,0.4) 0%, transparent 65%)",
          animationDelay: "-2s",
        }}
      />

      {/* HERO */}
      <section className="relative mx-auto max-w-7xl px-4 pb-10 pt-12 md:px-8 md:pb-14 md:pt-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-(--nx-blue-deep) dark:text-(--nx-cyan)">
              <Store className="h-3.5 w-3.5" />
              Nexora · Brand directory
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              Every maker shaping{" "}
              <span className="bg-linear-to-r from-(--nx-ink) via-(--nx-blue-deep) to-(--nx-cyan) bg-clip-text text-transparent">
                modern tech.
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
              Browse verified sellers, independent labels, and limited collabs —
              all under one roof. Follow brands for restock alerts and AI-curated
              recommendations.
            </p>

            {/* search */}
            <form
              action="/shop"
              className="mt-6 flex max-w-xl items-center gap-2 rounded-full border border-border bg-card pl-4 pr-1.5 shadow-sm focus-within:border-(--nx-blue-deep)"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                name="q"
                placeholder="Search brands and products"
                className="h-11 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-(--nx-ink) px-4 text-xs font-semibold text-white hover:bg-(--nx-blue-deep)"
              >
                Search <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>

            {/* trust strip */}
            <div className="mt-6 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-medium">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                100% verified sellers
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-medium">
                <Bell className="h-3.5 w-3.5 text-(--nx-blue-deep) dark:text-(--nx-cyan)" />
                Restock alerts
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-medium">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                AI-curated picks
              </span>
            </div>
          </div>

          {/* hero brand mosaic */}
          <div className="relative">
            <div className="grid grid-cols-3 gap-3">
              {BRANDS.slice(0, 9).map((b, i) => {
                const palette = [
                  "from-(--nx-ink) to-(--nx-blue-deep)",
                  "from-(--nx-blue-deep) to-(--nx-cyan)",
                  "from-rose-500 to-amber-500",
                  "from-emerald-500 to-(--nx-cyan)",
                  "from-violet-500 to-(--nx-blue-deep)",
                  "from-(--nx-blue) to-(--nx-cyan)",
                  "from-amber-500 to-rose-500",
                  "from-(--nx-cyan) to-emerald-500",
                  "from-(--nx-blue-deep) to-violet-500",
                ];
                const grad = palette[i % palette.length];
                return (
                  <div
                    key={b}
                    className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-card transition-transform hover:-translate-y-0.5"
                  >
                    <div
                      className={`absolute inset-0 bg-linear-to-br ${grad} opacity-90`}
                    />
                    <div
                      aria-hidden
                      className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10 blur-2xl"
                    />
                    <div className="relative flex h-full flex-col p-3">
                      <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/70">
                        Brand
                      </span>
                      <div className="my-auto grid place-items-center">
                        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-2xl font-bold text-white shadow-inner backdrop-blur-sm sm:h-14 sm:w-14 sm:text-3xl">
                          {b[0]}
                        </span>
                      </div>
                      <p className="truncate text-sm font-semibold tracking-tight text-white">
                        {b}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <span className="nx-tiny-float absolute -left-3 -top-3 hidden rounded-full bg-(--nx-ink) px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow-lg md:inline-flex">
              {BRANDS.length}+ brands live
            </span>
            <span className="nx-tiny-float nx-tiny-float--fast absolute -bottom-3 -right-3 hidden rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-(--nx-ink) shadow-lg md:inline-flex">
              <Star className="mr-1 h-3 w-3 text-amber-500" /> 4.8 avg
            </span>
          </div>
        </div>
      </section>

      {/* SPOTLIGHT */}
      <section className="mx-auto max-w-7xl px-4 pb-12 md:px-8 md:pb-16">
        <header className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--nx-blue-deep) dark:text-(--nx-cyan)">
              Spotlight
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
              Featured this week
            </h2>
          </div>
        </header>
        <div className="grid gap-4 md:grid-cols-3">
          {SPOTLIGHT.map(({ name, meta, product }) => {
            const tier = TIER_LABEL[meta.tier];
            const TierIcon = tier.icon;
            return (
              <article
                key={name}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(40,28,89,0.4)]"
              >
                <div className="relative h-40 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full bg-linear-to-br ${tier.tone} px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-lg`}
                    >
                      <TierIcon className="h-3 w-3" />
                      {tier.label}
                    </span>
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-base font-semibold tracking-tight">
                    {name}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                    Featured drop · {product.name}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      {meta.rating}
                    </span>
                    <span>·</span>
                    <span>{meta.productsCount} products</span>
                    <span>·</span>
                    <span>
                      {(meta.followers / 1000).toFixed(1)}k followers
                    </span>
                  </div>
                  <Link
                    href={`/shop?q=${encodeURIComponent(name)}`}
                    className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-background px-4 text-xs font-semibold transition-colors hover:bg-secondary"
                  >
                    Visit storefront
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* DIRECTORY */}
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8 md:pb-28">
        <div className="grid gap-8 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-4 md:space-y-6 md:sticky md:top-24 md:self-start">
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <Compass className="h-3.5 w-3.5" />
                Categories
              </p>
              <ul className="mt-3 grid grid-cols-2 gap-1 text-sm md:grid-cols-1 md:space-y-1">
                {CATEGORIES.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/shop?category=${c.id}`}
                      className="flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors hover:bg-secondary"
                    >
                      <span className="truncate">{c.title}</span>
                      <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Filter A–Z
              </p>
              <div className="mt-3 grid grid-cols-9 gap-1 text-[11px] md:grid-cols-6">
                {ALPHABET.map((l) => {
                  const has = BRANDS.some((b) =>
                    b.toUpperCase().startsWith(l),
                  );
                  return (
                    <a
                      key={l}
                      href={has ? `#brand-${l}` : undefined}
                      className={`grid h-7 place-items-center rounded-md font-semibold transition-colors ${
                        has
                          ? "bg-secondary text-foreground hover:bg-(--nx-ink) hover:text-white"
                          : "cursor-not-allowed text-muted-foreground/40"
                      }`}
                    >
                      {l}
                    </a>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Brand grid */}
          <div>
            <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--nx-blue-deep) dark:text-(--nx-cyan)">
                  Directory
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
                  All brands
                </h2>
              </div>
              <p className="text-xs text-muted-foreground">
                {BRANDS.length} verified sellers · sorted by activity
              </p>
            </header>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {BRANDS.map((name, i) => {
                const meta = brandMeta(name, i);
                const tier = TIER_LABEL[meta.tier];
                const TierIcon = tier.icon;
                const letter = name[0].toUpperCase();
                return (
                  <article
                    key={name}
                    id={`brand-${letter}`}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-linear-to-br from-(--nx-blue) to-(--nx-cyan) opacity-10 blur-2xl transition-opacity group-hover:opacity-25"
                    />
                    <div className="flex items-start gap-3">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-(--nx-ink) to-(--nx-blue-deep) text-base font-semibold text-white shadow-sm">
                        {letter}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold tracking-tight">
                          {name}
                        </p>
                        <span
                          className={`mt-1 inline-flex items-center gap-1 rounded-full bg-linear-to-br ${tier.tone} px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider`}
                        >
                          <TierIcon className="h-2.5 w-2.5" />
                          {tier.label}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        {meta.rating}
                      </span>
                      <span>·</span>
                      <span>{meta.productsCount} items</span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <Link
                        href={`/shop?q=${encodeURIComponent(name)}`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-(--nx-blue-deep) hover:text-(--nx-ink) dark:text-(--nx-cyan)"
                      >
                        Visit
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                      <FollowButton slug={name} />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Become a seller CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-linear-to-br from-(--nx-ink) via-(--nx-blue-deep) to-(--nx-blue) p-8 text-white md:p-12">
          <div
            aria-hidden
            className="nx-spin-slow absolute -right-16 -top-16 h-60 w-60 rounded-full border border-white/15"
          />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
                For makers
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                Bring your brand to Nexora.
              </h3>
              <p className="mt-2 max-w-lg text-sm text-white/80">
                Apply for a verified storefront in minutes. Built-in payments,
                shipping, and AI-driven discovery — all under one roof.
              </p>
            </div>
            <Link
              href="/sell/start"
              className="inline-flex h-11 items-center gap-2 self-start rounded-full bg-white px-6 text-sm font-semibold text-(--nx-ink) shadow-lg transition-transform hover:-translate-y-0.5"
            >
              Become a seller
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
