import Link from "next/link";
import { ArrowRight, Heart, Mail, Package, Sparkles } from "lucide-react";

import { getUserInfo } from "@/src/services/auth.services";

export const metadata = {
  title: "Your account · Nexora",
};

export default async function AccountOverviewPage() {
  const user = await getUserInfo();
  // Layout already redirects unauthenticated users; user is guaranteed here.
  if (!user) return null;

  const cards: {
    href: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      href: "/account/orders",
      title: "Orders & tracking",
      description: "See past purchases and track active shipments.",
      icon: Package,
    },
    {
      href: "/account/wishlist",
      title: "Saved for later",
      description: "Items you've hearted across the catalog.",
      icon: Heart,
    },
    {
      href: "/account/settings",
      title: "Account settings",
      description: "Update your name, email, and password.",
      icon: Mail,
    },
  ];

  return (
    <div>
      {/* Welcome card */}
      <div className="nx-card relative overflow-hidden p-8 md:p-10">
        <div
          aria-hidden
          className="nx-orb pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full"
          style={{
            background: "radial-gradient(circle, #3B82F6 0%, transparent 65%)",
          }}
        />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3 w-3 text-[#3B82F6]" />
            Nexora AI is curating recommendations for you
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
            Welcome back, {user.name?.split(" ")[0] ?? "friend"}.
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base">
            Pick up where you left off — track an order, revisit your saved
            items, or discover what&rsquo;s new in tech.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="nx-btn-primary inline-flex h-11 items-center gap-2 px-6 text-sm font-medium"
            >
              Continue shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/account/orders"
              className="nx-btn-ghost inline-flex h-11 items-center gap-2 px-6 text-sm font-medium"
            >
              View orders
            </Link>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ href, title, description, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="nx-card group flex flex-col p-6"
          >
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-secondary text-foreground/70">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-semibold tracking-tight">
              {title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-foreground transition-colors group-hover:text-[#3B82F6]">
              Open
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
