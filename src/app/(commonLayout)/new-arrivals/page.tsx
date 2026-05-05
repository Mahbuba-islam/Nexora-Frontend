import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Wand2 } from "lucide-react";

import { getProducts } from "@/src/services/nexora.service";
import ProductCard from "@/components/modules/Nexora/ProductCard";
import { primaryImage, toNumberPrice } from "@/src/types/nexora.types";
import { formatUSD } from "@/components/modules/Nexora/data";

export const metadata = {
  title: "New arrivals · Nexora",
  description:
    "Just landed on Nexora — handpicked new tech, curated daily by the AI editor.",
};

export const dynamic = "force-dynamic";

export default async function NewArrivalsPage() {
  // Try the explicit "new arrivals" flag first; fall back to the freshest
  // products by createdAt so the page is never empty even on a sparse seed.
  const flagged = await getProducts({ isNewArrival: true, limit: 24 });
  const freshest =
    flagged.data.length >= 6
      ? flagged
      : await getProducts({ sortBy: "createdAt", sortOrder: "desc", limit: 24 });

  const products = freshest.data;
  const hero = products[0];
  const restRow = products.slice(1, 4);
  const grid = products.slice(4);
  const total = freshest.meta?.total ?? products.length;

  return (
    <div className="bg-background">
      {/* HERO */}
      <header className="relative isolate overflow-hidden border-b border-border bg-[#0B0B12] text-white">
        <Image
          src="/imges/nexora-img-1.jpg"
          alt="New arrivals on Nexora"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover opacity-30"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-br from-[#281C59]/90 via-[#0B0B12]/80 to-[#4E8D9C]/70" />

        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur">
            <Sparkles className="h-3 w-3 text-[#85C79A]" />
            Just landed · curated by Nexora AI
          </div>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
            New arrivals.
            <span className="block bg-linear-to-r from-[#85C79A] via-white to-[#4E8D9C] bg-clip-text text-transparent">
              Fresh tech, picked this week.
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/70 md:text-base">
            {total.toLocaleString()} brand-new products from the brands you trust — added in the last 30 days and ranked by what our buyers love most.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/shop?sort=newest"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#281C59] shadow-[0_10px_30px_-10px_rgba(255,255,255,0.5)] transition-transform hover:-translate-y-0.5"
            >
              Browse all newest
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/shop?sort=bestselling"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
            >
              <Wand2 className="h-4 w-4 text-[#85C79A]" />
              See bestsellers
            </Link>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      {products.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
          {/* Featured + 3 supporting */}
          {hero && (
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              <div className="col-span-12 lg:col-span-7">
                <ProductCard product={hero} priority />
              </div>
              <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1">
                {restRow.map((p, i) => (
                  <ProductCard key={p.id} product={p} priority={i < 2} />
                ))}
              </div>
            </section>
          )}

          {/* Editorial banner */}
          <section className="mt-14 overflow-hidden rounded-3xl border border-border bg-linear-to-br from-[#281C59] via-[#1B1844] to-[#4E8D9C] p-1">
            <div className="flex flex-col items-center justify-between gap-6 rounded-[22px] bg-[#0B0B12] px-6 py-8 text-white md:flex-row md:px-10">
              <div className="max-w-md">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">
                  Editor’s shortlist
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                  Why these made the cut
                </h3>
                <p className="mt-2 text-sm text-white/70">
                  Nexora AI ranks new arrivals by reviewer signal, build
                  quality, and match-to-buyer fit — so you spend less time
                  scrolling and more time shipping.
                </p>
              </div>
              <Link
                href="/ai"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[#85C79A] px-5 text-sm font-semibold text-[#0B0B12] transition-transform hover:-translate-y-0.5"
              >
                Ask Nexora AI
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* Grid */}
          {grid.length > 0 && (
            <section className="mt-14">
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                    Everything new
                  </h2>
                  <p className="text-xs text-muted-foreground md:text-sm">
                    Updated daily — refresh to see the latest drops.
                  </p>
                </div>
                <Link
                  href="/shop?sort=newest"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-[#4E8D9C]"
                >
                  See all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {grid.map((p, i) => (
                  <ProductCard key={p.id} product={p} priority={i < 4} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center md:px-8">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-foreground/60">
        <Sparkles className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-lg font-semibold tracking-tight">
        No new arrivals just yet
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Our editors are curating the next drop. Check back tomorrow, or
        explore the full catalog in the meantime.
      </p>
      <Link
        href="/shop"
        className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
      >
        Browse the catalog
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
