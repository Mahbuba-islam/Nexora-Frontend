"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Package, Store, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getMyOrders,
  type NxOrder,
  type NxOrderItem,
  type NxOrderStatus,
} from "@/src/services/orders.service";
import { formatUSD } from "@/components/modules/Nexora/data";
import { toNumberPrice } from "@/src/types/nexora.types";

const STATUS_STYLES: Record<NxOrderStatus, string> = {
  PENDING: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  PAID: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  PROCESSING: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  SHIPPED: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300",
  PARTIAL: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  DELIVERED: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  CANCELLED: "bg-red-500/15 text-red-700 dark:text-red-300",
  REFUNDED: "bg-foreground/10 text-foreground/70",
};

const PAGE_SIZE = 10;

export default function OrdersClient() {
  const [orders, setOrders] = useState<NxOrder[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      const data = await getMyOrders({ page, limit: PAGE_SIZE });
      setOrders(data);
      setLoading(false);
    }
    fetchOrders();
  }, [page]);

  if (loading) return <div className="text-center py-10 text-muted-foreground">Loading…</div>;
  if (orders.length === 0) return <EmptyState />;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Orders
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {orders.length} {orders.length === 1 ? "order" : "orders"} on your account.
        </p>
      </div>

      <ul className="space-y-5">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </ul>
      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          className="px-4 py-2 rounded border text-xs"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>
        <span className="text-xs text-muted-foreground">
          Page {page}
        </span>
        <button
          className="px-4 py-2 rounded border text-xs"
          disabled={orders.length < PAGE_SIZE}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function flattenItems(order: NxOrder): NxOrderItem[] {
  return (order.sellerOrders ?? [])
    .flatMap((so) => so?.items ?? [])
    .filter((it): it is NxOrderItem => Boolean(it));
}

function OrderCard({ order }: { order: NxOrder }) {
  const placed = new Date(order.placedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const items = flattenItems(order);
  const sellerCount = order.sellerOrders.length;
  const trackingPreview = order.sellerOrders.find((s) => s.trackingNumber);

  return (
    <li className="nx-card overflow-hidden p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-secondary/40 px-5 py-3 text-xs">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Order placed
            </p>
            <p className="mt-0.5 font-medium text-foreground">{placed}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Total
            </p>
            <p className="mt-0.5 font-semibold tabular-nums text-foreground">
              {formatUSD(toNumberPrice(order.total))}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Order #
            </p>
            <p className="mt-0.5 font-mono text-foreground">
              {order.orderNumber}
            </p>
          </div>
          {sellerCount > 1 && (
            <div className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <Store className="h-3 w-3" />
              {sellerCount} sellers
            </div>
          )}
        </div>
        <span
          className={[
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider",
            STATUS_STYLES[order.status] ?? "bg-secondary text-foreground/80",
          ].join(" ")}
        >
          {order.status === "SHIPPED" || order.status === "DELIVERED" ? (
            <Truck className="h-3 w-3" />
          ) : (
            <Package className="h-3 w-3" />
          )}
          {order.status?.toLowerCase() ?? "pending"}
        </span>
      </div>

      <ul className="divide-y divide-border">
        {items.slice(0, 3).map((item) => (
          <li key={item.id} className="flex items-center gap-4 px-5 py-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-secondary">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name || "Product"}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              {item.productSlug ? (
                <Link
                  href={`/shop/${item.productSlug}`}
                  className="line-clamp-1 text-sm font-semibold text-foreground hover:text-[#4E8D9C]"
                >
                  {item.name}
                </Link>
              ) : (
                <p className="line-clamp-1 text-sm font-semibold text-foreground">
                  {item.name}
                </p>
              )}
              {item.variant && (
                <p className="text-xs text-muted-foreground">{item.variant}</p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                Qty {item.qty} · {formatUSD(toNumberPrice(item.price))}
              </p>
            </div>
          </li>
        ))}
        {items.length > 3 && (
          <li className="px-5 py-3 text-xs text-muted-foreground">
            + {items.length - 3} more {items.length - 3 === 1 ? "item" : "items"}
          </li>
        )}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3 text-xs">
        <div>
          {trackingPreview?.trackingNumber ? (
            <p className="text-muted-foreground">
              Tracking{" "}
              <span className="font-mono text-foreground">
                {trackingPreview.trackingNumber}
              </span>
              {trackingPreview.carrier && ` · ${trackingPreview.carrier}`}
              {sellerCount > 1 && ` (${sellerCount - 1} more)`}
            </p>
          ) : (
            <p className="text-muted-foreground">{order.itemsCount} items</p>
          )}
        </div>
        <Link
          href={`/account/orders/${order.id}`}
          className="inline-flex items-center gap-1 font-semibold text-foreground hover:text-[#4E8D9C]"
        >
          View details
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </li>
  );
}

function EmptyState() {
  return (
    <div className="nx-card flex min-h-80 flex-col items-center justify-center p-10 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-foreground/70">
        <Package className="h-6 w-6" />
      </div>
      <h2 className="mt-5 text-2xl font-semibold tracking-tight">
        No orders yet.
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        When you complete a purchase you&rsquo;ll see it here — with shipping
        tracking, invoices, and quick reorder.
      </p>
      <Link
        href="/shop"
        className="nx-btn-primary mt-7 inline-flex h-11 items-center gap-2 px-6 text-sm font-medium"
      >
        Start shopping
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}