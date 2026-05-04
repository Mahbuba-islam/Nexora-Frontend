import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Wand2 } from "lucide-react";
import {
  getBrands,
  getCategoryTree,
  getProducts,
} from "@/src/services/nexora.service";
import type { NxProductQuery } from "@/src/types/nexora.types";
import ProductCard from "@/components/modules/Nexora/ProductCard";
import ShopFilters from "@/components/modules/Nexora/ShopFilters";

export const metadata = {
  title: "Shop · Nexora",
  description:
    "Browse premium tech curated by Nexora AI — phones, laptops, audio, wearables, and more.",
};

type SearchParams = Promise<{
  category?: string;
  brand?: string;
  search?: string;
  sort?: string;
  page?: string;
}>;

const PAGE_SIZE = 12;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? "1") || 1);

  const query: NxProductQuery = {
    limit: PAGE_SIZE,
    page,
  };
  if (sp.category) query.categorySlug = sp.category;
  if (sp.brand) query.brandSlug = sp.brand;
  if (sp.search) query.search = sp.search;
  if (sp.sort) {
    const [by, order] = sp.sort.split(":") as [
      NonNullable<NxProductQuery["sortBy"]>,
      NonNullable<NxProductQuery["sortOrder"]>,
    ];
    query.sortBy = by;
    query.sortOrder = order;
  }

  // Parallel reads — never block on filters waiting for products.
  const [productsRes, categoryTree, brands] = await Promise.all([
    getProducts(query),
    getCategoryTree(),
    getBrands(),
  ]);

  const products = productsRes.data;
  const meta = productsRes.meta ?? {
    page,
    limit: PAGE_SIZE,
    total: products.length,
    totalPages: 1,
  };

  return (
    <div className="bg-background">
      {/* Page header */}
      <header className="border-b border-border bg-[#F9F8F6] dark:bg-[#1c1c20]">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur">
            <Wand2 className="h-3 w-3 text-[#4E8D9C]" />
            Curated by AI
          </div>
          <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
            <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
              Shop the catalog
            </h1>
            <p className="text-xs text-muted-foreground md:text-sm">
              {meta.total.toLocaleString()} products · {brands.length} brands · updated daily
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 md:px-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-3">
          <Suspense fallback={null}>
            <ShopFilters
              categoryTree={categoryTree}
              brands={brands}
              current={{
                category: sp.category,
                brand: sp.brand,
                search: sp.search,
                sort: sp.sort,
              }}
            />
          </Suspense>
        </div>

        <div className="lg:col-span-9">
          {products.length === 0 ? (
            <EmptyState searchTerm={sp.search} />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((p, i) => (
                  <ProductCard key={p.id} product={p} priority={i < 3} />
                ))}
              </div>

              {meta.totalPages > 1 && (
                <Pagination meta={meta} sp={sp} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ searchTerm }: { searchTerm?: string }) {
  return (
    <div className="nx-card flex min-h-80 flex-col items-center justify-center px-8 py-14 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-foreground/70">
        <Wand2 className="h-6 w-6" />
      </div>
      <h2 className="mt-5 text-xl font-semibold tracking-tight">
        No products match your filters
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {searchTerm ? (
          <>
            We couldn&rsquo;t find anything for{" "}
            <span className="font-medium text-foreground">
              &ldquo;{searchTerm}&rdquo;
            </span>
            . Try clearing filters or asking Nexora AI.
          </>
        ) : (
          "Try clearing your filters or browse a different category."
        )}
      </p>
      <Link
        href="/shop"
        className="nx-btn-primary mt-6 inline-flex h-11 items-center gap-2 px-6 text-sm font-medium"
      >
        Reset filters
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function Pagination({
  meta,
  sp,
}: {
  meta: { page: number; totalPages: number };
  sp: Awaited<SearchParams>;
}) {
  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    if (sp.category) params.set("category", sp.category);
    if (sp.brand) params.set("brand", sp.brand);
    if (sp.search) params.set("search", sp.search);
    if (sp.sort) params.set("sort", sp.sort);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return `/shop${qs ? `?${qs}` : ""}`;
  };

  const prev = Math.max(1, meta.page - 1);
  const next = Math.min(meta.totalPages, meta.page + 1);

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex items-center justify-between gap-4"
    >
      <Link
        href={buildHref(prev)}
        aria-disabled={meta.page === 1}
        className={[
          "nx-btn-ghost inline-flex h-11 items-center gap-2 px-5 text-sm font-medium",
          meta.page === 1 ? "pointer-events-none opacity-40" : "",
        ].join(" ")}
      >
        ← Previous
      </Link>
      <p className="text-xs text-muted-foreground">
        Page <span className="font-semibold text-foreground">{meta.page}</span>{" "}
        of {meta.totalPages}
      </p>
      <Link
        href={buildHref(next)}
        aria-disabled={meta.page === meta.totalPages}
        className={[
          "nx-btn-ghost inline-flex h-11 items-center gap-2 px-5 text-sm font-medium",
          meta.page === meta.totalPages ? "pointer-events-none opacity-40" : "",
        ].join(" ")}
      >
        Next →
      </Link>
    </nav>
  );
}
