import { Wallet } from "lucide-react";

import {
  getAdminPayouts,
  getPayoutPipeline,
} from "@/src/services/marketplace.service";
import type { NxPayout, NxPayoutStatus } from "@/src/services/payouts.service";
import {
  GeneratePayoutsButton,
  PayoutRowActions,
} from "@/components/modules/Nexora/admin/PayoutAdminControls";
import { formatUSD } from "@/components/modules/Nexora/data";
import { toNumberPrice } from "@/src/types/nexora.types";

export const metadata = { title: "Payouts · Nexora Admin" };

const STATUS_STYLES: Record<NxPayoutStatus, string> = {
  PENDING: "bg-amber-500/15 text-amber-700",
  PROCESSING: "bg-[#4E8D9C]/15 text-[#4E8D9C]",
  PAID: "bg-emerald-500/15 text-emerald-700",
  FAILED: "bg-red-500/15 text-red-700",
  CANCELLED: "bg-zinc-500/15 text-zinc-700",
};

export default async function AdminPayoutsPage() {
  const [payouts, pipeline] = await Promise.all([
    getAdminPayouts() as Promise<NxPayout[]>,
    getPayoutPipeline(),
  ]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Payouts
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate, approve, and reconcile seller payouts.
          </p>
        </div>
        <GeneratePayoutsButton />
      </header>

      {pipeline && (
        <div className="nx-card p-6">
          <div className="grid gap-2 sm:grid-cols-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Pending payout amount
              </p>
              <p className="mt-1 text-xl font-semibold tracking-tight">
                {formatUSD(toNumberPrice(pipeline.pendingPayoutAmount))}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Pending seller orders
              </p>
              <p className="mt-1 text-xl font-semibold tracking-tight">
                {pipeline.pendingSellerOrders}
              </p>
            </div>
            {pipeline.scheduledNext && (
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Next disbursement
                </p>
                <p className="mt-1 text-xl font-semibold tracking-tight">
                  {new Date(pipeline.scheduledNext).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <section className="nx-card overflow-hidden">
        <header className="flex items-center justify-between border-b border-border bg-secondary/40 px-5 py-3">
          <p className="text-xs font-semibold uppercase tracking-wider">
            All payouts
          </p>
          <p className="text-[11px] text-muted-foreground">
            {payouts.length} {payouts.length === 1 ? "entry" : "entries"}
          </p>
        </header>
        {payouts.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-foreground/70">
              <Wallet className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-semibold">No payouts yet</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Generate a payout cycle to aggregate pending seller earnings.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {payouts.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold">
                    {formatUSD(toNumberPrice(p.amount))}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      to {p.sellerName || p.sellerId.slice(0, 8)}
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {new Date(p.periodStart).toLocaleDateString()} –{" "}
                    {new Date(p.periodEnd).toLocaleDateString()}
                    {typeof p.orderCount === "number" &&
                      ` · ${p.orderCount} orders`}
                  </p>
                  {p.failureReason && (
                    <p className="mt-1 text-xs text-red-600">
                      {p.failureReason}
                    </p>
                  )}
                  {p.reference && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Ref: {p.reference}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_STYLES[p.status]}`}
                  >
                    {p.status}
                  </span>
                  <PayoutRowActions payoutId={p.id} status={p.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
