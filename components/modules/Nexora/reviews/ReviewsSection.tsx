import { getReviewsForProduct } from "@/src/services/reviews.service";
import { getUserInfo } from "@/src/services/auth.services";
import ReviewsClient from "./ReviewsClient";

interface Props {
  productId: string;
  productSlug: string;
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
    <section className="border-t border-border bg-background/40">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">

        {/* HEADER */}
        <div className="mb-10 md:mb-12">
          <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Customer Reviews
          </h2>

          <h3 className="mt-2 text-2xl md:text-4xl font-semibold tracking-tight text-foreground">
            What people are saying
          </h3>

          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Real feedback from verified buyers to help you make confident decisions.
          </p>
        </div>

        {/* SINGLE CLIENT */}
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