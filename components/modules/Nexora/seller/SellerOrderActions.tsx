"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  updateSellerOrderStatus,
  type UpdateSellerOrderStatusPayload,
} from "@/src/services/sellerOrders.service";
import type { NxSellerOrderStatus } from "@/src/services/orders.service";

const NEXT_STATUS: Record<NxSellerOrderStatus, NxSellerOrderStatus[]> = {
  PENDING: ["ACCEPTED", "CANCELLED"],
  ACCEPTED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
  REFUNDED: [],
};

const LABELS: Record<NxSellerOrderStatus, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accept order",
  PROCESSING: "Mark as processing",
  SHIPPED: "Mark as shipped",
  DELIVERED: "Mark as delivered",
  CANCELLED: "Cancel order",
  REFUNDED: "Refund",
};

interface Props {
  sellerOrderId: string;
  currentStatus: NxSellerOrderStatus;
  trackingNumber?: string | null;
  carrier?: string | null;
}

export default function SellerOrderActions({
  sellerOrderId,
  currentStatus,
  trackingNumber: initialTracking,
  carrier: initialCarrier,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [tracking, setTracking] = useState(initialTracking ?? "");
  const [carrier, setCarrier] = useState(initialCarrier ?? "");
  const [reason, setReason] = useState("");
  const [confirming, setConfirming] = useState<NxSellerOrderStatus | null>(null);

  const transitions = NEXT_STATUS[currentStatus] ?? [];

  const requiresTracking = confirming === "SHIPPED";
  const requiresReason = confirming === "CANCELLED";

  const submit = (status: NxSellerOrderStatus) => {
    if (pending) return; // prevent double submit

    const payload: UpdateSellerOrderStatusPayload = { status };

    if (status === "SHIPPED") {
      if (!tracking.trim()) {
        toast.error("Tracking number is required.");
        return;
      }
      payload.trackingNumber = tracking.trim();
      if (carrier.trim()) payload.carrier = carrier.trim();
    }

    if (status === "CANCELLED") {
      if (!reason.trim()) {
        toast.error("Cancellation reason is required.");
        return;
      }
      payload.cancellationReason = reason.trim();
    }

    startTransition(async () => {
      const res = await updateSellerOrderStatus(sellerOrderId, payload);

      if (res?.success) {
        toast.success("Order updated successfully.");
        setConfirming(null);
        router.refresh();
      } else {
        toast.error(res?.message || "Failed to update order.");
      }
    });
  };

  if (!transitions.length) {
    return (
      <p className="rounded-2xl border border-dashed border-border px-4 py-3 text-xs text-muted-foreground">
        No further actions available for this order.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {!confirming ? (
        <div className="flex flex-wrap gap-2">
          {transitions.map((s) => (
            <button
              key={s}
              type="button"
              disabled={pending}
              onClick={() => {
                if (s === "SHIPPED" || s === "CANCELLED") {
                  setConfirming(s);
                } else {
                  submit(s);
                }
              }}
              className={
                s === "CANCELLED"
                  ? "rounded-full border border-red-300 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                  : "nx-btn-primary inline-flex h-9 items-center gap-2 rounded-full px-4 text-xs font-semibold disabled:opacity-50"
              }
            >
              {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {LABELS[s]}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-3 rounded-2xl border border-border bg-background p-4">
          <p className="text-sm font-semibold">{LABELS[confirming]}</p>

          {requiresTracking && (
            <>
              <input
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                placeholder="Tracking number"
                className="h-10 w-full rounded-xl border border-border px-3 text-sm outline-none focus:border-[#4E8D9C]"
              />
              <input
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                placeholder="Carrier (optional)"
                className="h-10 w-full rounded-xl border border-border px-3 text-sm outline-none focus:border-[#4E8D9C]"
              />
            </>
          )}

          {requiresReason && (
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for cancellation"
              rows={3}
              className="w-full rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-[#4E8D9C]"
            />
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setConfirming(null)}
              disabled={pending}
              className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => submit(confirming)}
              disabled={pending}
              className="nx-btn-primary inline-flex h-9 items-center gap-2 rounded-full px-4 text-xs font-semibold disabled:opacity-50"
            >
              {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}