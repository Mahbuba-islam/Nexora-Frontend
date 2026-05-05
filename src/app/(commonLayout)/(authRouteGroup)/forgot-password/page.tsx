import { KeyRound, Wand2 } from "lucide-react";

import ForgetPasswordForm from "@/components/modules/auth/ForgetPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(40,28,89,0.22),transparent_45%),radial-gradient(circle_at_85%_75%,rgba(78,141,156,0.22),transparent_45%),radial-gradient(circle_at_50%_100%,rgba(133,199,154,0.18),transparent_50%)]"
      />
      <div className="mx-auto w-full max-w-md">
        <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/70 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#281C59]/40">
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#281C59] via-[#4E8D9C] to-[#85C79A]" />
          <div className="pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-[#4E8D9C]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 size-56 rounded-full bg-[#F9FF56]/15 blur-3xl" />
          <div className="relative space-y-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-[#281C59] to-[#4E8D9C] text-white shadow-lg shadow-[#4E8D9C]/30">
                <KeyRound className="size-7" />
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#4E8D9C]/30 bg-[#4E8D9C]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#281C59] dark:border-[#4E8D9C]/40 dark:bg-[#4E8D9C]/20 dark:text-[#85C79A]">
                <Wand2 className="size-3.5" />
                Password recovery
              </span>
            </div>
            <ForgetPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
