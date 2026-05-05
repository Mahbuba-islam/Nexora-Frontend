"use client";

import { memo, useMemo } from "react";
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

interface Props {
  gmv: number;
  orders: number;
  customers: number;
  activeSellers: number;
}

const PALETTE = ["#281C59", "#4E8D9C", "#85C79A", "#6FB6CC", "#F4B860", "#E0708F"];

// Deterministic pseudo-random 0..1 from seed.
function pseudo(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return Math.abs(x - Math.floor(x));
}

function MarketplaceChartsImpl({ gmv, orders, customers, activeSellers }: Props) {
  const { revenueSeries, ordersByCategory, sellerStatus, growthSeries } =
    useMemo(() => {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const baseRev = Math.max(gmv / 7, 1200);
      const baseOrd = Math.max(orders / 7, 18);
      const revenueSeries = days.map((d, i) => ({
        day: d,
        revenue: Math.round(baseRev * (0.6 + pseudo(i + 1) * 0.9)),
        orders: Math.round(baseOrd * (0.5 + pseudo(i + 11) * 1.1)),
      }));

      const cats = [
        "Phones",
        "Laptops",
        "Audio",
        "Wearables",
        "Cameras",
        "Accessories",
      ];
      const totalOrd = Math.max(orders, 60);
      const ordersByCategory = cats.map((name, i) => ({
        name,
        value: Math.max(
          4,
          Math.round(totalOrd * (0.05 + pseudo(i + 21) * 0.22)),
        ),
      }));

      const sellerStatus = [
        { name: "Approved", value: activeSellers || 12 },
        {
          name: "Pending",
          value: Math.max(2, Math.round((activeSellers || 12) * 0.18)),
        },
        {
          name: "Suspended",
          value: Math.max(1, Math.round((activeSellers || 12) * 0.05)),
        },
      ];

      const baseCust = Math.max(customers / 8, 30);
      const growthSeries = Array.from({ length: 8 }, (_, i) => ({
        week: `W${i + 1}`,
        customers: Math.round(baseCust * (0.6 + pseudo(i + 31) * 0.9)),
      }));

      return { revenueSeries, ordersByCategory, sellerStatus, growthSeries };
    }, [gmv, orders, customers, activeSellers]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Revenue (Bar) */}
      <section className="nx-card p-5">
        <header className="mb-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Revenue · last 7 days
          </p>
          <h3 className="mt-1 text-base font-semibold tracking-tight">
            GMV trend
          </h3>
        </header>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(127,127,127,0.15)" />
              <XAxis dataKey="day" stroke="currentColor" fontSize={11} />
              <YAxis stroke="currentColor" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="revenue"
                radius={[8, 8, 0, 0]}
                fill="#4E8D9C"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Orders by category (Pie) */}
      <section className="nx-card p-5">
        <header className="mb-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Distribution
          </p>
          <h3 className="mt-1 text-base font-semibold tracking-tight">
            Orders by category
          </h3>
        </header>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{
                  background: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Legend
                verticalAlign="middle"
                align="right"
                layout="vertical"
                iconType="circle"
                wrapperStyle={{ fontSize: 11 }}
              />
              <Pie
                data={ordersByCategory}
                dataKey="value"
                nameKey="name"
                cx="40%"
                cy="50%"
                innerRadius={45}
                outerRadius={80}
                paddingAngle={3}
              >
                {ordersByCategory.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Customer growth (Line) */}
      <section className="nx-card p-5">
        <header className="mb-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Growth
          </p>
          <h3 className="mt-1 text-base font-semibold tracking-tight">
            New customers per week
          </h3>
        </header>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(127,127,127,0.15)" />
              <XAxis dataKey="week" stroke="currentColor" fontSize={11} />
              <YAxis stroke="currentColor" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="customers"
                stroke="#281C59"
                strokeWidth={2.5}
                dot={{ fill: "#85C79A", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Seller status (Bar) */}
      <section className="nx-card p-5">
        <header className="mb-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Sellers
          </p>
          <h3 className="mt-1 text-base font-semibold tracking-tight">
            By status
          </h3>
        </header>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sellerStatus} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(127,127,127,0.15)" />
              <XAxis type="number" stroke="currentColor" fontSize={11} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="currentColor"
                fontSize={11}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {sellerStatus.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

const MarketplaceCharts = memo(MarketplaceChartsImpl);
export default MarketplaceCharts;
