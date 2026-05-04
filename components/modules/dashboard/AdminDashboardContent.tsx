"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ArrowUpRight,
  DollarSign,
  Layers,
  ShieldCheck,
  Wand2,
  TrendingUp,
  UserCog,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDashboardData } from "@/src/services/dashboard.services";
import type { IAdminDashboardStats } from "@/src/types/admin.dashboard";
import type { ApiResponse } from "@/src/types/api.types";
import ConsultationsBarChart from "../shared/ConsultationsBarChart";
import ConsultationsLineChart from "../shared/ConsultationsLineChart";
import ConsultationsPieChart from "../shared/ConsultationsPieCharts";
import RecentConsultationsTable from "../shared/RecentConsultationsTable";
import StatsCard from "../shared/StatsCard";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatStatusLabel = (status: string) =>
  status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

/**
 * Realistic mock used when the backend is unreachable so the dashboard
 * always demos cleanly for recruiters / portfolio reviews.
 */
const FALLBACK_STATS: IAdminDashboardStats = {
  expertCount: 128,
  clientCount: 2_341,
  consultationCount: 1_872,
  industryCount: 14,
  paymentCount: 1_504,
  userCount: 2_469,
  totalRevenue: 184_320,
  consultationStatusDistribution: [
    { status: "COMPLETED", count: 1120 },
    { status: "SCHEDULED", count: 432 },
    { status: "IN_PROGRESS", count: 184 },
    { status: "CANCELLED", count: 96 },
    { status: "REFUNDED", count: 40 },
  ],
  revenueByMonth: [
    { month: "2025-11-01", amount: 12400 },
    { month: "2025-12-01", amount: 15800 },
    { month: "2026-01-01", amount: 18100 },
    { month: "2026-02-01", amount: 21200 },
    { month: "2026-03-01", amount: 24700 },
    { month: "2026-04-01", amount: 29900 },
    { month: "2026-05-01", amount: 34220 },
  ],
};

const AdminDashboardContent = () => {
  const { data: adminDashboardResponse, isLoading } = useQuery({
    queryKey: ["admin-dashboard-data"],
    queryFn: () => getDashboardData<IAdminDashboardStats>(),
    refetchOnWindowFocus: false,
    retry: false,
  });

  const apiData = (adminDashboardResponse as ApiResponse<IAdminDashboardStats> | undefined)?.data;
  // Always render — fall back to demo numbers so the dashboard never blanks.
  const data = apiData ?? FALLBACK_STATS;
  const isFallback = !apiData;
  const statusItems = data.consultationStatusDistribution || [];
  const averageRevenuePerConsultation = data.consultationCount
    ? Math.round((data.totalRevenue || 0) / data.consultationCount)
    : 0;

  if (isLoading) {
    return (
      <div className="grid gap-6">
        <div className="h-40 animate-pulse rounded-2xl bg-muted/60" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-xl bg-muted/60" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <Card
        className="relative overflow-hidden border-white/10 text-white shadow-2xl"
        style={{
          backgroundImage:
            "linear-gradient(135deg, #281C59 0%, #4E8D9C 55%, #6FB6CC 100%)",
          boxShadow: "0 20px 60px -20px rgba(78,141,156,0.55)",
        }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-24 size-72 rounded-full bg-(--nx-cyan)/35 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 size-72 rounded-full bg-(--nx-blue)/35 blur-3xl" />
          <div
            className="absolute inset-0 opacity-30 mask-[radial-gradient(ellipse_at_top,black,transparent_70%)]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.18) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.18) 1px,transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <CardContent className="relative z-10 grid gap-8 p-6 md:p-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-white/30 bg-white/15 text-white backdrop-blur hover:bg-white/15">
                <ShieldCheck className="mr-1 size-3.5" />
                Platform Command Center
              </Badge>
              {isFallback && (
                <Badge className="border-(--nx-cyan)/40 bg-(--nx-cyan)/20 text-white backdrop-blur hover:bg-(--nx-cyan)/20">
                  Demo data
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold leading-tight md:text-4xl">
                Oversee Nexora in{" "}
                <span className="bg-linear-to-r from-(--nx-cyan) to-white bg-clip-text text-transparent">
                  real time.
                </span>
              </h1>
              <p className="max-w-xl text-sm text-white/85 md:text-base">
                Track users, consultations, industries, and revenue from one
                modern operational workspace.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap">
              <Link href="/admin/dashboard/industries-management" className="w-full sm:w-auto">
                <Button className="w-full bg-white text-(--nx-ink) shadow-md hover:bg-white/90 sm:w-52">
                  <Layers className="mr-2 size-4" />
                  Manage industries
                </Button>
              </Link>
              <Link href="/admin/dashboard/expert-management" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:text-white sm:w-52"
                >
                  Review experts
                  <ArrowUpRight className="ml-2 size-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Mini stats ribbon */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Users", value: data.userCount || 0 },
              { label: "Sessions", value: data.consultationCount || 0 },
              { label: "Revenue", value: formatCurrency(data.totalRevenue || 0) },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/25 bg-white/10 p-4 backdrop-blur-md"
              >
                <p className="text-xs uppercase tracking-wider text-white/70">
                  {s.label}
                </p>
                <p className="mt-1 text-xl font-bold lg:text-2xl">{s.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            title: "Experts",
            desc: "Verify & manage",
            href: "/admin/dashboard/expert-management",
            icon: UserCog,
            tone: "bg-(--nx-blue-deep)",
          },
          {
            title: "Clients",
            desc: "User accounts",
            href: "/admin/dashboard/client-management",
            icon: Users,
            tone: "bg-(--nx-blue)",
          },
          {
            title: "Industries",
            desc: "Categories",
            href: "/admin/dashboard/industries-management",
            icon: Layers,
            tone: "bg-(--nx-ink)",
          },
          {
            title: "Payments",
            desc: "Revenue & payouts",
            href: "/admin/dashboard/payment-management",
            icon: DollarSign,
            tone: "bg-(--nx-cyan) text-(--nx-ink)",
          },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div
                className={`mb-3 inline-flex size-10 items-center justify-center rounded-xl text-white shadow-md ${action.tone}`}
              >
                <Icon className="size-5" />
              </div>
              <p className="font-semibold text-foreground">{action.title}</p>
              <p className="text-xs text-muted-foreground">{action.desc}</p>
              <ArrowUpRight className="absolute right-4 top-4 size-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatsCard
          title="Experts"
          value={data.expertCount || 0}
          iconName="UserCog"
          description="Registered experts"
          className="bg-card"
        />
        <StatsCard
          title="Clients"
          value={data.clientCount || 0}
          iconName="Users"
          description="Active client accounts"
          className="bg-card"
        />
        <StatsCard
          title="Consultations"
          value={data.consultationCount || 0}
          iconName="CalendarDays"
          description="Booked platform sessions"
          className="bg-card"
        />
        <StatsCard
          title="Revenue"
          value={formatCurrency(data.totalRevenue || 0)}
          iconName="DollarSign"
          description="Paid consultation earnings"
          className="bg-card"
        />
        <StatsCard
          title="Industries"
          value={data.industryCount || 0}
          iconName="Layers"
          description="Specialized categories"
          className="bg-card"
        />
        <StatsCard
          title="Users"
          value={data.userCount || 0}
          iconName="User"
          description="Total platform members"
          className="bg-card"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <ConsultationsBarChart
            data={data.revenueByMonth || []}
            title="Revenue Growth"
            description="Monthly paid revenue trend across the platform."
          />

          <ConsultationsLineChart
            data={data.revenueByMonth || []}
            title="User & Revenue Trend"
            description="Cumulative platform performance over recent months."
            seriesLabel="Revenue (USD)"
          />

          <ConsultationsPieChart
            data={statusItems}
            title="Consultation Distribution"
            description="A role-wide view of current consultation statuses."
          />
        </div>

        <Card className="relative overflow-hidden border-border bg-card shadow-sm">
          <div
            className="absolute inset-x-0 top-0 h-1"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #281C59 0%, #4E8D9C 50%, #A8DCB8 100%)",
            }}
          />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="size-4 text-(--nx-blue-deep)" />
              Platform Highlights
            </CardTitle>
            <CardDescription>
              Important operational indicators for admin decision-making.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-xl border border-(--nx-blue)/30 bg-(--nx-blue)/10 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-(--nx-blue-deep) dark:text-(--nx-cyan)">
                <TrendingUp className="size-4" />
                Revenue efficiency
              </div>
              <p className="text-2xl font-bold text-(--nx-ink) dark:text-white">
                {formatCurrency(averageRevenuePerConsultation)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Average paid value per consultation.
              </p>
            </div>

            <div className="rounded-xl border border-(--nx-cyan)/40 bg-(--nx-cyan)/10 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-(--nx-blue-deep) dark:text-(--nx-cyan)">
                <ShieldCheck className="size-4" />
                Operational summary
              </div>
              <p className="text-sm text-muted-foreground">
                {data.paymentCount || 0} payments processed across {data.industryCount || 0} industries.
              </p>
            </div>

            <div className="space-y-2">
              {statusItems.length > 0 ? (
                statusItems.map((item) => (
                  <div
                    key={item.status}
                    className="flex items-center justify-between rounded-lg border border-border bg-background/50 px-3 py-2"
                  >
                    <span className="text-sm font-medium">
                      {formatStatusLabel(item.status)}
                    </span>
                    <Badge variant="secondary">{item.count}</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No consultation status data available yet.
                </p>
              )}
            </div>

            <Link href="/admin/dashboard/client-management" className="inline-flex w-full">
              <Button
                className="w-full justify-between text-white shadow-md"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #281C59 0%, #4E8D9C 100%)",
                }}
              >
                Open user management
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <RecentConsultationsTable
        data={statusItems}
        title="Platform Consultation Snapshot"
        description="A structured live summary of consultation activity across the platform."
      />
    </div>
  );
};

export default AdminDashboardContent;