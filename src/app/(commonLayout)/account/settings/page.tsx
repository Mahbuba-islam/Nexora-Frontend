import Link from "next/link";
import { redirect } from "next/navigation";
import { Bell, ChevronRight, Lock, Mail, Shield, User } from "lucide-react";

import { getUserInfo } from "@/src/services/auth.services";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getUserInfo();
  if (!user) redirect("/login?redirect=/account/settings");

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Account · Settings
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          Manage your Nexora account
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Update your profile, security and notification preferences.
        </p>
      </header>

      {/* Profile card */}
      <section className="nx-card p-6 md:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-[#281C59] text-lg font-semibold text-white">
              {(user.name ?? user.email ?? "N").slice(0, 1).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-semibold">
                {user.name ?? "Unnamed shopper"}
              </h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {user.role && (
                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#EDF7BD] px-2 py-0.5 text-[11px] font-semibold text-[#281C59]">
                  {String(user.role).toLowerCase()} account
                </span>
              )}
            </div>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field icon={User} label="Display name" value={user.name ?? "—"} />
          <Field icon={Mail} label="Email" value={user.email ?? "—"} />
          <Field
            icon={Shield}
            label="Email verified"
            value={user.isEmailVerified ? "Verified" : "Pending"}
          />
          <Field
            icon={Bell}
            label="Notifications"
            value="On — orders, payouts, system"
          />
        </dl>
      </section>

      {/* Action grid */}
      <section className="grid gap-4 md:grid-cols-2">
        <SettingLink
          href="/change-password"
          icon={Lock}
          title="Change password"
          desc="Rotate your password regularly to keep your account safe."
        />
        <SettingLink
          href="/account/notifications"
          icon={Bell}
          title="Notification center"
          desc="Review delivery, payout and system updates."
        />
        <SettingLink
          href="/account/orders"
          icon={ChevronRight}
          title="Order history"
          desc="Track shipments and download invoices."
        />
        <SettingLink
          href="/sell/start"
          icon={ChevronRight}
          title="Sell on Nexora"
          desc="Start selling and reach millions of curious shoppers."
        />
      </section>

      {/* Danger zone */}
      <section className="nx-card border-red-200 bg-red-50/40 p-6 dark:border-red-900/40 dark:bg-red-950/20">
        <h3 className="text-sm font-semibold text-red-700 dark:text-red-300">
          Danger zone
        </h3>
        <p className="mt-1 text-xs text-red-600/80 dark:text-red-300/80">
          Deleting your account is permanent. Outstanding orders and reviews
          will be anonymized.
        </p>
        <button
          type="button"
          disabled
          className="mt-4 inline-flex h-9 items-center rounded-full border border-red-200 bg-white px-4 text-xs font-semibold text-red-600 opacity-60"
        >
          Request account deletion
        </button>
      </section>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/60 p-4">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="mt-1.5 text-sm font-medium text-foreground/90">{value}</p>
    </div>
  );
}

function SettingLink({
  href,
  icon: Icon,
  title,
  desc,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="nx-card group flex items-start gap-4 p-5 transition-shadow hover:shadow-md"
    >
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#EDF7BD] text-[#281C59]">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold">{title}</h4>
        <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-foreground/30 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
