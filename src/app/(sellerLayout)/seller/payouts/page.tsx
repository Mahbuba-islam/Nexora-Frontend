import { Wallet } from "lucide-react";

import {
  getMyPayouts,
  getMySellerEarnings,
  type NxPayoutStatus,
} from "@/src/services/payouts.service";
import { formatUSD } from "@/components/modules/Nexora/data";
import { toNumberPrice } from "@/src/types/nexora.types";

export const metadata = { title: "Payouts · Seller · Nexora" };

const STATUS_STYLES: Record<NxPayoutStatus, string> = {
  PENDING: "bg-amber-500/15 text-amber-700",
  PROCESSING: "bg-[#4E8D9C]/15 text-[#4E8D9C]",
  PAID: "bg-emerald-500/15 text-emerald-700",
  FAILED: "bg-red-500/15 text-red-700",
  CANCELLED: "bg-zinc-500/15 text-zinc-700",
};

export default async function SellerPayoutsPage() {
  const [payouts, earnings] = await Promise.all([
    getMyPayouts(),
    getMySellerEarnings(),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Payouts
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Earnings, scheduled disbursements, and history.
        </p>
      </header>

      {earnings && (
        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCard
            label="Pending payout"
            value={formatUSD(toNumberPrice(earnings.pendingPayout))}
            accent="amber"
          />
          <SummaryCard
            label="Lifetime earnings"
            value={formatUSD(toNumberPrice(earnings.lifetimeEarnings))}
            accent="blue"
          />
          <SummaryCard
            label="Paid out"
            value={formatUSD(toNumberPrice(earnings.paidOut))}
            accent="green"
          />
        </div>
      )}

      <section className="nx-card overflow-hidden">
        <header className="flex items-center justify-between border-b border-border bg-secondary/40 px-5 py-3">
          <p className="text-xs font-semibold uppercase tracking-wider">
            Payout history
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
              Your earnings will be paid out on your scheduled disbursement
              date. Track each transfer here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {payouts.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"
              >
                <div>
                  <p className="text-sm font-semibold">
                    {formatUSD(toNumberPrice(p.amount))}
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
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_STYLES[p.status]}`}
                >
                  {p.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "amber" | "blue" | "green";
}) {
  const tone =
    accent === "amber"
      ? "bg-amber-500/15 text-amber-600"
      : accent === "blue"
        ? "bg-[#4E8D9C]/15 text-[#4E8D9C]"
        : "bg-emerald-500/15 text-emerald-600";
  return (
    <div className="nx-card p-5">
      <div className={`grid h-10 w-10 place-items-center rounded-2xl ${tone}`}>
        <Wallet className="h-5 w-5" />
      </div>
      <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
