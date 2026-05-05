import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Bot,
  Compass,
  Lightbulb,
  MessageSquare,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react";

export const metadata = {
  title: "Nexora AI · The Shopping Concierge",
  description:
    "An AI shopping concierge built into every page — conversational search, AI-curated bundles, and a live assistant that learns what you love.",
};

const CAPABILITIES = [
  {
    icon: MessageSquare,
    title: "Conversational search",
    desc: "Ask in your own words. Nexora translates intent into the perfect filters across the catalog.",
  },
  {
    icon: Wand2,
    title: "AI-curated bundles",
    desc: "Tasteful pairings priced as a set, refreshed daily for your wardrobe, desk, kitchen, or studio.",
  },
  {
    icon: Compass,
    title: "Personal concierge",
    desc: "Live answers across web and mobile — sizing, returns, gifting, and ‘what should I get?’ moments.",
  },
  {
    icon: Lightbulb,
    title: "Predictive offers",
    desc: "Coupons that anticipate the next reorder. Nudges that respect your budget and your inbox.",
  },
];

const SAMPLE_PROMPTS = [
  "Find a quiet WFH setup under $400",
  "Show me bestselling skincare for sensitive skin",
  "What's a great gift for a 9-year-old who loves space?",
  "Compare noise-cancelling headphones",
];

export default function AILandingPage() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Background imagery */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src="/imges/nexora-img-3.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-30 dark:opacity-25"
        />
        <div className="absolute inset-0 bg-linear-to-br from-background/85 via-background/70 to-background/95" />
        <div
          className="absolute -left-24 top-24 h-96 w-96 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(78,141,156,0.45) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute right-[-10%] top-[40%] h-md w-md rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(249,255,86,0.3) 0%, transparent 65%)",
          }}
        />
      </div>

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-16 md:px-8 md:pb-24 md:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/80 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[#F9FF56]" />
            Nexora AI · v2026
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            An AI shopping concierge,{" "}
            <span className="bg-linear-to-r from-[#281C59] via-[#4E8D9C] to-[#F9FF56] bg-clip-text text-transparent">
              built into every page.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-foreground/70 md:text-base">
            Conversational search, AI-curated bundles, and a real-time concierge
            that learns what you love. Ask anything — Nexora finds it,
            compares it, and brings it home.
          </p>

          <form
            action="/shop"
            method="get"
            className="mx-auto mt-8 flex w-full max-w-2xl items-center gap-2 rounded-full border border-white/20 bg-white/15 px-2 py-2 shadow-2xl ring-1 ring-black/5 backdrop-blur-2xl dark:bg-white/8"
          >
            <Bot className="ml-3 h-5 w-5 shrink-0 text-[#4E8D9C]" />
            <input
              name="search"
              placeholder="Ask Nexora — “quiet WFH setup under $400”"
              className="h-12 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-foreground/50 md:text-base"
            />
            <button
              type="submit"
              className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-[#281C59] px-5 text-xs font-semibold text-white transition-colors hover:bg-[#4E8D9C]"
            >
              Try AI search
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          <ul className="mx-auto mt-5 flex max-w-3xl flex-wrap justify-center gap-2 text-xs">
            {SAMPLE_PROMPTS.map((p) => (
              <li key={p}>
                <Link
                  href={`/shop?search=${encodeURIComponent(p)}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 font-medium text-foreground/80 backdrop-blur transition-colors hover:bg-white/20"
                >
                  <Zap className="h-3 w-3 text-[#F9FF56]" />
                  {p}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
        <header className="mb-8 max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#4E8D9C]">
            Capabilities
          </p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">
            More taste. Less tabs.
          </h2>
          <p className="mt-2 text-sm text-foreground/70 md:text-base">
            Four pillars power every Nexora interaction. They run on the same
            unified model so context never gets dropped.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map((c) => (
            <div
              key={c.title}
              className="group relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl transition-all hover:-translate-y-1 hover:bg-white/15 dark:bg-white/4"
            >
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-linear-to-br from-[#281C59] to-[#4E8D9C] text-white shadow-lg">
                <c.icon className="h-4 w-4" />
              </div>
              <h3 className="mt-4 text-base font-semibold tracking-tight">
                {c.title}
              </h3>
              <p className="mt-1.5 text-sm text-foreground/70">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONCIERGE PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <div className="grid gap-6 overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-6 backdrop-blur-xl md:grid-cols-2 md:p-10 dark:bg-white/4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#4E8D9C]">
              The Concierge
            </p>
            <h3 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">
              Like having a stylist, sysadmin and gift-finder on speed dial.
            </h3>
            <p className="mt-3 max-w-md text-sm text-foreground/70 md:text-base">
              Open the chat in the bottom-right of any page. The concierge sees
              your cart, recent orders, and what&apos;s on sale near you — and
              never shares anything outside your account.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/shop"
                className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#281C59] px-5 text-xs font-semibold text-white hover:bg-[#4E8D9C]"
              >
                Browse curated picks
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/support"
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-5 text-xs font-semibold text-foreground/90 backdrop-blur hover:bg-white/20"
              >
                Talk to a human
              </Link>
            </div>
          </div>

          <div className="relative rounded-2xl border border-white/15 bg-background/70 p-4 shadow-2xl backdrop-blur-xl">
            <div className="space-y-3">
              <Bubble who="You">I need a quiet WFH setup under $400.</Bubble>
              <Bubble who="Nexora">
                I found 3 picks that fit. The Pulse Studio over-ear headphones
                are great for calls, and the Aurora MagCharge stand keeps your
                desk tidy. Want me to bundle and apply a 12% saver coupon?
              </Bubble>
              <Bubble who="You">Yes, add to cart.</Bubble>
              <Bubble who="Nexora">
                Done. Free shipping is already applied — total $379.
              </Bubble>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Bubble({
  who,
  children,
}: {
  who: "You" | "Nexora";
  children: React.ReactNode;
}) {
  const isAI = who === "Nexora";
  return (
    <div className={`flex ${isAI ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm ${
          isAI
            ? "bg-linear-to-br from-[#281C59] to-[#4E8D9C] text-white"
            : "border border-border bg-secondary/60 text-foreground/90"
        }`}
      >
        <p className="text-[10px] font-semibold uppercase tracking-wider opacity-70">
          {who}
        </p>
        <p className="mt-0.5 text-sm">{children}</p>
      </div>
    </div>
  );
}
