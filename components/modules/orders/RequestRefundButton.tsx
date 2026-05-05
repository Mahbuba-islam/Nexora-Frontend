"use client";

import { useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { createRefundRequest } from "@/src/services/marketplaceExtras.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const REASONS = [
  { value: "damaged", label: "Item arrived damaged" },
  { value: "wrong-item", label: "Wrong item received" },
  { value: "not-as-described", label: "Not as described" },
  { value: "no-longer-needed", label: "No longer needed" },
  { value: "defective", label: "Defective / not working" },
  { value: "other", label: "Other" },
];

export default function RequestRefundButton({
  orderId,
  maxAmount,
}: {
  orderId: string;
  maxAmount?: number;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [amount, setAmount] = useState<string>(
    maxAmount != null ? maxAmount.toFixed(2) : "",
  );
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!reason) {
      toast.error("Pick a reason for the refund.");
      return;
    }
    setBusy(true);
    const parsedAmount = amount ? Number(amount) : undefined;
    const result = await createRefundRequest({
      orderId,
      amount: parsedAmount,
      reason: details ? `${reason}: ${details}` : reason,
    });
    setBusy(false);
    if (!result) {
      toast.error("Couldn't submit refund. Try again in a moment.");
      return;
    }
    toast.success("Refund request submitted. We'll review within 24h.");
    setOpen(false);
    setReason("");
    setDetails("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="inline-flex items-center gap-1.5"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Request refund
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request a refund</DialogTitle>
          <DialogDescription>
            Tell us what happened. We&rsquo;ll review and respond within 24h.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Reason
            </label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Amount (USD)
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={
                maxAmount != null ? `Up to ${maxAmount.toFixed(2)}` : "Optional"
              }
            />
            <p className="text-[11px] text-muted-foreground">
              Leave empty to request a full refund.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Details (optional)
            </label>
            <Textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="A few words help us resolve faster…"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            type="button"
            onClick={() => setOpen(false)}
            disabled={busy}
          >
            Cancel
          </Button>
          <Button onClick={submit} disabled={busy}>
            {busy && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
            Submit request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
