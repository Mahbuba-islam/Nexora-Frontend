"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Search } from "lucide-react";
import type { NxBrand, NxCategory } from "@/src/types/nexora.types";

interface Props {
  categories: NxCategory[];
  brands: NxBrand[];
  current: {
    category?: string;
    brand?: string;
    search?: string;
    sort?: string;
  };
}

const SORTS = [
  { value: "createdAt:desc", label: "Newest" },
  { value: "soldCount:desc", label: "Best selling" },
  { value: "price:asc", label: "Price: low → high" },
  { value: "price:desc", label: "Price: high → low" },
  { value: "avgRating:desc", label: "Top rated" },
];

export default function ShopFilters({ categories, brands, current }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value && value.length > 0) next.set(key, value);
    else next.delete(key);
    next.delete("page"); // reset pagination on filter change
    startTransition(() => router.push(`/shop?${next.toString()}`));
  };

  const onSubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setParam("search", String(fd.get("search") ?? "").trim() || null);
  };

  // Only show top-level categories in the filter bar.
  const rootCategories = categories.filter((c) => !c.parentId && c.isActive);

  return (
    <aside className="sticky top-20 space-y-7">
      <form onSubmit={onSubmitSearch} className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          name="search"
          defaultValue={current.search ?? ""}
          placeholder="Search Nexora…"
          className="h-11 w-full rounded-full border border-border bg-background pl-11 pr-4 text-sm outline-none transition-colors focus:border-[#3B82F6]"
        />
      </form>

      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Sort
        </p>
        <select
          value={current.sort ?? ""}
          onChange={(e) => setParam("sort", e.target.value || null)}
          className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-[#3B82F6]"
        >
          <option value="">Featured</option>
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Category
        </p>
        <ul className="space-y-1.5">
          <li>
            <Link
              href="/shop"
              className={chip(!current.category)}
              prefetch={false}
            >
              All
            </Link>
          </li>
          {rootCategories.map((c) => (
            <li key={c.id}>
              <Link
                href={`/shop?category=${encodeURIComponent(c.slug)}`}
                className={chip(current.category === c.slug)}
                prefetch={false}
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Brand
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setParam("brand", null)}
            className={pill(!current.brand)}
          >
            All
          </button>
          {brands.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setParam("brand", b.slug)}
              className={pill(current.brand === b.slug)}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {isPending && (
        <p className="text-xs text-muted-foreground">Updating…</p>
      )}
    </aside>
  );
}

const chip = (active: boolean) =>
  [
    "block rounded-lg px-3 py-2 text-sm transition-colors",
    active
      ? "bg-[#242424] text-[#F9F8F6] dark:bg-[#F9F8F6] dark:text-[#242424]"
      : "text-foreground/75 hover:bg-secondary",
  ].join(" ");

const pill = (active: boolean) =>
  [
    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
    active
      ? "border-transparent bg-[#3B82F6] text-white"
      : "border-border text-foreground/75 hover:border-foreground/40",
  ].join(" ");
