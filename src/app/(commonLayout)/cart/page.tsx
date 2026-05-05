"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/src/providers/CartProvider";
import { formatUSD } from "@/components/modules/Nexora/data";
import ShippingQuoteForm from "@/components/modules/Nexora/ShippingQuoteForm";
import type { NxShippingRate } from "@/src/services/marketplaceExtras.service";

export default function CartPage() {
  const { items, count, subtotal, hydrated, setQty, remove, clear } = useCart();
  const [selectedRate, setSelectedRate] = useState<NxShippingRate | null>(null);

  // Shipping: live quote takes precedence; fallback to estimate.
  const shipping =
    selectedRate?.amount ?? (subtotal > 0 && subtotal < 200 ? 9.99 : 0);
  const tax = +(subtotal * 0.07).toFixed(2);
  const total = subtotal + shipping + tax;

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="h-10 w-40 animate-pulse rounded-full bg-secondary" />
        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-2xl bg-secondary"
              />
            ))}
          </div>
          <div className="lg:col-span-4 h-72 animate-pulse rounded-3xl bg-secondary" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center md:px-8">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-secondary">
          <ShoppingBag className="h-7 w-7 text-foreground/70" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight md:text-5xl">
          Your bag is empty.
        </h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground md:text-base">
          Curated by Nexora AI — find your next favorite gadget across phones,
          laptops, audio, and more.
        </p>
        <Link
          href="/shop"
          className="nx-btn-primary mt-8 inline-flex h-12 items-center gap-2 px-7 text-sm font-medium"
        >
          Start shopping
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
            Your bag.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {count} {count === 1 ? "item" : "items"} · subtotal{" "}
            {formatUSD(subtotal)}
          </p>
        </div>
        <button
          type="button"
          onClick={clear}
          className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Clear bag
        </button>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Items */}
        <ul className="space-y-4 lg:col-span-8">
          {items.map((item) => (
            <li
              key={item.id}
              className="nx-card flex gap-4 p-4 sm:gap-6 sm:p-5"
            >
              <Link
                href={`/shop/${item.slug}`}
                className="relative aspect-square h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-secondary sm:h-28 sm:w-28"
              >
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                )}
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    {item.brand && (
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                        {item.brand}
                      </p>
                    )}
                    <Link
                      href={`/shop/${item.slug}`}
                      className="mt-0.5 line-clamp-2 text-sm font-semibold text-foreground hover:text-[#4E8D9C] sm:text-base"
                    >
                      {item.name}
                    </Link>
                  </div>
                  <p className="shrink-0 text-sm font-semibold tabular-nums sm:text-base">
                    {formatUSD(item.price * item.qty)}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="inline-flex items-center overflow-hidden rounded-full border border-border">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQty(item.id, item.qty - 1)}
                      className="grid h-9 w-9 place-items-center text-foreground/80 transition-colors hover:bg-secondary"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="grid h-9 w-9 place-items-center text-sm font-semibold tabular-nums">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQty(item.id, item.qty + 1)}
                      className="grid h-9 w-9 place-items-center text-foreground/80 transition-colors hover:bg-secondary"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Summary */}
        <aside className="lg:col-span-4">
          <div className="nx-card sticky top-24 p-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Summary
            </h2>
            <dl className="mt-5 space-y-3 text-sm">
              <Row label="Subtotal" value={formatUSD(subtotal)} />
              <Row
                label="Shipping"
                value={shipping === 0 ? "Free" : formatUSD(shipping)}
              />
              <Row label="Estimated tax" value={formatUSD(tax)} />
            </dl>
            <div className="mt-5 flex items-baseline justify-between border-t border-border pt-5">
              <span className="text-sm font-semibold">Total</span>
              <span className="text-2xl font-semibold tabular-nums">
                {formatUSD(total)}
              </span>
            </div>

            <Link
              href="/checkout"
              className="nx-btn-primary mt-6 inline-flex h-12 w-full items-center justify-center gap-2 px-6 text-sm font-semibold"
            >
              Checkout
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/shop"
              className="mt-3 block text-center text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Continue shopping
            </Link>
          </div>

          <ShippingQuoteForm onSelect={setSelectedRate} />
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium tabular-nums">{value}</dd>
    </div>
  );
}
