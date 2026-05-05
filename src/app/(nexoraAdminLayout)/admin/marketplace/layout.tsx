import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  BarChart3,
  ChevronRight,
  Home,
  LayoutDashboard,
  Package,
  RefreshCw,
  Store,
  Users,
  Wallet,
} from "lucide-react";

import { getUserInfo } from "@/src/services/auth.services";
import AccountMenu from "@/components/modules/Nexora/AccountMenu";

export const dynamic = "force-dynamic";

const NAV: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { href: "/admin/marketplace", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/marketplace/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/marketplace/products", label: "Products", icon: Package },
  { href: "/admin/marketplace/sellers", label: "Sellers", icon: Store },
  { href: "/admin/marketplace/users", label: "Users", icon: Users },
  { href: "/admin/marketplace/payouts", label: "Payouts", icon: Wallet },
  { href: "/admin/marketplace/refunds", label: "Refunds", icon: RefreshCw },
];

export default async function AdminMarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserInfo();
  if (!user) redirect("/login?redirect=/admin/marketplace");
  if (user.role !== "ADMIN") redirect("/");

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border bg-[#F9F8F6] dark:bg-[#1c1c20]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Nexora home">
            <Image
              src="/logo/nexora-logo.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 rounded-xl object-cover ring-1 ring-border"
              priority
            />
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Marketplace Admin
              </p>
              <h1 className="truncate text-lg font-semibold tracking-tight md:text-xl">
                Nexora HQ
              </h1>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-xs font-semibold text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Home className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Back to site</span>
            </Link>
            <AccountMenu isAuthenticated role={user.role} />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-6 md:gap-8 md:px-8 md:py-8">
        <aside className="hidden w-60 shrink-0 lg:block">
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
          </nav>
        </aside>

        {/* Mobile horizontal nav */}
        <div className="lg:hidden">
          <nav className="-mx-4 mb-4 flex gap-1.5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
