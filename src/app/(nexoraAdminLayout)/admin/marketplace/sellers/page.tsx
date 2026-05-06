import Link from "next/link";
import { ArrowUpRight, Store } from "lucide-react";


import { getAdminSellers } from "@/src/services/marketplace.service";
import { formatUSD } from "@/components/modules/Nexora/data";
import { toNumberPrice } from "@/src/types/nexora.types";
import { useState } from "react";

export const metadata = { title: "Sellers · Nexora Admin" };

const STATUS_STYLES = {
  PENDING: "bg-amber-500/15 text-amber-700",
  APPROVED: "bg-emerald-500/15 text-emerald-700",
  SUSPENDED: "bg-red-500/15 text-red-700",
  REJECTED: "bg-zinc-500/15 text-zinc-700",
} as const;


import { useEffect } from "react";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "REJECTED", label: "Rejected" },
];

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("");
  const [shopName, setShopName] = useState("");
  const [owner, setOwner] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchSellers = async () => {
      const res = await getAdminSellers({
        page,
        limit: 20,
        status: status || undefined,
        shopName: shopName || undefined,
        owner: owner || undefined,
        search: search || undefined,
      });
      setSellers(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
    };
    fetchSellers();
  }, [page, status, shopName, owner, search]);

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

      <form className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by shop name or owner"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="h-9 rounded-md border border-input px-3 text-sm"
        />
        <input
          type="text"
          placeholder="Shop name"
          value={shopName}
          onChange={e => setShopName(e.target.value)}
          className="h-9 rounded-md border border-input px-3 text-sm"
        />
        <input
          type="text"
          placeholder="Owner"
          value={owner}
          onChange={e => setOwner(e.target.value)}
          className="h-9 rounded-md border border-input px-3 text-sm"
        />
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="h-9 rounded-md border border-input px-3 text-sm"
        >
          {STATUS_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </form>

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
                      <p className="text-xs text-muted-foreground">/{s.shopSlug}</p>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <p>{s.ownerName || "—"}</p>
                    {s.ownerEmail && (
                      <p className="text-xs text-muted-foreground">{s.ownerEmail}</p>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_STYLES[s.status]}`}>{s.status}</span>
                  </td>
                  <td className="px-5 py-3 text-right">{s.productCount ?? "—"}</td>
                  <td className="px-5 py-3 text-right">{s.ordersCount ?? "—"}</td>
                  <td className="px-5 py-3 text-right font-semibold">{s.gmv ? formatUSD(toNumberPrice(s.gmv)) : "—"}</td>
                  <td className="px-5 py-3 text-right">
                    <Link href={`/admin/marketplace/sellers/${s.id}`} className="inline-flex h-8 items-center gap-1 rounded-full border border-border bg-background px-3 text-[11px] font-semibold text-foreground/80 hover:bg-secondary">
                      Manage <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <footer className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 rounded border border-input"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </button>
              <button
                className="px-3 py-1 rounded border border-input"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
