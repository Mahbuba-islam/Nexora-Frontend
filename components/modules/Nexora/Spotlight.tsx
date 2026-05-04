import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * Apple-style "Spotlight" stack: two oversized editorial tiles.
 */
export default function Spotlight() {
  return (
    <section className="relative bg-background py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 md:px-8 lg:grid-cols-2">
        {/* Tile 1 — dark, headline product */}
        <Link
          href="/shop/nx-aurora-laptop"
          className="group relative overflow-hidden rounded-3xl bg-[#242424] text-white"
        >
          <div className="relative aspect-4/5 w-full md:aspect-5/6">
            <Image
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1600&q=85"
              alt="Aurora 14 laptop on a dark surface"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-t from-[#242424] via-[#242424]/60 to-transparent"
            />
            <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-10">
              <div className="flex items-start justify-between">
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-wider backdrop-blur">
                  New silicon
                </span>
                <ArrowUpRight className="h-6 w-6 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">
                  Aurora 14
                </p>
                <h3 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
                  AI silicon.
                  <br />
                  All-day brilliance.
                </h3>
                <p className="mt-4 max-w-md text-sm text-white/75 md:text-base">
                  A featherweight chassis. A neural engine that anticipates
                  every keystroke. The new Aurora is here.
                </p>
              </div>
            </div>
          </div>
        </Link>

        {/* Tile 2 — light, AI angle */}
        <Link
          href="/ai"
          className="group relative overflow-hidden rounded-3xl bg-linear-to-br from-[#EFE9E3] via-[#F9F8F6] to-[#4BBFF9]/30 dark:from-[#1c1c20] dark:via-[#242424] dark:to-[#3B82F6]/30"
        >
          <div className="relative aspect-4/5 w-full md:aspect-5/6">
            <Image
              src="https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=1600&q=85"
              alt="Pulse Buds Ultra audio earbuds"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-t from-white/85 via-white/30 to-transparent dark:from-[#18181B]/85 dark:via-[#18181B]/30"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#3B82F6]">
                Nexora AI
              </p>
              <h3 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
                Sound that
                <br />
                tunes itself to you.
              </h3>
              <p className="mt-4 max-w-md text-sm text-foreground/75 md:text-base">
                Adaptive audio profiles, learned in real time. Compare any pair
                with our AI assistant and find your match in seconds.
              </p>
              <span className="mt-6 inline-flex h-11 w-fit items-center gap-2 rounded-full bg-[#242424] px-5 text-xs font-medium text-[#F9F8F6] transition-transform group-hover:translate-x-1 dark:bg-[#F9F8F6] dark:text-[#242424]">
                Discover audio
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
