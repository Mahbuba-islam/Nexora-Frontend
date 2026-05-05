import { RefreshCw } from "lucide-react";

import { getAdminRefunds } from "@/src/services/marketplaceExtras.service";
import { formatUSD } from "@/components/modules/Nexora/data";
import RefundQueueClient from "@/components/modules/admin/RefundQueueClient";

export const metadata = { title: "Refunds · Nexora Admin" };

export default async function AdminRefundsPage() {
  const refunds = await getAdminRefunds();

  const totals = refunds.reduce(
    (acc, r) => {
      const amt = Number(r.amount) || 0;
      acc.total += amt;
      if (r.status === "REQUESTED" || r.status === "APPROVED" || r.status === "PROCESSING") {
        acc.pending += amt;
        acc.pendingCount += 1;
      }
      if (r.status === "REFUNDED") {
        acc.paid += amt;
      }
      return acc;
    },
    { total: 0, pending: 0, paid: 0, pendingCount: 0 },
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Refunds & RMA
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Approve, reject, and track customer refund requests.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
          <RefreshCw className="h-3.5 w-3.5" />
          {refunds.length} total
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          label="Awaiting action"
          value={`${totals.pendingCount}`}
          accent="amber"
        />
        <SummaryCard
          label="Pending amount"
          value={formatUSD(totals.pending)}
          accent="blue"
        />
        <SummaryCard
          label="Refunded"
          value={formatUSD(totals.paid)}
          accent="green"
        />
      </div>

      <RefundQueueClient initial={refunds} />
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
      ? "from-amber-500/15 to-amber-500/5 text-amber-700 dark:text-amber-400"
      : accent === "blue"
        ? "from-(--nx-blue-deep)/15 to-(--nx-blue-deep)/5 text-(--nx-blue-deep) dark:text-(--nx-cyan)"
        : "from-emerald-500/15 to-emerald-500/5 text-emerald-700 dark:text-emerald-400";
  return (
    <div className={`nx-card bg-linear-to-br ${tone} p-5`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-foreground">
        {value}
      </p>
    </div>
  );
}
