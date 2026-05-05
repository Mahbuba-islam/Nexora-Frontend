"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, Wand2, Store, ArrowRight, X } from "lucide-react";
import { NX_NAV } from "./data";
import AISearchDialog from "./AISearchDialog";
import AccountMenu from "./AccountMenu";
import CategoriesMegaMenu from "./CategoriesMegaMenu";
import NotificationBell from "./NotificationBell";
import ThemeToggle from "./ThemeToggle";
import MoreMenu from "./MoreMenu";
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
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 md:h-[52px] md:px-8">
          {/* Logo */}
   <Link
  href="/"
  aria-label="Nexora home"
  className="group flex items-center gap-2 md:gap-2.5 font-semibold tracking-tight"
>
  {/* Logo */}
  <span className="relative flex h-9 w-9 md:h-10 md:w-10 items-center justify-center  rounded-full  dark:bg-[#F9F8F6] ring-1 ring-black/5 dark:ring-white/10 transition-all duration-300 group-hover:scale-[1.03] group-hover:ring-indigo-400/40">
    <Image
      src="/logo/nexora-new-logo.png"
      alt="Nexora logo"
    fill
      priority
      className=""
    />

    {/* Status dot */}
    <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-[#85C79A] shadow-[0_0_6px_rgba(133,199,154,0.9)]" />
  </span>

  {/* Text */}
  {/* <span className="text-[15px] md:text-[16px] leading-none font-semibold text-black dark:text-white transition-colors duration-300 group-hover:text-indigo-500 dark:group-hover:text-indigo-300">
    Nexora
  </span> */}
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
            <MoreMenu />
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Ask Nexora AI"
              onClick={() => setAiOpen(true)}
              className="hidden h-9 items-center gap-2 rounded-full border border-border bg-background/60 px-3 text-xs text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
            >
              <Wand2 className="h-3.5 w-3.5 text-[#4E8D9C]" />
              <span className="hidden lg:inline">Ask Nexora AI</span>
              <span className="lg:hidden">Ask AI</span>
              <span className="ml-1 rounded-md border border-border px-1.5 py-0.5 text-[10px] font-medium text-foreground/70">
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
              className="group hidden h-9 items-center gap-1.5 rounded-full bg-linear-to-r from-[#281C59] to-[#4E8D9C] px-3.5 text-xs font-semibold text-white shadow-[0_8px_24px_-12px_rgba(40,28,89,0.6)] transition-all hover:-translate-y-px hover:shadow-[0_12px_30px_-10px_rgba(78,141,156,0.7)] md:inline-flex"
              aria-label="Sell on Nexora"
            >
              <Store className="h-3.5 w-3.5" />
              <span>Sell</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>

            {/* Icon tray — groups secondary actions for visual hierarchy */}
            <div className="hidden items-center gap-0.5 rounded-full border border-border bg-background/40 p-0.5 md:flex">
              <Link
                href="/account/wishlist"
                aria-label={`Wishlist (${wishCount} items)`}
                className="relative grid h-8 w-8 place-items-center rounded-full text-foreground/80 transition-colors hover:bg-secondary"
              >
                <Heart className="h-4 w-4" />
                {wishHydrated && wishCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                    {wishCount > 99 ? "99+" : wishCount}
                  </span>
                )}
              </Link>
              <NotificationBell visible={isAuthenticated} />
              <ThemeToggle className="grid" />
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
            {/* More — same destinations as the desktop dropdown */}
            <div className="my-3 px-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                More
              </p>
            </div>
            {[
              { href: "/about", label: "About" },
              { href: "/ai", label: "How it works" },
              { href: "/support", label: "Help center" },
              { href: "/shipping", label: "Shipping" },
              { href: "/returns", label: "Returns" },
              { href: "/warranty", label: "Warranty" },
              { href: "/orders", label: "Order status" },
              { href: "/terms", label: "Terms & policies" },
            ].map((m) => (
              <Link
                key={m.href}
                href={m.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary"
              >
                {m.label}
                <span aria-hidden className="text-foreground/40">→</span>
              </Link>
            ))}
            {isAuthenticated ? (
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
                  href="/account/wishlist"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-medium text-foreground/90 transition-colors hover:bg-secondary"
                >
                  Wishlist
                  {wishHydrated && wishCount > 0 && (
                    <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                      {wishCount > 99 ? "99+" : wishCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/account/orders"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-medium text-foreground/90 transition-colors hover:bg-secondary"
                >
                  My orders
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
            ) : (
              <>
                <div className="my-3 h-px bg-border" />
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  Sign in
                  <span aria-hidden className="text-foreground/40">→</span>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-medium text-foreground/90 transition-colors hover:bg-secondary"
                >
                  Create account
                  <span aria-hidden className="text-foreground/40">→</span>
                </Link>
              </>
            )}
          </nav>
          <div className="space-y-3 border-t border-border p-5">
            <div className="flex items-center justify-between rounded-2xl border border-border bg-secondary/40 px-4 py-2.5">
              <span className="text-sm font-medium text-foreground/80">Theme</span>
              <ThemeToggle />
            </div>
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
