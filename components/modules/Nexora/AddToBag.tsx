"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/src/providers/CartProvider";
import type { NxProduct } from "@/src/types/nexora.types";

interface Props {
  product: NxProduct;
  inStock: boolean;
}

export default function AddToBag({ product, inStock }: Props) {
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const cap =
    product.allowBackorder || !product.trackInventory
      ? 99
      : Math.max(1, product.stock);

  const handleAdd = () => {
    add(product, qty);
    setJustAdded(true);
    toast.success(`Added to bag · ${product.name}`, {
      description: `Quantity: ${qty}`,
    });
    window.setTimeout(() => setJustAdded(false), 1600);
  };

  const handleBuyNow = () => {
    add(product, qty);
    router.push("/cart");
  };

  return (
    <div className="mt-7 flex flex-col gap-3">
      {/* Quantity stepper */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-muted-foreground">Qty</span>
        <div className="inline-flex items-center overflow-hidden rounded-full border border-border">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1 || !inStock}
            className="h-10 w-10 text-base font-semibold text-foreground/80 transition-colors hover:bg-secondary disabled:opacity-40"
          >
            −
          </button>
          <span className="grid h-10 w-10 place-items-center text-sm font-semibold tabular-nums">
            {qty}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => Math.min(cap, q + 1))}
            disabled={qty >= cap || !inStock}
            className="h-10 w-10 text-base font-semibold text-foreground/80 transition-colors hover:bg-secondary disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleAdd}
          disabled={!inStock}
          className="nx-btn-primary inline-flex h-14 items-center justify-center gap-2 px-8 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
        >
          {justAdded ? (
            <>
              <Check className="h-4 w-4" />
              Added
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" />
              {inStock ? "Add to bag" : "Sold out"}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={!inStock}
          className="nx-btn-ghost inline-flex h-14 items-center justify-center gap-2 px-8 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
        >
          Buy now
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
