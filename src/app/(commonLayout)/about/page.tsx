import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Globe2,
  HeartHandshake,
  Sparkles,
  Star,
  Trophy,
  Users,
  Wand2,
} from "lucide-react";

export const metadata = {
  title: "About · Nexora",
  description:
    "Nexora is the AI-native marketplace for premium tech — calm, curated, and built for the next generation of buyers.",
};

const STATS = [
  { label: "Happy customers", value: "120k+" },
  { label: "Verified sellers", value: "3.4k" },
  { label: "Avg. delivery", value: "2.1 days" },
  { label: "AI accuracy", value: "94%" },
];

const VALUES = [
  {
    icon: Wand2,
    title: "Calm by design",
    body: "We strip the noise so you can focus on the gear that matters. Fewer pop-ups, cleaner pages, smarter results.",
  },
  {
    icon: HeartHandshake,
    title: "Trust, on the record",
    body: "Verified sellers, escrowed payouts, transparent reviews. If something goes sideways, our team makes it right.",
  },
  {
    icon: Sparkles,
    title: "AI that helps, never hypes",
    body: "Our concierge is tuned for honesty: it&rsquo;ll tell you when an older model is a better buy.",
  },
  {
    icon: Globe2,
    title: "Built worldwide",
    body: "A distributed team across 9 countries — designers, engineers, ML researchers, and former buyers.",
  },
];

const TIMELINE = [
  {
    year: "2023",
    title: "The first prototype",
    body: "Two friends, one weekend, and a hunch that shopping for tech could feel calmer.",
  },
  {
    year: "2024",
    title: "Concierge goes live",
    body: "We shipped Nexora AI — a recommendation layer that actually understands your shortlist.",
  },
  {
    year: "2025",
    title: "Marketplace opens",
    body: "Independent sellers joined. Buyer-protection-first, no race-to-the-bottom listings.",
  },
  {
    year: "2026",
    title: "Today",
    body: "120k+ shoppers, 3.4k sellers, and a roadmap focused on radical transparency.",
  },
];

const TEAM = [
  { name: "Anish Roy", role: "Founder & CEO", initials: "AR", tint: "from-[#281C59] to-[#4E8D9C]" },
  { name: "Mira Khanna", role: "Head of Design", initials: "MK", tint: "from-[#4E8D9C] to-[#85C79A]" },
  { name: "Theo Park", role: "AI Research Lead", initials: "TP", tint: "from-[#6FB6CC] to-[#4E8D9C]" },
  { name: "Lena Voss", role: "Head of Trust & Safety", initials: "LV", tint: "from-[#85C79A] to-[#4E8D9C]" },
];

export default function AboutPage() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <header className="relative isolate overflow-hidden border-b border-border bg-[#0B0B12] text-white">
        <div className="absolute inset-0 -z-10 bg-linear-to-br from-[#281C59] via-[#1B1844] to-[#4E8D9C] opacity-95" />
        <div
          className="absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(133,199,154,0.4), transparent 40%), radial-gradient(circle at 80% 30%, rgba(78,141,156,0.4), transparent 50%)",
          }}
        />
        <div className="mx-auto max-w-5xl px-4 py-20 md:px-8 md:py-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur">
            <Compass className="h-3 w-3 text-[#85C79A]" />
            About Nexora
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Premium tech, curated by AI.
            <span className="block bg-linear-to-r from-[#85C79A] via-[#6FB6CC] to-[#F9F8F6] bg-clip-text text-transparent">
              Built for the next generation of buyers.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
            Nexora is a marketplace that respects your time. We blend
            human-curated listings with an AI concierge so you can buy the
            right gear faster — without endless tabs, fake reviews, or
            algorithm whiplash.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#281C59] transition-colors hover:bg-[#F9F8F6]"
            >
              Explore the shop
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
            >
              Talk to the team
            </Link>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="border-b border-border bg-secondary/30">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-10 md:grid-cols-4 md:px-8 md:py-14">
          {STATS.map((s) => (
            <div key={s.label} className="text-center md:text-left">
              <p className="text-3xl font-semibold tracking-tight md:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Our mission
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Help everyone make a tech purchase they&rsquo;re proud of.
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-base leading-relaxed text-foreground/80">
              We started Nexora because shopping for laptops, headphones, or
              cameras felt like a second job. Reviews you couldn&rsquo;t
              trust. Affiliate-fueled rankings. A SKU explosion that buried
              the gems. We built a different store: a tightly-edited catalog,
              verified independent sellers, and a concierge model trained on
              spec sheets &amp; long-form reviews — not on hype cycles.
            </p>
            <p className="mt-4 text-base leading-relaxed text-foreground/80">
              The result is a marketplace that feels less like a shopping
              feed and more like a knowledgeable friend who happens to know
              the gear inside-out.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            What we believe
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Four values, applied every release.
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="nx-card p-6 transition-transform hover:-translate-y-0.5"
                >
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-linear-to-br from-[#281C59] to-[#4E8D9C] text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold tracking-tight">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {v.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Our story
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          From weekend sketch to a 120k-shopper marketplace.
        </h2>
        <ol className="mt-10 grid gap-5 lg:grid-cols-4">
          {TIMELINE.map((t, i) => (
            <li key={t.year} className="nx-card relative p-6">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-(--nx-blue-deep) dark:text-(--nx-cyan)">
                {t.year}
              </span>
              <h3 className="mt-2 text-base font-semibold tracking-tight">
                {t.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.body}</p>
              <span className="absolute -top-2 right-4 grid h-7 w-7 place-items-center rounded-full bg-(--nx-blue-deep) text-[11px] font-semibold text-white dark:bg-(--nx-cyan) dark:text-[#0B0B12]">
                {i + 1}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Team */}
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                The team
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                Small team. Strong opinions. Open inbox.
              </h2>
            </div>
            <Link
              href="/careers"
              className="hidden items-center gap-1 text-sm font-medium text-foreground/80 hover:text-foreground sm:inline-flex"
            >
              We&rsquo;re hiring
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((m) => (
              <div key={m.name} className="nx-card p-6">
                <div
                  className={`grid h-14 w-14 place-items-center rounded-2xl bg-linear-to-br ${m.tint} text-base font-semibold text-white`}
                >
                  {m.initials}
                </div>
                <p className="mt-4 text-base font-semibold tracking-tight">
                  {m.name}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press / proof */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="rounded-3xl border border-border bg-card p-8 md:p-12">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-[11px] font-medium text-foreground/70">
                <Trophy className="h-3 w-3 text-(--nx-blue-deep) dark:text-(--nx-cyan)" />
                Recognized by
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                Loved by buyers, recognized by the press.
              </h2>
              <p className="mt-3 text-sm text-muted-foreground md:text-base">
                Featured in The Verge, Wired, and Fast Company for our
                approach to AI-assisted shopping.
              </p>
            </div>
            <div className="lg:col-span-7">
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[
                  "Wired · Best of 2025",
                  "The Verge · Pick",
                  "Fast Company · Innovator",
                  "Product Hunt · #1 of the day",
                  "TechCrunch · Disrupt finalist",
                  "TIME · Top inventions",
                ].map((q) => (
                  <li
                    key={q}
                    className="flex items-center gap-2 rounded-2xl border border-border bg-secondary/30 px-3 py-3 text-xs font-medium text-foreground/80"
                  >
                    <Star className="h-3.5 w-3.5 text-(--nx-blue-deep) dark:text-(--nx-cyan)" />
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8 md:pb-28">
        <div className="rounded-3xl border border-border bg-linear-to-br from-[#281C59] via-[#1B1844] to-[#4E8D9C] p-10 text-white md:p-14">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur">
                <Users className="h-3 w-3 text-[#85C79A]" />
                Join us
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                Shop smarter today, or sell to the next generation.
              </h2>
              <p className="mt-3 max-w-xl text-sm text-white/75 md:text-base">
                Whether you&rsquo;re looking for your next laptop or
                you&rsquo;re ready to put your store in front of buyers who
                actually convert — we&rsquo;d love to have you.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#281C59] transition-colors hover:bg-[#F9F8F6]"
              >
                Browse shop
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/sell/start"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
              >
                Start selling
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
