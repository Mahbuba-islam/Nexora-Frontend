import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Wand2 } from "lucide-react";
import {
  getBrands,
  getCategoryTree,
  getProducts,
} from "@/src/services/nexora.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  toNumberPrice,
  type NxProduct,
  type NxProductQuery,
} from "@/src/types/nexora.types";
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
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
}>;

const PAGE_SIZE = 12;

export default function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const queryClient = useQueryClient();
  const [sp, setSp] = useState<any>({});
  useEffect(() => {
    (async () => {
      setSp(await searchParams);
    })();
  }, [searchParams]);
  const page = Math.max(1, Number(sp.page ?? "1") || 1);
  const minPriceNum = sp.minPrice && !Number.isNaN(Number(sp.minPrice)) ? Math.max(0, Number(sp.minPrice)) : undefined;
  const maxPriceNum = sp.maxPrice && !Number.isNaN(Number(sp.maxPrice)) ? Math.max(0, Number(sp.maxPrice)) : undefined;
  const minRatingNum = sp.minRating && !Number.isNaN(Number(sp.minRating)) ? Math.min(5, Math.max(0, Number(sp.minRating))) : undefined;
  const query: NxProductQuery = { limit: PAGE_SIZE, page };
  if (sp.category) query.categorySlug = sp.category;
  if (sp.brand) query.brandSlug = sp.brand;
  if (sp.search) query.search = sp.search;
  if (minPriceNum != null) query.minPrice = minPriceNum;
  if (maxPriceNum != null) query.maxPrice = maxPriceNum;
  if (minRatingNum != null) query.minRating = minRatingNum;
  if (sp.sort) {
    const PRESETS: Record<string, { sortBy: NonNullable<NxProductQuery["sortBy"]>; sortOrder: NonNullable<NxProductQuery["sortOrder"]> }> = {
      newest: { sortBy: "createdAt", sortOrder: "desc" },
      oldest: { sortBy: "createdAt", sortOrder: "asc" },
      "price-asc": { sortBy: "price", sortOrder: "asc" },
      "price-desc": { sortBy: "price", sortOrder: "desc" },
      bestselling: { sortBy: "soldCount", sortOrder: "desc" },
      rating: { sortBy: "avgRating", sortOrder: "desc" },
    };
    const preset = PRESETS[sp.sort];
    if (preset) {
      query.sortBy = preset.sortBy;
      query.sortOrder = preset.sortOrder;
    } else if (sp.sort.includes(":")) {
      const [by, order] = sp.sort.split(":") as [NonNullable<NxProductQuery["sortBy"]>, NonNullable<NxProductQuery["sortOrder"]>];
      query.sortBy = by;
      query.sortOrder = order;
    }
  }
  const { data: productsRes = { data: [], meta: {} }, isLoading } = useQuery({
    queryKey: ["products", query],
    queryFn: () => getProducts(query),
    staleTime: 1000 * 30,
  });
  const products: NxProduct[] = (productsRes.data || []).filter((p) => {
    const price = toNumberPrice(p.price);
    if (minPriceNum != null && price < minPriceNum) return false;
    if (maxPriceNum != null && price > maxPriceNum) return false;
    if (minRatingNum != null && (p.avgRating ?? 0) < minRatingNum) return false;
    return true;
  });
  const meta = productsRes.meta ?? { page, limit: PAGE_SIZE, total: products.length, totalPages: 1 };
  const { data: categoryTree = [] } = useQuery({
    queryKey: ["categoryTree"],
    queryFn: () => getCategoryTree(),
    staleTime: 1000 * 60,
  });
  const { data: brands = [] } = useQuery({
    queryKey: ["brands"],
    queryFn: () => getBrands(),
    staleTime: 1000 * 60,
  });
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
                minPrice: sp.minPrice,
                maxPrice: sp.maxPrice,
                minRating: sp.minRating,
              }}
            />
          </Suspense>
        </div>
        <div className="lg:col-span-9">
          {isLoading ? (
            <div>Loading products...</div>
          ) : products.length === 0 ? (
            <EmptyState searchTerm={sp.search} />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {products.map((p, i) => (
                  <ProductCard key={p.id} product={p} priority={i < 3} />
                ))}
              </div>
              {meta.totalPages > 1 && <Pagination meta={meta} sp={sp} />}
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
    if (sp.minPrice) params.set("minPrice", sp.minPrice);
    if (sp.maxPrice) params.set("maxPrice", sp.maxPrice);
    if (sp.minRating) params.set("minRating", sp.minRating);
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
