"use client";

import { format } from "date-fns";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
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
import type { BarChartData } from "@/src/types/dashboard.types";

interface ConsultationsLineChartProps {
  data: BarChartData[];
  title?: string;
  description?: string;
  /** Override the series label shown in the tooltip/legend. */
  seriesLabel?: string;
}

/**
 * Line chart variant of the monthly consultation/revenue trend.
 *
 * Reuses `BarChartData` (month + amount/count) so it can drop in
 * alongside the existing bar chart without any backend changes.
 */
const ConsultationsLineChart = ({
  data,
  title = "Growth Trend",
  description = "Month-over-month performance.",
  seriesLabel = "Value",
}: ConsultationsLineChartProps) => {
  const formatted = (data ?? []).map((item) => ({
    month:
      typeof item.month === "string"
        ? format(new Date(item.month), "MMM yyyy")
        : format(item.month, "MMM yyyy"),
    value: Number(item.amount ?? item.count ?? 0),
  }));

  if (!formatted.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex h-72 items-center justify-center">
          <p className="text-sm text-muted-foreground">No trend data yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={formatted}>
            <defs>
              <linearGradient id="nx-line-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#4E8D9C" />
                <stop offset="100%" stopColor="#A8DCB8" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,120,140,0.15)" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                background: "rgba(40, 28, 89, 0.92)",
                border: "1px solid rgba(168, 220, 184, 0.3)",
                borderRadius: 12,
                color: "white",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              name={seriesLabel}
              stroke="url(#nx-line-grad)"
              strokeWidth={3}
              dot={{ r: 4, fill: "#4E8D9C", strokeWidth: 2, stroke: "#A8DCB8" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ConsultationsLineChart;
