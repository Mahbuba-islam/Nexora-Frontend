"use client";

import { useState } from "react";
import { ArrowRight, Check, Wand2 } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setDone(true);
    setTimeout(() => {
      setDone(false);
      setEmail("");
    }, 2400);
  };

  return (
    <section className="relative isolate overflow-hidden bg-[#F9F8F6] py-14 dark:bg-[#1c1c20] md:py-20">
      <div
        aria-hidden
        className="nx-orb absolute left-1/2 top-1/2 h-130 w-130 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50"
        style={{ background: "radial-gradient(circle, #85C79A 0%, transparent 65%)" }}
      />
      <div className="relative mx-auto max-w-3xl px-4 text-center md:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 text-[12px] font-medium text-muted-foreground backdrop-blur">
          <Wand2 className="h-3.5 w-3.5 text-[#4E8D9C]" />
          Drops · Restocks · AI-curated picks
        </div>
        <h2 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
          Get the next big thing
          <br />
          <span className="text-foreground/50">before everyone else.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[15px] text-foreground/70">
          One thoughtful email a week. Curated by Nexora AI from millions of
          drops, deals and reviews. Unsubscribe anytime.
        </p>

        <form
          onSubmit={onSubmit}
          className="mx-auto mt-10 flex max-w-lg flex-col items-stretch gap-2 rounded-full border border-border bg-background p-1.5 shadow-lg shadow-black/5 sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@nexora.com"
            className="h-12 flex-1 rounded-full bg-transparent px-5 text-sm outline-none placeholder:text-muted-foreground"
            aria-label="Email address"
          />
          <button
            type="submit"
            disabled={done}
            className="nx-btn-primary inline-flex h-12 items-center justify-center gap-2 px-6 text-sm font-medium disabled:opacity-90"
          >
            {done ? (
              <>
                <Check className="h-4 w-4" /> Subscribed
              </>
            ) : (
              <>
                Join the list <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
        <p className="mt-3 text-xs text-muted-foreground">
          By subscribing you agree to our privacy policy.
        </p>
      </div>
    </section>
  );
}
