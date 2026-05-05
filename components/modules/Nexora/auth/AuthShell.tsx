import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";

interface AuthShellProps {
  children: React.ReactNode;
  /** Eyebrow above the headline shown on the right-side art panel. */
  eyebrow?: string;
  /** Large headline shown on the right-side art panel. */
  headline: string;
  /** Sub-copy under the headline. */
  subline: string;
}

/**
 * Two-column layout used by every auth page.
 * Left  → form (mobile-first)
 * Right → photographic art panel (lg:+ only)
 */
export default function AuthShell({
  children,
  eyebrow = "Nexora marketplace",
  headline,
  subline,
}: AuthShellProps) {
  return (
    <div className="grid min-h-[calc(100dvh-4rem)] w-full grid-cols-1 lg:grid-cols-2">
      <div className="flex w-full items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>

      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src="/imges/nexora-login-page.jpg"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 0px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-br from-[#281C59]/85 via-[#1B1844]/70 to-[#4E8D9C]/55" />
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
          <Link
            href="/"
            className="mb-auto inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-white/90"
          >
            <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/20">
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

          <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
            <Sparkles className="h-3 w-3" />
            {eyebrow}
          </p>
          <h2 className="mt-3 max-w-md text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            {headline}
          </h2>
          <p className="mt-3 max-w-md text-sm text-white/75">{subline}</p>

          <ul className="mt-8 grid grid-cols-3 gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
            <li className="rounded-2xl border border-white/15 bg-white/5 px-3 py-3 backdrop-blur-sm">
              AI-curated picks
            </li>
            <li className="rounded-2xl border border-white/15 bg-white/5 px-3 py-3 backdrop-blur-sm">
              Verified sellers
            </li>
            <li className="rounded-2xl border border-white/15 bg-white/5 px-3 py-3 backdrop-blur-sm">
              Buyer protection
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
