import Link from "next/link";
import { ArrowRight, Plus, Sparkles, Tag } from "lucide-react";

import { getBrands } from "@/src/services/nexora.service";

export const dynamic = "force-dynamic";
export const metadata = { title: "Brands · Nexora Admin" };

export default async function AdminBrandsPage() {
  const brands = await getBrands();

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#4E8D9C]">
            <Sparkles className="h-3.5 w-3.5" />
            Catalog · Brands
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
            Brands
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {brands.length} brand{brands.length === 1 ? "" : "s"} on the
            marketplace.
          </p>
        </div>
        <Link
          href="/admin/marketplace/brands/new"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-4 text-xs font-semibold text-background hover:bg-foreground/90"
        >
          <Plus className="h-3.5 w-3.5" />
          New brand
        </Link>
      </header>

      {brands.length === 0 ? (
        <div className="nx-card flex flex-col items-center justify-center p-12 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-foreground/70">
            <Tag className="h-6 w-6" />
          </div>
          <h3 className="mt-5 text-xl font-semibold">No brands yet</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Create your first brand to start grouping products on the
            marketplace.
          </p>
          <Link
            href="/admin/marketplace/brands/new"
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-4 text-xs font-semibold text-background hover:bg-foreground/90"
          >
            <Plus className="h-3.5 w-3.5" />
            Create brand
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((b) => (
            <div
              key={b.id}
              className="nx-card group flex flex-col gap-3 p-5"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl bg-linear-to-br from-[#281C59] to-[#4E8D9C] text-white shadow-lg">
                  {b.logo ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={b.logo}
                      alt={b.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Tag className="h-5 w-5" />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold tracking-tight">
                    {b.name}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    /{b.slug}
                  </p>
                </div>
              </div>
              {b.description && (
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {b.description}
                </p>
              )}
              <div className="mt-auto flex items-center justify-between text-[11px]">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 font-semibold ${b.isActive ? "bg-emerald-500/15 text-emerald-700" : "bg-zinc-500/15 text-zinc-700"}`}
                >
                  {b.isActive ? "Active" : "Hidden"}
                </span>
                {b.isFeatured && (
                  <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2 py-0.5 font-semibold text-amber-700">
                    Featured
                  </span>
                )}
                <Link
                  href={`/shop?brand=${b.slug}`}
                  className="inline-flex items-center gap-1 text-[#4E8D9C] hover:text-[#4E8D9C]/80"
                >
                  View on shop
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
