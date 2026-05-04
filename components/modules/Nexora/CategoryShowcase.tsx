import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "./data";

/**
 * Nike-style category showcase: oversized imagery + assertive type.
 */
export default function CategoryShowcase() {
  return (
    <section className="relative bg-[#EFE9E3] py-12 dark:bg-[#1c1c20] md:py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              Shop by category
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              Built for every <span className="text-[#4E8D9C]">moment.</span>
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-medium hover:text-foreground"
          >
            Browse all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c, i) => (
            <Link
              key={c.id}
              href={`/shop/${c.id}`}
              className={[
                "group relative overflow-hidden rounded-3xl bg-background",
                i === 0 ? "lg:col-span-2 lg:row-span-2" : "",
              ].join(" ")}
            >
              <div
                className={[
                  "relative w-full",
                  i === 0 ? "aspect-4/5 lg:aspect-auto lg:h-full" : "aspect-4/5",
                ].join(" ")}
              >
                <Image
                  src={c.image}
                  alt={c.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-linear-to-t from-black/65 via-black/15 to-transparent"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                  <h3 className="text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
                    {c.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm text-white/85">
                    {c.desc}
                  </p>
                  <span className="mt-5 inline-flex h-10 w-fit items-center gap-2 rounded-full bg-white/95 px-5 text-xs font-medium text-[#281C59] transition-transform group-hover:translate-x-1">
                    Shop {c.title}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
