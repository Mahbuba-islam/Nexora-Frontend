import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Package,
  PackagePlus,
  Wallet,
} from "lucide-react";

import { getUserInfo } from "@/src/services/auth.services";
import { logoutAction } from "@/src/app/(commonLayout)/(authRouteGroup)/logOut/_action";

export const dynamic = "force-dynamic";

const NAV: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { href: "/seller", label: "Overview", icon: LayoutDashboard },
  { href: "/seller/products", label: "Products", icon: PackagePlus },
  { href: "/seller/orders", label: "Orders", icon: Package },
  { href: "/seller/payouts", label: "Payouts", icon: Wallet },
];

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserInfo();
  if (!user) redirect("/login?redirect=/seller");
  if (user.role !== "SELLER" && user.role !== "ADMIN") {
    redirect("/");
  }

  const name =
    user.name ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.email ||
    "Seller";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border bg-[#F9F8F6] dark:bg-[#1c1c20]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Seller Workspace
            </p>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              {name}
            </h1>
          </div>
          <Link
            href="/"
            className="hidden text-xs font-semibold text-foreground/70 hover:text-foreground md:block"
          >
            ← Back to storefront
          </Link>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-8 md:px-8">
        <aside className="hidden w-60 shrink-0 md:block">
          <nav className="nx-card sticky top-24 p-3">
            <ul className="space-y-1">
              {NAV.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                      <ChevronRight className="ml-auto h-3.5 w-3.5 text-foreground/30" />
                    </Link>
                  </li>
                );
              })}
            </ul>
            <form action={logoutAction} className="mt-3 border-t border-border pt-3">
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </form>
          </nav>
        </aside>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
