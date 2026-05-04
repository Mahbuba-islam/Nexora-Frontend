"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";

import type { NxCategoryNode } from "@/src/types/nexora.types";
import { cn } from "@/src/lib/utils";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1";

/**
 * Categories mega-menu — hover/focus opens a panel with root → children.
 * Self-fetches the tree once and caches it for the session via module-level var.
 */
let cachedTree: NxCategoryNode[] | null = null;
let inflight: Promise<NxCategoryNode[]> | null = null;

async function loadTree(): Promise<NxCategoryNode[]> {
  if (cachedTree) return cachedTree;
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const res = await fetch(`${API_BASE}/categories/tree`, {
        cache: "no-store",
      });
      if (!res.ok) return [];
      const json = (await res.json()) as { data?: NxCategoryNode[] };
      cachedTree = Array.isArray(json.data) ? json.data : [];
      return cachedTree;
    } catch {
      return [];
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

export default function CategoriesMegaMenu() {
  const [tree, setTree] = useState<NxCategoryNode[]>([]);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadTree().then((data) => {
      setTree(data);
      if (data.length > 0) setActiveId(data[0].id);
    });
  }, []);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  if (tree.length === 0) {
    // Backend offline / empty — fall back to plain link.
    return (
      <Link
        href="/shop"
        className="relative rounded-full px-3.5 py-1.5 text-sm text-foreground/75 transition-colors hover:text-foreground"
      >
        Shop
      </Link>
    );
  }

  const active = tree.find((n) => n.id === activeId) ?? tree[0];

  return (
    <div
      className="relative hidden md:block"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        className="inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-sm text-foreground/75 transition-colors hover:text-foreground"
        onClick={() => setOpen((v) => !v)}
        onFocus={() => setOpen(true)}
      >
        Shop
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {/* Panel — anchor to left edge of trigger, then clamp to viewport */}
      <div
        className={cn(
          "absolute left-0 top-full z-50 mt-2 w-[min(48rem,calc(100vw-2rem))] transition-all duration-200",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
        role="menu"
      >
        <div className="overflow-hidden rounded-3xl border border-border bg-background/95 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-12 gap-0">
            {/* Roots column */}
            <ul className="col-span-4 max-h-105 overflow-y-auto border-r border-border bg-secondary/40 p-2">
              {tree.map((root) => {
                const isActive = root.id === active.id;
                return (
                  <li key={root.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveId(root.id)}
                      onFocus={() => setActiveId(root.id)}
                      className={cn(
                        "group flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition-colors",
                        isActive
                          ? "bg-background text-foreground shadow-sm"
                          : "text-foreground/75 hover:bg-background/60",
                      )}
                    >
                      <span className="flex flex-col">
                        <span>{root.name}</span>
                        {typeof root.productCount === "number" && (
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            {root.productCount.toLocaleString()} items
                          </span>
                        )}
                      </span>
                      <ArrowRight
                        className={cn(
                          "h-3.5 w-3.5 transition-transform",
                          isActive && "translate-x-0.5",
                        )}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Children grid */}
            <div className="col-span-8 p-6">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {active.name}
                  </p>
                  <h3 className="mt-1 text-base font-semibold tracking-tight">
                    Shop {active.name.toLowerCase()}
                  </h3>
                </div>
                <Link
                  href={`/shop?category=${active.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-foreground hover:text-[#4E8D9C]"
                >
                  See all
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {active.children.length > 0 ? (
                <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1.5">
                  {active.children.slice(0, 12).map((child) => (
                    <li key={child.id}>
                      <Link
                        href={`/shop?category=${child.slug}`}
                        className="group flex items-center justify-between rounded-xl px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        <span>{child.name}</span>
                        {typeof child.productCount === "number" &&
                          child.productCount > 0 && (
                            <span className="text-[10px] tabular-nums text-muted-foreground">
                              {child.productCount}
                            </span>
                          )}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">
                  Browse the full {active.name} collection.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
