import Link from "next/link";
import { ArrowRight, Heart, Mail, Package, Wand2 } from "lucide-react";

import { getUserInfo } from "@/src/services/auth.services";
import WelcomeWave from "@/components/modules/Nexora/shared/WelcomeWave";
import { getProducts } from "@/src/services/nexora.service";
import { primaryImage, toNumberPrice } from "@/src/types/nexora.types";
import { formatUSD } from "@/components/modules/Nexora/data";
import RecommendationCarousel from "@/components/modules/Nexora/RecommendationCarousel";
import SmartImage from "@/components/modules/Nexora/SmartImage";

export const metadata = {
  title: "Your account · Nexora",
};

export default async function AccountOverviewPage() {
  const [user, recRes] = await Promise.all([
    getUserInfo(),
    getProducts({ limit: 4, sortBy: "soldCount", sortOrder: "desc" }),
  ]);
  // Layout already redirects unauthenticated users; user is guaranteed here.
  if (!user) return null;

  const recommended = recRes.data ?? [];

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
      <div className="nx-card nx-aurora relative overflow-hidden p-8 md:p-10">
        <div
          aria-hidden
          className="nx-orb pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full"
          style={{
            background: "radial-gradient(circle, #6FB6CC 0%, transparent 65%)",
          }}
        />
        <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_auto]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur">
              <Wand2 className="h-3 w-3 text-(--nx-blue)" />
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

          <div className="hidden md:flex md:items-center md:justify-end">
            <WelcomeWave className="h-44 w-44 lg:h-56 lg:w-56" />
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
            <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-foreground transition-colors group-hover:text-[#4E8D9C]">
              Open
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      {/* Recommended for you */}
      {recommended.length > 0 && (
        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Recommended · Hand-picked by AI
              </p>
              <h3 className="mt-1 text-xl font-semibold tracking-tight md:text-2xl">
                For you, {user.name?.split(" ")[0] ?? "there"}.
              </h3>
            </div>
            <Link
              href="/shop"
              className="hidden shrink-0 items-center gap-1 text-sm font-medium text-foreground/80 hover:text-foreground sm:inline-flex"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {recommended.map((p) => {
              const img =
                primaryImage(p) ??
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80";
              const price = toNumberPrice(p.price);
              return (
                <Link
                  key={p.id}
                  href={`/shop/${p.slug}`}
                  className="nx-card group overflow-hidden p-3"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-linear-to-br from-(--nx-blue)/10 to-(--nx-cyan)/10">
                    <SmartImage
                      src={img}
                      alt={p.images?.[0]?.alt ?? p.name}
                      fill
                      sizes="(min-width: 1024px) 22vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                  </div>
                  <p className="mt-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                    {p.category?.name ?? p.brand?.name ?? "Featured"}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-sm font-semibold">
                    {p.name}
                  </p>
                  <p className="mt-1 text-sm font-semibold tracking-tight">
                    {formatUSD(price)}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Personalized v2 — server-side AI recommendations */}
      <RecommendationCarousel variant="for-you" />
    </div>
  );
}
