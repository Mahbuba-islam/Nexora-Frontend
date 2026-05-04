"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, Wand2, Store, ArrowRight, X } from "lucide-react";
import { NX_NAV } from "./data";
import AISearchDialog from "./AISearchDialog";
import AccountMenu from "./AccountMenu";
import CategoriesMegaMenu from "./CategoriesMegaMenu";
import NotificationBell from "./NotificationBell";
import { logoutAction } from "@/src/app/(commonLayout)/(authRouteGroup)/logOut/_action";
import { useCart } from "@/src/providers/CartProvider";
import { useWishlist } from "@/src/providers/WishlistProvider";
import { cn } from "@/src/lib/utils";

interface HeaderProps {
  isAuthenticated?: boolean;
  role?: string | null;
}

export default function Header({ isAuthenticated = false, role = null }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const { count, hydrated } = useCart();
  const { count: wishCount, hydrated: wishHydrated } = useWishlist();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cmd/Ctrl + K opens AI search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setAiOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
            <span className="relative grid h-8 w-8 place-items-center rounded-xl bg-[#281C59] text-[#F9F8F6] dark:bg-[#F9F8F6] dark:text-[#281C59]">
              <span className="text-sm font-black">N</span>
              <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-[#85C79A] shadow-[0_0_10px_rgba(75,191,249,0.9)]" />
            </span>
            <span className="text-[15px] md:text-base">Nexora</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            <CategoriesMegaMenu />
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
              onClick={() => setAiOpen(true)}
              className="hidden h-9 items-center gap-2 rounded-full border border-border bg-background/60 px-3 text-xs text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
            >
              <Wand2 className="h-3.5 w-3.5 text-[#4E8D9C]" />
              Ask Nexora AI
              <span className="ml-2 rounded-md border border-border px-1.5 py-0.5 text-[10px] font-medium text-foreground/70">
                ⌘K
              </span>
            </button>
            <button
              type="button"
              aria-label="Search"
              onClick={() => setAiOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-full text-foreground/80 transition-colors hover:bg-secondary md:hidden"
            >
              <Search className="h-4.5 w-4.5" />
            </button>
            <Link
              href="/sell/start"
              className="group hidden h-9 items-center gap-2 rounded-full bg-linear-to-r from-[#281C59] to-[#4E8D9C] px-4 text-xs font-semibold text-white shadow-[0_8px_24px_-12px_rgba(40,28,89,0.6)] transition-all hover:shadow-[0_12px_30px_-10px_rgba(78,141,156,0.7)] hover:-translate-y-px md:inline-flex"
              aria-label="Sell on Nexora"
            >
              <Store className="h-3.5 w-3.5" />
              Sell on Nexora
              <span className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-white/70 lg:inline">
                Join now
              </span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/account/wishlist"
              aria-label={`Wishlist (${wishCount} items)`}
              className="relative hidden h-9 w-9 place-items-center rounded-full text-foreground/80 transition-colors hover:bg-secondary md:grid"
            >
              <Heart className="h-4.5 w-4.5" />
              {wishHydrated && wishCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                  {wishCount > 99 ? "99+" : wishCount}
                </span>
              )}
            </Link>
            <div className="hidden md:block">
              <NotificationBell visible={isAuthenticated} />
            </div>
            <AccountMenu isAuthenticated={isAuthenticated} role={role} />
            <Link
              href="/cart"
              aria-label={`Cart (${count} items)`}
              className="relative grid h-9 w-9 place-items-center rounded-full text-foreground/80 transition-colors hover:bg-secondary"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              {hydrated && count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#4E8D9C] px-1 text-[10px] font-semibold text-white">
                  {count > 99 ? "99+" : count}
                </span>
              )}
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
            <Link
              href="/sell/start"
              onClick={() => setOpen(false)}
              className="mx-2 my-2 flex items-center justify-between rounded-2xl bg-linear-to-r from-[#281C59] to-[#4E8D9C] px-4 py-3.5 text-sm font-semibold text-white"
            >
              <span className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                Sell on Nexora · Join now
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
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
            {isAuthenticated && (
              <>
                <div className="my-3 h-px bg-border" />
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-medium text-foreground/90 transition-colors hover:bg-secondary"
                >
                  Account
                  <span aria-hidden className="text-foreground/40">→</span>
                </Link>
                <Link
                  href="/account/settings"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-medium text-foreground/90 transition-colors hover:bg-secondary"
                >
                  Settings
                  <span aria-hidden className="text-foreground/40">→</span>
                </Link>
              </>
            )}
          </nav>
          <div className="space-y-3 border-t border-border p-5">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setAiOpen(true);
              }}
              className="nx-btn-primary inline-flex h-11 w-full items-center justify-center gap-2 px-5 text-sm font-medium"
            >
              <Wand2 className="h-4 w-4" />
              Ask Nexora AI
            </button>
            {isAuthenticated && (
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border bg-background text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  Sign out
                </button>
              </form>
            )}
          </div>
        </aside>
      </div>

      <AISearchDialog open={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
