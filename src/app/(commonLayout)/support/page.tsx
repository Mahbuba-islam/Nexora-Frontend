import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CreditCard,
  HelpCircle,
  LifeBuoy,
  Package,
  RefreshCw,
  Shield,
  Sparkles,
  Truck,
  UserCog,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SupportSearch from "@/components/modules/Nexora/SupportSearch";
import SupportChannels from "@/components/modules/Nexora/SupportChannels";

export const metadata = { title: "Support · Nexora" };

const TOPIC_CARDS = [
  {
    icon: Truck,
    title: "Track your order",
    desc: "See live status, ETAs, and carrier updates.",
    href: "/orders",
    accent: "from-(--nx-ink) to-(--nx-blue-deep)",
  },
  {
    icon: RefreshCw,
    title: "Returns & refunds",
    desc: "Start a return in two taps. Refunds in 3–5 days.",
    href: "/returns",
    accent: "from-(--nx-blue-deep) to-(--nx-cyan)",
  },
  {
    icon: CreditCard,
    title: "Payments & invoices",
    desc: "Cards, wallets, taxes, and downloadable invoices.",
    href: "/account/payments",
    accent: "from-emerald-500 to-(--nx-cyan)",
  },
  {
    icon: UserCog,
    title: "Account & security",
    desc: "Login, two-factor, devices, and password reset.",
    href: "/account",
    accent: "from-rose-500 to-orange-400",
  },
  {
    icon: Package,
    title: "Shipping & delivery",
    desc: "Rates, regions, and how to change an address.",
    href: "/help/shipping",
    accent: "from-(--nx-ink) to-(--nx-blue)",
  },
  {
    icon: Shield,
    title: "Trust & safety",
    desc: "Verified sellers, buyer protection, and disputes.",
    href: "/help/safety",
    accent: "from-amber-500 to-rose-500",
  },
];

const FAQ_GROUPS = [
  {
    label: "Orders",
    items: [
      {
        q: "How do I track my order?",
        a: "Open Account → Orders to see live status. You'll also get email and push updates the moment your shipment moves.",
      },
      {
        q: "Can I change my shipping address after ordering?",
        a: "If the order hasn't been picked yet, you can edit the address directly from the order page. If it's already in transit, contact support and we'll work with the carrier.",
      },
      {
        q: "What if my package is delayed or missing?",
        a: "Wait 24h past the estimated delivery date, then open a missing-package case from the order page. Most claims are resolved in under 48 hours.",
      },
    ],
  },
  {
    label: "Returns & refunds",
    items: [
      {
        q: "How long do I have to return an item?",
        a: "30 days for most items, 14 days for opened electronics. The full policy is on the product page under \"Returns\".",
      },
      {
        q: "When will my refund be processed?",
        a: "Once we receive the return at our hub, refunds post within 3–5 business days to the original payment method.",
      },
      {
        q: "Do I pay for return shipping?",
        a: "Returns are free for defective or wrong items. For change-of-mind returns, a small label fee may apply depending on the seller.",
      },
    ],
  },
  {
    label: "Payments",
    items: [
      {
        q: "Which payment methods are accepted?",
        a: "Major credit/debit cards, Apple Pay, Google Pay, and select regional wallets. Some sellers also offer buy-now-pay-later.",
      },
      {
        q: "Why was my card declined?",
        a: "Most declines are issuer-side (insufficient funds, fraud rules). Try another method or contact your bank — Nexora never stores your full card number.",
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        q: "How do I enable two-factor authentication?",
        a: "Account → Security → Two-factor. We strongly recommend an authenticator app over SMS for higher-value purchases.",
      },
      {
        q: "I forgot my password.",
        a: "Use \"Forgot password\" on the login screen. The reset link is valid for 30 minutes.",
      },
    ],
  },
];

const CHANNELS = [
  {
    iconName: "chat" as const,
    title: "Live chat",
    desc: "Avg. wait under 2 minutes",
    cta: "Start chat",
    href: "#",
    available: true,
    action: "chat" as const,
  },
  {
    iconName: "ai" as const,
    title: "Nexora AI",
    desc: "Instant answers, 24/7",
    cta: "Ask the AI",
    href: "#",
    available: true,
    action: "ai" as const,
  },
  {
    iconName: "email" as const,
    title: "Email",
    desc: "support@nexora.shop · replies in 4h",
    cta: "Send email",
    href: "mailto:support@nexora.shop",
    available: true,
  },
  {
    iconName: "phone" as const,
    title: "Phone",
    desc: "Mon–Fri · 9am–6pm",
    cta: "Call us",
    href: "tel:+18005550000",
    available: false,
  },
];

export default function SupportPage() {
  return (
    <div className="relative isolate overflow-hidden bg-background">
      {/* Ambient orbs */}
      <div
        aria-hidden
        className="nx-pulse-soft absolute -left-32 top-10 h-72 w-72 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(168,220,184,0.4) 0%, transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="nx-pulse-soft absolute -right-32 top-72 h-80 w-80 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(111,182,204,0.4) 0%, transparent 65%)",
          animationDelay: "-2s",
        }}
      />

      {/* HERO */}
      <section className="relative mx-auto max-w-7xl px-4 pb-10 pt-12 md:px-8 md:pb-14 md:pt-16">
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-8 shadow-sm md:p-12">
          <span
            aria-hidden
            className="nx-tiny-float pointer-events-none absolute right-[10%] top-6 hidden text-(--nx-blue-deep)/40 md:block"
          >
            <HelpCircle className="h-7 w-7" />
          </span>
          <span
            aria-hidden
            className="nx-tiny-float nx-tiny-float--fast pointer-events-none absolute left-[8%] bottom-8 hidden text-amber-400/60 md:block"
          >
            <Sparkles className="h-5 w-5" />
          </span>

          <div className="relative mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-(--nx-blue-deep) dark:text-(--nx-cyan)">
              <LifeBuoy className="h-3.5 w-3.5" />
              Nexora · Help center
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              How can we{" "}
              <span className="bg-linear-to-r from-(--nx-ink) via-(--nx-blue-deep) to-(--nx-cyan) bg-clip-text text-transparent">
                help you today?
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
              Search our help center, browse popular topics, or chat with the
              Nexora AI for instant answers. Real humans available when you need
              them.
            </p>

            {/* Search + chips (client) */}
            <SupportSearch />
          </div>
        </div>
      </section>

      {/* TOPIC GRID */}
      <section className="mx-auto max-w-7xl px-4 pb-12 md:px-8 md:pb-16">
        <header className="mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--nx-blue-deep) dark:text-(--nx-cyan)">
            Browse by topic
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
            Popular help topics
          </h2>
        </header>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOPIC_CARDS.map((t) => {
            const I = t.icon;
            return (
              <Link
                key={t.title}
                href={t.href}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div
                  className={`grid h-11 w-11 place-items-center rounded-2xl bg-linear-to-br ${t.accent} text-white shadow-sm`}
                >
                  <I className="h-5 w-5" />
                </div>
                <p className="mt-3 text-base font-semibold tracking-tight">
                  {t.title}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t.desc}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-(--nx-blue-deep) dark:text-(--nx-cyan)">
                  Learn more
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
                <span
                  aria-hidden
                  className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-linear-to-br ${t.accent} opacity-10 blur-2xl transition-opacity group-hover:opacity-25`}
                />
              </Link>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-20">
        <header className="mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--nx-blue-deep) dark:text-(--nx-cyan)">
            Frequently asked
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
            Top questions, answered
          </h2>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          {FAQ_GROUPS.map((g) => (
            <div
              key={g.label}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5" />
                {g.label}
              </p>
              <Accordion type="single" collapsible className="mt-2 w-full">
                {g.items.map((item, idx) => (
                  <AccordionItem key={item.q} value={`${g.label}-${idx}`}>
                    <AccordionTrigger className="text-left text-sm">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT CHANNELS */}
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8 md:pb-28">
        <div className="rounded-3xl border border-border bg-linear-to-br from-card via-background to-secondary p-6 md:p-10">
          <SupportChannels
            channels={CHANNELS.map((c) => ({
              iconName: c.iconName,
              title: c.title,
              desc: c.desc,
              cta: c.cta,
              href: c.href,
              available: c.available,
              action: "action" in c ? c.action : undefined,
            }))}
          />

          <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-background p-5 md:flex-row md:items-center">
            <div>
              <p className="text-base font-semibold tracking-tight">
                Still need help?
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Send us a message and a real human will get back within 4 hours.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-(--nx-ink) px-5 text-sm font-semibold text-white hover:bg-(--nx-blue-deep)"
            >
              Contact support
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
