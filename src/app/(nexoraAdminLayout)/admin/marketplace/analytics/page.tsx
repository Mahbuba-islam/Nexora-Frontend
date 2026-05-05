import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  Crown,
  Receipt,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  getConversionFunnel,
  getCustomerAcquisition,
  getInventoryHealth,
  getOrdersTimeseries,
  getRefundMetrics,
  getSalesByCategory,
  getTopCustomers,
} from "@/src/services/admin.service";
import { formatUSD } from "@/components/modules/Nexora/data";

import {
  CustomerAcquisitionChart,
  OrdersTimeseriesChart,
  RefundsPieChart,
  SalesByCategoryChart,
} from "@/components/modules/admin/AnalyticsCharts";

export const metadata = { title: "Analytics · Nexora Admin" };
export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const [
    timeseries,
    salesByCategory,
    acquisition,
    refunds,
    topCustomers,
    funnel,
    inventory,
  ] = await Promise.all([
    getOrdersTimeseries(30),
    getSalesByCategory(8),
    getCustomerAcquisition(30),
    getRefundMetrics(),
    getTopCustomers(10),
    getConversionFunnel(30),
    getInventoryHealth(),
  ]);

  const totalRevenue = (timeseries ?? []).reduce(
    (sum, p) => sum + Number(p.revenue),
    0,
  );
  const totalOrders = (timeseries ?? []).reduce((s, p) => s + p.orders, 0);
  const newCustomers = (acquisition ?? []).reduce(
    (s, p) => s + p.customers,
    0,
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Analytics
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time pulse on revenue, orders, customers, refunds, and inventory health.
          </p>
        </div>
        <span className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          <Activity className="h-3 w-3 text-emerald-500" />
          Last 30 days
        </span>
      </header>

      {/* KPI strip */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          label="Revenue (30d)"
          value={formatUSD(totalRevenue)}
          icon={TrendingUp}
          delta="vs last month"
        />
        <Kpi
          label="Orders (30d)"
          value={totalOrders.toLocaleString()}
          icon={ShoppingBag}
        />
        <Kpi
          label="New customers"
          value={newCustomers.toLocaleString()}
          icon={Users}
        />
        <Kpi
          label="Refunded"
          value={formatUSD(Number(refunds?.totalRefunded ?? 0))}
          icon={Receipt}
          tone="rose"
          delta={
            refunds?.refundRatePct != null
              ? `${refunds.refundRatePct.toFixed(2)}% refund rate`
              : undefined
          }
        />
      </div>

      {/* Funnel + inventory pills */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="nx-card p-5 lg:col-span-2">
          <SectionHead
            title="Conversion funnel"
            subtitle="Carts → checkout → paid orders"
          />
          {funnel ? (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <FunnelStep label="Carts" value={funnel.carts} />
              <FunnelStep
                label="Abandoned"
                value={funnel.abandonedCarts}
                tone="rose"
                arrow="down"
              />
              <FunnelStep
                label="Converted"
                value={funnel.convertedCarts}
                tone="emerald"
                arrow="up"
              />
              <FunnelStep
                label="Paid orders"
                value={funnel.paidOrders}
                tone="violet"
              />
              <FunnelStep
                label="Conversion rate"
                value={`${funnel.conversionRatePct.toFixed(1)}%`}
                tone="emerald"
              />
              <FunnelStep
                label="Abandonment"
                value={`${funnel.abandonmentRatePct.toFixed(1)}%`}
                tone="rose"
              />
            </div>
          ) : (
            <Empty />
          )}
        </div>
        <div className="nx-card p-5">
          <SectionHead
            title="Inventory health"
            subtitle="Catalog status snapshot"
          />
          {inventory ? (
            <ul className="mt-4 space-y-2 text-sm">
              <InvRow label="Active" value={inventory.active} tone="emerald" icon={Boxes} />
              <InvRow label="Low stock" value={inventory.lowStock} tone="amber" icon={AlertTriangle} />
              <InvRow label="Out of stock" value={inventory.outOfStock} tone="rose" icon={AlertTriangle} />
              <InvRow label="Drafts" value={inventory.drafts} tone="muted" icon={Boxes} />
              <InvRow label="Archived" value={inventory.archived} tone="muted" icon={Boxes} />
            </ul>
          ) : (
            <Empty />
          )}
        </div>
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="nx-card p-5 lg:col-span-2">
          <SectionHead
            title="Orders & paid orders"
            subtitle="Daily volume over last 30 days"
          />
          <div className="mt-4">
            {timeseries && timeseries.length > 0 ? (
              <OrdersTimeseriesChart data={timeseries} />
            ) : (
              <Empty />
            )}
          </div>
        </div>
        <div className="nx-card p-5">
          <SectionHead title="Refund mix" subtitle="By status" />
          <div className="mt-4">
            {refunds ? <RefundsPieChart data={refunds} /> : <Empty />}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="nx-card p-5 lg:col-span-2">
          <SectionHead
            title="Sales by category"
            subtitle="Top revenue-generating categories"
          />
          <div className="mt-4">
            {salesByCategory && salesByCategory.length > 0 ? (
              <SalesByCategoryChart data={salesByCategory} />
            ) : (
              <Empty />
            )}
          </div>
        </div>
        <div className="nx-card p-5">
          <SectionHead
            title="Customer acquisition"
            subtitle="Daily signups"
          />
          <div className="mt-4">
            {acquisition && acquisition.length > 0 ? (
              <CustomerAcquisitionChart data={acquisition} />
            ) : (
              <Empty />
            )}
          </div>
        </div>
      </div>

      {/* Top customers */}
      <div className="nx-card p-5">
        <SectionHead
          title="Top customers"
          subtitle="By lifetime spend in this period"
        />
        {topCustomers && topCustomers.length > 0 ? (
          <ol className="mt-4 divide-y divide-border">
            {topCustomers.map((c, i) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-3 py-3 text-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-secondary text-[11px] font-bold">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">
                      {c.name ?? "Anonymous"}{" "}
                      {i === 0 && (
                        <Crown className="ml-1 inline h-3.5 w-3.5 text-amber-500" />
                      )}
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {c.email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatUSD(Number(c.spend))}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {c.orders} orders
                  </p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <Empty />
        )}
      </div>
    </div>
  );
}

function SectionHead({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div>
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      {subtitle && (
        <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}

function Kpi({
  label,
  value,
  icon: Icon,
  tone,
  delta,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "rose" | "emerald";
  delta?: string;
}) {
  const valueTone =
    tone === "rose"
      ? "text-rose-600"
      : tone === "emerald"
        ? "text-emerald-600"
        : "text-foreground";
  return (
    <div className="nx-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        <Icon className="h-4 w-4 text-foreground/40" />
      </div>
      <p className={`mt-2 text-2xl font-semibold tracking-tight ${valueTone}`}>
        {value}
      </p>
      {delta && (
        <p className="mt-1 text-[11px] text-muted-foreground">{delta}</p>
      )}
    </div>
  );
}

function FunnelStep({
  label,
  value,
  tone,
  arrow,
}: {
  label: string;
  value: number | string;
  tone?: "emerald" | "rose" | "violet";
  arrow?: "up" | "down";
}) {
  const styles =
    tone === "emerald"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
      : tone === "rose"
        ? "border-rose-500/30 bg-rose-500/10 text-rose-600"
        : tone === "violet"
          ? "border-[#4E8D9C]/30 bg-[#4E8D9C]/10 text-[#4E8D9C]"
          : "border-border bg-secondary/40 text-foreground";
  return (
    <div className={`rounded-2xl border p-3 ${styles}`}>
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.16em] opacity-80">
          {label}
        </p>
        {arrow === "up" && <ArrowUpRight className="h-3 w-3" />}
        {arrow === "down" && <ArrowDownRight className="h-3 w-3" />}
      </div>
      <p className="mt-1 text-lg font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function InvRow({
  label,
  value,
  tone,
  icon: Icon,
}: {
  label: string;
  value: number;
  tone: "emerald" | "amber" | "rose" | "muted";
  icon: React.ComponentType<{ className?: string }>;
}) {
  const tones = {
    emerald: "text-emerald-600",
    amber: "text-amber-600",
    rose: "text-rose-600",
    muted: "text-foreground/60",
  } as const;
  return (
    <li className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2">
      <span className="flex items-center gap-2 text-foreground/80">
        <Icon className={`h-3.5 w-3.5 ${tones[tone]}`} />
        {label}
      </span>
      <span className={`font-semibold ${tones[tone]}`}>{value}</span>
    </li>
  );
}

function Empty() {
  return (
    <p className="grid h-45 place-items-center text-sm text-muted-foreground">
      No data yet.
    </p>
  );
}
