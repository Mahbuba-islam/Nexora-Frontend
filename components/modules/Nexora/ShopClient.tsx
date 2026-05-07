"use client";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Wand2 } from "lucide-react";
import { getProducts } from "@/src/services/nexora.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toNumberPrice, type NxProduct, type NxProductQuery } from "@/src/types/nexora.types";
import ProductCard from "@/components/modules/Nexora/ProductCard";
import ShopFilters from "@/components/modules/Nexora/ShopFilters";

const PAGE_SIZE = 12;

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

export default function ShopClient({ searchParams }: { searchParams: SearchParams }) {
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
  // Responsive shop UI rendering
  const products = productsRes.data || [];
  const meta = productsRes.meta || {};
  const totalPages = meta.totalPages || 1;
  const currentPage = meta.page || page;

  // Placeholder: fetch categories/brands for filters if needed
  // const categories = ...
  // const brands = ...

  return (
    <section className="mx-auto max-w-7xl px-2 sm:px-4 md:px-6 lg:px-8 py-6 min-h-[60vh]">
      {/* Filters row (optional, can be improved) */}
      {/* <ShopFilters categoryTree={categories} brands={brands} current={sp} /> */}

      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <span className="text-muted-foreground text-lg">Loading products...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center py-20">
          <span className="text-muted-foreground text-lg mb-2">No products found.</span>
          <Link href="/shop" className="text-primary underline">Reset filters</Link>
        </div>
      ) : (
        <>
          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10 gap-2">
              <button
                className="px-3 py-1 rounded bg-muted text-foreground disabled:opacity-50"
                onClick={() => {
                  if (currentPage > 1) {
                    const params = new URLSearchParams({ ...sp, page: String(currentPage - 1) });
                    window.location.search = params.toString();
                  }
                }}
                disabled={currentPage <= 1}
              >
                Previous
              </button>
              <span className="px-3 py-1 text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="px-3 py-1 rounded bg-muted text-foreground disabled:opacity-50"
                onClick={() => {
                  if (currentPage < totalPages) {
                    const params = new URLSearchParams({ ...sp, page: String(currentPage + 1) });
                    window.location.search = params.toString();
                  }
                }}
                disabled={currentPage >= totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
