"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { CheckCircle2, Mail, RefreshCw } from "lucide-react";

import AppField from "@/components/form/AppField";
import AppSubmitButton from "@/components/form/AppSubmitButton";
import { Button } from "@/components/ui/button";

import { httpClient } from "@/src/lib/axious/httpClient";

const friendlyOtpMessage = (rawMessage: unknown, fallback: string) => {
  const text = typeof rawMessage === "string" ? rawMessage.trim() : "";
  const lower = text.toLowerCase();

  if (!text) return fallback;
  if (/expired|expiry|timed?\s?out/.test(lower))
    return "This OTP has expired. Please request a new one.";
  if (/invalid|incorrect|wrong|mismatch|not match/.test(lower))
    return "The code you entered is incorrect. Please double-check and try again.";
  if (/too many|rate limit|limit reached|429/.test(lower))
    return "Too many attempts. Please wait a minute before trying again.";
  if (/not found|no otp|no record/.test(lower))
    return "No active code for this email. Tap “Send a new code” below.";
  if (/already verified|already used|used/.test(lower))
    return "This code has already been used. Please request a new one if needed.";
  if (/network|failed to fetch|timeout/.test(lower))
    return "Network issue. Check your connection and try again.";
  return text;
};

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [verified, setVerified] = useState(false);
  const [timer, setTimer] = useState(120);
  const canResend = timer <= 0;

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const verifyMutation = useMutation({
    mutationFn: async (payload: { email: string; otp: string }) => {
      return httpClient.post("/auth/verify-email", payload, {
        expectedStatuses: [400, 401, 403, 429],
      });
    },
  });

  const resendMutation = useMutation({
    mutationFn: async () => {
      return httpClient.post(
        "/auth/resend-otp",
        { email },
        { expectedStatuses: [400, 403, 404, 429] },
      );
    },
    onSuccess: () => {
      toast.success("A new code has been sent to your email.");
      setTimer(120);
    },
    onError: (err: unknown) => {
      const e = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const raw = e?.response?.data?.message || e?.message;
      toast.error(
        friendlyOtpMessage(
          raw,
          "Couldn't send a new code right now. Please try again.",
        ),
      );
    },
  });

  const form = useForm({
    defaultValues: { otp: "" },
    onSubmit: async ({ value }) => {
      try {
        await verifyMutation.mutateAsync({ email: email!, otp: value.otp });
        setVerified(true);
        toast.success("Email verified — taking you to sign in…");
        setTimeout(() => {
          window.location.href = `/login?email=${encodeURIComponent(email ?? "")}&verified=1`;
        }, 1200);
      } catch (err: unknown) {
        const e = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        const raw = e?.response?.data?.message || e?.message;
        toast.error(friendlyOtpMessage(raw, "Invalid OTP. Please try again."));
      }
    },
  });

  if (verified) {
    return (
      <div className="mx-auto mt-16 max-w-md p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#85C79A]/20 text-[#281C59]">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          Email verified
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Redirecting you to sign in…
        </p>
      </div>
    );
  }

  return (
    <div className="nx-card mx-auto mt-10 max-w-md p-8">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#EDF7BD] text-[#281C59]">
        <Mail className="h-5 w-5" />
      </div>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">
        Verify your email
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        We sent a 6-digit code to{" "}
        <strong className="text-foreground">{email}</strong>.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="mt-6 space-y-4"
      >
        <form.Field name="otp">
          {(field) => (
            <AppField field={field} label="OTP Code" placeholder="6-digit code" />
          )}
        </form.Field>

        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
          {([canSubmit, isSubmitting]) => (
            <AppSubmitButton
              isPending={isSubmitting || verifyMutation.isPending}
              pendingLabel="Verifying..."
              disabled={!canSubmit}
            >
              Verify Email
            </AppSubmitButton>
          )}
        </form.Subscribe>
      </form>

      <div className="mt-6 flex items-center justify-center gap-1 text-center">
        {!canResend ? (
          <p className="text-sm text-muted-foreground">
            Resend code in <strong>{timer}s</strong>
          </p>
        ) : (
          <Button
            variant="link"
            onClick={() => resendMutation.mutate()}
            disabled={resendMutation.isPending}
            className="gap-1.5"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${resendMutation.isPending ? "animate-spin" : ""}`}
            />
            Send a new code
          </Button>
        )}
      </div>
    </div>
  );
}
