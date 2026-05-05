import Link from "next/link";
import { ArrowRight, Sparkles, Store } from "lucide-react";

import { getAdminSellers } from "@/src/services/marketplace.service";

export const metadata = {
  title: "Stores · Nexora",
  description:
    "Browse independent stores on the Nexora marketplace. Discover what makers, brands and creators are launching.",
};
export const dynamic = "force-dynamic";

export default async function StoresPage() {
  const sellers = await getAdminSellers();
  const approved = sellers.filter((s) => s.status === "APPROVED");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
      <header className="mb-10 max-w-2xl">
        <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#4E8D9C]">
          <Sparkles className="h-3.5 w-3.5" />
          Marketplace · Stores
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
          Browse stores on Nexora
        </h1>
        <p className="mt-3 text-sm text-muted-foreground md:text-base">
          {approved.length > 0
            ? `${approved.length} verified stores currently live across the marketplace.`
            : "Stores will appear here once sellers complete onboarding."}
        </p>
      </header>

      {approved.length === 0 ? (
        <div className="nx-card flex flex-col items-center justify-center p-12 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-foreground/70">
            <Store className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-xl font-semibold">No live stores yet</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Want to be one of the first?
          </p>
          <Link
            href="/seller/apply"
            className="mt-5 inline-flex h-10 items-center gap-1.5 rounded-full bg-foreground px-4 text-xs font-semibold text-background hover:bg-foreground/90"
          >
            Open a Nexora store
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {approved.map((s) => (
            <Link
              key={s.id}
              href={
                s.shopSlug ? `/shop?seller=${s.shopSlug}` : `/shop?seller=${s.id}`
              }
              className="nx-card group relative flex flex-col gap-3 p-5 transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-linear-to-br from-[#281C59] to-[#4E8D9C] text-white shadow-lg">
                  <Store className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold tracking-tight">
                    {s.shopName}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {s.ownerName ?? "Independent seller"}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {s.productCount ?? 0} products · {s.ordersCount ?? 0} orders
              </p>
              <span className="mt-auto inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#4E8D9C]">
                Browse store
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
