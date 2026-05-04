import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

/**
 * Nexora auth route group layout.
 *
 * Apple-class split-screen: editorial hero on the left, form on the right.
 * Stacks on mobile.
 */
export default function AuthRouteGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-[calc(100svh-3.5rem)] bg-[#F9F8F6] text-[#18181B] dark:bg-[#18181B] dark:text-[#F9F8F6]">
      {/* Background orbs */}
      <div
        aria-hidden
        className="nx-orb pointer-events-none absolute -left-40 top-10 h-130 w-130 rounded-full"
        style={{
          background: "radial-gradient(circle, #3B82F6 0%, transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="nx-orb pointer-events-none absolute -right-40 bottom-0 h-130 w-130 rounded-full"
        style={{
          background: "radial-gradient(circle, #4BBFF9 0%, transparent 65%)",
          animationDelay: "-6s",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-10 md:px-8 md:py-16 lg:grid-cols-2 lg:gap-20 lg:py-24">
        {/* Left: editorial */}
        <aside className="flex flex-col justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </Link>

          <div className="mt-12 lg:mt-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1.5 text-[12px] font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-[#3B82F6]" />
              Welcome to Nexora
            </div>
            <h1 className="mt-5 text-4xl font-semibold leading-[0.95] tracking-tight md:text-6xl lg:text-7xl">
              Tech that
              <br />
              <span className="nx-shimmer-text">thinks with you.</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-foreground/70 md:text-lg">
              One Nexora account unlocks personalized AI recommendations,
              one-tap checkout, order tracking, and every device synced —
              everywhere you shop.
            </p>

            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6">
              {[
                { v: "2.4M+", l: "Buyers" },
                { v: "98%", l: "AI match" },
                { v: "24h", l: "Delivery" },
              ].map((s) => (
                <div key={s.l}>
                  <dt className="text-2xl font-semibold tracking-tight">
                    {s.v}
                  </dt>
                  <dd className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                    {s.l}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="mt-12 text-xs text-muted-foreground lg:mt-0">
            © {new Date().getFullYear()} Nexora · Curated by AI.
          </p>
        </aside>

        {/* Right: form slot */}
        <main className="relative">{children}</main>
      </div>
    </div>
  );
}
