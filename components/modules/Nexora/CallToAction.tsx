import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="nx-aurora relative overflow-hidden rounded-[2rem] border border-border bg-linear-to-br from-[#281C59] via-[#1A2742] to-[#4E8D9C] p-8 text-white shadow-[0_40px_80px_-40px_rgba(40,28,89,0.55)] md:p-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 -right-20 h-80 w-80 rounded-full bg-[#A8DCB8]/30 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#6FB6CC]/30 blur-3xl"
          />

          <div className="relative grid items-center gap-8 md:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
                <Sparkles className="h-3 w-3" />
                Nexora Insider
              </span>
              <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
                Ready to upgrade <br className="hidden md:block" />
                with intelligence?
              </h2>
              <p className="mt-4 max-w-md text-sm text-white/75 md:text-base">
                Join 1.4M shoppers who let Nexora AI find their next favourite
                tech — at the right price, at the right moment.
              </p>
            </div>

            <div className="flex flex-col items-start gap-4 md:items-end">
              <Link
                href="/register"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#281C59] shadow-[0_10px_30px_-10px_rgba(255,255,255,0.4)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-12px_rgba(255,255,255,0.55)]"
              >
                Create free account
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/shop"
                className="group inline-flex h-12 items-center gap-2 rounded-full border border-white/30 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Browse the marketplace
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <p className="text-[11px] text-white/55">
                No credit card · Cancel any time · 30-day returns
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
