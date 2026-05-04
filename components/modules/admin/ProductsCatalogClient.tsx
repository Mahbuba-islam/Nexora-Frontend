"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Boxes, Layers, Package, Filter } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProductRow {
  id: string;
  title: string;
  category: string;
  seller: string;
  price: number;
  stock: number;
  status: "LIVE" | "DRAFT" | "OUT_OF_STOCK";
}

const PRODUCTS: ProductRow[] = [
  { id: "p_001", title: "Aurora X Pro 5G", category: "Phones", seller: "Aurora Tech", price: 899, stock: 124, status: "LIVE" },
  { id: "p_002", title: "Pulse Mini", category: "Phones", seller: "Aurora Tech", price: 499, stock: 38, status: "LIVE" },
  { id: "p_003", title: "Vector 14 Studio", category: "Laptops", seller: "Vector Studio", price: 1499, stock: 22, status: "LIVE" },
  { id: "p_004", title: "Vector Air 13", category: "Laptops", seller: "Vector Studio", price: 1099, stock: 0, status: "OUT_OF_STOCK" },
  { id: "p_005", title: "Aurora Buds 3", category: "Audio", seller: "Pulse Audio", price: 199, stock: 412, status: "LIVE" },
  { id: "p_006", title: "Pulse Studio Over-Ear", category: "Audio", seller: "Pulse Audio", price: 349, stock: 88, status: "LIVE" },
  { id: "p_007", title: "Orbit Watch S5", category: "Wearables", seller: "Helix", price: 429, stock: 56, status: "LIVE" },
  { id: "p_008", title: "Helix Ring", category: "Wearables", seller: "Helix", price: 299, stock: 0, status: "OUT_OF_STOCK" },
  { id: "p_009", title: "Nexora Hub Mini", category: "Smart home", seller: "Aurora Tech", price: 129, stock: 240, status: "LIVE" },
  { id: "p_010", title: "MagCharge Stand", category: "Accessories", seller: "Aurora Tech", price: 89, stock: 180, status: "LIVE" },
  { id: "p_011", title: "Glow Lab Vit-C Serum", category: "Beauty", seller: "Glow Lab", price: 48, stock: 720, status: "LIVE" },
  { id: "p_012", title: "Maison Linen Overshirt", category: "Fashion", seller: "Maison North", price: 165, stock: 64, status: "DRAFT" },
];

const STATUS_COLORS: Record<ProductRow["status"], string> = {
  LIVE: "#4E8D9C",
  DRAFT: "#A8DCB8",
  OUT_OF_STOCK: "#f97316",
};

const PAGE_SIZE = 5;

export default function ProductsCatalogClient() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("ALL");
  const [page, setPage] = useState(1);

  const categories = useMemo(
    () => Array.from(new Set(PRODUCTS.map((p) => p.category))),
    [],
  );

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (cat !== "ALL" && p.category !== cat) return false;
      if (q) {
        const n = q.toLowerCase();
        return (
          p.title.toLowerCase().includes(n) ||
          p.seller.toLowerCase().includes(n)
        );
      }
      return true;
    });
  }, [q, cat]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const slice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Chart data
  const byCategory = categories.map((c) => ({
    name: c,
    count: PRODUCTS.filter((p) => p.category === c).length,
  }));
  const byStatus = (Object.keys(STATUS_COLORS) as ProductRow["status"][]).map(
    (s) => ({
      status: s,
      value: PRODUCTS.filter((p) => p.status === s).length,
    }),
  );

  const live = PRODUCTS.filter((p) => p.status === "LIVE").length;
  const oos = PRODUCTS.filter((p) => p.status === "OUT_OF_STOCK").length;

  return (
    <section className="space-y-6 p-4 md:p-6">
      <header className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/60">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-(--nx-blue)/40 bg-(--nx-cyan)/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-(--nx-blue-deep) dark:text-(--nx-cyan)">
          Marketplace · Admin
        </span>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">
          Products catalog
        </h1>
        <p className="text-sm text-muted-foreground">
          Every listing across every shop — searchable, paginated, with live
          analytics.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Tile label="Total products" value={PRODUCTS.length} icon={Layers} />
        <Tile label="Live listings" value={live} icon={Package} />
        <Tile label="Out of stock" value={oos} icon={Boxes} accent="warn" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Listings by category</CardTitle>
            <CardDescription className="text-xs">
              Catalog distribution across the marketplace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={byCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" fontSize={10} />
                <YAxis fontSize={11} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" fill="#4E8D9C" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Status mix</CardTitle>
            <CardDescription className="text-xs">
              Live vs draft vs out-of-stock
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={byStatus}
                  dataKey="value"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={72}
                  paddingAngle={2}
                >
                  {byStatus.map((s, i) => (
                    <Cell key={i} fill={STATUS_COLORS[s.status]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Filter className="h-3.5 w-3.5" /> Filters
          </div>
          <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center md:justify-end">
            <Input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Search by product or seller…"
              className="h-9 md:max-w-xs"
            />
            <select
              value={cat}
              onChange={(e) => {
                setCat(e.target.value);
                setPage(1);
              }}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus:border-ring focus:outline-none"
            >
              <option value="ALL">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Seller</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right">Stock</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {slice.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-muted-foreground"
                  >
                    No products match your filters.
                  </td>
                </tr>
              ) : (
                slice.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-border hover:bg-secondary/40"
                  >
                    <td className="px-4 py-3 font-semibold">{p.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {p.category}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {p.seller}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      ${p.price}
                    </td>
                    <td className="px-4 py-3 text-right">{p.stock}</td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white"
                        style={{ backgroundColor: STATUS_COLORS[p.status] }}
                      >
                        {p.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <footer className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
          <span>
            Page {page} of {pages} · {filtered.length} result
            {filtered.length === 1 ? "" : "s"}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page === pages}
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
            >
              Next
            </Button>
          </div>
        </footer>
      </div>
    </section>
  );
}

function Tile({
  label,
  value,
  icon: Icon,
  accent = "default",
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  accent?: "default" | "warn";
}) {
  const tone =
    accent === "warn"
      ? "bg-orange-500/15 text-orange-600"
      : "bg-(--nx-blue-deep)/15 text-(--nx-blue-deep) dark:text-(--nx-cyan)";
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className={`grid h-11 w-11 place-items-center rounded-2xl ${tone}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
        </div>
      </div>
    </div>
  );
}
