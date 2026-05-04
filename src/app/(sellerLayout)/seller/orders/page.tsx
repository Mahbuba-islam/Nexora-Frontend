import Link from "next/link";
import { Package } from "lucide-react";

import { getMySellerOrders } from "@/src/services/sellerOrders.service";
import { formatUSD } from "@/components/modules/Nexora/data";
import { toNumberPrice } from "@/src/types/nexora.types";
import type { NxSellerOrderStatus } from "@/src/services/orders.service";

export const metadata = { title: "Orders · Seller · Nexora" };

const STATUS_STYLES: Record<NxSellerOrderStatus, string> = {
  PENDING: "bg-amber-500/15 text-amber-700",
  ACCEPTED: "bg-[#4E8D9C]/15 text-[#4E8D9C]",
  PROCESSING: "bg-violet-500/15 text-violet-700",
  SHIPPED: "bg-indigo-500/15 text-indigo-700",
  DELIVERED: "bg-emerald-500/15 text-emerald-700",
  CANCELLED: "bg-red-500/15 text-red-700",
  REFUNDED: "bg-zinc-500/15 text-zinc-700",
};

const TABS: { label: string; statuses: NxSellerOrderStatus[] | "all" }[] = [
  { label: "All", statuses: "all" },
  { label: "New", statuses: ["PENDING"] },
  { label: "Processing", statuses: ["ACCEPTED", "PROCESSING"] },
  { label: "Shipped", statuses: ["SHIPPED"] },
  { label: "Delivered", statuses: ["DELIVERED"] },
];

interface SP {
  searchParams: Promise<{ tab?: string }>;
}

export default async function SellerOrdersPage({ searchParams }: SP) {
  const sp = await searchParams;
  const activeTab = sp.tab || "All";
  const orders = await getMySellerOrders({ limit: 100 });

  const tab = TABS.find((t) => t.label === activeTab) || TABS[0];
  const visible =
    tab.statuses === "all"
      ? orders
      : orders.filter((o) => (tab.statuses as NxSellerOrderStatus[]).includes(o.status));

  return (
    <div>
      <header className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Orders
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage incoming orders, fulfilment, and shipping.
        </p>
      </header>

      <nav className="mb-5 flex flex-wrap gap-1 rounded-full border border-border bg-background p-1">
        {TABS.map((t) => {
          const isActive = t.label === activeTab;
          return (
            <Link
              key={t.label}
              href={`/seller/orders?tab=${encodeURIComponent(t.label)}`}
              className={
                isActive
                  ? "rounded-full bg-foreground px-4 py-1.5 text-xs font-semibold text-background"
                  : "rounded-full px-4 py-1.5 text-xs font-semibold text-foreground/70 hover:text-foreground"
              }
            >
              {t.label}
            </Link>
          );
        })}
      </nav>

      {visible.length === 0 ? (
        <div className="nx-card flex flex-col items-center justify-center p-12 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-foreground/70">
            <Package className="h-6 w-6" />
          </div>
          <h3 className="mt-5 text-xl font-semibold">No orders here.</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            When customers buy from your shop, orders will appear in this tab.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((o) => (
            <Link
              key={o.id}
              href={`/seller/orders/${o.id}`}
              className="nx-card flex flex-wrap items-center justify-between gap-4 p-5 transition-colors hover:bg-secondary/40"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold">
                    #{o.orderNumber || o.orderId.slice(0, 8)}
                  </p>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_STYLES[o.status]}`}
                  >
                    {o.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {o.items?.length || 0} item
                  {(o.items?.length || 0) === 1 ? "" : "s"} ·{" "}
                  {new Date(o.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
                {o.buyer?.name && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {o.buyer.name}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">
                  {formatUSD(toNumberPrice(o.total))}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Net {formatUSD(toNumberPrice(o.sellerNetAmount))}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
