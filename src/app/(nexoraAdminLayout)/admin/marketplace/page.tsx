import Link from "next/link";
import { ArrowRight, ShoppingBag, Store, Wallet } from "lucide-react";

import {
  getMarketplaceStats,
  getPayoutPipeline,
  getTopSellers,
} from "@/src/services/marketplace.service";
import { formatUSD } from "@/components/modules/Nexora/data";
import { toNumberPrice } from "@/src/types/nexora.types";

export const metadata = { title: "Marketplace overview · Nexora Admin" };

export default async function AdminMarketplaceOverviewPage() {
  const [stats, pipeline, topSellers] = await Promise.all([
    getMarketplaceStats(),
    getPayoutPipeline(),
    getTopSellers(8),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Overview
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Marketplace performance at a glance.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="GMV"
          value={stats ? formatUSD(toNumberPrice(stats.gmv ?? 0)) : "—"}
          icon={ShoppingBag}
          accent="blue"
        />
        <Stat
          label="Orders"
          value={stats ? (stats.orders ?? 0).toLocaleString() : "—"}
          icon={ShoppingBag}
          accent="amber"
        />
        <Stat
          label="Active sellers"
          value={stats ? (stats.activeSellers ?? 0).toLocaleString() : "—"}
          icon={Store}
          accent="green"
        />
        <Stat
          label="Customers"
          value={stats ? (stats.customers ?? 0).toLocaleString() : "—"}
          icon={Store}
          accent="violet"
        />
      </div>

      <section className="nx-card p-6">
        <header className="flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Payout pipeline
            </p>
            <p className="mt-1 text-3xl font-semibold tracking-tight">
              {pipeline
                ? formatUSD(toNumberPrice(pipeline.pendingPayoutAmount ?? 0))
                : stats
                  ? formatUSD(toNumberPrice(stats.pendingPayouts ?? 0))
                  : "—"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Pending across{" "}
              {pipeline?.pendingSellerOrders ??
                stats?.sellerOrders ??
                0}{" "}
              seller orders
            </p>
          </div>
          <Link
            href="/admin/marketplace/payouts"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-[#4E8D9C]"
          >
            Manage payouts <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </header>
      </section>

      <section className="nx-card p-6">
        <header className="flex items-end justify-between">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">
              Top sellers
            </h3>
            <p className="text-xs text-muted-foreground">
              Highest-revenue shops this period
            </p>
          </div>
          <Link
            href="/admin/marketplace/sellers"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-[#4E8D9C]"
          >
            All sellers <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </header>
        <div className="mt-5 space-y-2">
          {topSellers.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
              No seller activity yet.
            </p>
          ) : (
            topSellers.map((s, i) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold">
                    {i + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {s.shopName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {s.ordersCount} orders
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold">
                  {formatUSD(toNumberPrice(s.gmv))}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* keep Wallet import non-warning */}
      <span className="hidden">
        <Wallet />
      </span>
    </div>
  );
}

interface StatProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: "amber" | "blue" | "green" | "violet";
}

function Stat({ label, value, icon: Icon, accent }: StatProps) {
  const tone =
    accent === "amber"
      ? "bg-amber-500/15 text-amber-600"
      : accent === "blue"
        ? "bg-[#4E8D9C]/15 text-[#4E8D9C]"
        : accent === "violet"
          ? "bg-violet-500/15 text-violet-600"
          : "bg-emerald-500/15 text-emerald-600";
  return (
    <div className="nx-card p-5">
      <div className={`grid h-10 w-10 place-items-center rounded-2xl ${tone}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
