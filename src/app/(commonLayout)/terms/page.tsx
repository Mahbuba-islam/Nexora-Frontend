import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  FileText,
  Globe,
  Lock,
  Mail,
  Scale,
  ShieldCheck,
} from "lucide-react";

export const metadata = {
  title: "Terms & Policies · Nexora",
  description:
    "The plain-English rules for shopping, selling, and using Nexora — written to be readable.",
};

const LAST_UPDATED = "May 1, 2026";
const CONTACT_EMAIL = "legal@nexora.dev";

const SECTIONS = [
  { id: "overview", label: "Overview", icon: FileText },
  { id: "accounts", label: "Your account", icon: Lock },
  { id: "marketplace", label: "Marketplace rules", icon: Scale },
  { id: "buyers", label: "Buyer protection", icon: ShieldCheck },
  { id: "sellers", label: "Seller agreement", icon: Globe },
  { id: "payments", label: "Payments & refunds", icon: CheckCircle2 },
  { id: "ai", label: "Nexora AI usage", icon: ShieldCheck },
  { id: "privacy", label: "Privacy summary", icon: Lock },
  { id: "contact", label: "Contact us", icon: Mail },
];

export default function TermsPage() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <header className="relative isolate overflow-hidden border-b border-border bg-[#0B0B12] text-white">
        <div className="absolute inset-0 -z-10 bg-linear-to-br from-[#281C59] via-[#1B1844] to-[#4E8D9C] opacity-90" />
        <div
          className="absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(133,199,154,0.4), transparent 40%), radial-gradient(circle at 80% 30%, rgba(78,141,156,0.4), transparent 50%)",
          }}
        />

        <div className="mx-auto max-w-5xl px-4 py-16 md:px-8 md:py-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur">
            <Scale className="h-3 w-3 text-[#85C79A]" />
            Legal · Last updated {LAST_UPDATED}
          </div>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
            Terms & policies, written to be{" "}
            <span className="bg-linear-to-r from-[#85C79A] via-white to-[#4E8D9C] bg-clip-text text-transparent">
              actually readable
            </span>
            .
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/70 md:text-base">
            These are the rules that govern your use of Nexora. We&apos;ve
            stripped out the dense legalese where we can — but if you ever feel
            stuck, our team replies within one business day.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#281C59] transition-transform hover:-translate-y-0.5"
            >
              <Mail className="h-4 w-4" />
              Email legal
            </a>
            <Link
              href="/privacy"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
            >
              Privacy policy <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:px-8 md:py-16 lg:grid-cols-12 lg:gap-14">
        {/* Sticky TOC */}
        <aside className="lg:col-span-3">
          <nav className="lg:sticky lg:top-24">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              On this page
            </p>
            <ul className="mt-3 space-y-1">
              {SECTIONS.map((s) => {
                const Icon = s.icon;
                return (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="group flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      <Icon className="h-3.5 w-3.5 text-foreground/40 group-hover:text-[#4E8D9C]" />
                      {s.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Body */}
        <main className="space-y-12 lg:col-span-9">
          <Section
            id="overview"
            title="Overview"
            kicker="The 60-second version"
          >
            <p>
              Nexora is an online marketplace operated by Nexora, Inc.
              (&quot;Nexora,&quot; &quot;we,&quot; &quot;our&quot;). When you
              browse, buy, or sell on Nexora you agree to these Terms and to
              the specific policies linked from this page.
            </p>
            <ul className="not-prose mt-5 grid gap-3 md:grid-cols-2">
              {[
                "Buy with confidence — every order is covered by Nexora Buyer Protection.",
                "Sellers keep ownership of their listings and pay a transparent commission.",
                "Nexora AI is opt-in for personalization and never sees your payment data.",
                "We never sell personal data; advertising is contextual, not behavioral.",
              ].map((line) => (
                <li
                  key={line}
                  className="flex gap-3 rounded-2xl border border-border bg-background p-4 text-sm text-foreground/80"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#4E8D9C]" />
                  {line}
                </li>
              ))}
            </ul>
          </Section>

          <Section
            id="accounts"
            title="Your Nexora account"
            kicker="What we ask of you"
          >
            <p>
              You&apos;re responsible for safeguarding your password and any
              activity that happens under your account. You must be at least
              16 years old (or the age of digital consent in your country) to
              create an account. One human, one account — no automation,
              scraping, or impersonation.
            </p>
            <p>
              You can close your account at any time from{" "}
              <Link
                href="/account/settings"
                className="font-medium text-[#4E8D9C] underline-offset-4 hover:underline"
              >
                Account settings
              </Link>
              . When you do, we delete or anonymize personal data within 30
              days, unless we have a legal duty to retain it (e.g. tax
              records).
            </p>
          </Section>

          <Section
            id="marketplace"
            title="Marketplace rules"
            kicker="Listings, content, conduct"
          >
            <p>
              Nexora is a marketplace, not a reseller. Sellers list their own
              products; we curate and display them. We reserve the right to
              remove listings that violate the law, infringe IP, or breach our{" "}
              <Link
                href="/legal/community"
                className="font-medium text-[#4E8D9C] underline-offset-4 hover:underline"
              >
                Community Guidelines
              </Link>
              .
            </p>
            <p>
              You agree not to misuse the service: no harassment, no fraud, no
              attempts to bypass technical protections, and no use of Nexora
              to compete with Nexora&apos;s own services using crawled data.
            </p>
          </Section>

          <Section
            id="buyers"
            title="Buyer protection"
            kicker="Shop with peace of mind"
          >
            <p>
              Every purchase is covered by Nexora Buyer Protection. If your
              item arrives damaged, never arrives, or is materially different
              from the listing, you can request a refund within 30 days of
              delivery. Eligible refunds are processed to your original
              payment method within 5–10 business days.
            </p>
            <p>
              Some categories (perishables, custom-made, opened software) have
              category-specific return rules; these are clearly labeled on the
              product page before checkout.
            </p>
          </Section>

          <Section
            id="sellers"
            title="Seller agreement"
            kicker="If you sell on Nexora"
          >
            <p>
              By accepting these Terms as a seller, you grant Nexora a
              non-exclusive, worldwide license to host and display your
              listings, product imagery, and shop content for the purpose of
              operating the marketplace. You retain all ownership.
            </p>
            <ul className="not-prose mt-5 grid gap-3 md:grid-cols-2">
              {[
                ["Commission", "Default 10% of item subtotal — visible per-shop."],
                ["Payouts", "Net-payout, weekly, after the buyer-protection window."],
                ["Listings", "You warrant they are accurate, lawful, and yours to sell."],
                ["Suspension", "Repeated policy violations may pause payouts and listings."],
              ].map(([title, body]) => (
                <li
                  key={title}
                  className="rounded-2xl border border-border bg-background p-4"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#4E8D9C]">
                    {title}
                  </p>
                  <p className="mt-1 text-sm text-foreground/80">{body}</p>
                </li>
              ))}
            </ul>
          </Section>

          <Section
            id="payments"
            title="Payments & refunds"
            kicker="Secure by default"
          >
            <p>
              We process payments via PCI-DSS compliant providers (Stripe,
              etc.). Nexora never stores raw card numbers. Prices are shown
              including applicable taxes wherever law requires; otherwise tax
              is calculated at checkout based on your shipping address.
            </p>
            <p>
              Refunds are issued to the original payment method. If we cannot
              refund the original instrument (e.g. expired card), we&apos;ll
              issue store credit redeemable across the marketplace.
            </p>
          </Section>

          <Section
            id="ai"
            title="Nexora AI usage"
            kicker="Smart, but on your side"
          >
            <p>
              Nexora AI helps you discover products, answers support
              questions, and assists sellers with listings. By default, your
              prompts are used only to serve your request and improve the
              system in aggregate (de-identified). You can opt out of any
              AI-assisted personalization in{" "}
              <Link
                href="/account/settings"
                className="font-medium text-[#4E8D9C] underline-offset-4 hover:underline"
              >
                Account settings → Privacy
              </Link>
              .
            </p>
          </Section>

          <Section
            id="privacy"
            title="Privacy at a glance"
            kicker="Full policy at /privacy"
          >
            <ul className="not-prose grid gap-3 md:grid-cols-2">
              {[
                ["What we collect", "Account, order, and basic device info."],
                ["What we don't sell", "We never sell personal data. Period."],
                ["Where we store it", "Encrypted at rest in EU + US regions."],
                ["Your rights", "Export, correct, or delete anytime."],
              ].map(([t, b]) => (
                <li
                  key={t}
                  className="rounded-2xl border border-border bg-background p-4"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#4E8D9C]">
                    {t}
                  </p>
                  <p className="mt-1 text-sm text-foreground/80">{b}</p>
                </li>
              ))}
            </ul>
          </Section>

          <Section
            id="contact"
            title="Contact us"
            kicker="Questions, complaints, or DMCA"
          >
            <p>
              For all legal correspondence, write to{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-[#4E8D9C] underline-offset-4 hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
              . For consumer questions, head to{" "}
              <Link
                href="/support"
                className="font-medium text-[#4E8D9C] underline-offset-4 hover:underline"
              >
                Support
              </Link>{" "}
              — most replies arrive within a few hours.
            </p>
            <p className="text-xs text-muted-foreground">
              By using Nexora you acknowledge you have read and agree to these
              Terms. We may update them from time to time; material changes
              will be announced via email and in-product 30 days in advance.
            </p>
          </Section>
        </main>
      </div>
    </div>
  );
}

function Section({
  id,
  title,
  kicker,
  children,
}: {
  id: string;
  title: string;
  kicker?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-3xl border border-border bg-[#F9F8F6] p-6 dark:bg-[#1c1c20] md:p-8"
    >
      {kicker && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#4E8D9C]">
          {kicker}
        </p>
      )}
      <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
        {title}
      </h2>
      <div className="prose prose-sm mt-4 max-w-none text-foreground/80 dark:prose-invert prose-p:leading-relaxed prose-li:my-1">
        {children}
      </div>
    </section>
  );
}
