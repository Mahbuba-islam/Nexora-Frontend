"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  adminGeneratePayouts,
  adminMarkPayoutFailed,
  adminMarkPayoutPaid,
} from "@/src/services/payouts.service";

export function GeneratePayoutsButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const res = await adminGeneratePayouts();
          if (res.success) {
            toast.success(res.message || "Payouts generated.");
            router.refresh();
          } else {
            toast.error(res.message || "Failed to generate payouts.");
          }
        })
      }
      className="nx-btn-primary inline-flex h-10 items-center gap-2 rounded-full px-5 text-xs font-semibold disabled:opacity-50"
    >
      {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      Generate payouts
    </button>
  );
}

interface RowActionsProps {
  payoutId: string;
  status: string;
}

export function PayoutRowActions({ payoutId, status }: RowActionsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState<"PAID" | "FAILED" | null>(null);
  const [reference, setReference] = useState("");
  const [reason, setReason] = useState("");

  if (status !== "PENDING" && status !== "PROCESSING") return null;

  const submitPaid = () =>
    startTransition(async () => {
      const res = await adminMarkPayoutPaid(payoutId, reference.trim() || undefined);
      if (res.success) {
        toast.success("Payout marked paid.");
        setConfirming(null);
        router.refresh();
      } else toast.error(res.message || "Failed.");
    });

  const submitFailed = () =>
    startTransition(async () => {
      if (!reason.trim()) {
        toast.error("Reason is required.");
        return;
      }
      const res = await adminMarkPayoutFailed(payoutId, reason.trim());
      if (res.success) {
        toast.success("Payout marked failed.");
        setConfirming(null);
        router.refresh();
      } else toast.error(res.message || "Failed.");
    });

  if (confirming === "PAID") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="Reference (optional)"
          className="h-8 w-44 rounded-full border border-border bg-background px-3 text-xs outline-none focus:border-[#4E8D9C]"
        />
        <button
          type="button"
          disabled={pending}
          onClick={submitPaid}
          className="nx-btn-primary inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold disabled:opacity-50"
        >
          {pending && <Loader2 className="h-3 w-3 animate-spin" />}
          Confirm
        </button>
        <button
          type="button"
          onClick={() => setConfirming(null)}
          className="rounded-full px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    );
  }

  if (confirming === "FAILED") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Failure reason"
          className="h-8 w-48 rounded-full border border-red-300 bg-background px-3 text-xs outline-none focus:border-red-500"
        />
        <button
          type="button"
          disabled={pending}
          onClick={submitFailed}
          className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        >
          {pending && <Loader2 className="mr-1 inline h-3 w-3 animate-spin" />}
          Mark failed
        </button>
        <button
          type="button"
          onClick={() => setConfirming(null)}
          className="rounded-full px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => setConfirming("PAID")}
        className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100"
      >
        Mark paid
      </button>
      <button
        type="button"
        onClick={() => setConfirming("FAILED")}
        className="rounded-full border border-red-300 bg-red-50 px-3 py-1 text-[11px] font-semibold text-red-700 hover:bg-red-100"
      >
        Mark failed
      </button>
    </div>
  );
}
