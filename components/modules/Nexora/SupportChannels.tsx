"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import {
  ArrowRight,
  Headphones,
  Mail,
  MessageCircle,
  Sparkles,
} from "lucide-react";

export type SupportChannelIcon = "chat" | "ai" | "email" | "phone";

interface Channel {
  iconName: SupportChannelIcon;
  title: string;
  desc: string;
  cta: string;
  href: string;
  available: boolean;
  /**
   * When set, instead of navigating, dispatch the global concierge event.
   * `chat` opens the panel as a live-chat-style session, `ai` seeds it as
   * an AI Q&A session.
   */
  action?: "chat" | "ai";
}

interface Props {
  channels: Channel[];
}

const ICON_MAP: Record<SupportChannelIcon, ComponentType<{ className?: string }>> = {
  chat: MessageCircle,
  ai: Sparkles,
  email: Mail,
  phone: Headphones,
};

const openConcierge = (prompt?: string) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("nexora:open-concierge", {
      detail: { prompt: prompt ?? "" },
    }),
  );
};

export default function SupportChannels({ channels }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {channels.map((c) => {
        const I = ICON_MAP[c.iconName] ?? MessageCircle;
        const inner = (
          <>
            <div className="flex items-start justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-linear-to-br from-(--nx-ink) to-(--nx-blue-deep) text-white">
                <I className="h-4 w-4" />
              </div>
              {c.available ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 nx-pulse-soft" />
                  Online
                </span>
              ) : (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  Off-hours
                </span>
              )}
            </div>
            <p className="mt-3 text-base font-semibold tracking-tight">
              {c.title}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{c.desc}</p>
            <p className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-(--nx-blue-deep) dark:text-(--nx-cyan)">
              {c.cta}
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </p>
          </>
        );

        const baseClass =
          "group relative block w-full overflow-hidden rounded-2xl border border-border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md";

        if (c.action === "chat") {
          return (
            <button
              key={c.title}
              type="button"
              onClick={() =>
                openConcierge(
                  "I'd like to chat with a Nexora support agent — can you help?",
                )
              }
              className={baseClass}
            >
              {inner}
            </button>
          );
        }
        if (c.action === "ai") {
          return (
            <button
              key={c.title}
              type="button"
              onClick={() => openConcierge()}
              className={baseClass}
            >
              {inner}
            </button>
          );
        }
        return (
          <Link key={c.title} href={c.href} className={baseClass}>
            {inner}
          </Link>
        );
      })}
    </div>
  );
}
