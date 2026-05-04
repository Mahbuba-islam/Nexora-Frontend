"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Filter,
  Package,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface OrderRow {
  id: string;
  customer: string;
  seller: string;
  total: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
}

const ORDERS: OrderRow[] = [
  { id: "ORD-10293", customer: "Aiko Tanaka", seller: "Aurora Tech", total: 899, status: "PROCESSING", createdAt: "2025-04-14" },
  { id: "ORD-10294", customer: "Marcus Levin", seller: "Maison North", total: 165, status: "DELIVERED", createdAt: "2025-04-14" },
  { id: "ORD-10295", customer: "Priya Nair", seller: "Pulse Audio", total: 199, status: "SHIPPED", createdAt: "2025-04-13" },
  { id: "ORD-10296", customer: "Sofia Reyes", seller: "Glow Lab", total: 48, status: "PENDING", createdAt: "2025-04-13" },
  { id: "ORD-10297", customer: "Daniel Cho", seller: "Vector Studio", total: 1499, status: "DELIVERED", createdAt: "2025-04-12" },
  { id: "ORD-10298", customer: "Lena Mateus", seller: "Aurora Tech", total: 499, status: "CANCELLED", createdAt: "2025-04-12" },
  { id: "ORD-10299", customer: "Yuki Sato", seller: "Helix", total: 299, status: "DELIVERED", createdAt: "2025-04-11" },
  { id: "ORD-10300", customer: "Theo Brandt", seller: "Maison North", total: 165, status: "DELIVERED", createdAt: "2025-04-11" },
  { id: "ORD-10301", customer: "Amelia Park", seller: "Pulse Audio", total: 349, status: "SHIPPED", createdAt: "2025-04-10" },
  { id: "ORD-10302", customer: "Hassan Ali", seller: "Aurora Tech", total: 129, status: "DELIVERED", createdAt: "2025-04-10" },
  { id: "ORD-10303", customer: "Riya Iyer", seller: "Glow Lab", total: 48, status: "PENDING", createdAt: "2025-04-09" },
  { id: "ORD-10304", customer: "Nora Lindqvist", seller: "Vector Studio", total: 1099, status: "PROCESSING", createdAt: "2025-04-09" },
];

const TREND = [
  { day: "Mon", orders: 28, gmv: 4200 },
  { day: "Tue", orders: 34, gmv: 5810 },
  { day: "Wed", orders: 31, gmv: 4980 },
  { day: "Thu", orders: 42, gmv: 7240 },
  { day: "Fri", orders: 51, gmv: 9120 },
  { day: "Sat", orders: 67, gmv: 12480 },
  { day: "Sun", orders: 58, gmv: 10210 },
];

const STATUS_COLORS: Record<OrderRow["status"], string> = {
  PENDING: "#A8DCB8",
  PROCESSING: "#6FB6CC",
  SHIPPED: "#4E8D9C",
  DELIVERED: "#281C59",
  CANCELLED: "#f97316",
};

const PAGE_SIZE = 5;

export default function OrdersManagementClient() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<OrderRow["status"] | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return ORDERS.filter((o) => {
      if (status !== "ALL" && o.status !== status) return false;
      if (q) {
        const needle = q.toLowerCase();
        return (
          o.id.toLowerCase().includes(needle) ||
          o.customer.toLowerCase().includes(needle) ||
          o.seller.toLowerCase().includes(needle)
        );
      }
      return true;
    });
  }, [q, status]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const slice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalGmv = ORDERS.reduce((s, o) => s + o.total, 0);
  const breakdown = Object.entries(
    ORDERS.reduce<Record<string, number>>((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {}),
  ).map(([status, value]) => ({ status: status as OrderRow["status"], value }));

  return (
    <section className="space-y-6 p-4 md:p-6">
      <header className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/60">
        <div className="flex flex-col gap-1.5">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-(--nx-blue)/40 bg-(--nx-cyan)/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-(--nx-blue-deep) dark:text-(--nx-cyan)">
            Marketplace · Admin
          </span>
          <h1 className="text-2xl font-bold tracking-tight">Orders management</h1>
          <p className="text-sm text-muted-foreground">
            All marketplace orders across every seller — filterable, paginated, dynamic.
          </p>
        </div>
      </header>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatTile
          label="Total orders"
          value={ORDERS.length.toString()}
          icon={ShoppingBag}
          accent="from-(--nx-ink) to-(--nx-blue-deep)"
        />
        <StatTile
          label="GMV (7-day)"
          value={`$${TREND.reduce((s, t) => s + t.gmv, 0).toLocaleString()}`}
          icon={TrendingUp}
          accent="from-(--nx-blue-deep) to-(--nx-blue)"
        />
        <StatTile
          label="Avg order value"
          value={`$${Math.round(totalGmv / ORDERS.length)}`}
          icon={Package}
          accent="from-(--nx-blue) to-(--nx-cyan)"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">GMV trend</CardTitle>
            <CardDescription className="text-xs">
              Daily marketplace revenue, last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="gmv"
                  stroke="#281C59"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#281C59" }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#6FB6CC"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#6FB6CC" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Status mix</CardTitle>
            <CardDescription className="text-xs">
              Live distribution by fulfilment status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={breakdown}
                  dataKey="value"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={72}
                  paddingAngle={2}
                >
                  {breakdown.map((s, i) => (
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

      {/* Filters */}
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
              placeholder="Search by ID, customer, seller…"
              className="h-9 md:max-w-xs"
            />
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as OrderRow["status"] | "ALL");
                setPage(1);
              }}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus:border-ring focus:outline-none"
            >
              <option value="ALL">All statuses</option>
              {Object.keys(STATUS_COLORS).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Order</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Seller</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {slice.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-muted-foreground"
                  >
                    No orders match your filters.
                  </td>
                </tr>
              ) : (
                slice.map((o) => (
                  <tr
                    key={o.id}
                    className="border-t border-border hover:bg-secondary/40"
                  >
                    <td className="px-4 py-3 font-semibold">{o.id}</td>
                    <td className="px-4 py-3">{o.customer}</td>
                    <td className="px-4 py-3 text-muted-foreground">{o.seller}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      ${o.total}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white"
                        style={{ backgroundColor: STATUS_COLORS[o.status] }}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(o.createdAt).toLocaleDateString()}
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

function StatTile({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5">
      <div
        aria-hidden
        className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-linear-to-br ${accent} opacity-30 blur-xl`}
      />
      <div className="relative flex items-center gap-3">
        <div
          className={`grid h-11 w-11 place-items-center rounded-2xl bg-linear-to-br ${accent} text-white shadow-sm`}
        >
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
