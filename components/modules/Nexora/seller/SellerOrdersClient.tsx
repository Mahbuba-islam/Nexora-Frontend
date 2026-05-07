"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import { useEffect, useState } from "react";

import { getMySellerOrders } from "@/src/services/sellerOrders.service";
import { formatUSD } from "@/components/modules/Nexora/data";
import { toNumberPrice } from "@/src/types/nexora.types";
import type { NxSellerOrderStatus } from "@/src/services/orders.service";

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

const PAGE_SIZE = 10;

export default function SellerOrdersClient() {
  const [orders, setOrders] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);

      const tab = TABS.find((t) => t.label === activeTab) || TABS[0];
      const status =
        tab.statuses === "all" ? undefined : tab.statuses[0];

     try {
  const data = await getMySellerOrders({
    status,
    page,
    limit: PAGE_SIZE,
  });

  setOrders(data ?? []);
} finally {
  setLoading(false);
}
    }

    fetchOrders();
  }, [activeTab, page]);

  return (
    <div>
      {/* HEADER */}
      <header className="mb-6">
        <h2 className="text-2xl font-semibold md:text-3xl">Orders</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage incoming orders, fulfilment, and shipping.
        </p>
      </header>

      {/* TABS */}
      <nav className="mb-5 flex flex-wrap gap-1 rounded-full border p-1">
        {TABS.map((t) => {
          const isActive = t.label === activeTab;

          return (
            <button
              key={t.label}
              onClick={() => {
                setActiveTab(t.label);
                setPage(1);
              }}
              className={
                isActive
                  ? "rounded-full bg-foreground px-4 py-1.5 text-xs font-semibold text-background"
                  : "rounded-full px-4 py-1.5 text-xs font-semibold text-foreground/70"
              }
            >
              {t.label}
            </button>
          );
        })}
      </nav>

      {/* CONTENT */}
      {loading ? (
        <p className="py-10 text-center text-muted-foreground">
          Loading…
        </p>
      ) : orders.length === 0 ? (
        <div className="nx-card flex flex-col items-center p-12 text-center">
          <Package className="h-6 w-6 text-muted-foreground" />
          <h3 className="mt-5 text-xl font-semibold">
            No orders here.
          </h3>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o: any) => (
            <Link
              key={o.id}
              href={`/seller/orders/${o.id}`}
              className="nx-card flex justify-between p-5"
            >
              <div>
                <p className="font-semibold">
                  #{o.orderNumber || o.orderId?.slice(0, 8)}
                </p>

                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs ${
                    STATUS_STYLES[o.status as NxSellerOrderStatus]
                  }`}
                >
                  {o.status}
                </span>
              </div>

              <div className="text-right font-semibold">
                {formatUSD(toNumberPrice(o.total))}
              </div>
            </Link>
          ))}

          {/* PAGINATION */}
          <div className="mt-6 flex justify-between">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded border px-4 py-2 text-xs"
            >
              Prev
            </button>

            <span className="text-xs">Page {page}</span>

            <button
              disabled={orders.length < PAGE_SIZE}
              onClick={() => setPage((p) => p + 1)}
              className="rounded border px-4 py-2 text-xs"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}