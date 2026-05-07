import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Filter, Package, Plus, Search, X } from "lucide-react";

import { getAdminProducts } from "@/src/services/admin.service";
import { formatUSD } from "@/components/modules/Nexora/data";
import ProductRowActions from "@/components/modules/admin/ProductRowActions";

export const metadata = { title: "Products · Nexora Admin" };
export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  search?: string;
  status?: string;
  lowStock?: string;
  outOfStock?: string;
  page?: string;
}>;

const STATUS_OPTIONS = [
  { value: "ALL", label: "All statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "DRAFT", label: "Draft" },
  { value: "OUT_OF_STOCK", label: "Out of stock" },
  { value: "ARCHIVED", label: "Archived" },
];

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? "1") || 1);

  const res = await getAdminProducts({
    search: sp.search || undefined,
    status: (sp.status as never) || undefined,
    lowStock: sp.lowStock === "1" ? true : undefined,
    outOfStock: sp.outOfStock === "1" ? true : undefined,
    page,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const products = res.data;
  const meta = res.meta;

  const totalActive = products.filter((p) => p.status === "ACTIVE").length;
  const lowStock = products.filter(
    (p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= (p.lowStockAlert ?? 5),
  ).length;
  const outOfStock = products.filter((p) => (p.stock ?? 0) === 0).length;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Products
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Curate the catalog. Edit, feature, archive, or restore at scale.
          </p>
        </div>
        <Link
          href="/seller/products"
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-foreground px-3.5 text-xs font-semibold text-background hover:bg-foreground/90"
        >
          <Plus className="h-3.5 w-3.5" />
          New product
        </Link>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Listings on page" value={products.length} icon={Package} />
        <Stat label="Active" value={totalActive} accent="emerald" />
        <Stat label="Low stock" value={lowStock} accent="amber" />
        <Stat label="Out of stock" value={outOfStock} accent="rose" />
      </div>

      <form method="get" className="nx-card flex flex-wrap items-end gap-3 p-4">
     <label className="flex-1 min-w-50">
  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
    Search
  </span>

  <div className="mt-1.5 flex h-10 items-center gap-2 rounded-full border border-border bg-background px-3">
    <Search className="h-4 w-4 text-foreground/50" />

    <input
      name="search"
      defaultValue={sp.search ?? ""}
      placeholder="Name, SKU, brand…"
      className="flex-1 bg-transparent text-sm focus:outline-none"
    />

    {/* ❌ CLEAR BUTTON (X) */}
    {sp.search && (
      <Link
        href="?page=1"
        className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-secondary transition"
        title="Clear search"
      >
        <X className="h-4 w-4 text-foreground/60" />
      </Link>
    )}
  </div>
</label>
        <label className="min-w-40">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Status
          </span>
          <select
            name="status"
            defaultValue={sp.status ?? "ALL"}
            className="mt-1.5 h-10 w-full rounded-full border border-border bg-background px-4 text-sm focus:outline-none"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label className="inline-flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            name="lowStock"
            value="1"
            defaultChecked={sp.lowStock === "1"}
            className="h-4 w-4 accent-[#4E8D9C]"
          />
          Low stock
        </label>
        <label className="inline-flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            name="outOfStock"
            value="1"
            defaultChecked={sp.outOfStock === "1"}
            className="h-4 w-4 accent-[#4E8D9C]"
          />
          Out of stock
        </label>
        <button
          type="submit"
          className="inline-flex h-10 items-center gap-1.5 rounded-full bg-foreground px-4 text-xs font-semibold text-background hover:bg-foreground/90"
        >
          <Filter className="h-3.5 w-3.5" />
          Apply
        </button>
      </form>

      <div className="nx-card overflow-hidden">
        {products.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Package className="mx-auto h-10 w-10 text-foreground/30" />
            <p className="mt-4 text-sm font-semibold">
              No products match your filters.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try clearing filters or seeding demo data on the backend.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/30 text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Product</th>
                    <th className="px-4 py-3 font-semibold">Seller</th>
                    <th className="px-4 py-3 font-semibold">Price</th>
                    <th className="px-4 py-3 font-semibold">Stock</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Sold</th>
                    <th className="px-4 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-border last:border-b-0 hover:bg-secondary/20"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-secondary">
                            {p.images?.[0]?.url ? (
                              <Image
                                src={p.images[0].url}
                                alt=""
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : (
                              <Package className="absolute inset-0 m-auto h-4 w-4 text-foreground/30" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/shop/${p.slug}`}
                              className="block max-w-[24ch] truncate text-sm font-semibold hover:text-[#4E8D9C]"
                            >
                              {p.name}
                            </Link>
                            <p className="text-[11px] text-muted-foreground">
                              {p.sku}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-foreground/80">
                        {p.seller?.shopName ?? "—"}
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {formatUSD(Number(p.price))}
                      </td>
                      <td className="px-4 py-3">
                        <StockPill
                          stock={p.stock ?? 0}
                          alert={p.lowStockAlert ?? 5}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill status={p.status} />
                      </td>
                      <td className="px-4 py-3 text-foreground/80">
                        {p.soldCount ?? 0}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1.5">
                          <ProductRowActions
                            product={{
                              id: p.id,
                              name: p.name,
                              price: Number(p.price),
                              stock: p.stock ?? 0,
                              status: p.status,
                              isFeatured: p.isFeatured,
                              isDeleted: p.isDeleted,
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-border md:hidden">
              {products.map((p) => (
                <li key={p.id} className="space-y-3 px-4 py-4">
                  <div className="flex items-start gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-secondary">
                      {p.images?.[0]?.url ? (
                        <Image
                          src={p.images[0].url}
                          alt={p.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {p.sku} · {p.seller?.shopName ?? "—"}
                      </p>
                      {/* Short description */}
                      {p.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.description}</p>
                      )}
                      {/* Meta info row */}
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">{formatUSD(Number(p.price))}</span>
                        {p.createdAt && (
                          <span>• {new Date(p.createdAt).toLocaleDateString()}</span>
                        )}
                        {typeof p.rating === 'number' && !isNaN(Number(p.rating)) ? (
                          <span>• ⭐ {Number(p.rating).toFixed(1)}</span>
                        ) : null}
                        {p.location && (
                          <span>• {p.location}</span>
                        )}
                        <StatusPill status={p.status} />
                        <StockPill
                          stock={p.stock ?? 0}
                          alert={p.lowStockAlert ?? 5}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <ProductRowActions
                      product={{
                        id: p.id,
                        name: p.name,
                        price: Number(p.price),
                        stock: p.stock ?? 0,
                        status: p.status,
                        isFeatured: p.isFeatured,
                        isDeleted: p.isDeleted,
                      }}
                    />
                    <Link
                      href={`/shop/${p.slug}`}
                      className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-semibold text-foreground/70 hover:bg-secondary"
                    >
                      View <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>

            {meta && meta.totalPages > 1 && <Pagination meta={meta} sp={sp} />}
          </>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  accent?: "emerald" | "amber" | "rose";
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const tone =
    accent === "emerald"
      ? "text-emerald-600"
      : accent === "amber"
        ? "text-amber-600"
        : accent === "rose"
          ? "text-rose-600"
          : "text-foreground";
  return (
    <div className="nx-card flex items-center justify-between p-4">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        <p className={`mt-1 text-2xl font-semibold tracking-tight ${tone}`}>
          {value}
        </p>
      </div>
      {Icon && <Icon className="h-5 w-5 text-foreground/40" />}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone =
    status === "ACTIVE"
      ? "bg-emerald-500/15 text-emerald-600"
      : status === "ARCHIVED"
        ? "bg-foreground/10 text-foreground/70"
        : status === "OUT_OF_STOCK"
          ? "bg-rose-500/15 text-rose-600"
          : "bg-amber-500/15 text-amber-700";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tone}`}
    >
      {status.replace(/_/g, " ").toLowerCase()}
    </span>
  );
}

function StockPill({ stock, alert }: { stock: number; alert: number }) {
  const tone =
    stock === 0
      ? "bg-rose-500/15 text-rose-600"
      : stock <= alert
        ? "bg-amber-500/15 text-amber-700"
        : "bg-emerald-500/15 text-emerald-600";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${tone}`}
    >
      {stock} units
    </span>
  );
}

function Pagination({
  meta,
  sp,
}: {
  meta: { page: number; totalPages: number };
  sp: Awaited<SearchParams>;
}) {
  const buildHref = (p: number) => {
    const q = new URLSearchParams();
    if (sp.search) q.set("search", sp.search);
    if (sp.status) q.set("status", sp.status);
    if (sp.lowStock) q.set("lowStock", sp.lowStock);
    if (sp.outOfStock) q.set("outOfStock", sp.outOfStock);
    q.set("page", String(p));
    return `?${q.toString()}`;
  };
  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
      <span>
        Page {meta.page} of {meta.totalPages}
      </span>
      <div className="flex items-center gap-1.5">
        {meta.page > 1 && (
          <Link
            href={buildHref(meta.page - 1)}
            className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground/80 hover:bg-secondary"
          >
            Previous
          </Link>
        )}
        {meta.page < meta.totalPages && (
          <Link
            href={buildHref(meta.page + 1)}
            className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground/80 hover:bg-secondary"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
