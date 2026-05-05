"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/src/lib/utils";

const FAQS = [
  {
    q: "What makes Nexora different from other tech marketplaces?",
    a: "Nexora is AI-native end to end. Search, recommendations, bundling, and after-sales support are all powered by the Nexora model — so you get curated picks that match your actual workflow, not a wall of SKUs.",
  },
  {
    q: "Are the AI picks personalized to me?",
    a: "Yes. Once you sign in, picks adapt to your browsing, wishlist, and past orders. We never sell or share that signal — it stays inside your account.",
  },
  {
    q: "How fast is shipping and what does it cost?",
    a: "Most US orders ship in 24 hours and arrive in 2–4 business days. Shipping is free over $75 and we offer climate-neutral delivery on every order.",
  },
  {
    q: "What is the return policy?",
    a: "30-day no-questions-asked returns on every product, with prepaid labels. Sealed items are eligible for full refund; opened items are eligible for store credit or exchange.",
  },
  {
    q: "Do you offer warranty and support after the sale?",
    a: "Every product includes the manufacturer warranty plus Nexora Care — 24/7 chat support staffed by humans, with AI-assisted diagnosis to resolve common issues in minutes.",
  },
  {
    q: "Can I sell my own products on Nexora?",
    a: "Yes — visit Sell on Nexora to apply. Approved sellers get access to AI listing tools, automated logistics, and the same trust signals as our top brands.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="px-2 py-16 md:px-10 md:py-24 ml-3">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Frequently asked
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Everything you wanted to know — answered.
          </h2>
          <p className="mt-4 text-sm text-muted-foreground md:text-base">
            Still curious? Our AI concierge can answer policy, fitment and
            warranty questions in real time.
          </p>
        </div>

        <div className="lg:col-span-8">
          <ul className="divide-y divide-border rounded-3xl border border-border bg-card/60 backdrop-blur-md">
            {FAQS.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={item.q}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left md:px-6"
                  >
                    <span className="text-sm font-semibold text-foreground md:text-base">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300",
                        isOpen && "rotate-180 text-foreground",
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "grid overflow-hidden px-5 transition-all duration-300 md:px-6",
                      isOpen
                        ? "grid-rows-[1fr] pb-5 opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <p className="min-h-0 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                      {item.a}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
