"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Heart,
  LogOut,
  Package,
  Settings,
  Store,
  User,
} from "lucide-react";

import { logoutAction } from "@/src/app/(commonLayout)/(authRouteGroup)/logOut/_action";
import { cn } from "@/src/lib/utils";

interface Props {
  isAuthenticated: boolean;
  /** Optional role hint so we can show role-aware shortcuts. */
  role?: string | null;
}

const ITEMS = [
  { href: "/account", label: "Account", icon: User },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/settings", label: "Settings", icon: Settings },
];

export default function AccountMenu({ isAuthenticated, role }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  if (!isAuthenticated) {
    return (
      <Link
        href="/login"
        aria-label="Sign in"
        className="hidden h-9 w-9 place-items-center rounded-full text-foreground/80 transition-colors hover:bg-secondary md:grid"
      >
        <User className="h-4.5 w-4.5" />
      </Link>
    );
  }

  const handleLogout = () => {
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative hidden md:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        aria-expanded={open}
        className="grid h-9 w-9 place-items-center rounded-full text-foreground/80 transition-colors hover:bg-secondary"
      >
        <User className="h-4.5 w-4.5" />
      </button>

      <div
        className={cn(
          "absolute right-0 top-full z-50 mt-2 w-64 origin-top-right transition-all duration-200",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
      >
        <div className="overflow-hidden rounded-3xl border border-border bg-background/95 shadow-2xl backdrop-blur-xl">
          <div className="border-b border-border px-5 py-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Signed in
            </p>
            {role && (
              <p className="mt-1 text-xs font-semibold text-[#4E8D9C]">
                {role.toLowerCase()} workspace
              </p>
            )}
          </div>

          <ul className="p-2">
            {ITEMS.map((it) => {
              const Icon = it.icon;
              return (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-foreground/85 transition-colors hover:bg-secondary"
                  >
                    <Icon className="h-4 w-4 text-[#4E8D9C]" />
                    {it.label}
                  </Link>
                </li>
              );
            })}

            {role === "SELLER" && (
              <li>
                <Link
                  href="/seller"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-foreground/85 transition-colors hover:bg-secondary"
                >
                  <Store className="h-4 w-4 text-[#85C79A]" />
                  Seller workspace
                </Link>
              </li>
            )}

            {role === "ADMIN" && (
              <li>
                <Link
                  href="/admin/marketplace"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-foreground/85 transition-colors hover:bg-secondary"
                >
                  <Store className="h-4 w-4 text-[#85C79A]" />
                  Admin marketplace
                </Link>
              </li>
            )}
          </ul>

          <div className="border-t border-border p-2">
            <form action={logoutAction}>
              <button
                type="submit"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
