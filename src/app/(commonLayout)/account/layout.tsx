import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ChevronRight,
  Heart,
  LogOut,
  Package,
  Settings,
  User,
} from "lucide-react";

import { getUserInfo } from "@/src/services/auth.services";
import { logoutAction } from "@/src/app/(commonLayout)/(authRouteGroup)/logOut/_action";

const NAV: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { href: "/account", label: "Overview", icon: User },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/settings", label: "Settings", icon: Settings },
];

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserInfo();
  if (!user) {
    redirect("/login?redirect=/account");
  }

  return (
    <div className="bg-background">
      {/* Header */}
      <header className="border-b border-border bg-[#F9F8F6] dark:bg-[#1c1c20]">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Your Nexora account
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
            Hi, {user.name?.split(" ")[0] ?? "there"}.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 md:px-8 lg:grid-cols-12 lg:gap-12">
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <nav className="nx-card sticky top-24 overflow-hidden p-2">
            <ul>
              {NAV.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-foreground/85 transition-colors hover:bg-secondary"
                  >
                    <span className="inline-flex items-center gap-3">
                      <Icon className="h-4 w-4 text-foreground/60" />
                      {label}
                    </span>
                    <ChevronRight className="h-4 w-4 text-foreground/30 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
            <form action={logoutAction} className="border-t border-border p-2">
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-foreground/85 transition-colors hover:bg-secondary"
              >
                <LogOut className="h-4 w-4 text-foreground/60" />
                Sign out
              </button>
            </form>
          </nav>
        </aside>

        <div className="lg:col-span-9">{children}</div>
      </div>
    </div>
  );
}
