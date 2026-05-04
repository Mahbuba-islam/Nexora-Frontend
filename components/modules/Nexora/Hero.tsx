import Link from "next/link";
import { ArrowRight, ShoppingBag, Wand2 } from "lucide-react";
import HeroMedia from "./HeroMedia";

/**
 * Nexora Hero — Apple-class typographic hero, Nike-class energy.
 * Server component (no client interaction needed).
 */
export default function Hero() {
  return (
    <section className="relative isolate min-h-[60vh] overflow-hidden bg-[#F9F8F6] text-[#18181B] dark:bg-[#18181B] dark:text-[#F9F8F6] lg:min-h-[60vh]">
      {/* Background orbs */}
      <div
        aria-hidden
        className="nx-orb absolute -left-24 top-10 h-105 w-105 rounded-full"
        style={{ background: "radial-gradient(circle, #4E8D9C 0%, transparent 65%)" }}
      />
      <div
        aria-hidden
        className="nx-orb absolute -right-32 top-40 h-130 w-130 rounded-full"
        style={{
          background: "radial-gradient(circle, #85C79A 0%, transparent 65%)",
          animationDelay: "-6s",
        }}
      />
      {/* Subtle grid */}
      <div aria-hidden className="nx-grid-bg absolute inset-0 opacity-60" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 pb-12 pt-6 md:px-8 md:pb-16 md:pt-10 lg:grid-cols-12 lg:gap-14 lg:pb-20 lg:pt-14">
        {/* Copy */}
        <div className="lg:col-span-6">
          <div className="nx-rise inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1.5 text-[12px] font-medium text-muted-foreground backdrop-blur">
            <ShoppingBag className="h-3.5 w-3.5 text-[#4E8D9C]" />
            New · Fashion, beauty, home & tech — all in one feed
          </div>

          <h1 className="nx-rise nx-rise-delay-1 mt-6 text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl lg:text-[88px]">
            Everything you love.
            <br />
            <span className="nx-shimmer-text">Curated by you.</span>
          </h1>

          <p className="nx-rise nx-rise-delay-2 mt-6 max-w-xl text-base text-foreground/70 md:text-lg">
            From wardrobe staples to smart speakers, Nexora’s AI surfaces the
            shops, brands, and pieces that match your taste — across fashion,
            beauty, home, and tech.
          </p>

          <div className="nx-rise nx-rise-delay-3 mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/shop"
              className="nx-btn-primary inline-flex h-12 items-center gap-2 px-7 text-sm font-medium"
            >
              Shop the latest
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#ai"
              className="nx-btn-ghost inline-flex h-12 items-center gap-2 px-6 text-sm font-medium"
            >
              <Wand2 className="h-4 w-4 text-[#4E8D9C]" />
              Try Nexora AI
            </Link>
          </div>

          {/* Stat strip */}
          <dl className="nx-rise nx-rise-delay-4 mt-12 grid max-w-lg grid-cols-3 gap-6 text-left">
            {[
              { v: "5", l: "Curated shops" },
              { v: "4", l: "Categories" },
              { v: "24h", l: "Express delivery" },
            ].map((s) => (
              <div key={s.l}>
                <dt className="text-2xl font-semibold tracking-tight md:text-3xl">{s.v}</dt>
                <dd className="mt-1 text-[12px] uppercase tracking-wider text-muted-foreground">
                  {s.l}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Hero visual */}
        <div className="relative lg:col-span-6">
          <div className="relative mx-auto aspect-4/5 w-full max-w-140 overflow-hidden rounded-[2rem] border border-border bg-linear-to-br from-[#EFE9E3] via-[#F9F8F6] to-[#85C79A]/30 dark:from-[#281C59] dark:via-[#1c1c20] dark:to-[#4E8D9C]/30">
            <HeroMedia
              poster="https://images.unsplash.com/photo-1592890288564-76628a30a657?auto=format&fit=crop&w=1400&q=85"
              alt="Nexora Vision Pro headset in studio light"
            />
            {/* Floating spec card */}
            <div className="nx-rise nx-rise-delay-3 absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl border border-white/30 bg-white/70 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-black/40">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Featured · New season
                </p>
                <p className="mt-1 text-base font-semibold tracking-tight">
                  Shop the edit
                </p>
              </div>
              <Link
                href="/shop?sort=newest"
                className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#281C59] px-4 text-xs font-medium text-[#F9F8F6] transition-colors hover:bg-black dark:bg-[#F9F8F6] dark:text-[#281C59] dark:hover:bg-white"
              >
                Explore
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Floating chip */}
          <div className="nx-float nx-float--slow absolute -left-3 top-10 hidden rounded-2xl border border-border bg-background/80 px-3 py-2 text-xs font-medium shadow-xl backdrop-blur md:block">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            AI matched to your style
          </div>
          <div className="nx-float absolute -right-3 bottom-24 hidden rounded-2xl border border-border bg-background/80 px-3 py-2 text-xs font-medium shadow-xl backdrop-blur md:block">
            ⚡ Free 24h shipping
          </div>
        </div>
      </div>

      {/* Scroll-down hint */}
      <a
        href="#featured"
        aria-label="Scroll to featured products"
        className="nx-scroll-cue absolute bottom-4 left-1/2 z-10 -translate-x-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/80 text-foreground shadow-lg backdrop-blur transition-transform hover:translate-y-0.5 hover:bg-background"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </a>
    </section>
  );
}
