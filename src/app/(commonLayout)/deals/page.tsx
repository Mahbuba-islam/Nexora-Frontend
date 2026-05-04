import Link from "next/link";
import {
  ArrowRight,
  BadgePercent,
  Clock,
  Flame,
  Gift,
  Sparkles,
  Tag,
  Timer,
  TrendingDown,
  Zap,
} from "lucide-react";

import { FEATURED_PRODUCTS, formatUSD } from "@/components/modules/Nexora/data";
import DealsCountdown from "@/components/modules/Nexora/DealsCountdown";

export const metadata = { title: "Deals · Nexora" };

const HERO_PILLS = [
  { icon: Flame, label: "Flash drops", tone: "from-rose-500 to-orange-400" },
  { icon: BadgePercent, label: "Up to 40% off", tone: "from-(--nx-ink) to-(--nx-blue-deep)" },
  { icon: Sparkles, label: "AI bundles", tone: "from-(--nx-blue-deep) to-(--nx-cyan)" },
];

// Build deal cards from featured products with synthetic price drops
const DEALS = FEATURED_PRODUCTS.map((p, i) => ({
  ...p,
  oldPrice:
    p.oldPrice ?? Math.round((p.price / (1 - 0.18 + (i % 3) * 0.05)) * 100) / 100,
  stockBar: 30 + ((i * 17) % 65),
  perk: ["Free 24h shipping", "Member -10%", "Bundle save $80", "Gift wrap free"][
    i % 4
  ],
}));

const TIMED_LANES = [
  {
    title: "Lightning hour",
    icon: Zap,
    blurb: "Live for the next 60 minutes",
    accent: "from-amber-500 to-rose-500",
  },
  {
    title: "Member exclusives",
    icon: Gift,
    blurb: "Sign in to unlock",
    accent: "from-(--nx-ink) to-(--nx-blue-deep)",
  },
  {
    title: "AI bundles",
    icon: Sparkles,
    blurb: "Save more when you pair them",
    accent: "from-(--nx-blue-deep) to-(--nx-cyan)",
  },
];

export default function DealsPage() {
  return (
    <div className="relative isolate overflow-hidden bg-background">
      {/* Ambient floating decor */}
      <div
        aria-hidden
        className="nx-orb nx-pulse-soft absolute -left-32 top-20 h-72 w-72 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(168,220,184,0.45) 0%, transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="nx-orb nx-pulse-soft absolute -right-32 top-60 h-80 w-80 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(111,182,204,0.45) 0%, transparent 65%)",
          animationDelay: "-2s",
        }}
      />

      {/* Tiny floating glyphs */}
      <span
        aria-hidden
        className="nx-tiny-float pointer-events-none absolute left-[8%] top-32 hidden text-(--nx-blue-deep)/40 md:block"
      >
        <Tag className="h-6 w-6" />
      </span>
      <span
        aria-hidden
        className="nx-tiny-float nx-tiny-float--slow pointer-events-none absolute right-[12%] top-48 hidden text-rose-400/50 md:block"
      >
        <BadgePercent className="h-7 w-7" />
      </span>
      <span
        aria-hidden
        className="nx-tiny-float nx-tiny-float--fast pointer-events-none absolute left-[18%] top-72 hidden text-amber-400/60 md:block"
      >
        <Sparkles className="h-5 w-5" />
      </span>
      <span
        aria-hidden
        className="nx-tiny-float pointer-events-none absolute right-[8%] top-80 hidden text-(--nx-cyan) md:block"
      >
        <TrendingDown className="h-5 w-5" />
      </span>

      {/* HERO */}
      <section className="relative mx-auto max-w-7xl px-4 pb-12 pt-12 md:px-8 md:pb-16 md:pt-16">
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-linear-to-br from-(--nx-ink) via-(--nx-blue-deep) to-(--nx-blue) p-8 text-white shadow-[0_30px_80px_-30px_rgba(40,28,89,0.6)] md:p-14">
          {/* shimmer grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              maskImage:
                "radial-gradient(ellipse at center, black 30%, transparent 70%)",
            }}
          />

          {/* floating sparkle ring */}
          <div
            aria-hidden
            className="nx-spin-slow pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/15"
          />
          <div
            aria-hidden
            className="nx-spin-slow pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full border border-white/10"
            style={{ animationDuration: "32s", animationDirection: "reverse" }}
          />

          <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur">
                <Flame className="h-3.5 w-3.5 text-amber-300" />
                Live deals · refreshed every minute
              </div>

              <h1 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-tight md:text-6xl">
                The best drops on Nexora.
                <br />
                <span className="bg-linear-to-r from-amber-200 via-(--nx-cyan) to-white bg-clip-text text-transparent">
                  Curated. Limited. Worth it.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm text-white/75 md:text-base">
                Flash drops, member-only pricing, AI-bundled multi-product savings —
                all in one premium feed. Move fast: stock and timers are real.
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {HERO_PILLS.map((p) => {
                  const I = p.icon;
                  return (
                    <span
                      key={p.label}
                      className={`inline-flex items-center gap-1.5 rounded-full bg-linear-to-br ${p.tone} px-3 py-1.5 text-[11px] font-semibold shadow-sm`}
                    >
                      <I className="h-3.5 w-3.5" />
                      {p.label}
                    </span>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="#deals"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-(--nx-ink) shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  Shop the drops
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/shop?sort=newest"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-white/30 bg-white/5 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Browse the full shop
                </Link>
              </div>
            </div>

            {/* Live countdown card */}
            <div className="relative">
              <div className="nx-tiny-float nx-tiny-float--slow rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">
                  <Timer className="h-3.5 w-3.5 text-amber-300" />
                  Ends in
                </div>
                <DealsCountdown />
                <p className="mt-3 text-xs text-white/70">
                  Hourly drops cycle automatically. Refresh to see what just landed.
                </p>
              </div>

              {/* floating chips */}
              <span className="nx-tiny-float absolute -left-3 -top-3 hidden rounded-2xl border border-white/30 bg-white/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur md:inline-flex">
                <Clock className="mr-1 h-3 w-3" /> 60 min flash
              </span>
              <span className="nx-tiny-float nx-tiny-float--fast absolute -bottom-3 -right-3 hidden rounded-2xl border border-white/30 bg-white/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur md:inline-flex">
                <BadgePercent className="mr-1 h-3 w-3" /> -40% live
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Lanes */}
      <section className="mx-auto max-w-7xl px-4 pb-10 md:px-8">
        <div className="grid gap-3 sm:grid-cols-3">
          {TIMED_LANES.map((l) => {
            const I = l.icon;
            return (
              <div
                key={l.title}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div
                  className={`grid h-10 w-10 place-items-center rounded-2xl bg-linear-to-br ${l.accent} text-white shadow-sm`}
                >
                  <I className="h-4 w-4" />
                </div>
                <p className="mt-3 text-base font-semibold tracking-tight">
                  {l.title}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {l.blurb}
                </p>
                <span
                  aria-hidden
                  className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-linear-to-br ${l.accent} opacity-15 blur-2xl transition-opacity group-hover:opacity-30`}
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* Deal grid */}
      <section
        id="deals"
        className="mx-auto max-w-7xl px-4 pb-20 md:px-8 md:pb-28"
      >
        <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--nx-blue-deep) dark:text-(--nx-cyan)">
              Now live
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
              Hand-picked deals
            </h2>
          </div>
          <Link
            href="/shop?sort=newest"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-(--nx-blue-deep)"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEALS.map((d) => {
            const pct = Math.round(((d.oldPrice - d.price) / d.oldPrice) * 100);
            return (
              <article
                key={d.id}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(40,28,89,0.35)]"
              >
                <div className="relative aspect-4/3 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={d.image}
                    alt={d.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-linear-to-r from-rose-500 to-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                    <BadgePercent className="h-3 w-3" /> -{pct}%
                  </span>
                  {d.badge && (
                    <span className="absolute right-3 top-3 rounded-full bg-(--nx-ink)/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                      {d.badge}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {d.category}
                  </p>
                  <h3 className="mt-1 text-base font-semibold tracking-tight">
                    {d.name}
                  </h3>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                    {d.tagline}
                  </p>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-lg font-semibold tracking-tight text-(--nx-blue-deep) dark:text-(--nx-cyan)">
                      {formatUSD(d.price)}
                    </span>
                    <span className="text-xs text-muted-foreground line-through">
                      {formatUSD(d.oldPrice)}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <span>Stock</span>
                      <span className="text-rose-500">
                        {Math.max(2, 100 - d.stockBar)}% claimed
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-amber-500 to-rose-500"
                        style={{ width: `${100 - d.stockBar}%` }}
                      />
                    </div>
                  </div>

                  <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Sparkles className="h-3 w-3 text-(--nx-blue-deep)" />
                    {d.perk}
                  </p>

                  <Link
                    href={`/shop?q=${encodeURIComponent(d.name)}`}
                    className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-(--nx-ink) text-sm font-semibold text-white transition-colors hover:bg-(--nx-blue-deep)"
                  >
                    Grab the deal
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
