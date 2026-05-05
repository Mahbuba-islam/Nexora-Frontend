import { Boxes, Globe2, ShieldCheck, Sparkles } from "lucide-react";

import CountUp from "./CountUp";

const STATS = [
  {
    icon: Sparkles,
    value: 12,
    decimals: 0,
    suffix: "M+",
    label: "AI recommendations served",
    accent: "text-[#4E8D9C]",
  },
  {
    icon: Boxes,
    value: 85,
    decimals: 0,
    suffix: "K",
    label: "Curated tech products",
    accent: "text-[#A8DCB8]",
  },
  {
    icon: Globe2,
    value: 120,
    decimals: 0,
    suffix: "+",
    label: "Countries shipped to",
    accent: "text-[#6FB6CC]",
  },
  {
    icon: ShieldCheck,
    value: 99.98,
    decimals: 2,
    suffix: "%",
    label: "Order safety rating",
    accent: "text-[#281C59] dark:text-[#A8DCB8]",
  },
];

export default function Stats() {
  return (
    <section className="nx-aurora relative px-4 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-7xl ">
        <div className="mb-10 max-w-2xl">
          <p className="text-[11px] ml-5  font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            By the numbers
          </p>
          <h2 className="mt-3 ml-4  text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            A marketplace operating at{" "}
            <span className="nx-shimmer-text ">internet scale</span>.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground md:text-base ml-5">
            Every metric you see is recomputed in real time from the Nexora
            platform — not a press release.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6 mx-2">
          {STATS.map(({ icon: Icon, value, decimals, suffix, label, accent }) => (
            <div
              key={label}
              className="nx-card flex flex-col items-start gap-3 p-5 md:p-6"
            >
              <span
                className={`grid h-10 w-10 place-items-center rounded-2xl bg-secondary ${accent}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                <CountUp value={value} decimals={decimals} suffix={suffix} />
              </div>
              <p className="text-xs text-muted-foreground md:text-sm">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
