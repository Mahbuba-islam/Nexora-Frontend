"use client";

import { useMemo, useState } from "react";
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
  /** Optional name to display when the API doesn't echo back a `user`. */
  currentUserName?: string | null;
  /** Server-side rating fallback from the product DTO. */
  fallbackAverage?: number;
  fallbackCount?: number;
}

/**
 * Client-owned reviews experience. The server component fetches the
 * initial list/summary; this component takes over after mount so that
 * newly-posted reviews appear instantly without waiting for a page refresh.
 */
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
    if (reviews.length === 0) {
      return initialSummary;
    }
    const dist: NxReviewSummary["distribution"] = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    let sum = 0;
    for (const r of reviews) {
      const n = Math.min(5, Math.max(1, Math.round(r.rating))) as
        | 1
        | 2
        | 3
        | 4
        | 5;
      dist[n] += 1;
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

  const average =
    summary.totalReviews > 0 ? summary.averageRating : fallbackAverage;
  const total = summary.totalReviews > 0 ? summary.totalReviews : fallbackCount;
  const dist = summary.distribution;
  const maxBucket = Math.max(1, dist[1], dist[2], dist[3], dist[4], dist[5]);

  return (
    <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
      {/* Summary */}
      <aside className="lg:col-span-4">
        <div className="nx-card p-6">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-semibold tabular-nums tracking-tight">
              {average > 0 ? average.toFixed(1) : "—"}
            </span>
            <span className="text-sm text-muted-foreground">/ 5</span>
          </div>
          <div className="mt-2 flex items-center gap-0.5">
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
          <p className="mt-2 text-xs text-muted-foreground">
            Based on {total.toLocaleString()}{" "}
            {total === 1 ? "review" : "reviews"}
          </p>

          <ul className="mt-6 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = dist[star as 1 | 2 | 3 | 4 | 5] ?? 0;
              const pct = (count / maxBucket) * 100;
              return (
                <li
                  key={star}
                  className="flex items-center gap-3 text-xs text-muted-foreground"
                >
                  <span className="w-8 tabular-nums">{star}★</span>
                  <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                    <span
                      className="absolute inset-y-0 left-0 rounded-full bg-[#F9FF56]"
                      style={{ width: `${pct}%` }}
                    />
                  </span>
                  <span className="w-8 text-right tabular-nums">{count}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Write-a-review form (auth-gated) */}
        <div className="mt-6">
          <ReviewForm
            productId={productId}
            productSlug={productSlug}
            isAuthenticated={isAuthenticated}
            currentUserName={currentUserName ?? null}
            onSubmitted={handleAdd}
          />
        </div>
      </aside>

      {/* Reviews list */}
      <div className="lg:col-span-8">
        {reviews.length === 0 ? (
          <div className="nx-card flex min-h-72 flex-col items-center justify-center p-10 text-center">
            <Star className="h-8 w-8 text-foreground/30" />
            <h4 className="mt-4 text-lg font-semibold tracking-tight">
              Be the first to review.
            </h4>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Share your impressions to help other shoppers — your review
              appears here once it&rsquo;s in.
            </p>
          </div>
        ) : (
          <ul className="space-y-5">
            {reviews.map((r) => (
              <li key={r.id} className="nx-card p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {r.user?.name ?? "Verified buyer"}
                      {r.isVerifiedPurchase && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                          Verified
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(r.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star
                        key={i}
                        className={[
                          "h-3.5 w-3.5",
                          i < Math.round(r.rating)
                            ? "fill-[#F9FF56] text-[#F9FF56]"
                            : "text-foreground/20",
                        ].join(" ")}
                      />
                    ))}
                  </div>
                </div>
                {r.title && (
                  <h4 className="mt-3 text-base font-semibold tracking-tight">
                    {r.title}
                  </h4>
                )}
                {r.body && (
                  <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                    {r.body}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
