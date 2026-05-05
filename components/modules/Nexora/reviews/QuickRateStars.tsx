"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { submitReview, type NxReview } from "@/src/services/reviews.service";

interface Props {
  productId: string;
  productSlug: string;
  isAuthenticated: boolean;
  currentUserName?: string | null;
  /** Optional: when present, the hero "No ratings yet" copy is replaced. */
  className?: string;
}

/**
 * One-tap star rating widget.
 *
 * Clicking a star posts a rating-only review and:
 *  1. Optimistically lights up the chosen star count locally,
 *  2. Dispatches a `nx:review-added` event so the on-page ReviewsClient
 *     can prepend the new entry without a refetch,
 *  3. Calls `router.refresh()` so the server-rendered hero average / count
 *     re-syncs from the API.
 */
export default function QuickRateStars({
  productId,
  productSlug,
  isAuthenticated,
  currentUserName,
  className,
}: Props) {
  const router = useRouter();
  const [hover, setHover] = useState(0);
  const [chosen, setChosen] = useState(0);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (rating: number) => {
    if (pending || done) return;
    if (!isAuthenticated) {
      router.push(`/login?redirect=/shop/${productSlug}`);
      return;
    }
    setChosen(rating);
    setPending(true);

    // Optimistic event so the reviews list reflects the new rating live.
    const optimistic: NxReview = {
      id: `local-${Date.now()}`,
      productId,
      userId: "me",
      user: currentUserName ? { id: "me", name: currentUserName } : undefined,
      rating,
      title: null,
      body: "",
      isVerifiedPurchase: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("nx:review-added", { detail: optimistic }),
      );
    }

    try {
      const res = await submitReview({ productId, rating });
      if (!res.success) {
        toast.error(res.message ?? "Could not save your rating.");
        setChosen(0);
        return;
      }
      setDone(true);
      toast.success(`Thanks — you rated this ${rating} ${rating === 1 ? "star" : "stars"}.`);
      // Re-sync server-rendered average/count.
      router.refresh();
    } finally {
      setPending(false);
    }
  };

  const display = hover || chosen;

  return (
    <div className={["flex items-center gap-2", className].filter(Boolean).join(" ")}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {done ? "Rated" : "Tap to rate"}
      </span>
      <div
        className="flex items-center gap-0.5"
        onMouseLeave={() => setHover(0)}
        role="radiogroup"
        aria-label="Rate this product"
      >
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = n <= display;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={chosen === n}
              aria-label={`${n} ${n === 1 ? "star" : "stars"}`}
              onMouseEnter={() => !done && setHover(n)}
              onFocus={() => !done && setHover(n)}
              onBlur={() => setHover(0)}
              onClick={() => submit(n)}
              disabled={pending || done}
              className="rounded-full p-0.5 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E8D9C] disabled:cursor-not-allowed"
            >
              <Star
                className={[
                  "h-5 w-5 transition-colors",
                  filled
                    ? "fill-[#F9FF56] text-[#F9FF56]"
                    : "text-foreground/30 hover:text-foreground/60",
                ].join(" ")}
              />
            </button>
          );
        })}
      </div>
      {pending && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
    </div>
  );
}
