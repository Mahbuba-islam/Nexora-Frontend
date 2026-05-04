"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";

import { useWishlist } from "@/src/providers/WishlistProvider";
import type { NxProduct } from "@/src/types/nexora.types";

interface Props {
  product: NxProduct;
  /** Visual variant. */
  variant?: "card" | "detail";
}

export default function WishlistButton({ product, variant = "card" }: Props) {
  const { has, toggle, hydrated } = useWishlist();
  const active = hydrated && has(product.id);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggle(product);
    toast.success(
      added
        ? `Saved to wishlist · ${product.name}`
        : `Removed from wishlist · ${product.name}`,
    );
  };

  if (variant === "detail") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        aria-label={active ? "Remove from wishlist" : "Save to wishlist"}
        className="nx-btn-ghost inline-flex h-12 items-center justify-center gap-2 px-5 text-sm font-medium"
      >
        <Heart
          className={[
            "h-4 w-4 transition-colors",
            active ? "fill-red-500 text-red-500" : "",
          ].join(" ")}
        />
        {active ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Save to wishlist"}
      className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-border bg-background/85 text-foreground/80 backdrop-blur transition-colors hover:bg-background"
    >
      <Heart
        className={[
          "h-4 w-4 transition-colors",
          active ? "fill-red-500 text-red-500" : "",
        ].join(" ")}
      />
    </button>
  );
}
