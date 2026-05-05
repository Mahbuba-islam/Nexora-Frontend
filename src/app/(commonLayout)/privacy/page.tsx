import Link from "next/link";
import { Lock, Mail, Shield, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Privacy policy · Nexora",
  description:
    "How Nexora collects, uses, and protects your data — written plainly.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-background">
      <header className="relative isolate overflow-hidden border-b border-border bg-[#0B0B12] text-white">
        <div className="absolute inset-0 -z-10 bg-linear-to-br from-[#281C59] via-[#1B1844] to-[#4E8D9C] opacity-90" />
        <div className="mx-auto max-w-5xl px-4 py-16 md:px-8 md:py-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur">
            <Shield className="h-3 w-3 text-[#85C79A]" />
            Privacy · Effective May 1, 2026
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
            Your data, on your terms.
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/70 md:text-base">
            We collect the minimum we need to run a great marketplace, store
            it securely, and give you full control to export or delete it any
            time.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-8 px-4 py-12 md:px-8 md:py-16">
        <Block icon={ShieldCheck} title="What we collect">
          Account information you provide (name, email), order data, basic
          device and usage analytics, and content you choose to share with
          Nexora AI. We don&apos;t collect biometric data or precise location.
        </Block>
        <Block icon={Lock} title="How we use it">
          To process orders, prevent fraud, deliver customer support,
          personalize discovery (opt-out available), and meet legal
          obligations. We don&apos;t sell or rent personal data.
        </Block>
        <Block icon={Shield} title="Where it lives">
          Encrypted at rest in audited cloud regions in the EU and US.
          Payment data is tokenized by PCI-DSS providers — we never see raw
          card numbers.
        </Block>
        <Block icon={Mail} title="Your rights">
          Export, correct, or delete your data from{" "}
          <Link
            href="/account/settings"
            className="font-medium text-[#4E8D9C] underline-offset-4 hover:underline"
          >
            Account settings
          </Link>{" "}
          or by emailing{" "}
          <a
            href="mailto:privacy@nexora.dev"
            className="font-medium text-[#4E8D9C] underline-offset-4 hover:underline"
          >
            privacy@nexora.dev
          </a>
          . We respond within 30 days.
        </Block>

        <p className="text-xs text-muted-foreground">
          For the full legal text, see our{" "}
          <Link
            href="/terms"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Terms & Policies
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

function Block({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex gap-4 rounded-3xl border border-border bg-[#F9F8F6] p-6 dark:bg-[#1c1c20] md:p-8">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#4E8D9C]/15 text-[#4E8D9C]">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="text-lg font-semibold tracking-tight md:text-xl">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-foreground/80">
          {children}
        </p>
      </div>
    </section>
  );
}
