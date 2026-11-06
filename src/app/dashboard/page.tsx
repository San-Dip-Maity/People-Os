"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import {
  Users,
  CalendarCheck,
  Clock,
  AlertCircle,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const [clockedIn, setClockedIn] = React.useState(false);
  const [clockTime, setClockTime] = React.useState("09:00 AM");

  const handleClockToggle = () => {
    setClockedIn(!clockedIn);
    if (!clockedIn) {
      const now = new Date();
      setClockTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Welcome & Overview Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Operations Command Center
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Real-time workforce intelligence and human capital telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Tenant: Acme Global (UAE / IND)
            </span>
          </div>
        </div>

        {/* AI People Intelligence Insight Banner */}
        <div className="relative overflow-hidden rounded-xl border border-blue-200 dark:border-blue-900/60 bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-white dark:from-blue-950/30 dark:via-zinc-900 dark:to-zinc-950 p-4 sm:p-5 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-lg bg-blue-600 text-white shrink-0 shadow-sm shadow-blue-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                  AI Workforce Insight • Effective Date Aware
                </h4>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Updated 5m ago
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                Notice: 3 employees transferred between <strong>UAE Legal Entity</strong> and{" "}
                <strong>Bangalore Work Location</strong> have their India Holiday Calendar
                effective from next Monday. No leave conflict detected.
              </p>
            </div>
          </div>
        </div>

        {/* KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Total Headcount
              </span>
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                1,248
              </span>
              <span className="inline-flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +4.2%
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Across 3 legal entities & 5 offices
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Today&apos;s Attendance
              </span>
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                96.4%
              </span>
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                1,203 Present
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              28 on approved leave, 17 remote
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Pending Approvals
              </span>
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                14
              </span>
              <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                3 require SLA action
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              8 Leaves, 4 Regularizations, 2 Air
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Payroll Cycle
              </span>
              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Nov 2026
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                PREVIEW
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Cut-off: 24th Nov • In Audit Review
            </p>
          </div>
        </div>

        {/* Two-Column Operations Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Pending Workflow Approvals (2 cols) */}
          <div className="lg:col-span-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-50">
                  Pending Workflow Engine Approvals
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Unified multi-level queue across modules
                </p>
              </div>
              <button className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                View All Queue <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {[
                {
                  id: "WF-1092",
                  employee: "Sarah Connor",
                  type: "Annual Leave",
                  details: "5 days (Nov 15 - Nov 20)",
                  entity: "Acme UAE Ltd",
                  level: "L2 HR Approval",
                  badge: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
                },
                {
                  id: "WF-1093",
                  employee: "Rajesh Kumar",
                  type: "Attendance Regularization",
                  details: "Missing Check-Out (Nov 4)",
                  entity: "Acme India Pvt Ltd",
                  level: "L1 Manager Approval",
                  badge: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
                },
                {
                  id: "WF-1094",
                  employee: "Daniel Lee",
                  type: "Air Entitlement Claim",
                  details: "Annual Flight Ticket (2 Yrs Service)",
                  entity: "Acme UAE Ltd",
                  level: "L2 HR & Finance",
                  badge: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50/60 dark:hover:bg-zinc-900/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-xs text-zinc-900 dark:text-zinc-100">
                        {item.employee}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${item.badge}`}
                      >
                        {item.type}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {item.details} •{" "}
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">
                        {item.entity}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      title="Approve request"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      title="Reject request"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-medium transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Attendance Punch & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Punch Widget */}
            <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-50">
                  Self-Service Attendance
                </h3>
                <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                  Asia/Dubai (+04:00)
                </span>
              </div>

              <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-center space-y-1">
                <span className="text-2xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-100">
                  {clockedIn ? "07h 42m" : "00h 00m"}
                </span>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {clockedIn
                    ? `Clocked in at ${clockTime}`
                    : "Not clocked in today"}
                </p>
              </div>

              <button
                onClick={handleClockToggle}
                className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 ${
                  clockedIn
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <Clock className="w-4 h-4" />
                {clockedIn ? "Clock Out for Today" : "Clock In (Web Punch)"}
              </button>
            </div>

            {/* Quick Actions */}
            <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs space-y-3">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Frequent Operations
              </h3>
              <div className="space-y-1.5">
                {[
                  { title: "New Employee Onboarding", href: "/employees" },
                  { title: "Apply Time Off / Leave", href: "/leave" },
                  { title: "Preview Payroll Calculation", href: "/payroll" },
                  { title: "Review Holiday Assignment", href: "/holidays" },
                ].map((act, i) => (
                  <a
                    key={i}
                    href={act.href}
                    className="flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group"
                  >
                    <span>{act.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
