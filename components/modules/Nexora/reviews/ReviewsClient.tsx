"use client";

import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";

import type {
  NxReview,
  NxReviewSummary,
} from "@/src/services/reviews.service";

import ReviewForm from "./ReviewForm";

interface Props {
  productId: string;
  productSlug: string;
  initialReviews: NxReview[];
  initialSummary: NxReviewSummary;
  isAuthenticated: boolean;
  currentUserName?: string | null;
  fallbackAverage?: number;
  fallbackCount?: number;
}

export default function ReviewsClient({
  productId,
  productSlug,
  initialReviews,
  initialSummary,
  isAuthenticated,
  currentUserName,
  fallbackAverage = 0,
  fallbackCount = 0,
}: Props) {
  const [reviews, setReviews] = useState<NxReview[]>(initialReviews);

  const summary = useMemo<NxReviewSummary>(() => {
    if (reviews.length === 0) return initialSummary;

    const dist: NxReviewSummary["distribution"] = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    let sum = 0;

    for (const r of reviews) {
      const rating = Math.min(5, Math.max(1, Math.round(r.rating))) as
        | 1
        | 2
        | 3
        | 4
        | 5;

      dist[rating] += 1;
      sum += r.rating;
    }

    return {
      productId,
      averageRating: sum / reviews.length,
      totalReviews: reviews.length,
      distribution: dist,
    };
  }, [reviews, initialSummary, productId]);

  const handleAdd = (incoming: NxReview) => {
    setReviews((prev) => [incoming, ...prev]);
  };

  useEffect(() => {
    const onAdded = (e: Event) => {
      const detail = (e as CustomEvent<NxReview>).detail;
      if (detail?.productId === productId) handleAdd(detail);
    };

    window.addEventListener("nx:review-added", onAdded as EventListener);
    return () =>
      window.removeEventListener("nx:review-added", onAdded as EventListener);
  }, [productId]);

  const average =
    summary.totalReviews > 0 ? summary.averageRating : fallbackAverage;

  const total =
    summary.totalReviews > 0 ? summary.totalReviews : fallbackCount;

  const dist = summary.distribution;
  const maxBucket = Math.max(1, dist[1], dist[2], dist[3], dist[4], dist[5]);

  return (
    <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
      {/* LEFT - SUMMARY + FORM */}
      <aside className="lg:col-span-4 flex flex-col gap-6">
        <div className="rounded-2xl border border-border bg-background/90 p-6 flex flex-col items-center">
          <span className="text-4xl font-bold tabular-nums">
            {average > 0 ? average.toFixed(1) : "—"}
          </span>

          <div className="mt-1 flex items-center gap-0.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star
                key={i}
                className={[
                  "h-4 w-4",
                  i < Math.round(average)
                    ? "fill-[#F9FF56] text-[#F9FF56]"
                    : "text-foreground/20",
                ].join(" ")}
              />
            ))}
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            Based on {total.toLocaleString()}{" "}
            {total === 1 ? "review" : "reviews"}
          </p>

          <ul className="mt-4 w-full space-y-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = dist[star as 1 | 2 | 3 | 4 | 5] ?? 0;
              const pct = (count / maxBucket) * 100;

              return (
                <li
                  key={star}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <span className="w-7 tabular-nums">{star}★</span>

                  <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                    <span
                      className="absolute inset-y-0 left-0 rounded-full bg-[#F9FF56]"
                      style={{ width: `${pct}%` }}
                    />
                  </span>

                  <span className="w-7 text-right tabular-nums">
                    {count}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <ReviewForm
          productId={productId}
          productSlug={productSlug}
          isAuthenticated={isAuthenticated}
          currentUserName={currentUserName ?? null}
          onSubmitted={handleAdd}
        />
      </aside>

      {/* RIGHT - REVIEWS LIST */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        {reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-background/70 flex flex-col items-center justify-center min-h-56 p-8 text-center">
            <Star className="h-8 w-8 text-foreground/30" />
            <h4 className="mt-3 text-lg font-semibold">
              No reviews yet.
            </h4>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">
              Be the first to share your experience — it helps other buyers.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border rounded-2xl border border-border bg-background/90">
            {reviews.map((r) => (
              <li key={r.id} className="flex gap-4 p-6">
                <div className="w-10 h-10 rounded-full bg-[#4E8D9C]/10 text-[#4E8D9C] flex items-center justify-center font-bold">
                  {r.user?.name?.[0]?.toUpperCase() ?? "V"}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      {r.user?.name ?? "Verified buyer"}
                    </span>

                    {r.isVerifiedPurchase && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600">
                        Verified
                      </span>
                    )}

                    <span className="ml-auto text-xs text-muted-foreground">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {r.title && (
                    <h4 className="mt-1 font-semibold">{r.title}</h4>
                  )}

                  <p className="mt-1 text-sm text-foreground/80">
                    {r.body?.trim()
                      ? r.body
                      : "No written review provided."}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}