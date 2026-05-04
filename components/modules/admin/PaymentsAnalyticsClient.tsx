"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
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
import { CreditCard, DollarSign, Filter, TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PayoutRow {
  id: string;
  seller: string;
  amount: number;
  method: "BANK" | "STRIPE" | "PAYPAL";
  status: "PENDING" | "PROCESSING" | "PAID" | "FAILED";
  createdAt: string;
}

const PAYOUTS: PayoutRow[] = [
  { id: "PO-9001", seller: "Aurora Tech", amount: 4280.5, method: "BANK", status: "PAID", createdAt: "2025-04-13" },
  { id: "PO-9002", seller: "Maison North", amount: 815.0, method: "STRIPE", status: "PAID", createdAt: "2025-04-13" },
  { id: "PO-9003", seller: "Pulse Audio", amount: 1498.2, method: "BANK", status: "PROCESSING", createdAt: "2025-04-12" },
  { id: "PO-9004", seller: "Glow Lab", amount: 240.0, method: "PAYPAL", status: "PENDING", createdAt: "2025-04-12" },
  { id: "PO-9005", seller: "Vector Studio", amount: 6298.0, method: "BANK", status: "PAID", createdAt: "2025-04-11" },
  { id: "PO-9006", seller: "Helix", amount: 877.0, method: "STRIPE", status: "FAILED", createdAt: "2025-04-11" },
  { id: "PO-9007", seller: "Aurora Tech", amount: 3120.4, method: "BANK", status: "PENDING", createdAt: "2025-04-10" },
  { id: "PO-9008", seller: "Maison North", amount: 495.0, method: "STRIPE", status: "PAID", createdAt: "2025-04-10" },
  { id: "PO-9009", seller: "Pulse Audio", amount: 1199.0, method: "BANK", status: "PROCESSING", createdAt: "2025-04-09" },
  { id: "PO-9010", seller: "Glow Lab", amount: 432.0, method: "PAYPAL", status: "PAID", createdAt: "2025-04-09" },
];

const TREND = [
  { day: "Mon", paid: 3120, pending: 1240 },
  { day: "Tue", paid: 4180, pending: 980 },
  { day: "Wed", paid: 2980, pending: 1620 },
  { day: "Thu", paid: 5240, pending: 720 },
  { day: "Fri", paid: 7120, pending: 1180 },
  { day: "Sat", paid: 8480, pending: 2120 },
  { day: "Sun", paid: 6210, pending: 1840 },
];

const STATUS_COLORS: Record<PayoutRow["status"], string> = {
  PENDING: "#A8DCB8",
  PROCESSING: "#6FB6CC",
  PAID: "#281C59",
  FAILED: "#ef4444",
};

const PAGE_SIZE = 5;

export default function PaymentsAnalyticsClient() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<PayoutRow["status"] | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return PAYOUTS.filter((p) => {
      if (status !== "ALL" && p.status !== status) return false;
      if (q) {
        const n = q.toLowerCase();
        return (
          p.id.toLowerCase().includes(n) ||
          p.seller.toLowerCase().includes(n) ||
          p.method.toLowerCase().includes(n)
        );
      }
      return true;
    });
  }, [q, status]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const slice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalPaid = PAYOUTS.filter((p) => p.status === "PAID").reduce(
    (s, p) => s + p.amount,
    0,
  );
  const totalPending = PAYOUTS.filter((p) =>
    ["PENDING", "PROCESSING"].includes(p.status),
  ).reduce((s, p) => s + p.amount, 0);

  const methodMix = (["BANK", "STRIPE", "PAYPAL"] as PayoutRow["method"][]).map(
    (m) => ({
      method: m,
      value: PAYOUTS.filter((p) => p.method === m).length,
    }),
  );

  return (
    <section className="space-y-6 p-4 md:p-6">
      <header className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/60">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-(--nx-blue)/40 bg-(--nx-cyan)/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-(--nx-blue-deep) dark:text-(--nx-cyan)">
          Marketplace · Admin
        </span>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">
          Payments & payouts
        </h1>
        <p className="text-sm text-muted-foreground">
          Track GMV → seller payouts. Live filters, pagination, and dynamic
          analytics.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Tile
          label="Paid out (period)"
          value={`$${totalPaid.toLocaleString()}`}
          icon={DollarSign}
        />
        <Tile
          label="Pending payouts"
          value={`$${totalPending.toLocaleString()}`}
          icon={CreditCard}
          accent="warn"
        />
        <Tile
          label="Avg payout"
          value={`$${Math.round(
            PAYOUTS.reduce((s, p) => s + p.amount, 0) / PAYOUTS.length,
          ).toLocaleString()}`}
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Paid vs pending</CardTitle>
            <CardDescription className="text-xs">
              Daily seller payout volume, last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={TREND}>
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
                <Bar dataKey="paid" stackId="a" fill="#281C59" radius={[0, 0, 0, 0]} />
                <Bar
                  dataKey="pending"
                  stackId="a"
                  fill="#A8DCB8"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Method mix</CardTitle>
            <CardDescription className="text-xs">
              How sellers receive payouts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={methodMix}
                  dataKey="value"
                  nameKey="method"
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={72}
                  paddingAngle={2}
                >
                  <Cell fill="#281C59" />
                  <Cell fill="#4E8D9C" />
                  <Cell fill="#6FB6CC" />
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

        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Cumulative paid trend</CardTitle>
            <CardDescription className="text-xs">
              Smoothed daily paid-out total
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
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
                <Line
                  type="monotone"
                  dataKey="paid"
                  stroke="#4E8D9C"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
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
              placeholder="Search by ID, seller, method…"
              className="h-9 md:max-w-xs"
            />
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as PayoutRow["status"] | "ALL");
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

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Payout</th>
                <th className="px-4 py-3 text-left">Seller</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-left">Method</th>
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
                    No payouts match your filters.
                  </td>
                </tr>
              ) : (
                slice.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-border hover:bg-secondary/40"
                  >
                    <td className="px-4 py-3 font-semibold">{p.id}</td>
                    <td className="px-4 py-3">{p.seller}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      ${p.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {p.method}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white"
                        style={{ backgroundColor: STATUS_COLORS[p.status] }}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(p.createdAt).toLocaleDateString()}
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
  value: string;
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
