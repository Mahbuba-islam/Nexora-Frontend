import Link from "next/link";
import { ArrowUpRight, Store } from "lucide-react";

import { getAdminSellers } from "@/src/services/marketplace.service";
import { formatUSD } from "@/components/modules/Nexora/data";
import { toNumberPrice } from "@/src/types/nexora.types";

export const metadata = { title: "Sellers · Nexora Admin" };

const STATUS_STYLES = {
  PENDING: "bg-amber-500/15 text-amber-700",
  APPROVED: "bg-emerald-500/15 text-emerald-700",
  SUSPENDED: "bg-red-500/15 text-red-700",
  REJECTED: "bg-zinc-500/15 text-zinc-700",
} as const;

export default async function AdminSellersPage() {
  const sellers = await getAdminSellers();

  return (
    <div>
      <header className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Sellers
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage shops, approvals, and shop performance.
        </p>
      </header>

      {sellers.length === 0 ? (
        <div className="nx-card flex flex-col items-center justify-center p-12 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-foreground/70">
            <Store className="h-6 w-6" />
          </div>
          <h3 className="mt-5 text-xl font-semibold">No sellers yet</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Approved sellers will appear here once they finish onboarding.
          </p>
        </div>
      ) : (
        <div className="nx-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Shop</th>
                <th className="px-5 py-3">Owner</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Products</th>
                <th className="px-5 py-3 text-right">Orders</th>
                <th className="px-5 py-3 text-right">GMV</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sellers.map((s) => (
                <tr key={s.id} className="hover:bg-secondary/40">
                  <td className="px-5 py-3">
                    <p className="font-semibold">{s.shopName}</p>
                    {s.shopSlug && (
                      <p className="text-xs text-muted-foreground">
                        /{s.shopSlug}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <p>{s.ownerName || "—"}</p>
                    {s.ownerEmail && (
                      <p className="text-xs text-muted-foreground">
                        {s.ownerEmail}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_STYLES[s.status]}`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    {s.productCount ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {s.ordersCount ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold">
                    {s.gmv ? formatUSD(toNumberPrice(s.gmv)) : "—"}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/admin/marketplace/sellers/${s.id}`}
                      className="inline-flex h-8 items-center gap-1 rounded-full border border-border bg-background px-3 text-[11px] font-semibold text-foreground/80 hover:bg-secondary"
                    >
                      Manage <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
