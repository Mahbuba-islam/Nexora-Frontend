export default function ShopLoading() {
  return (
    <div className="bg-background">
      {/* Header skeleton */}
      <header className="border-b border-border bg-[#F9F8F6] dark:bg-[#1c1c20]">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
          <div className="h-6 w-44 animate-pulse rounded-full bg-foreground/10" />
          <div className="mt-5 h-12 w-2/3 animate-pulse rounded-2xl bg-foreground/10 md:h-16" />
          <div className="mt-3 h-4 w-72 animate-pulse rounded-full bg-foreground/10" />
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 md:px-8 lg:grid-cols-12 lg:gap-12">
        {/* Filter sidebar skeleton */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="h-12 animate-pulse rounded-full bg-secondary" />
          <div className="h-10 animate-pulse rounded-2xl bg-secondary" />
          <div className="space-y-2">
            <div className="h-3 w-20 animate-pulse rounded bg-secondary" />
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-9 animate-pulse rounded-full bg-secondary"
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-24 animate-pulse rounded bg-secondary" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-20 animate-pulse rounded-full bg-secondary"
                />
              ))}
            </div>
          </div>
        </aside>

        {/* Grid skeleton */}
        <div className="lg:col-span-9">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="nx-card flex flex-col p-4">
      <div className="aspect-square w-full animate-pulse rounded-2xl bg-secondary" />
      <div className="mt-4 h-4 w-3/4 animate-pulse rounded bg-secondary" />
      <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-secondary" />
      <div className="mt-4 flex items-center justify-between">
        <div className="h-5 w-16 animate-pulse rounded bg-secondary" />
        <div className="h-8 w-24 animate-pulse rounded-full bg-secondary" />
      </div>
    </div>
  );
}
