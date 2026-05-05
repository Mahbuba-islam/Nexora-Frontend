import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  /** How many skeleton cards to render. Defaults to 8 (a 4-column desktop row × 2). */
  count?: number;
}

/**
 * Loading placeholder that matches the visual footprint of `ProductCard`:
 * square image, title, short description, price + rating row, and CTA.
 *
 * Use to keep the 4-per-row desktop grid stable while data loads.
 */
export default function ProductCardSkeleton({ count = 8 }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="nx-card flex flex-col overflow-hidden p-4"
          aria-hidden
        >
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="mt-4 flex flex-1 flex-col gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <div className="mt-3 flex items-center justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-10" />
            </div>
            <Skeleton className="mt-3 h-10 w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
