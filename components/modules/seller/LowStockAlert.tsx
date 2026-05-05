"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Boxes, Loader2 } from "lucide-react";

import {
  getLowStockProducts,
  type NxLowStockProduct,
} from "@/src/services/marketplaceExtras.service";

export default function LowStockAlert({
  scope = "seller",
}: {
  scope?: "seller" | "admin";
}) {
  const [items, setItems] = useState<NxLowStockProduct[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await getLowStockProducts(scope);
      if (!cancelled) setItems(data);
    })();
    return () => {
      cancelled = true;
    };
  }, [scope]);

  if (items == null) {
    return (
      <section className="nx-card flex items-center gap-2 px-5 py-4 text-xs text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Checking inventory…
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="nx-card flex items-center gap-3 px-5 py-4">
        <div className="grid h-9 w-9 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-600">
          <Boxes className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold">All stocked up</p>
          <p className="text-xs text-muted-foreground">
            No products are below their threshold right now.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="nx-card overflow-hidden">
      <header className="flex items-center justify-between border-b border-border bg-amber-500/10 px-5 py-3">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-3.5 w-3.5" />
          {items.length} low-stock {items.length === 1 ? "item" : "items"}
        </p>
        <Link
          href="/seller/products"
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-foreground hover:text-(--nx-blue-deep)"
        >
          Manage
          <ArrowRight className="h-3 w-3" />
        </Link>
      </header>

      <ul className="divide-y divide-border">
        {items.slice(0, 6).map((p) => {
          const ratio = p.threshold > 0 ? p.stock / p.threshold : 1;
          const tone =
            ratio < 0.34
              ? "from-rose-500 to-amber-500"
              : ratio < 0.67
                ? "from-amber-500 to-amber-300"
                : "from-amber-300 to-emerald-400";
          return (
            <li
              key={p.id}
              className="flex items-center gap-4 px-5 py-3"
            >
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-10 w-10 shrink-0 rounded-xl border border-border object-cover"
                />
              ) : (
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary">
                  <Boxes className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{p.name}</p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full bg-linear-to-r ${tone}`}
                      style={{
                        width: `${Math.min(100, Math.max(6, ratio * 100))}%`,
                      }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold tabular-nums text-muted-foreground">
                    {p.stock}/{p.threshold}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
