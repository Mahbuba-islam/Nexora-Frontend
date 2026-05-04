"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/src/providers/CartProvider";
import { useWishlist } from "@/src/providers/WishlistProvider";
import { formatUSD } from "@/components/modules/Nexora/data";
import type { NxProduct } from "@/src/types/nexora.types";

export default function WishlistAccountPage() {
  const { items, hydrated, remove, clear } = useWishlist();
  const { add: addToCart } = useCart();

  if (!hydrated) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-secondary" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-2xl bg-secondary"
            />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="nx-card flex min-h-80 flex-col items-center justify-center p-10 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-foreground/70">
          <Heart className="h-6 w-6" />
        </div>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight">
          No saved items yet.
        </h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Tap the heart on any product to keep it here for later.
        </p>
        <Link
          href="/shop"
          className="nx-btn-primary mt-7 inline-flex h-11 items-center gap-2 px-6 text-sm font-medium"
        >
          Browse products
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  // Synthesise a minimal NxProduct from the stored item so addToCart works
  // even though we only persisted a slim shape.
  const itemToProduct = (i: (typeof items)[number]): NxProduct =>
    ({
      id: i.id,
      slug: i.slug,
      name: i.name,
      sku: "",
      shortDesc: null,
      description: null,
      price: String(i.price),
      compareAtPrice: null,
      currency: "USD",
      stock: 99,
      trackInventory: false,
      allowBackorder: true,
      status: "ACTIVE",
      condition: "NEW",
      isFeatured: false,
      isBestseller: false,
      isNewArrival: false,
      isOnSale: false,
      brandId: "",
      categoryId: "",
      avgRating: null,
      reviewCount: 0,
      soldCount: 0,
      viewCount: 0,
      publishedAt: null,
      createdAt: new Date(i.addedAt).toISOString(),
      updatedAt: new Date(i.addedAt).toISOString(),
      images: i.image
        ? [
            {
              id: i.id,
              url: i.image,
              alt: i.name,
              sortOrder: 0,
              isPrimary: true,
            },
          ]
        : [],
      brand: i.brand
        ? {
            id: "",
            name: i.brand,
            slug: "",
            isFeatured: false,
            isActive: true,
          }
        : undefined,
    }) as NxProduct;

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Saved for later
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? "item" : "items"} in your
            wishlist.
          </p>
        </div>
        <button
          type="button"
          onClick={clear}
          className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Clear all
        </button>
      </div>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.id} className="nx-card flex gap-4 p-4">
            <Link
              href={`/shop/${item.slug}`}
              className="relative aspect-square h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-secondary"
            >
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              )}
            </Link>

            <div className="flex min-w-0 flex-1 flex-col">
              {item.brand && (
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {item.brand}
                </p>
              )}
              <Link
                href={`/shop/${item.slug}`}
                className="line-clamp-2 text-sm font-semibold text-foreground hover:text-[#4E8D9C]"
              >
                {item.name}
              </Link>
              <p className="mt-1 text-sm font-semibold tabular-nums">
                {formatUSD(item.price)}
              </p>

              <div className="mt-auto flex items-center justify-between pt-3">
                <button
                  type="button"
                  onClick={() => {
                    addToCart(itemToProduct(item), 1);
                    toast.success(`Added to bag · ${item.name}`);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-[#4E8D9C]"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Add to bag
                </button>
                <button
                  type="button"
                  onClick={() => {
                    remove(item.id);
                    toast.success(`Removed · ${item.name}`);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
