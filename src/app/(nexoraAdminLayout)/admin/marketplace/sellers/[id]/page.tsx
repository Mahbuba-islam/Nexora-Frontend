import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getAdminSellerDetail } from "@/src/services/admin.service";
import { formatUSD } from "@/components/modules/Nexora/data";
import SellerActions from "@/components/modules/admin/SellerActions";

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
      <div>
        <Link
          href="/admin/marketplace/sellers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground/70 hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sellers
        </Link>
      </div>

      <header className="nx-card flex flex-wrap items-start justify-between gap-4 p-6">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Seller profile
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">
            {seller.shopName}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {seller.tagline ?? seller.description ?? "—"}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <Pill>Status · {seller.status}</Pill>
            <Pill>KYC · {seller.kycStatus ?? "—"}</Pill>
            <Pill>
              Commission ·{" "}
              {seller.commissionRate != null
                ? `${(seller.commissionRate * 100).toFixed(1)}%`
                : "—"}
            </Pill>
          </div>
        </div>

        <SellerActions
          seller={{
            id: seller.id,
            shopName: seller.shopName,
            tagline: seller.tagline,
            contactEmail: seller.contactEmail,
            commissionRate: seller.commissionRate,
            kycStatus: seller.kycStatus,
            status: seller.status,
          }}
        />
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Products" value={seller.productCount ?? 0} />
        <Stat label="Orders" value={seller.ordersCount ?? 0} />
        <Stat
          label="GMV"
          value={
            seller.gmv != null
              ? formatUSD(Number(seller.gmv))
              : seller.totalSales != null
                ? formatUSD(Number(seller.totalSales))
                : "$0.00"
          }
        />
        <Stat
          label="Earnings"
          value={
            seller.sellerEarnings != null
              ? formatUSD(Number(seller.sellerEarnings))
              : "$0.00"
          }
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="nx-card p-5">
          <h3 className="text-sm font-semibold tracking-tight">Last 30 days</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <Row label="Orders" value={seller.ordersLast30Days ?? 0} />
            <Row
              label="GMV"
              value={
                seller.monthGmv != null
                  ? formatUSD(Number(seller.monthGmv))
                  : "—"
              }
            />
            <Row
              label="Earnings"
              value={
                seller.monthEarnings != null
                  ? formatUSD(Number(seller.monthEarnings))
                  : "—"
              }
            />
            <Row label="Refunds" value={seller.refundCount ?? 0} />
            <Row label="Low-stock items" value={seller.lowStockCount ?? 0} />
          </dl>
        </div>
        <div className="nx-card p-5">
          <h3 className="text-sm font-semibold tracking-tight">Payouts</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <Row
              label="Pending"
              value={
                seller.pendingPayoutTotal != null
                  ? formatUSD(Number(seller.pendingPayoutTotal))
                  : "—"
              }
            />
            <Row
              label="Paid"
              value={
                seller.paidPayoutTotal != null
                  ? formatUSD(Number(seller.paidPayoutTotal))
                  : "—"
              }
            />
            <Row
              label="Contact"
              value={seller.contactEmail ?? seller.user?.email ?? "—"}
            />
            <Row label="Phone" value={seller.contactPhone ?? "—"} />
          </dl>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="nx-card p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-secondary/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground/70">
      {children}
    </span>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground/90">{value}</span>
    </div>
  );
}
