import { getReviewsForProduct } from "@/src/services/reviews.service";
import { getUserInfo } from "@/src/services/auth.services";
import ReviewsClient from "./ReviewsClient";

interface Props {
  productId: string;
  productSlug: string;
  /** Server-side rating from product DTO (used as fallback if no reviews loaded). */
  fallbackAverage?: number;
  fallbackCount?: number;
}

export default async function ReviewsSection({
  productId,
  productSlug,
  fallbackAverage = 0,
  fallbackCount = 0,
}: Props) {
  const [{ reviews, summary }, user] = await Promise.all([
    getReviewsForProduct(productId),
    getUserInfo(),
  ]);

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Reviews
        </h2>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-4xl">
          What customers are saying.
        </h3>

        <ReviewsClient
          productId={productId}
          productSlug={productSlug}
          initialReviews={reviews}
          initialSummary={summary}
          isAuthenticated={!!user}
          currentUserName={
            (user as { name?: string | null } | null)?.name ?? null
          }
          fallbackAverage={fallbackAverage}
          fallbackCount={fallbackCount}
        />
      </div>
    </section>
  );
}
