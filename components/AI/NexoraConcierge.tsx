"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Mic,
  PackageSearch,
  Send,
  Sparkles,
  Tag,
  Truck,
  Wand2,
  X,
} from "lucide-react";

import { FEATURED_PRODUCTS, formatUSD } from "@/components/modules/Nexora/data";
import type { NxProduct } from "@/components/modules/Nexora/data";

/**
 * Nexora Concierge — a marketplace shopping assistant.
 *
 * Designed to look and feel different from the dashboard SupportChatWidget:
 * - Bottom-right floating "pill" trigger that morphs into a glass panel
 * - Quick category chips at the top of the panel
 * - Mixes chat bubbles with rich product result cards
 * - Suggests follow-up prompts after every reply
 * - Voice-mic affordance (visual only — no real STT to keep it deterministic)
 *
 * Uses a lightweight on-device intent matcher rather than a live LLM so the
 * recruiter demo is instant and works offline.
 */

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  products?: NxProduct[];
  followups?: string[];
}

const QUICK_CHIPS = [
  { label: "Find a phone", icon: PackageSearch, prompt: "Help me find a phone" },
  { label: "Track my order", icon: Truck, prompt: "Where is my order?" },
  { label: "Today's deals", icon: Tag, prompt: "What's on sale today?" },
  {
    label: "Style picks",
    icon: Sparkles,
    prompt: "Pick something for my style",
  },
];

const GREETINGS = [
  "Hi! I'm your Nexora concierge. What are we shopping for today?",
  "Hey there 👋 Looking for something specific, or want me to surprise you?",
  "Welcome to Nexora. Tell me a vibe, a budget, or a category — I'll handle the rest.",
];

interface Intent {
  match: (q: string) => boolean;
  reply: (q: string) => Omit<ChatMessage, "id" | "role">;
}

function pickProducts(filter: (p: NxProduct) => boolean, max = 3): NxProduct[] {
  return FEATURED_PRODUCTS.filter(filter).slice(0, max);
}

function extractBudget(q: string): number | null {
  const m = q.match(/\$?\s?(\d{2,5})/);
  return m ? Number(m[1]) : null;
}

const INTENTS: Intent[] = [
  {
    match: (q) => /(phone|mobile|smartphone|lumen)/i.test(q),
    reply: (q) => {
      const budget = extractBudget(q);
      const items = pickProducts((p) => {
        if (p.category !== "Phones") return false;
        if (budget && p.price > budget) return false;
        return true;
      });
      return {
        text: budget
          ? `Here are phones under ${formatUSD(budget)} that I think you'll love:`
          : "Our top picks in Phones — AI-tuned cameras, all-day battery:",
        products: items.length > 0 ? items : pickProducts((p) => p.category === "Phones"),
        followups: [
          "Show me cheaper options",
          "Compare these two",
          "What about laptops?",
        ],
      };
    },
  },
  {
    match: (q) => /(laptop|macbook|aurora|notebook)/i.test(q),
    reply: () => ({
      text: "Lightweight, AI-accelerated and built for shipping work:",
      products: pickProducts((p) => p.category === "Laptops"),
      followups: ["Under $1500", "Compare battery life", "Best for video editing"],
    }),
  },
  {
    match: (q) => /(watch|orbit|wearable|fitness)/i.test(q),
    reply: () => ({
      text: "Wearables that actually move the needle on your day:",
      products: pickProducts((p) => p.category === "Wearables"),
      followups: ["Health features", "Cheaper alternatives", "Battery life"],
    }),
  },
  {
    match: (q) => /(buds|headphone|audio|sound|music)/i.test(q),
    reply: () => ({
      text: "Tuned by AI, comfortable for hours:",
      products: pickProducts((p) => p.category === "Audio"),
      followups: ["Best noise cancelling", "Under $150", "For gym use"],
    }),
  },
  {
    match: (q) => /(camera|photo|video|studio)/i.test(q),
    reply: () => ({
      text: "Pocketable cinema, no compromises:",
      products: pickProducts((p) => p.category === "Cameras"),
      followups: ["For travel", "Compare lenses", "Beginner picks"],
    }),
  },
  {
    match: (q) => /(deal|sale|discount|cheap|budget)/i.test(q),
    reply: () => ({
      text: "These are flagged with a price drop right now:",
      products: pickProducts((p) => Boolean(p.oldPrice)),
      followups: ["Show me everything under $500", "Track my order", "Style picks"],
    }),
  },
  {
    match: (q) => /(track|order|shipping|delivery|where)/i.test(q),
    reply: () => ({
      text: "I can take you to your orders page — your delivery, returns and tracking codes are all there.",
      followups: ["My account", "Talk to a human", "Style picks"],
    }),
  },
  {
    match: (q) => /(style|surprise|recommend|pick|vibe|aesthetic)/i.test(q),
    reply: () => ({
      text: "Picked from your taste graph — minimalist, future-forward, and a little playful:",
      products: FEATURED_PRODUCTS.slice(0, 3),
      followups: ["More like these", "Show only AI picks", "Best new arrivals"],
    }),
  },
  {
    match: (q) => /(human|agent|support|help|talk)/i.test(q),
    reply: () => ({
      text: "I'll keep this short — for live support, head to the help centre. I'll stay here in case you want to keep browsing.",
      followups: ["Track my order", "Show today's deals", "Style picks"],
    }),
  },
];

function detectIntent(q: string): Omit<ChatMessage, "id" | "role"> {
  const intent = INTENTS.find((i) => i.match(q));
  if (intent) return intent.reply(q);

  // Fallback: treat the message as a free-text product search.
  const needle = q.toLowerCase();
  const matches = FEATURED_PRODUCTS.filter((p) =>
    `${p.name} ${p.tagline} ${p.category}`.toLowerCase().includes(needle),
  ).slice(0, 3);

  if (matches.length > 0) {
    return {
      text: "Here's what I found in our catalog:",
      products: matches,
      followups: ["Show similar", "Sort by price", "Today's deals"],
    };
  }

  return {
    text: "I'm not sure I have a perfect match — try a category, a budget like \"$700\", or browse the full shop.",
    followups: ["Find a phone", "Today's deals", "Style picks"],
  };
}

const newId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export default function NexoraConcierge() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [greetingVisible, setGreetingVisible] = useState(false);
  const [greetingDismissed, setGreetingDismissed] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Show the floating waving greeting bubble after 1.4s, only once per session
  // and only while the panel is closed.
  useEffect(() => {
    if (greetingDismissed) return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("nexora.concierge.greeted") === "1") {
      setGreetingDismissed(true);
      return;
    }
    const t = window.setTimeout(() => setGreetingVisible(true), 1400);
    // Auto-hide after 12s if user ignores it
    const t2 = window.setTimeout(() => {
      setGreetingVisible(false);
      sessionStorage.setItem("nexora.concierge.greeted", "1");
      setGreetingDismissed(true);
    }, 14000);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, [greetingDismissed]);

  useEffect(() => {
    if (open && greetingVisible) {
      setGreetingVisible(false);
      sessionStorage.setItem("nexora.concierge.greeted", "1");
      setGreetingDismissed(true);
    }
  }, [open, greetingVisible]);

  // Seed greeting on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      const greeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
      setMessages([
        {
          id: newId(),
          role: "ai",
          text: greeting,
          followups: ["Find a phone", "Today's deals", "Style picks"],
        },
      ]);
    }
  }, [open, messages.length]);

  // Auto-scroll on new message
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, busy]);

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text || busy) return;
    setInput("");
    setMessages((m) => [...m, { id: newId(), role: "user", text }]);
    setBusy(true);
    // Tiny simulated thinking delay so the typing indicator is visible.
    window.setTimeout(() => {
      const reply = detectIntent(text);
      setMessages((m) => [
        ...m,
        { id: newId(), role: "ai", ...reply },
      ]);
      setBusy(false);
    }, 700);
  };

  const reset = () => {
    setMessages([]);
    setOpen(false);
  };

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="pointer-events-auto flex w-[min(94vw,400px)] flex-col overflow-hidden rounded-3xl border border-white/30 bg-white/90 shadow-[0_30px_80px_-20px_rgba(40,28,89,0.45)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/90">
          {/* Header */}
          <header className="flex items-center justify-between bg-linear-to-br from-(--nx-ink) to-(--nx-blue-deep) px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-2xl bg-white/15 backdrop-blur">
                <Wand2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-tight">
                  Nexora Concierge
                </p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/70">
                  AI · always on
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={reset}
              aria-label="Close concierge"
              className="grid h-8 w-8 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          {/* Quick chips */}
          <div className="flex flex-wrap gap-1.5 border-b border-border/60 bg-background/50 px-3 py-2.5">
            {QUICK_CHIPS.map((c) => {
              const Icon = c.icon;
              return (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => send(c.prompt)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-(--nx-blue)/30 bg-(--nx-cyan)/15 px-3 py-1 text-[11px] font-semibold text-(--nx-blue-deep) transition-colors hover:bg-(--nx-cyan)/30 dark:text-(--nx-cyan)"
                >
                  <Icon className="h-3 w-3" />
                  {c.label}
                </button>
              );
            })}
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex max-h-[58vh] min-h-70 flex-1 flex-col gap-3 overflow-y-auto bg-background/30 p-4"
          >
            {messages.map((m) => (
              <ChatBubble key={m.id} message={m} onFollowup={send} />
            ))}
            {busy && (
              <div className="flex w-fit items-center gap-1.5 rounded-2xl rounded-tl-sm bg-(--nx-blue-deep)/10 px-3 py-2 text-xs text-(--nx-blue-deep) dark:text-(--nx-cyan)">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-delay:120ms]" />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-delay:240ms]" />
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border/60 bg-background/70 p-3"
          >
            <button
              type="button"
              aria-label="Voice (demo only)"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Mic className="h-4 w-4" />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for a category, budget, or vibe…"
              className="h-9 flex-1 rounded-full border border-border bg-background px-4 text-sm shadow-sm focus:border-(--nx-blue-deep) focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || busy}
              aria-label="Send"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-(--nx-ink) text-white transition-colors hover:bg-(--nx-blue-deep) disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating waving greeting bubble (only when panel closed) */}
      {!open && greetingVisible && (
        <div className="pointer-events-auto nx-pop relative max-w-[260px] rounded-2xl border border-white/30 bg-white/95 px-4 py-3 text-sm shadow-[0_18px_40px_-12px_rgba(40,28,89,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95">
          <button
            type="button"
            onClick={() => {
              setGreetingVisible(false);
              if (typeof window !== "undefined") {
                sessionStorage.setItem("nexora.concierge.greeted", "1");
              }
              setGreetingDismissed(true);
            }}
            aria-label="Dismiss greeting"
            className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-colors hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </button>
          <p className="font-semibold tracking-tight text-foreground">
            Hi, I&rsquo;m Nexora AI <span className="nx-wave">👋</span>
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            What can I help you find today?
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-(--nx-blue-deep) hover:text-(--nx-ink) dark:text-(--nx-cyan)"
          >
            Start a chat <ArrowRight className="h-3 w-3" />
          </button>
          {/* tail */}
          <span
            aria-hidden
            className="absolute -bottom-2 right-8 h-3 w-3 rotate-45 border-b border-r border-white/30 bg-white/95 dark:border-white/10 dark:bg-slate-900/95"
          />
        </div>
      )}

      {/* Floating trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="pointer-events-auto group inline-flex items-center gap-2 rounded-full bg-linear-to-br from-(--nx-ink) to-(--nx-blue-deep) px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_-12px_rgba(40,28,89,0.55)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-12px_rgba(40,28,89,0.7)]"
        aria-expanded={open}
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15 transition-transform group-hover:rotate-12">
          <Wand2 className="h-3.5 w-3.5" />
        </span>
        {open ? "Hide concierge" : "Ask Nexora AI"}
      </button>
    </div>
  );
}

function ChatBubble({
  message,
  onFollowup,
}: {
  message: ChatMessage;
  onFollowup: (q: string) => void;
}) {
  const isUser = message.role === "user";
  return (
    <div
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"} flex-col gap-2`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "ml-auto rounded-tr-sm bg-(--nx-ink) text-white"
            : "rounded-tl-sm bg-white text-foreground shadow-sm dark:bg-slate-800"
        }`}
      >
        {message.text}
      </div>

      {message.products && message.products.length > 0 && (
        <ProductCarousel products={message.products} />
      )}

      {message.followups && message.followups.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {message.followups.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => onFollowup(f)}
              className="rounded-full border border-(--nx-blue-deep)/25 bg-(--nx-blue-deep)/5 px-2.5 py-1 text-[10px] font-semibold text-(--nx-blue-deep) transition-colors hover:bg-(--nx-blue-deep)/15 dark:text-(--nx-cyan)"
            >
              {f}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCarousel({ products }: { products: NxProduct[] }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {products.map((p) => (
        <Link
          key={p.id}
          href={`/shop?q=${encodeURIComponent(p.name)}`}
          className="group flex w-44 shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="relative aspect-4/3 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.image}
              alt={p.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {p.badge && (
              <span className="absolute left-2 top-2 rounded-full bg-(--nx-ink)/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                {p.badge}
              </span>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-1 p-2.5">
            <p className="line-clamp-1 text-xs font-semibold tracking-tight">
              {p.name}
            </p>
            <p className="line-clamp-1 text-[10px] text-muted-foreground">
              {p.tagline}
            </p>
            <div className="mt-auto flex items-center justify-between pt-1">
              <span className="text-xs font-semibold text-(--nx-blue-deep) dark:text-(--nx-cyan)">
                {formatUSD(p.price)}
              </span>
              <ArrowRight className="h-3 w-3 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// Silence import-only warnings for chips that may be unused if INTENTS expand.
void useMemo;
