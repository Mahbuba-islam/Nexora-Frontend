"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  FileText,
  Info,
  LifeBuoy,
  Package,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

const ITEMS: {
  href: string;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    href: "/about",
    label: "About",
    desc: "Our story, team, and mission.",
    icon: Info,
  },
  {
    href: "/ai",
    label: "How it works",
    desc: "Inside the Nexora AI concierge.",
    icon: Sparkles,
  },
  {
    href: "/support",
    label: "Help center",
    desc: "Browse answers or chat with us.",
    icon: LifeBuoy,
  },
  {
    href: "/shipping",
    label: "Shipping",
    desc: "Delivery times and rates.",
    icon: Truck,
  },
  {
    href: "/returns",
    label: "Returns",
    desc: "30-day, no-questions returns.",
    icon: RotateCcw,
  },
  {
    href: "/warranty",
    label: "Warranty",
    desc: "What&rsquo;s covered, for how long.",
    icon: ShieldCheck,
  },
  {
    href: "/orders",
    label: "Order status",
    desc: "Track an active shipment.",
    icon: Package,
  },
  {
    href: "/terms",
    label: "Terms & policies",
    desc: "The plain-English fine print.",
    icon: FileText,
  },
];

export default function MoreMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  };

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => () => cancelClose(), []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
      onFocus={() => {
        cancelClose();
        setOpen(true);
      }}
      onBlur={(e) => {
        if (!ref.current?.contains(e.relatedTarget as Node)) scheduleClose();
      }}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={[
          "relative inline-flex items-center rounded-full px-3.5 py-1.5 text-sm transition-colors",
          open ? "text-foreground" : "text-foreground/75 hover:text-foreground",
        ].join(" ")}
      >
        More
        <span
          aria-hidden
          className={[
            "absolute -bottom-0.5 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-current transition-all duration-200",
            open ? "w-5 opacity-80" : "w-0 opacity-0",
          ].join(" ")}
        />
      </button>

      <div
        role="menu"
        data-state={open ? "open" : "closed"}
        aria-hidden={!open}
        className={[
          "absolute left-1/2 top-[calc(100%+8px)] z-50 w-[min(92vw,540px)] -translate-x-1/2 origin-top rounded-3xl border border-border bg-background/95 p-3 shadow-2xl backdrop-blur-xl transition-all duration-200",
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-1 scale-95 opacity-0",
        ].join(" ")}
      >
        <div className="grid gap-1 sm:grid-cols-2">
          {ITEMS.map((it) => {
            const Icon = it.icon;
            return (
              <Link
                key={it.href}
                href={it.href}
                role="menuitem"
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                className="group flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-secondary"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-secondary text-foreground/70 transition-colors group-hover:bg-(--nx-blue-deep) group-hover:text-white dark:group-hover:bg-(--nx-cyan) dark:group-hover:text-[#0B0B12]">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold tracking-tight text-foreground">
                    {it.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {it.desc}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
