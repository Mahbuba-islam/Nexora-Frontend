import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Bell,
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
  { href: "/account/notifications", label: "Notifications", icon: Bell },
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
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-8 md:px-8 md:py-12 lg:grid-cols-12 lg:gap-12">
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
