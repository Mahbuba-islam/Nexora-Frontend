"use client";

import { useEffect, useState } from "react";
import { ArrowRight, BadgeCheck, Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import {
  createStripeOnboardingLink,
  getStripeAccountStatus,
  type NxStripeAccountStatus,
} from "@/src/services/marketplaceExtras.service";

export default function StripeConnectCard() {
  const [status, setStatus] = useState<NxStripeAccountStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const s = await getStripeAccountStatus();
      if (!cancelled) {
        setStatus(s);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function startOnboarding() {
    setBusy(true);
    const link = await createStripeOnboardingLink();
    setBusy(false);
    if (!link?.url) {
      toast.error("Couldn't open Stripe onboarding. Try again in a moment.");
      return;
    }
    window.location.href = link.url;
  }

  const connected = !!status?.connected;
  const ready = connected && status?.payoutsEnabled && status?.detailsSubmitted;

  return (
    <section className="nx-card overflow-hidden">
      <header className="flex items-center justify-between border-b border-border bg-secondary/40 px-5 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider">
          Payout method · Stripe
        </p>
        {connected && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              ready
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                : "bg-amber-500/15 text-amber-700 dark:text-amber-400"
            }`}
          >
            {ready ? (
              <BadgeCheck className="h-3 w-3" />
            ) : (
              <ShieldAlert className="h-3 w-3" />
            )}
            {ready ? "Verified" : "Action needed"}
          </span>
        )}
      </header>

      <div className="flex flex-col items-start gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <p className="text-sm font-semibold">
            {ready
              ? "You're set up to receive payouts."
              : connected
                ? "Finish onboarding to start receiving payouts."
                : "Connect your Stripe account to receive payouts."}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Stripe handles secure transfers, KYC verification, and tax forms.
            You'll be redirected to Stripe to complete the steps.
          </p>
          {connected && status?.accountId && (
            <p className="mt-2 font-mono text-[11px] text-muted-foreground">
              Account: {status.accountId}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={startOnboarding}
          disabled={busy || loading}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-(--nx-ink) px-5 text-sm font-semibold text-white transition-colors hover:bg-(--nx-blue-deep) disabled:opacity-60"
        >
          {busy || loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
          {ready
            ? "Manage account"
            : connected
              ? "Continue onboarding"
              : "Connect Stripe"}
        </button>
      </div>
    </section>
  );
}
