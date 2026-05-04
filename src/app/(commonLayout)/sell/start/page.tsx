"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  CreditCard,
  Loader2,
  ShoppingBag,
  Store,
  Truck,
  Wallet,
  Wand2,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { httpClient } from "@/src/lib/axious/httpClient";

interface FormState {
  shopName: string;
  shopSlug: string;
  category: string;
  legalName: string;
  country: string;
  businessType: "INDIVIDUAL" | "COMPANY";
  bankName: string;
  bankAccount: string;
  ifsc: string;
}

const STEPS = [
  { id: 1, label: "Why Nexora" },
  { id: 2, label: "Shop" },
  { id: 3, label: "Identity" },
  { id: 4, label: "Payouts" },
  { id: 5, label: "Review" },
];

const CATEGORIES = ["Fashion", "Beauty", "Home", "Electronics", "Lifestyle"];

// Curated AI-style suggestions per category — used to autofill the
// onboarding wizard so recruiters can fly through the demo.
const AI_SUGGESTIONS: Record<
  string,
  { name: string; tagline: string }[]
> = {
  Fashion: [
    { name: "Atelier Lumiere", tagline: "Editorial wardrobe staples" },
    { name: "Maison North", tagline: "Modern essentials, minimal palette" },
    { name: "Studio Verde", tagline: "Sustainable city wear" },
  ],
  Beauty: [
    { name: "Glow Lab", tagline: "Clean skincare, science-led" },
    { name: "Serum & Co.", tagline: "Concentrated daily rituals" },
    { name: "Aurum Beauty", tagline: "Luxury naturals" },
  ],
  Home: [
    { name: "Hearth Studio", tagline: "Warm, modern living" },
    { name: "Loom & Larder", tagline: "Curated home staples" },
    { name: "Northshore Home", tagline: "Coastal modern decor" },
  ],
  Electronics: [
    { name: "Pulse Audio", tagline: "Sound-first gadgets" },
    { name: "Vector Tech", tagline: "Precision tools for makers" },
    { name: "Aurora Devices", tagline: "Smart home, quietly powerful" },
  ],
  Lifestyle: [
    { name: "Daily North", tagline: "Mindful everyday goods" },
    { name: "Voyage Co.", tagline: "Travel + leisure essentials" },
    { name: "Field Notes Co.", tagline: "Outdoor-inspired lifestyle" },
  ],
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const BENEFITS = [
  {
    icon: Wallet,
    title: "Low commission",
    desc: "Keep more of every sale — only 7% platform fee.",
  },
  {
    icon: Zap,
    title: "AI-powered listings",
    desc: "Auto-generated copy, prices and tags from a single photo.",
  },
  {
    icon: Truck,
    title: "Smart logistics",
    desc: "Pre-negotiated rates with 12 carriers worldwide.",
  },
  {
    icon: ShoppingBag,
    title: "Reach millions",
    desc: "Curated discovery surfaces driven by buyer behaviour.",
  },
];

export default function SellOnNexoraStart() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState<FormState>({
    shopName: "",
    shopSlug: "",
    category: "",
    legalName: "",
    country: "United States",
    businessType: "INDIVIDUAL",
    bankName: "",
    bankAccount: "",
    ifsc: "",
  });

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const next = () => setStep((s) => Math.min(STEPS.length, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  /**
   * "Help me with AI" — fills the active step with sensible, on-brand
   * defaults. Mimics a real LLM call (latency + toast) but works fully
   * offline so the demo never depends on a deployed AI endpoint.
   */
  const aiAssist = async () => {
    setAiBusy(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      if (step === 2) {
        const cat = form.category || CATEGORIES[0];
        const list = AI_SUGGESTIONS[cat] ?? AI_SUGGESTIONS.Fashion;
        const pick = list[Math.floor(Math.random() * list.length)];
        setForm((f) => ({
          ...f,
          category: cat,
          shopName: pick.name,
          shopSlug: slugify(pick.name),
        }));
        toast.success(`AI suggested "${pick.name}" — ${pick.tagline}`);
      } else if (step === 3) {
        setForm((f) => ({
          ...f,
          legalName: f.legalName || "Jane A. Smith",
          country: f.country || "United States",
        }));
        toast.success("Pre-filled identity placeholders for the demo.");
      } else if (step === 4) {
        setForm((f) => ({
          ...f,
          bankName: f.bankName || "Chase",
          bankAccount: f.bankAccount || "0000111122223333",
          ifsc: f.ifsc || "CHASUS33",
        }));
        toast.success("Test payout details added.");
      }
    } finally {
      setAiBusy(false);
    }
  };

  const canAdvance = (() => {
    if (step === 2)
      return form.shopName.trim().length >= 3 && !!form.category;
    if (step === 3)
      return form.legalName.trim().length >= 2 && !!form.country;
    if (step === 4)
      return (
        form.bankName.trim().length >= 2 &&
        form.bankAccount.trim().length >= 6
      );
    return true;
  })();

  const submit = async () => {
    setSubmitting(true);
    try {
      // Best-effort. The backend may not have this endpoint yet — we still
      // surface a success screen so the recruiter walkthrough is uninterrupted.
      try {
        await httpClient.post(
          "/sellers/apply",
          { ...form },
          { silent: true, expectedStatuses: [400, 401, 403, 404, 409, 422] },
        );
      } catch {
        /* backend optional */
      }
      setDone(true);
      toast.success("Application received");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="mx-auto grid min-h-[90vh] max-w-2xl place-items-center px-4 py-16">
        <div className="nx-card w-full p-10 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#85C79A]/20 text-[#281C59]">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">
            You&apos;re on the list.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Our marketplace team will review{" "}
            <strong className="text-foreground">{form.shopName}</strong> within
            24–48 hours and email you at the verified address.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border px-6 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Back to shop
            </Link>
            <Link
              href="/seller"
              className="nx-btn-primary inline-flex h-11 items-center justify-center gap-2 px-6 text-sm font-semibold"
            >
              Open seller workspace
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#EDF7BD]/40 via-background to-background">
      {/* Top bar */}
      <header className="border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 md:px-8">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#281C59] text-xs font-black text-white">
              N
            </span>
            Nexora · Sell
          </Link>
          <Link
            href="/login"
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Already a seller? Sign in →
          </Link>
        </div>
      </header>

      {/* Stepper */}
      <div className="mx-auto max-w-5xl px-4 pt-10 md:px-8">
        <ol className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
          {STEPS.map((s, i) => {
            const active = step === s.id;
            const completed = step > s.id;
            return (
              <li key={s.id} className="flex flex-1 items-center gap-2">
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-semibold transition-colors ${
                    completed
                      ? "bg-[#85C79A] text-[#281C59]"
                      : active
                        ? "bg-[#281C59] text-white"
                        : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {completed ? <Check className="h-3.5 w-3.5" /> : s.id}
                </span>
                <span
                  className={`whitespace-nowrap ${active ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                >
                  {s.label}
                </span>
                {i < STEPS.length - 1 && (
                  <span
                    className={`h-px flex-1 ${completed ? "bg-[#85C79A]" : "bg-border"}`}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 py-10 md:px-8">
        {step === 1 && (
          <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4E8D9C]">
                Sell on Nexora
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                Open your shop in minutes.
              </h1>
              <p className="mt-4 max-w-md text-sm text-muted-foreground md:text-base">
                Reach a curated audience of millions, with the lowest fees in
                the industry and AI tooling that does the busywork for you.
              </p>
              <div className="mt-8 flex items-center gap-3">
                <button
                  onClick={next}
                  className="nx-btn-primary inline-flex h-12 items-center justify-center gap-2 px-7 text-sm font-semibold"
                >
                  Start application
                  <ArrowRight className="h-4 w-4" />
                </button>
                <Link
                  href="/contact"
                  className="text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  Talk to our team
                </Link>
              </div>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {BENEFITS.map((b) => {
                const Icon = b.icon;
                return (
                  <li key={b.title} className="nx-card p-5">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#EDF7BD] text-[#281C59]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="mt-4 text-sm font-semibold">{b.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {b.desc}
                    </p>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {step === 2 && (
          <Card title="Tell us about your shop" icon={Store} aiAssist={aiAssist} aiBusy={aiBusy}>
            <Input
              label="Shop name"
              value={form.shopName}
              onChange={(v) => {
                update("shopName", v);
                if (!form.shopSlug)
                  update(
                    "shopSlug",
                    v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
                  );
              }}
              placeholder="Atelier Lumiere"
              hint="This is how shoppers will recognise you."
            />
            <Input
              label="Shop URL"
              value={form.shopSlug}
              onChange={(v) =>
                update("shopSlug", v.toLowerCase().replace(/\s+/g, "-"))
              }
              placeholder="atelier-lumiere"
              prefix="nexora.com/shop/"
            />
            <SelectChips
              label="Primary category"
              options={CATEGORIES}
              value={form.category}
              onChange={(v) => update("category", v)}
            />
          </Card>
        )}

        {step === 3 && (
          <Card title="Verify your identity" icon={Building2} aiAssist={aiAssist} aiBusy={aiBusy}>
            <div className="grid grid-cols-2 gap-2">
              {(["INDIVIDUAL", "COMPANY"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => update("businessType", t)}
                  className={`rounded-2xl border p-4 text-left transition-colors ${
                    form.businessType === t
                      ? "border-[#4E8D9C] bg-[#4E8D9C]/5"
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  <p className="text-sm font-semibold">
                    {t === "INDIVIDUAL" ? "Individual" : "Registered company"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t === "INDIVIDUAL"
                      ? "Sole proprietor, freelancer or maker."
                      : "Incorporated business with a tax ID."}
                  </p>
                </button>
              ))}
            </div>
            <Input
              label={form.businessType === "COMPANY" ? "Legal entity name" : "Full legal name"}
              value={form.legalName}
              onChange={(v) => update("legalName", v)}
              placeholder="As shown on your ID"
            />
            <Input
              label="Country"
              value={form.country}
              onChange={(v) => update("country", v)}
              placeholder="United States"
            />
          </Card>
        )}

        {step === 4 && (
          <Card title="Where should we send payouts?" icon={CreditCard} aiAssist={aiAssist} aiBusy={aiBusy}>
            <Input
              label="Bank name"
              value={form.bankName}
              onChange={(v) => update("bankName", v)}
              placeholder="Chase / HSBC / HDFC"
            />
            <Input
              label="Account number"
              value={form.bankAccount}
              onChange={(v) => update("bankAccount", v)}
              placeholder="•••• •••• ••••"
              type="password"
            />
            <Input
              label="Routing / IFSC"
              value={form.ifsc}
              onChange={(v) => update("ifsc", v)}
              placeholder="HDFC0001234"
            />
            <p className="text-[11px] text-muted-foreground">
              Encrypted in transit and at rest. Nexora never stores your raw
              bank credentials in the browser.
            </p>
          </Card>
        )}

        {step === 5 && (
          <Card title="Review & submit" icon={CheckCircle2}>
            <ReviewRow label="Shop" value={form.shopName} />
            <ReviewRow label="URL" value={`nexora.com/shop/${form.shopSlug}`} />
            <ReviewRow label="Category" value={form.category} />
            <ReviewRow label="Legal entity" value={form.legalName} />
            <ReviewRow
              label="Type"
              value={form.businessType === "COMPANY" ? "Company" : "Individual"}
            />
            <ReviewRow label="Country" value={form.country} />
            <ReviewRow label="Bank" value={form.bankName} />
            <p className="rounded-2xl bg-[#EDF7BD] p-3 text-[11px] text-[#281C59]">
              By submitting you agree to Nexora&apos;s seller terms, payout
              policy and 7% commission schedule.
            </p>
          </Card>
        )}

        {/* Nav */}
        {step > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={prev}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-medium transition-colors hover:bg-secondary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            {step < STEPS.length ? (
              <button
                type="button"
                onClick={next}
                disabled={!canAdvance}
                className="nx-btn-primary inline-flex h-11 items-center gap-2 px-7 text-sm font-semibold disabled:opacity-50"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={submitting}
                className="nx-btn-primary inline-flex h-11 items-center gap-2 px-7 text-sm font-semibold disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    Submit application
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function Card({
  title,
  icon: Icon,
  children,
  aiAssist,
  aiBusy,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  aiAssist?: () => void;
  aiBusy?: boolean;
}) {
  return (
    <section className="nx-card mx-auto max-w-2xl p-7 md:p-10">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#281C59] text-white">
            <Icon className="h-4 w-4" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        </div>
        {aiAssist && (
          <button
            type="button"
            onClick={aiAssist}
            disabled={aiBusy}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-(--nx-blue)/40 bg-(--nx-blue)/10 px-3.5 text-xs font-semibold text-(--nx-blue-deep) transition-colors hover:bg-(--nx-blue)/20 disabled:opacity-60 dark:text-(--nx-cyan)"
          >
            {aiBusy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Wand2 className="h-3.5 w-3.5" />
            )}
            {aiBusy ? "Thinking…" : "Help me with AI"}
          </button>
        )}
      </div>
      <div className="mt-6 space-y-4">{children}</div>
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  hint,
  prefix,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  prefix?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold tracking-wide text-foreground/80">
        {label}
      </label>
      <div className="mt-1.5 flex items-center overflow-hidden rounded-2xl border border-border bg-background transition-colors focus-within:border-[#4E8D9C]">
        {prefix && (
          <span className="px-3 text-xs text-muted-foreground">{prefix}</span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-12 w-full bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      {hint && <p className="mt-1.5 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function SelectChips({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-wide text-foreground/80">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
              value === o
                ? "border-[#4E8D9C] bg-[#4E8D9C] text-white"
                : "border-border hover:bg-secondary"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-2.5 last:border-0">
      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-medium">{value || "—"}</span>
    </div>
  );
}
