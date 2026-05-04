import Link from "next/link";
import { ArrowRight, Wand2 } from "lucide-react";

interface ComingSoonSectionProps {
  eyebrow?: string;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  bullets?: string[];
}

export default function ComingSoonSection({
  eyebrow = "Nexora · in the works",
  title,
  description,
  primaryHref = "/shop",
  primaryLabel = "Browse the shop",
  secondaryHref = "/contact",
  secondaryLabel = "Talk to the team",
  bullets,
}: ComingSoonSectionProps) {
  return (
    <section className="nx-aurora relative mx-auto w-full max-w-6xl overflow-hidden rounded-[28px] border border-border/60 bg-card/70 px-6 py-14 backdrop-blur md:px-12 md:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 -top-20 size-72 rounded-full bg-(--nx-blue)/30 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-16 size-72 rounded-full bg-(--nx-cyan)/30 blur-[100px]"
      />

      <div className="relative mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground/70 backdrop-blur">
          <Wand2 className="size-3.5 text-(--nx-blue)" />
          {eyebrow}
        </span>

        <h1 className="mt-5 text-balance text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-sm text-muted-foreground md:text-base">
          {description}
        </p>

        {bullets && bullets.length > 0 && (
          <ul className="mx-auto mt-8 grid max-w-md gap-2 text-left text-sm text-foreground/80">
            {bullets.map((b) => (
              <li
                key={b}
                className="flex items-start gap-2 rounded-2xl border border-border/60 bg-background/60 px-4 py-2.5 backdrop-blur"
              >
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-(--nx-blue)" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={primaryHref}
            className="nx-btn-primary inline-flex h-11 items-center gap-2 px-6 text-sm font-semibold"
          >
            {primaryLabel}
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href={secondaryHref}
            className="nx-btn-ghost inline-flex h-11 items-center gap-2 px-6 text-sm font-semibold"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
