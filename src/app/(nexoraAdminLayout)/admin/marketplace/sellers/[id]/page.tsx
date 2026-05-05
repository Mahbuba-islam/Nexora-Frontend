import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  Store,
  TrendingUp,
  Wallet,
  XCircle,
} from "lucide-react";

import { getAdminSellerDetail } from "@/src/services/admin.service";
import { formatUSD } from "@/components/modules/Nexora/data";
import RowActionButton from "@/components/modules/admin/RowActionButton";
import InlineEditDialog from "@/components/modules/admin/InlineEditDialog";
import {
  approveSellerAction,
  deleteSellerAction,
  reinstateSellerAction,
  rejectSellerAction,
  suspendSellerAction,
  updateSellerAction,
} from "../../_actions";

export const dynamic = "force-dynamic";

export default async function AdminSellerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const seller = await getAdminSellerDetail(id);
  if (!seller) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/marketplace/sellers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All sellers
        </Link>
        <StatusBadge status={seller.status} />
      </div>

      <header className="nx-card flex flex-wrap items-start justify-between gap-4 p-6">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#281C59] text-white">
              <Store className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-semibold tracking-tight">
                {seller.shopName}
              </h1>
              {seller.shopSlug && (
                <p className="text-xs text-muted-foreground">
                  /{seller.shopSlug}
                </p>
              )}
            </div>
          </div>
          {seller.tagline && (
            <p className="mt-3 text-sm text-foreground/80">{seller.tagline}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {seller.user?.email && (
              <span className="inline-flex items-center gap-1">
                <Mail className="h-3 w-3" /> {seller.user.email}
              </span>
            )}
            {seller.contactPhone && (
              <span className="inline-flex items-center gap-1">
                <Phone className="h-3 w-3" /> {seller.contactPhone}
              </span>
            )}
            {seller.kycStatus && (
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> KYC {seller.kycStatus}
              </span>
            )}
            {seller.commissionRate != null && (
              <span className="inline-flex items-center gap-1">
                <Wallet className="h-3 w-3" />{" "}
                {(Number(seller.commissionRate) * 100).toFixed(1)}% commission
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <InlineEditDialog
            title="Edit seller profile"
            triggerLabel="Edit profile"
            triggerVariant="primary"
            fields={[
              { name: "shopName", label: "Shop name", defaultValue: seller.shopName },
              { name: "tagline", label: "Tagline", defaultValue: seller.tagline ?? "" },
              {
                name: "contactEmail",
                label: "Contact email",
                defaultValue: seller.contactEmail ?? "",
              },
              {
                name: "commissionRate",
                label: "Commission rate (0–1)",
                type: "number",
                step: "0.001",
                defaultValue: seller.commissionRate ?? 0.1,
              },
              {
                name: "kycStatus",
                label: "KYC status",
                type: "select",
                defaultValue: seller.kycStatus ?? "PENDING",
                options: [
                  { value: "PENDING", label: "Pending" },
                  { value: "APPROVED", label: "Approved" },
                  { value: "REJECTED", label: "Rejected" },
                ],
              },
            ]}
            onSave={(payload) => updateSellerAction(seller.id, payload)}
          />
          {seller.status === "PENDING" && (
            <>
              <RowActionButton
                variant="primary"
                label="Approve"
                action={() => approveSellerAction(seller.id)}
              />
              <RowActionButton
                variant="danger"
                label="Reject"
                confirm="Reject this seller's application?"
                action={() => rejectSellerAction(seller.id, "Rejected via admin UI")}
              />
            </>
          )}
          {seller.status === "APPROVED" && (
            <RowActionButton
              variant="subtle"
              label="Suspend"
              confirm="Suspend this seller? Their listings will be hidden."
              action={() => suspendSellerAction(seller.id, "Suspended via admin UI")}
            />
          )}
          {seller.status === "SUSPENDED" && (
            <RowActionButton
              variant="primary"
              label="Reinstate"
              action={() => reinstateSellerAction(seller.id)}
            />
          )}
          <RowActionButton
            variant="ghost"
            label="Close shop"
            confirm="Soft-close this shop? Listings go offline."
            action={() => deleteSellerAction(seller.id)}
          />
        </div>
      </header>

      {/* KPI grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          label="Lifetime GMV"
          value={formatUSD(Number(seller.gmv ?? 0))}
          icon={TrendingUp}
        />
        <Kpi
          label="Seller earnings"
          value={formatUSD(Number(seller.sellerEarnings ?? 0))}
          icon={Wallet}
          tone="emerald"
        />
        <Kpi
          label="Commission collected"
          value={formatUSD(Number(seller.commission ?? 0))}
          icon={Wallet}
        />
        <Kpi
          label="Paid orders"
          value={(seller.paidOrders ?? 0).toLocaleString()}
          icon={CheckCircle2}
        />
        <Kpi
          label="GMV (30d)"
          value={formatUSD(Number(seller.monthGmv ?? 0))}
          icon={TrendingUp}
        />
        <Kpi
          label="Earnings (30d)"
          value={formatUSD(Number(seller.monthEarnings ?? 0))}
          icon={Wallet}
          tone="emerald"
        />
        <Kpi
          label="Orders (30d)"
          value={(seller.ordersLast30Days ?? 0).toLocaleString()}
          icon={Package}
        />
        <Kpi
          label="Refunds"
          value={(seller.refundCount ?? 0).toLocaleString()}
          icon={XCircle}
          tone="rose"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="nx-card p-5">
          <h3 className="text-base font-semibold tracking-tight">Payout health</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Pending vs settled payouts.
          </p>
          <dl className="mt-4 space-y-2 text-sm">
            <Row
              label="Pending payouts"
              value={formatUSD(Number(seller.pendingPayoutTotal ?? 0))}
              tone="amber"
            />
            <Row
              label="Paid payouts"
              value={formatUSD(Number(seller.paidPayoutTotal ?? 0))}
              tone="emerald"
            />
            <Row
              label="Low-stock SKUs"
              value={(seller.lowStockCount ?? 0).toLocaleString()}
              tone="rose"
            />
            <Row
              label="Catalog size"
              value={(seller.productCount ?? 0).toLocaleString()}
            />
          </dl>
        </div>

        <div className="nx-card p-5">
          <h3 className="text-base font-semibold tracking-tight">About</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Public-facing description.
          </p>
          {seller.description ? (
            <p className="mt-3 whitespace-pre-line text-sm text-foreground/80">
              {seller.description}
            </p>
          ) : (
            <p className="mt-3 text-sm italic text-muted-foreground">
              No description provided.
            </p>
          )}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {seller.user?.name ?? "Owner unset"}
            </span>
            <span>
              Joined{" "}
              {seller.createdAt
                ? new Date(seller.createdAt).toLocaleDateString()
                : "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "APPROVED"
      ? "bg-emerald-500/15 text-emerald-700"
      : status === "PENDING"
        ? "bg-amber-500/15 text-amber-700"
        : status === "SUSPENDED"
          ? "bg-rose-500/15 text-rose-700"
          : "bg-zinc-500/15 text-zinc-700";
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${tone}`}
    >
      {status}
    </span>
  );
}

function Kpi({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "emerald" | "rose";
}) {
  const valueTone =
    tone === "emerald"
      ? "text-emerald-600"
      : tone === "rose"
        ? "text-rose-600"
        : "text-foreground";
  return (
    <div className="nx-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        <Icon className="h-4 w-4 text-foreground/40" />
      </div>
      <p className={`mt-2 text-xl font-semibold tracking-tight ${valueTone}`}>
        {value}
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "amber" | "emerald" | "rose";
}) {
  const valueTone =
    tone === "amber"
      ? "text-amber-600"
      : tone === "emerald"
        ? "text-emerald-600"
        : tone === "rose"
          ? "text-rose-600"
          : "text-foreground";
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-sm">
      <dt className="text-foreground/70">{label}</dt>
      <dd className={`font-semibold ${valueTone}`}>{value}</dd>
    </div>
  );
}
