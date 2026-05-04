import Link from "next/link";
import { ArrowRight, Bot, MessageSquareText, Search, Wand2 } from "lucide-react";

const FEATURES = [
  {
    icon: Search,
    title: "Semantic search",
    body: "Type how you think. Nexora AI understands intent — not keywords.",
  },
  {
    icon: Wand2,
    title: "Personal bundles",
    body: "Curated kits assembled around your habits, budget and devices you already own.",
  },
  {
    icon: MessageSquareText,
    title: "Compare & decide",
    body: "Ask the AI to weigh three flagships side-by-side in seconds.",
  },
  {
    icon: Bot,
    title: "Always-on concierge",
    body: "Order tracking, returns and warranty answered instantly, 24/7.",
  },
];

export default function AIShowcase() {
  return (
    <section
      id="ai"
      className="relative isolate overflow-hidden bg-[#281C59] py-14 text-[#F9F8F6] md:py-20"
    >
      {/* Glow */}
      <div
        aria-hidden
        className="nx-orb absolute -left-32 top-1/3 h-115 w-115 rounded-full"
        style={{ background: "radial-gradient(circle, #4E8D9C 0%, transparent 65%)" }}
      />
      <div
        aria-hidden
        className="nx-orb absolute -right-24 bottom-0 h-130 w-130 rounded-full"
        style={{ background: "radial-gradient(circle, #85C79A 0%, transparent 65%)", animationDelay: "-5s" }}
      />
      <div aria-hidden className="nx-grid-bg absolute inset-0 opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#85C79A]">
              Nexora AI
            </p>
            <h2 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
              The smartest store
              <br />
              you&rsquo;ve ever shopped.
            </h2>
            <p className="mt-6 max-w-md text-[15px] text-white/70 md:text-base">
              Built on top of a real-time recommendation engine. Nexora AI learns
              what matters to you across every visit and curates a store that
              feels personal — never noisy.
            </p>
            <Link
              href="/ai"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-[#F9F8F6] px-6 text-sm font-medium text-[#281C59] transition-transform hover:-translate-y-0.5 hover:bg-white"
            >
              Try the AI assistant
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/4 p-6 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.07]"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-linear-to-br from-[#4E8D9C] to-[#85C79A] text-white shadow-lg shadow-[#4E8D9C]/30">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Demo prompt strip */}
        <div className="mt-16 overflow-hidden rounded-3xl border border-white/10 bg-white/3 p-2 backdrop-blur-md">
          <div className="flex flex-col items-stretch gap-2 md:flex-row">
            <div className="flex flex-1 items-center gap-3 rounded-2xl bg-black/30 px-5 py-4">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-linear-to-br from-[#4E8D9C] to-[#85C79A]">
                <Wand2 className="h-3.5 w-3.5 text-white" />
              </span>
              <p className="truncate text-sm text-white/80">
                <span className="text-white/45">Try:</span>{" "}
                &ldquo;A laptop under $1500 for video editing, prefers macOS feel&rdquo;
              </p>
            </div>
            <button
              type="button"
              className="rounded-2xl bg-[#F9FF56] px-6 py-4 text-sm font-semibold text-[#281C59] transition-transform hover:-translate-y-0.5"
            >
              Run AI search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
