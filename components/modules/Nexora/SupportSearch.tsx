"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";

const CHIPS: { label: string; href: string }[] = [
  { label: "Where is my order?", href: "/account/orders" },
  { label: "Start a return", href: "/account/returns" },
  { label: "Update payment", href: "/account/payments" },
  { label: "Cancel an order", href: "/account/orders" },
];

export default function SupportSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) {
      router.push("/shop");
      return;
    }
    router.push(`/shop?search=${encodeURIComponent(term)}`);
  };

  const onChip = (chip: { label: string; href: string }) => {
    setQ(chip.label);
    router.push(chip.href);
  };

  return (
    <>
      <form
        onSubmit={submit}
        className="mx-auto mt-6 flex w-full max-w-xl items-center gap-2 rounded-full border border-border bg-white/95 pl-3 pr-1.5 shadow-md ring-1 ring-black/5 focus-within:border-(--nx-blue-deep) focus-within:ring-(--nx-blue-deep)/20 dark:bg-white/6 dark:ring-white/10 sm:pl-4"
      >
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          name="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search help articles, orders…"
          className="h-12 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          aria-label="Search"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-full bg-(--nx-ink) px-3 text-xs font-semibold text-white transition-colors hover:bg-(--nx-blue-deep) sm:px-5"
        >
          <span className="hidden sm:inline">Search</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </form>

      <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs">
        {CHIPS.map((chip) => (
          <button
            key={chip.label}
            type="button"
            onClick={() => onChip(chip)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 font-medium transition-colors hover:bg-secondary"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </>
  );
}
