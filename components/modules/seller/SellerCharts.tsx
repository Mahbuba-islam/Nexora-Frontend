"use client";

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

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface SellerChartsProps {
  /** [{ day: "Mon", revenue: 120, orders: 4 }, …] derived from real orders */
  weekly: { day: string; revenue: number; orders: number }[];
  /** [{ status: "DELIVERED", value: 12 }, …] */
  statusBreakdown: { status: string; value: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#A8DCB8",
  ACCEPTED: "#6FB6CC",
  PROCESSING: "#4E8D9C",
  SHIPPED: "#281C59",
  DELIVERED: "#22c55e",
  CANCELLED: "#f97316",
  REFUNDED: "#ef4444",
};

export default function SellerCharts({
  weekly,
  statusBreakdown,
}: SellerChartsProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Bar — weekly revenue */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Weekly revenue</CardTitle>
          <CardDescription className="text-xs">
            Last 7 days of seller-paid order volume (USD)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weekly}>
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
              <Bar dataKey="revenue" fill="#4E8D9C" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie — status breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Order status</CardTitle>
          <CardDescription className="text-xs">
            Live distribution across your fulfilment pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusBreakdown}
                dataKey="value"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={72}
                paddingAngle={2}
              >
                {statusBreakdown.map((s, i) => (
                  <Cell
                    key={i}
                    fill={STATUS_COLORS[s.status] ?? "#6FB6CC"}
                  />
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

      {/* Line — orders trend */}
      <Card className="lg:col-span-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Orders trend</CardTitle>
          <CardDescription className="text-xs">
            Daily order count over the past week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weekly}>
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
                dataKey="orders"
                stroke="#281C59"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#281C59" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
