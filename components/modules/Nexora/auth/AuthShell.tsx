import Image from "next/image";
import Link from "next/link";
import { Sparkles, ShieldCheck, Truck, Star } from "lucide-react";

interface AuthShellProps {
  children: React.ReactNode;
  eyebrow?: string;
  headline: string;
  subline: string;
}

/**
 * Premium two-column auth layout.
 *
 * Left: form on a clean surface (background-colored, not glass on glass).
 * Right (lg+): marketing panel with gradient + product imagery + trust badges.
 * Single full-bleed gradient background ties them together.
 */
export default function AuthShell({
  children,
  eyebrow = "Nexora marketplace",
  headline,
  subline,
}: AuthShellProps) {
  return (
    <div className="relative isolate min-h-[calc(100dvh-4rem)] w-full overflow-hidden bg-background">
      {/* Soft ambient gradient — no broken sizes, subtle in both themes */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 -top-40 h-112 w-md rounded-full bg-[#4E8D9C]/20 blur-3xl dark:bg-[#4E8D9C]/15" />
        <div className="absolute -right-40 top-1/3 h-104 w-104 rounded-full bg-[#F9FF56]/15 blur-3xl dark:bg-[#F9FF56]/10" />
        <div className="absolute bottom-0 left-1/3 h-88 w-88 rounded-full bg-[#85C79A]/15 blur-3xl dark:bg-[#85C79A]/10" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-8 px-4 py-8 sm:px-8 lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-2 lg:gap-12 lg:py-12">
        {/* Form pane */}
        <div className="flex w-full items-center justify-center">
          <div className="w-full max-w-md rounded-[2rem] border border-border bg-card/95 p-6 shadow-2xl backdrop-blur-xl md:p-9">
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground"
            >
              <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-[#281C59] ring-1 ring-border dark:bg-[#F9F8F6]">
                <Image
                  src="/logo/nexora-logo.png"
                  alt="Nexora"
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                />
              </span>
              Nexora
            </Link>
            {children}
          </div>
        </div>

        {/* Marketing pane */}
        <div className="hidden lg:block">
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-linear-to-br from-[#281C59] via-[#1A2742] to-[#4E8D9C] p-10 text-white shadow-2xl">
            {/* Decorative orbs */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#A8DCB8]/30 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-[#6FB6CC]/30 blur-3xl"
            />

            <div className="relative">
              <p className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur">
                <Sparkles className="h-3 w-3 text-[#F9FF56]" />
                {eyebrow}
              </p>
              <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight md:text-[2.5rem]">
                {headline}
              </h2>
              <p className="mt-4 max-w-md text-sm text-white/75 md:text-base">
                {subline}
              </p>

              {/* Stats row */}
              <dl className="mt-8 grid grid-cols-3 gap-3">
                <Stat label="Products" value="85K+" />
                <Stat label="Sellers" value="3.2K" />
                <Stat label="Rating" value="4.9★" />
              </dl>

              {/* Trust badges */}
              <ul className="mt-6 space-y-2.5 text-sm text-white/85">
                <Trust icon={ShieldCheck} text="Buyer protection on every order" />
                <Trust icon={Truck} text="Free shipping over $200 · 30-day returns" />
                <Trust icon={Star} text="Verified reviews from real customers" />
              </ul>

              {/* Testimonial card */}
              <figure className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm">
                <div className="flex items-center gap-0.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[#F9FF56] text-[#F9FF56]" />
                  ))}
                </div>
                <blockquote className="mt-3 text-sm leading-relaxed text-white/90">
                  “Nexora's AI nailed my upgrade in seconds — I've never trusted a
                  marketplace this much.”
                </blockquote>
                <figcaption className="mt-3 text-[11px] uppercase tracking-[0.18em] text-white/55">
                  Sophia · verified buyer
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 px-3 py-3 backdrop-blur-sm">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
        {label}
      </dt>
      <dd className="mt-1 text-xl font-semibold tracking-tight">{value}</dd>
    </div>
  );
}

function Trust({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}) {
  return (
    <li className="flex items-center gap-3">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 ring-1 ring-white/15">
        <Icon className="h-3.5 w-3.5 text-[#F9FF56]" />
      </span>
      {text}
    </li>
  );
}
