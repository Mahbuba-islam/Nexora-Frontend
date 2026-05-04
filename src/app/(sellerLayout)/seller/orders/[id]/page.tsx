import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Package, Truck } from "lucide-react";

import { getSellerOrderById } from "@/src/services/sellerOrders.service";
import SellerOrderActions from "@/components/modules/Nexora/seller/SellerOrderActions";
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

type Params = Promise<{ id: string }>;

export default async function SellerOrderDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const order = await getSellerOrderById(id);
  if (!order) notFound();

  const placed = new Date(order.createdAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="space-y-6">
      <Link
        href="/seller/orders"
        className="inline-flex items-center gap-2 text-xs font-semibold text-foreground/70 hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All orders
      </Link>

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Order #{order.orderNumber || order.orderId.slice(0, 8)}
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
            {formatUSD(toNumberPrice(order.total))}{" "}
            <span className="text-sm font-medium text-muted-foreground">
              gross
            </span>
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">Placed {placed}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${STATUS_STYLES[order.status]}`}
        >
          {order.status}
        </span>
      </header>

      <section className="nx-card p-6">
        <h3 className="text-sm font-semibold tracking-tight">Actions</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Move this order through fulfilment.
        </p>
        <div className="mt-4">
          <SellerOrderActions
            sellerOrderId={order.id}
            currentStatus={order.status}
            trackingNumber={order.trackingNumber}
            carrier={order.carrier}
          />
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-3">
        <section className="nx-card overflow-hidden md:col-span-2">
          <header className="flex items-center justify-between border-b border-border bg-secondary/40 px-5 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider">
              Items ({order.items?.length || 0})
            </p>
          </header>
          <ul className="divide-y divide-border">
            {(order.items || []).map((item) => (
              <li
                key={item.id}
                className="flex gap-4 px-5 py-4"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-secondary">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-foreground/40">
                      <Package className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-semibold">
                    {item.name}
                  </p>
                  {item.variant && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.variant}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    Qty {item.qty} ·{" "}
                    {formatUSD(toNumberPrice(item.price))}
                  </p>
                </div>
                <p className="text-sm font-semibold">
                  {formatUSD(toNumberPrice(item.price) * item.qty)}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <aside className="space-y-6">
          <section className="nx-card p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Earnings breakdown
            </h3>
            <dl className="mt-3 space-y-2 text-sm">
              <Row label="Subtotal" value={formatUSD(toNumberPrice(order.subtotal))} />
              <Row label="Shipping" value={formatUSD(toNumberPrice(order.shippingCost))} />
              <Row label="Tax" value={formatUSD(toNumberPrice(order.tax))} />
              {toNumberPrice(order.discount) > 0 && (
                <Row
                  label="Discount"
                  value={`-${formatUSD(toNumberPrice(order.discount))}`}
                />
              )}
              <Row
                label="Commission"
                muted
                value={`-${formatUSD(toNumberPrice(order.commissionAmount))}${
                  order.commissionRate
                    ? ` (${(Number(order.commissionRate) * 100).toFixed(1)}%)`
                    : ""
                }`}
              />
              <div className="border-t border-border pt-2">
                <Row
                  label="Your net"
                  bold
                  value={formatUSD(toNumberPrice(order.sellerNetAmount))}
                />
              </div>
            </dl>
          </section>

          {order.trackingNumber && (
            <section className="nx-card p-5">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Truck className="h-3.5 w-3.5" /> Shipping
              </h3>
              <p className="mt-2 text-sm font-semibold">
                {order.trackingNumber}
              </p>
              {order.carrier && (
                <p className="text-xs text-muted-foreground">{order.carrier}</p>
              )}
            </section>
          )}

          {order.buyer && (
            <section className="nx-card p-5">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> Buyer
              </h3>
              <p className="mt-2 text-sm font-semibold">
                {order.buyer.name || "Customer"}
              </p>
              {order.buyer.email && (
                <p className="text-xs text-muted-foreground">
                  {order.buyer.email}
                </p>
              )}
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  muted,
}: {
  label: string;
  value: string;
  bold?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={
        bold
          ? "flex justify-between text-sm font-semibold"
          : muted
            ? "flex justify-between text-xs text-muted-foreground"
            : "flex justify-between text-sm"
      }
    >
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
