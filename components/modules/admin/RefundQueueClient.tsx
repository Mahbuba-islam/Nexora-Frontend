"use client";

import { useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import {
  updateRefundStatus,
  type NxRefund,
  type NxRefundStatus,
} from "@/src/services/marketplaceExtras.service";
import { formatUSD } from "@/components/modules/Nexora/data";
import { Button } from "@/components/ui/button";

const STATUS_STYLES: Record<NxRefundStatus, string> = {
  REQUESTED: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  APPROVED: "bg-(--nx-blue-deep)/15 text-(--nx-blue-deep) dark:text-(--nx-cyan)",
  PROCESSING: "bg-(--nx-blue-deep)/15 text-(--nx-blue-deep) dark:text-(--nx-cyan)",
  REFUNDED: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  REJECTED: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  CANCELLED: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300",
};

export default function RefundQueueClient({
  initial,
}: {
  initial: NxRefund[];
}) {
  const [items, setItems] = useState<NxRefund[]>(initial);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "open" | "closed">("open");

  const filtered = items.filter((r) => {
    if (filter === "all") return true;
    if (filter === "open")
      return ["REQUESTED", "APPROVED", "PROCESSING"].includes(r.status);
    return ["REFUNDED", "REJECTED", "CANCELLED"].includes(r.status);
  });

  async function decide(id: string, status: NxRefundStatus) {
    setBusyId(id);
    const result = await updateRefundStatus(id, status);
    setBusyId(null);
    if (!result) {
      toast.error("Couldn't update refund.");
      return;
    }
    setItems((prev) => prev.map((r) => (r.id === id ? result : r)));
    toast.success(
      status === "APPROVED"
        ? "Refund approved. Stripe will process payout."
        : status === "REJECTED"
          ? "Refund rejected."
          : `Status updated to ${status}.`,
    );
  }

  return (
    <section className="nx-card overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-secondary/40 px-5 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider">
          Queue
        </p>
        <div className="flex gap-1">
          {(["open", "closed", "all"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                filter === f
                  ? "bg-(--nx-ink) text-white"
                  : "bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      {filtered.length === 0 ? (
        <div className="px-5 py-12 text-center text-sm text-muted-foreground">
          No refunds match this filter.
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {filtered.map((r) => {
            const amt = Number(r.amount) || 0;
            const open = ["REQUESTED", "APPROVED", "PROCESSING"].includes(
              r.status,
            );
            return (
              <li
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold tabular-nums">
                      {formatUSD(amt)}
                    </p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_STYLES[r.status]}`}
                    >
                      {r.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Order {r.orderId.slice(0, 8)}…
                    {r.customerName ? ` · ${r.customerName}` : ""}
                    {" · "}
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-foreground/80">
                    {r.reason}
                  </p>
                  {r.notes && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Note: {r.notes}
                    </p>
                  )}
                </div>

                {open && r.status === "REQUESTED" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => decide(r.id, "APPROVED")}
                      disabled={busyId === r.id}
                    >
                      {busyId === r.id ? (
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      ) : (
                        <Check className="mr-1 h-3 w-3" />
                      )}
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => decide(r.id, "REJECTED")}
                      disabled={busyId === r.id}
                    >
                      <X className="mr-1 h-3 w-3" />
                      Reject
                    </Button>
                  </div>
                )}

                {r.status === "APPROVED" && (
                  <Button
                    size="sm"
                    onClick={() => decide(r.id, "PROCESSING")}
                    disabled={busyId === r.id}
                  >
                    {busyId === r.id && (
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    )}
                    Process refund
                  </Button>
                )}

                {r.status === "PROCESSING" && (
                  <Button
                    size="sm"
                    onClick={() => decide(r.id, "REFUNDED")}
                    disabled={busyId === r.id}
                  >
                    {busyId === r.id && (
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    )}
                    Mark refunded
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
