import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";

interface AuthShellProps {
  children: React.ReactNode;
  eyebrow?: string;
  headline: string;
  subline: string;
}

/**
 * Premium glassmorphic auth shell.
 * Background image fills the viewport. Form sits inside a translucent
 * card. Marketing copy floats in a second glass panel on large screens.
 */
export default function AuthShell({
  children,
  eyebrow = "Nexora marketplace",
  headline,
  subline,
}: AuthShellProps) {
  return (
    <div className="relative isolate min-h-[calc(100dvh-4rem)] w-full overflow-hidden">
      {/* Full-bleed background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src="/imges/nexora-login-page.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-br from-[#281C59]/85 via-[#1B1844]/72 to-[#0a0a18]/85 dark:from-[#0a0716]/85 dark:via-[#141328]/72 dark:to-black/85" />
        <div
          className="absolute -left-32 top-12 h-md w-md rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(78,141,156,0.45) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute -right-32 bottom-0 h-md w-md rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(249,255,86,0.25) 0%, transparent 65%)",
          }}
        />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-stretch gap-8 px-4 py-12 sm:px-8 lg:grid-cols-[1fr_1fr] lg:gap-12 lg:py-16">
        {/* Form pane */}
        <div className="flex w-full items-center justify-center">
          <div className="w-full max-w-md rounded-[2rem] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl md:p-10">
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-white"
            >
              <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-white/15 ring-1 ring-white/25">
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
        <div className="hidden items-end lg:flex">
          <div className="w-full rounded-[2rem] border border-white/15 bg-white/5 p-10 shadow-xl backdrop-blur-xl">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
              <Sparkles className="h-3 w-3 text-[#F9FF56]" />
              {eyebrow}
            </p>
            <h2 className="mt-3 max-w-md text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl">
              {headline}
            </h2>
            <p className="mt-3 max-w-md text-sm text-white/75">{subline}</p>

            <ul className="mt-8 grid grid-cols-3 gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
              <li className="rounded-2xl border border-white/15 bg-white/10 px-3 py-3 backdrop-blur-sm">
                AI-curated picks
              </li>
              <li className="rounded-2xl border border-white/15 bg-white/10 px-3 py-3 backdrop-blur-sm">
                Verified sellers
              </li>
              <li className="rounded-2xl border border-white/15 bg-white/10 px-3 py-3 backdrop-blur-sm">
                Buyer protection
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
