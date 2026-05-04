import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Circle,
  Clock,
  Package,
  Store,
  Truck,
  X as XIcon,
} from "lucide-react";

import {
  getOrderById,
  type NxSellerOrder,
  type NxSellerOrderStatus,
} from "@/src/services/orders.service";
import { formatUSD } from "@/components/modules/Nexora/data";
import { toNumberPrice } from "@/src/types/nexora.types";

type Params = Promise<{ id: string }>;

export const metadata = {
  title: "Order details · Nexora",
};

const SELLER_STATUS_STYLES: Record<NxSellerOrderStatus, string> = {
  PENDING: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  ACCEPTED: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  PROCESSING: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  SHIPPED: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300",
  DELIVERED: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  CANCELLED: "bg-red-500/15 text-red-700 dark:text-red-300",
  REFUNDED: "bg-foreground/10 text-foreground/70",
};

const FULFILLMENT_STEPS: NxSellerOrderStatus[] = [
  "PENDING",
  "ACCEPTED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

export default async function OrderDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const placed = new Date(order.placedAt).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div>
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to orders
      </Link>

      <header className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Order {order.orderNumber}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
            Placed on {placed}
          </h2>
          {order.sellerOrders.length > 1 && (
            <p className="mt-2 inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-3 py-1 text-[11px] font-medium text-muted-foreground">
              <Store className="h-3 w-3" />
              Fulfilled by {order.sellerOrders.length} sellers — each ships
              independently
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Order total
          </p>
          <p className="text-3xl font-semibold tabular-nums tracking-tight">
            {formatUSD(toNumberPrice(order.total))}
          </p>
        </div>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Sub-orders */}
        <div className="space-y-5 lg:col-span-8">
          {order.sellerOrders.map((so) => (
            <SellerOrderCard key={so.id} sellerOrder={so} />
          ))}
        </div>

        {/* Sidebar: summary + addresses */}
        <aside className="lg:col-span-4">
          <div className="nx-card sticky top-24 space-y-6 p-6">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Order summary
              </h3>
              <dl className="mt-3 space-y-2 text-sm">
                <Row label="Subtotal" value={order.subtotal} />
                <Row label="Shipping" value={order.shippingCost} />
                <Row label="Tax" value={order.tax} />
                {toNumberPrice(order.discount) > 0 && (
                  <Row
                    label={
                      order.couponCode
                        ? `Discount (${order.couponCode})`
                        : "Discount"
                    }
                    value={`-${order.discount}`}
                    valueClassName="text-emerald-600 dark:text-emerald-400"
                  />
                )}
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-base font-semibold">
                  <dt>Total</dt>
                  <dd className="tabular-nums">
                    {formatUSD(toNumberPrice(order.total))}
                  </dd>
                </div>
              </dl>
            </div>

            {order.shippingAddress && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Shipping address
                </h3>
                <address className="mt-2 not-italic text-sm leading-relaxed text-foreground/80">
                  <p className="font-medium text-foreground">
                    {order.shippingAddress.name}
                  </p>
                  <p>{order.shippingAddress.line1}</p>
                  {order.shippingAddress.line2 && (
                    <p>{order.shippingAddress.line2}</p>
                  )}
                  <p>
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.region}{" "}
                    {order.shippingAddress.postal}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && (
                    <p className="mt-1">{order.shippingAddress.phone}</p>
                  )}
                </address>
              </div>
            )}

            {order.paymentMethod && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Payment
                </h3>
                <p className="mt-2 text-sm text-foreground/80">
                  {order.paymentMethod}
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={[
          "tabular-nums text-foreground",
          valueClassName ?? "",
        ].join(" ")}
      >
        {formatUSD(toNumberPrice(value))}
      </dd>
    </div>
  );
}

function SellerOrderCard({ sellerOrder }: { sellerOrder: NxSellerOrder }) {
  const status = sellerOrder.status;
  const eta = sellerOrder.estimatedDeliveryAt
    ? new Date(sellerOrder.estimatedDeliveryAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      })
    : null;
  const cancelled = status === "CANCELLED" || status === "REFUNDED";
  const currentStep = FULFILLMENT_STEPS.indexOf(status);

  return (
    <article className="nx-card overflow-hidden p-0">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-secondary/40 px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-background text-foreground/70">
            <Store className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Sold & fulfilled by
            </p>
            <p className="text-sm font-semibold tracking-tight">
              {sellerOrder.seller?.shopName ?? "Nexora seller"}
            </p>
          </div>
        </div>
        <span
          className={[
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider",
            SELLER_STATUS_STYLES[status],
          ].join(" ")}
        >
          {status === "SHIPPED" || status === "DELIVERED" ? (
            <Truck className="h-3 w-3" />
          ) : status === "CANCELLED" || status === "REFUNDED" ? (
            <XIcon className="h-3 w-3" />
          ) : (
            <Clock className="h-3 w-3" />
          )}
          {status.toLowerCase()}
        </span>
      </header>

      {/* Timeline */}
      {!cancelled && (
        <div className="border-b border-border px-5 py-5">
          <ol className="flex items-center justify-between">
            {FULFILLMENT_STEPS.map((step, idx) => {
              const reached = idx <= currentStep;
              const isCurrent = idx === currentStep;
              return (
                <li
                  key={step}
                  className="flex flex-1 items-center last:flex-none"
                >
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={[
                        "grid h-7 w-7 place-items-center rounded-full transition-colors",
                        reached
                          ? "bg-[#4E8D9C] text-white"
                          : "bg-secondary text-foreground/40",
                        isCurrent
                          ? "ring-2 ring-[#4E8D9C]/30 ring-offset-2 ring-offset-background"
                          : "",
                      ].join(" ")}
                    >
                      {reached ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Circle className="h-2 w-2 fill-current" />
                      )}
                    </div>
                    <span
                      className={[
                        "text-[10px] uppercase tracking-wider",
                        reached
                          ? "font-semibold text-foreground"
                          : "text-muted-foreground",
                      ].join(" ")}
                    >
                      {step.toLowerCase()}
                    </span>
                  </div>
                  {idx < FULFILLMENT_STEPS.length - 1 && (
                    <span
                      className={[
                        "mx-2 h-px flex-1 transition-colors",
                        idx < currentStep
                          ? "bg-[#4E8D9C]"
                          : "bg-border",
                      ].join(" ")}
                    />
                  )}
                </li>
              );
            })}
          </ol>
          {(sellerOrder.trackingNumber || eta) && (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              {sellerOrder.trackingNumber ? (
                <>
                  Tracking{" "}
                  <span className="font-mono text-foreground">
                    {sellerOrder.trackingNumber}
                  </span>
                  {sellerOrder.carrier && ` · ${sellerOrder.carrier}`}
                </>
              ) : (
                <>Estimated delivery {eta}</>
              )}
            </p>
          )}
        </div>
      )}

      {cancelled && sellerOrder.cancellationReason && (
        <div className="border-b border-border bg-red-500/5 px-5 py-3 text-sm text-red-700 dark:text-red-300">
          {sellerOrder.cancellationReason}
        </div>
      )}

      {/* Items */}
      <ul className="divide-y divide-border">
        {sellerOrder.items.map((item) => (
          <li key={item.id} className="flex items-center gap-4 px-5 py-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-secondary">
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              )}
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
            <div className="text-right">
              <p className="text-sm font-semibold tabular-nums">
                {formatUSD(toNumberPrice(item.price) * item.qty)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* Sub-order totals */}
      <div className="border-t border-border px-5 py-3 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-muted-foreground">
            Subtotal{" "}
            <span className="text-foreground tabular-nums">
              {formatUSD(toNumberPrice(sellerOrder.subtotal))}
            </span>
            {" · "}Shipping{" "}
            <span className="text-foreground tabular-nums">
              {formatUSD(toNumberPrice(sellerOrder.shippingCost))}
            </span>
            {" · "}Tax{" "}
            <span className="text-foreground tabular-nums">
              {formatUSD(toNumberPrice(sellerOrder.tax))}
            </span>
          </span>
          <span className="font-semibold text-foreground">
            <Package className="-mt-0.5 mr-1 inline h-3 w-3" />
            {formatUSD(toNumberPrice(sellerOrder.total))}
          </span>
        </div>
      </div>
    </article>
  );
}
