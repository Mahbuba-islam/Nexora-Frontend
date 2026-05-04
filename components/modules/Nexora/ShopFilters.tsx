"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { ChevronRight, Search } from "lucide-react";
import type {
  NxBrand,
  NxCategoryNode,
} from "@/src/types/nexora.types";

interface Props {
  /** Hierarchical category tree from /categories/tree. */
  categoryTree: NxCategoryNode[];
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

export default function ShopFilters({
  categoryTree,
  brands,
  current,
}: Props) {
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

  return (
    <aside className="sticky top-20 space-y-7">
      <form onSubmit={onSubmitSearch} className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          name="search"
          defaultValue={current.search ?? ""}
          placeholder="Search Nexora…"
          className="h-11 w-full rounded-full border border-border bg-background pl-11 pr-4 text-sm outline-none transition-colors focus:border-[#4E8D9C]"
        />
      </form>

      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Sort
        </p>
        <select
          value={current.sort ?? ""}
          onChange={(e) => setParam("sort", e.target.value || null)}
          className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-[#4E8D9C]"
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
        <ul className="space-y-1">
          <li>
            <Link
              href="/shop"
              className={chip(!current.category)}
              prefetch={false}
            >
              All categories
            </Link>
          </li>
          {categoryTree.map((root) => (
            <CategoryBranch
              key={root.id}
              node={root}
              currentSlug={current.category}
            />
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

function CategoryBranch({
  node,
  currentSlug,
  depth = 0,
}: {
  node: NxCategoryNode;
  currentSlug?: string;
  depth?: number;
}) {
  const hasChildren = node.children && node.children.length > 0;
  // Auto-expand if this branch contains the current selection.
  const containsSelected = (n: NxCategoryNode): boolean =>
    n.slug === currentSlug ||
    (n.children?.some(containsSelected) ?? false);
  const [open, setOpen] = useState(
    depth === 0 ? containsSelected(node) : false,
  );

  const active = node.slug === currentSlug;

  return (
    <li>
      <div className="flex items-center gap-1">
        <Link
          href={`/shop?category=${encodeURIComponent(node.slug)}`}
          className={[
            chip(active),
            depth > 0 ? "flex-1" : "flex-1",
          ].join(" ")}
          style={{ paddingLeft: `${0.75 + depth * 0.75}rem` }}
          prefetch={false}
        >
          <span className="flex items-center justify-between">
            <span>{node.name}</span>
            {typeof node.productCount === "number" && node.productCount > 0 && (
              <span className="text-[10px] tabular-nums text-muted-foreground">
                {node.productCount}
              </span>
            )}
          </span>
        </Link>
        {hasChildren && (
          <button
            type="button"
            aria-label={open ? "Collapse" : "Expand"}
            onClick={() => setOpen((v) => !v)}
            className="grid h-7 w-7 place-items-center rounded-md text-foreground/50 hover:bg-secondary hover:text-foreground"
          >
            <ChevronRight
              className={[
                "h-3.5 w-3.5 transition-transform",
                open ? "rotate-90" : "",
              ].join(" ")}
            />
          </button>
        )}
      </div>
      {hasChildren && open && (
        <ul className="mt-0.5 space-y-0.5">
          {node.children.map((child) => (
            <CategoryBranch
              key={child.id}
              node={child}
              currentSlug={currentSlug}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

const chip = (active: boolean) =>
  [
    "block rounded-lg px-3 py-2 text-sm transition-colors",
    active
      ? "bg-[#281C59] text-[#F9F8F6] dark:bg-[#F9F8F6] dark:text-[#281C59]"
      : "text-foreground/75 hover:bg-secondary",
  ].join(" ");

const pill = (active: boolean) =>
  [
    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
    active
      ? "border-transparent bg-[#4E8D9C] text-white"
      : "border-border text-foreground/75 hover:border-foreground/40",
  ].join(" ");
