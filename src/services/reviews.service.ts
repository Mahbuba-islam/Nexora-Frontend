// Nexora — reviews service.
// Backend may expose either /products/:id/reviews or /reviews?productId=…
// We try both. submit/delete also try the most common shapes silently.

import { httpClient } from "@/src/lib/axious/httpClient";

export interface NxReview {
  id: string;
  productId: string;
  userId: string;
  user?: {
    id: string;
    name?: string | null;
    image?: string | null;
  };
  rating: number; // 1–5
  title?: string | null;
  body?: string | null;
  isVerifiedPurchase?: boolean;
  helpfulCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface NxReviewSummary {
  productId: string;
  averageRating: number;
  totalReviews: number;
  /** Counts indexed [1..5]. */
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export interface NxReviewListResult {
  reviews: NxReview[];
  summary: NxReviewSummary;
}

function emptySummary(productId: string): NxReviewSummary {
  return {
    productId,
    averageRating: 0,
    totalReviews: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };
}

function computeSummary(productId: string, reviews: NxReview[]): NxReviewSummary {
  if (!reviews.length) return emptySummary(productId);
  const dist: NxReviewSummary["distribution"] = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
  let sum = 0;
  for (const r of reviews) {
    const rounded = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
    dist[rounded] += 1;
    sum += r.rating;
  }
  return {
    productId,
    averageRating: sum / reviews.length,
    totalReviews: reviews.length,
    distribution: dist,
  };
}

export async function getReviewsForProduct(
  productId: string,
): Promise<NxReviewListResult> {
  const candidates: { path: string; params?: Record<string, unknown> }[] = [
    { path: `/products/${productId}/reviews` },
    { path: `/reviews`, params: { productId } },
  ];

  for (const c of candidates) {
    try {
      const res = await httpClient.get<NxReview[] | NxReviewListResult>(
        c.path,
        { silent: true, params: c.params },
      );
      const data = res?.data;
      if (!data) continue;
      // Backend might return either an array or a {reviews, summary} object.
      if (Array.isArray(data)) {
        return {
          reviews: data,
          summary: computeSummary(productId, data),
        };
      }
      if (typeof data === "object" && Array.isArray((data as NxReviewListResult).reviews)) {
        const obj = data as NxReviewListResult;
        return {
          reviews: obj.reviews,
          summary: obj.summary ?? computeSummary(productId, obj.reviews),
        };
      }
    } catch {
      // try next
    }
  }

  return { reviews: [], summary: emptySummary(productId) };
}

export interface SubmitReviewPayload {
  productId: string;
  rating: number;
  title?: string;
  body?: string;
}

export async function submitReview(payload: SubmitReviewPayload): Promise<{
  success: boolean;
  message?: string;
  review?: NxReview;
}> {
  const candidates: { path: string; body: unknown }[] = [
    { path: `/products/${payload.productId}/reviews`, body: payload },
    { path: `/reviews`, body: payload },
  ];
  for (const c of candidates) {
    try {
      const res = await httpClient.post<NxReview>(c.path, c.body, {
        silent: true,
        withCredentials: true,
      });
      if (res?.success !== false) {
        return { success: true, review: res?.data };
      }
    } catch {
      // try next
    }
  }
  return {
    success: false,
    message: "We couldn't post your review just now. Please try again.",
  };
}
