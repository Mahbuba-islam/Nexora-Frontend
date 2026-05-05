import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Contact · Nexora",
  description:
    "Talk to the Nexora team — sales, partnerships, press, and concierge support. Premium glassmorphic contact experience.",
};

const CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@nexora.shop",
    href: "mailto:hello@nexora.shop",
    sub: "We reply within 4 business hours.",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (800) 555-0000",
    href: "tel:+18005550000",
    sub: "Mon – Fri · 9:00 – 18:00 PT",
  },
  {
    icon: MessageCircle,
    label: "Live chat",
    value: "Open the concierge",
    href: "/support",
    sub: "Avg. wait < 2 min · 24/7 with Nexora AI",
  },
  {
    icon: Headphones,
    label: "Press",
    value: "press@nexora.shop",
    href: "mailto:press@nexora.shop",
    sub: "Brand assets and interviews.",
  },
];

const TOPICS = [
  "General question",
  "Order help",
  "Become a seller",
  "Partnerships",
  "Press & media",
];

export default function ContactRoute() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Background image */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src="/imges/nexora-img-5.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-br from-[#281C59]/85 via-[#1a1330]/70 to-[#0c0817]/90 dark:from-[#0a0716]/85 dark:via-[#141328]/70 dark:to-black/85" />
        <div
          className="absolute -left-32 top-32 h-md w-md rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(78,141,156,0.35) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute -right-24 bottom-12 h-96 w-96 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(249,255,86,0.25) 0%, transparent 65%)",
          }}
        />
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-16 md:px-8 md:pb-28 md:pt-24">
        {/* HERO */}
        <header className="mx-auto max-w-3xl text-center text-white">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[#F9FF56]" />
            Talk to Nexora
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Real humans. Premium answers.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm text-white/75 md:text-base">
            Whether you&apos;re shopping, selling, or partnering with us — the
            Nexora concierge is one tap away. Pick the channel that suits you.
          </p>
        </header>

        {/* GRID */}
        <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Form */}
          <form
            className="rounded-[2rem] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl md:p-10"
            action="mailto:hello@nexora.shop"
            method="post"
            encType="text/plain"
          >
            <div className="mb-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F9FF56]">
                Send a message
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white md:text-3xl">
                We&apos;ll get back within 4h
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full name" name="name" required />
              <Field
                label="Email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
              />
              <SelectField label="Topic" name="topic" options={TOPICS} />
              <Field label="Order # (optional)" name="orderId" />
              <div className="md:col-span-2">
                <Label>Message</Label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  placeholder="How can we help?"
                  className="mt-1.5 block w-full rounded-2xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/40 backdrop-blur-md focus:border-[#F9FF56] focus:outline-none focus:ring-2 focus:ring-[#F9FF56]/30"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <Link
                href="/support"
                className="text-xs font-semibold text-white/70 hover:text-white"
              >
                Or browse our help center
              </Link>
              <button
                type="submit"
                className="inline-flex h-11 items-center gap-1.5 rounded-full bg-[#F9FF56] px-5 text-xs font-semibold text-[#281C59] shadow-lg transition-transform hover:scale-[1.02]"
              >
                Send message
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>

          {/* Channels */}
          <div className="space-y-4">
            <div className="rounded-[2rem] border border-white/20 bg-white/10 p-6 backdrop-blur-2xl md:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F9FF56]">
                Talk to us
              </p>
              <h3 className="mt-1 text-xl font-semibold tracking-tight text-white">
                Pick the channel
              </h3>
              <ul className="mt-5 space-y-3">
                {CHANNELS.map((c) => (
                  <li key={c.label}>
                    <a
                      href={c.href}
                      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 transition-colors hover:border-white/30 hover:bg-white/10"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-linear-to-br from-[#4E8D9C] to-[#281C59] text-white shadow">
                        <c.icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-white/60">
                          {c.label}
                        </span>
                        <span className="block truncate text-sm font-semibold text-white">
                          {c.value}
                        </span>
                        <span className="block text-[11px] text-white/60">
                          {c.sub}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[2rem] border border-white/20 bg-white/10 p-6 backdrop-blur-2xl md:p-8">
              <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F9FF56]">
                <MapPin className="h-3.5 w-3.5" />
                HQ
              </p>
              <h3 className="mt-1 text-xl font-semibold tracking-tight text-white">
                Nexora Inc.
              </h3>
              <p className="mt-2 text-sm text-white/75">
                325 Mission Street · 14th Floor
                <br />
                San Francisco, CA 94105
              </p>
              <p className="mt-3 text-[11px] text-white/55">
                Ops &amp; engineering · Mon – Fri · By appointment.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
      {children}
    </span>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1.5 block w-full rounded-2xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/40 backdrop-blur-md focus:border-[#F9FF56] focus:outline-none focus:ring-2 focus:ring-[#F9FF56]/30"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <select
        name={name}
        className="mt-1.5 block w-full rounded-2xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white backdrop-blur-md focus:border-[#F9FF56] focus:outline-none focus:ring-2 focus:ring-[#F9FF56]/30"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#1a1330] text-white">
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
