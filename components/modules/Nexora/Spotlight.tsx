import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * Apple-style "Spotlight" stack: two oversized editorial tiles.
 */
export default function Spotlight() {
  return (
    <section className="relative bg-background py-12 md:py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 md:px-8 lg:grid-cols-2">
        {/* Tile 1 — dark, fashion editorial */}
        <Link
          href="/shop?category=fashion"
          className="group relative overflow-hidden rounded-3xl bg-[#281C59] text-white"
        >
          <div className="relative aspect-4/5 w-full md:aspect-5/6">
            <Image
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85"
              alt="Editorial fashion shot in moody studio light"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-t from-[#281C59] via-[#281C59]/60 to-transparent"
            />
            <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-10">
              <div className="flex items-start justify-between">
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-wider backdrop-blur">
                  New season
                </span>
                <ArrowUpRight className="h-6 w-6 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">
                  Fashion
                </p>
                <h3 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
                  Wardrobe staples.
                  <br />
                  Future heritage.
                </h3>
                <p className="mt-4 max-w-md text-sm text-white/75 md:text-base">
                  Curated drops from independent labels and storied houses
                  alike — styled for the way you actually dress.
                </p>
              </div>
            </div>
          </div>
        </Link>

        {/* Tile 2 — light, beauty editorial */}
        <Link
          href="/shop?category=beauty"
          className="group relative overflow-hidden rounded-3xl bg-linear-to-br from-[#EFE9E3] via-[#F9F8F6] to-[#F4C2D5]/40 dark:from-[#1c1c20] dark:via-[#281C59] dark:to-[#4E8D9C]/30"
        >
          <div className="relative aspect-4/5 w-full md:aspect-5/6">
            <Image
              src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1600&q=85"
              alt="Beauty product flat-lay with warm light"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-t from-white/85 via-white/30 to-transparent dark:from-[#18181B]/85 dark:via-[#18181B]/30"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#4E8D9C]">
                Beauty
              </p>
              <h3 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
                Skin, sound,
                <br />
                self — in tune.
              </h3>
              <p className="mt-4 max-w-md text-sm text-foreground/75 md:text-base">
                Clean formulations and cult-favorite tools. AI matches the
                routine to your skin in seconds.
              </p>
              <span className="mt-6 inline-flex h-11 w-fit items-center gap-2 rounded-full bg-[#281C59] px-5 text-xs font-medium text-[#F9F8F6] transition-transform group-hover:translate-x-1 dark:bg-[#F9F8F6] dark:text-[#281C59]">
                Discover beauty
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
