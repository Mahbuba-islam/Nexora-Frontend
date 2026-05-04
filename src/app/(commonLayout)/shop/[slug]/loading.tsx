export default function ProductDetailLoading() {
  return (
    <div className="bg-background">
      {/* Breadcrumb skeleton */}
      <div className="border-b border-border bg-[#F9F8F6] dark:bg-[#1c1c20]">
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-8">
          <div className="h-3 w-64 animate-pulse rounded bg-foreground/10" />
        </div>
      </div>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-10 md:px-8 md:py-14 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square w-full animate-pulse rounded-3xl bg-secondary" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-xl bg-secondary"
              />
            ))}
          </div>
        </div>

        {/* Buy box */}
        <div className="flex flex-col">
          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-20 animate-pulse rounded-full bg-secondary" />
            <div className="h-6 w-16 animate-pulse rounded-full bg-secondary" />
          </div>
          <div className="mt-5 h-10 w-3/4 animate-pulse rounded-2xl bg-secondary md:h-14" />
          <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-secondary" />
          <div className="mt-5 h-4 w-40 animate-pulse rounded bg-secondary" />
          <div className="mt-7 h-12 w-44 animate-pulse rounded bg-secondary md:h-14 md:w-56" />
          <div className="mt-2 h-3 w-72 animate-pulse rounded bg-secondary" />
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <div className="h-14 w-full animate-pulse rounded-full bg-secondary sm:w-48" />
            <div className="h-14 w-full animate-pulse rounded-full bg-secondary sm:w-40" />
          </div>
          <div className="mt-8 grid grid-cols-1 gap-3 border-t border-border pt-6 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-5 animate-pulse rounded bg-secondary"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Description + specs skeleton */}
      <section className="border-t border-border bg-[#F9F8F6] dark:bg-[#1c1c20]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 md:px-8 md:py-20 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-3 lg:col-span-7">
            <div className="h-3 w-20 animate-pulse rounded bg-foreground/10" />
            <div className="h-8 w-1/2 animate-pulse rounded bg-foreground/10" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-4 w-full animate-pulse rounded bg-foreground/10"
              />
            ))}
          </div>
          <div className="space-y-3 lg:col-span-5">
            <div className="h-3 w-24 animate-pulse rounded bg-foreground/10" />
            <div className="h-8 w-1/3 animate-pulse rounded bg-foreground/10" />
            <div className="space-y-2 rounded-2xl border border-border bg-background p-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-5 w-full animate-pulse rounded bg-secondary"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
