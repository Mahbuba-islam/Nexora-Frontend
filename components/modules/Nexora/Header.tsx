"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, Sparkles, X } from "lucide-react";
import { NX_NAV } from "./data";
import { cn } from "@/src/lib/utils";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-500",
          scrolled
            ? "bg-background/75 backdrop-blur-xl border-b border-border"
            : "bg-transparent border-b border-transparent",
        )}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:h-16 md:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="group inline-flex items-center gap-2 font-semibold tracking-tight"
            aria-label="Nexora home"
          >
            <span className="relative grid h-8 w-8 place-items-center rounded-xl bg-[#242424] text-[#F9F8F6] dark:bg-[#F9F8F6] dark:text-[#242424]">
              <span className="text-sm font-black">N</span>
              <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-[#4BBFF9] shadow-[0_0_10px_rgba(75,191,249,0.9)]" />
            </span>
            <span className="text-[15px] md:text-base">Nexora</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NX_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative rounded-full px-3.5 py-1.5 text-sm text-foreground/75 transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="AI search"
              className="hidden h-9 items-center gap-2 rounded-full border border-border bg-background/60 px-3 text-xs text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#3B82F6]" />
              Ask Nexora AI
              <span className="ml-2 rounded-md border border-border px-1.5 py-0.5 text-[10px] font-medium text-foreground/70">
                ⌘K
              </span>
            </button>
            <button
              type="button"
              aria-label="Search"
              className="grid h-9 w-9 place-items-center rounded-full text-foreground/80 transition-colors hover:bg-secondary md:hidden"
            >
              <Search className="h-4.5 w-4.5" />
            </button>
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative grid h-9 w-9 place-items-center rounded-full text-foreground/80 transition-colors hover:bg-secondary"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#3B82F6] px-1 text-[10px] font-semibold text-white">
                2
              </span>
            </Link>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-full text-foreground/80 transition-colors hover:bg-secondary lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sheet */}
      <div
        className={cn(
          "fixed inset-0 z-60 transition-opacity duration-300 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <aside
          className={cn(
            "absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-background shadow-2xl transition-transform duration-500",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <span className="font-semibold tracking-tight">Menu</span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-2">
            {NX_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-medium text-foreground/90 transition-colors hover:bg-secondary"
              >
                {item.label}
                <span aria-hidden className="text-foreground/40">→</span>
              </Link>
            ))}
          </nav>
          <div className="border-t border-border p-5">
            <button
              type="button"
              className="nx-btn-primary inline-flex h-11 w-full items-center justify-center gap-2 px-5 text-sm font-medium"
            >
              <Sparkles className="h-4 w-4" />
              Ask Nexora AI
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
