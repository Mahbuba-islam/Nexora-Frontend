"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  CustomerAcquisitionPoint,
  OrdersTimeseriesPoint,
  RefundMetrics,
  SalesByCategory,
} from "@/src/services/admin.service";

const PALETTE = ["#281C59", "#4E8D9C", "#7C3AED", "#06B6D4", "#F59E0B", "#EC4899", "#10B981", "#EF4444"];

export function OrdersTimeseriesChart({
  data,
}: {
  data: OrdersTimeseriesPoint[];
}) {
  const series = data.map((p) => ({
    date: new Date(p.date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    orders: p.orders,
    paid: p.paidOrders,
    revenue: Number(p.revenue),
  }));
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={series} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
        <CartesianGrid stroke="rgba(120,120,140,0.15)" strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "1px solid rgba(120,120,140,0.2)",
            background: "rgba(255,255,255,0.95)",
            color: "#0B0B12",
          }}
        />
        <Line
          type="monotone"
          dataKey="orders"
          stroke="#281C59"
          strokeWidth={2.5}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="paid"
          stroke="#4E8D9C"
          strokeWidth={2.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function SalesByCategoryChart({
  data,
}: {
  data: SalesByCategory[];
}) {
  const series = data.map((d) => ({
    name: d.categoryName,
    revenue: Number(d.revenue),
    units: d.units,
  }));
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={series} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
        <CartesianGrid stroke="rgba(120,120,140,0.15)" strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={60} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "1px solid rgba(120,120,140,0.2)",
            background: "rgba(255,255,255,0.95)",
            color: "#0B0B12",
          }}
        />
        <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
          {series.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CustomerAcquisitionChart({
  data,
}: {
  data: CustomerAcquisitionPoint[];
}) {
  const series = data.map((p) => ({
    date: new Date(p.date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    customers: p.customers,
  }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={series} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
        <defs>
          <linearGradient id="acquisitionFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4E8D9C" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#4E8D9C" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(120,120,140,0.15)" strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "1px solid rgba(120,120,140,0.2)",
            background: "rgba(255,255,255,0.95)",
            color: "#0B0B12",
          }}
        />
        <Area
          type="monotone"
          dataKey="customers"
          stroke="#4E8D9C"
          strokeWidth={2.5}
          fill="url(#acquisitionFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function RefundsPieChart({ data }: { data: RefundMetrics }) {
  const series = data.byStatus.map((s) => ({
    name: s.status,
    value: s.count,
  }));
  if (series.length === 0) {
    return (
      <p className="grid h-55 place-items-center text-sm text-muted-foreground">
        No refund activity yet.
      </p>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={series}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={45}
          paddingAngle={2}
        >
          {series.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "1px solid rgba(120,120,140,0.2)",
            background: "rgba(255,255,255,0.95)",
            color: "#0B0B12",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
