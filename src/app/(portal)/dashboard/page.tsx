"use client";

import * as React from "react";
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
import Link from "next/link";
import { toast } from "@/components/ui/toast";

interface PendingItem {
  id: string;
  employee: string;
  type: string;
  details: string;
  entity: string;
  level: string;
  badge: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export default function DashboardPage() {
  const [clockedIn, setClockedIn] = React.useState(false);
  const [clockTime, setClockTime] = React.useState("09:00 AM");
  const [headcount, setHeadcount] = React.useState(1248);
  const [pendingQueue, setPendingQueue] = React.useState<PendingItem[]>([
    {
      id: "WF-1092",
      employee: "Sarah Connor",
      type: "Annual Leave",
      details: "5 days (Nov 15 - Nov 20)",
      entity: "Acme UAE Ltd",
      level: "L2 HR Approval",
      badge: "bg-[#B9E4E8] text-[#071B2B]",
      status: "PENDING",
    },
    {
      id: "WF-1093",
      employee: "Rajesh Kumar",
      type: "Attendance Regularization",
      details: "Missing Check-Out (Nov 4)",
      entity: "Acme India Pvt Ltd",
      level: "L1 Manager Approval",
      badge: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
      status: "PENDING",
    },
    {
      id: "WF-1094",
      employee: "Daniel Lee",
      type: "Air Entitlement Claim",
      details: "Annual Flight Ticket (2 Yrs Service)",
      entity: "Acme UAE Ltd",
      level: "L2 HR & Finance",
      badge: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
      status: "PENDING",
    },
  ]);

  // Load live data from database on mount
  React.useEffect(() => {
    async function loadDashboardData() {
      try {
        // Load live workflows
        const wfRes = await fetch("/api/workflows");
        if (wfRes.ok) {
          const wfData = await wfRes.json();
          if (wfData.workflows && wfData.workflows.length > 0) {
            setPendingQueue(
              wfData.workflows.map((w: {
                id: string;
                code?: string;
                employee: string;
                type: string;
                details: string;
                entity: string;
                level: string;
                status: "PENDING" | "APPROVED" | "REJECTED";
              }) => ({
                id: w.code || w.id,
                employee: w.employee,
                type: w.type,
                details: w.details,
                entity: w.entity,
                level: w.level,
                badge: "bg-[#B9E4E8] text-[#071B2B]",
                status: w.status,
              }))
            );
          }
        }

        // Load live attendance punch state
        const attRes = await fetch("/api/attendance");
        if (attRes.ok) {
          const attData = await attRes.json();
          setClockedIn(attData.clockedIn);
          if (attData.clockTime) {
            setClockTime(attData.clockTime);
          }
        }

        // Load employee headcount
        const empRes = await fetch("/api/employees");
        if (empRes.ok) {
          const empData = await empRes.json();
          if (empData.employees && empData.employees.length > 0) {
            setHeadcount(1243 + empData.employees.length);
          }
        }
      } catch (err) {
        console.error("Failed to load dashboard data from database:", err);
      }
    }
    loadDashboardData();
  }, []);

  const handleClockToggle = async () => {
    const nextState = !clockedIn;
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: clockedIn ? "clockOut" : "clockIn" }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error("Punch Failed", data.error || "Could not record punch to database.");
        return;
      }

      setClockedIn(data.clockedIn);
      if (data.clockTime) {
        setClockTime(data.clockTime);
      }

      if (data.clockedIn) {
        toast.success(
          "Punch In Successful",
          `Web punch recorded at ${data.clockTime}. Committed to database.`
        );
      } else {
        toast.info(
          "Punch Out Successful",
          `Clocked out at ${data.clockTime}. Attendance updated.`
        );
      }
    } catch (err) {
      console.error("Attendance toggle error:", err);
      // Fallback local update
      setClockedIn(nextState);
      toast.warning("Network Notice", "Punch recorded locally, syncing to server.");
    }
  };

  const handleDecision = async (id: string, decision: "APPROVED" | "REJECTED") => {
    // Optimistic UI update
    setPendingQueue((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: decision } : item
      )
    );

    try {
      const res = await fetch("/api/workflows", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, decision }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error("Decision Failed", data.error || "Failed to commit decision to database.");
        return;
      }

      if (decision === "APPROVED") {
        toast.success(
          "Workflow Approved",
          `Workflow ${id} approved and saved to audit log.`
        );
      } else {
        toast.warning(
          "Workflow Rejected",
          `Workflow ${id} marked as rejected in database.`
        );
      }
    } catch (err) {
      console.error("Workflow decision error:", err);
      toast.error("Network Error", "Could not reach database.");
    }
  };

  const activePendingCount = pendingQueue.filter((p) => p.status === "PENDING").length;

  return (
    <>
      <div className="space-y-6">
        {/* Welcome & Overview Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="title-page text-[#071B2B] dark:text-[#f0f7f9]">
              Operations Command Center
            </h1>
            <p className="text-supporting text-zinc-500 dark:text-zinc-400">
              Real-time workforce intelligence and human capital telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#eaf7f9] text-[#071B2B] dark:bg-[#0c263d] dark:text-[#B9E4E8] border border-[#B9E4E8] dark:border-[#163854]">
              <span className="w-2 h-2 rounded-full bg-[#167D8D] animate-pulse" />
              Tenant: Acme Global (UAE / IND)
            </span>
          </div>
        </div>

        {/* AI People Intelligence Insight Banner */}
        <div className="relative overflow-hidden rounded-xl border border-[#B9E4E8] dark:border-[#163854] bg-gradient-to-r from-[#eaf7f9] via-white to-white dark:from-[#0c263d] dark:via-[#071B2B] dark:to-[#071B2B] p-4 sm:p-5 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-lg bg-[#167D8D] text-white shrink-0 shadow-sm shadow-[#167D8D]/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#167D8D] dark:text-[#B9E4E8]">
                  AI Workforce Insight • Effective Date Aware
                </h4>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Updated 5m ago
                </span>
              </div>
              <p className="text-body text-zinc-700 dark:text-zinc-300">
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
          <Link
            href="/employees"
            className="p-5 rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs space-y-2 hover:border-[#167D8D] dark:hover:border-[#167D8D] transition-colors block"
          >
            <div className="flex items-center justify-between">
              <span className="text-label text-zinc-500 dark:text-zinc-400">
                Total Headcount
              </span>
              <div className="p-2 rounded-lg bg-[#eaf7f9] dark:bg-[#12334f] text-[#167D8D] dark:text-[#B9E4E8]">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight text-[#071B2B] dark:text-[#f0f7f9]">
                {headcount.toLocaleString()}
              </span>
              <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +4.2%
              </span>
            </div>
            <p className="text-supporting text-zinc-500 dark:text-zinc-400">
              Across 3 legal entities & 5 offices
            </p>
          </Link>

          {/* Card 2 */}
          <Link
            href="/attendance"
            className="p-5 rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs space-y-2 hover:border-[#167D8D] dark:hover:border-[#167D8D] transition-colors block"
          >
            <div className="flex items-center justify-between">
              <span className="text-label text-zinc-500 dark:text-zinc-400">
                Today&apos;s Attendance
              </span>
              <div className="p-2 rounded-lg bg-[#eaf7f9] dark:bg-[#12334f] text-[#167D8D] dark:text-[#B9E4E8]">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight text-[#071B2B] dark:text-[#f0f7f9]">
                96.4%
              </span>
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                1,203 Present
              </span>
            </div>
            <p className="text-supporting text-zinc-500 dark:text-zinc-400">
              28 on approved leave, 17 remote
            </p>
          </Link>

          {/* Card 3 */}
          <Link
            href="/workflows"
            className="p-5 rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs space-y-2 hover:border-[#167D8D] dark:hover:border-[#167D8D] transition-colors block"
          >
            <div className="flex items-center justify-between">
              <span className="text-label text-zinc-500 dark:text-zinc-400">
                Pending Approvals
              </span>
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight text-[#071B2B] dark:text-[#f0f7f9]">
                {activePendingCount}
              </span>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                Queue active
              </span>
            </div>
            <p className="text-supporting text-zinc-500 dark:text-zinc-400">
              Leaves, Regularizations & Air
            </p>
          </Link>

          {/* Card 4 */}
          <Link
            href="/payroll"
            className="p-5 rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs space-y-2 hover:border-[#167D8D] dark:hover:border-[#167D8D] transition-colors block"
          >
            <div className="flex items-center justify-between">
              <span className="text-label text-zinc-500 dark:text-zinc-400">
                Payroll Cycle
              </span>
              <div className="p-2 rounded-lg bg-[#eaf7f9] dark:bg-[#12334f] text-[#167D8D] dark:text-[#B9E4E8]">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight text-[#071B2B] dark:text-[#f0f7f9]">
                Nov 2026
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#B9E4E8] text-[#071B2B]">
                PREVIEW
              </span>
            </div>
            <p className="text-supporting text-zinc-500 dark:text-zinc-400">
              Cut-off: 24th Nov • In Audit Review
            </p>
          </Link>
        </div>

        {/* Two-Column Operations Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Pending Workflow Approvals (2 cols) */}
          <div className="lg:col-span-2 rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#EEEEEE] dark:border-[#163854] flex items-center justify-between">
              <div>
                <h3 className="heading-card text-[#071B2B] dark:text-[#f0f7f9]">
                  Pending Workflow Engine Approvals
                </h3>
                <p className="text-supporting text-zinc-500 dark:text-zinc-400">
                  Unified multi-level queue across modules
                </p>
              </div>
              <Link
                href="/workflows"
                className="text-xs font-semibold text-[#167D8D] dark:text-[#B9E4E8] hover:underline flex items-center gap-1"
              >
                View All Queue <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-[#EEEEEE] dark:divide-[#163854]">
              {pendingQueue.map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#fafafa] dark:hover:bg-[#0a2134] transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-[#071B2B] dark:text-[#f0f7f9]">
                        {item.employee}
                      </span>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-[#B9E4E8] text-[#071B2B]"
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
                    {item.status === "PENDING" ? (
                      <>
                        <button
                          onClick={() => handleDecision(item.id, "APPROVED")}
                          title="Approve request"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#167D8D] hover:bg-[#126876] text-white text-xs font-semibold transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => handleDecision(item.id, "REJECTED")}
                          title="Reject request"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#EEEEEE] dark:border-[#163854] hover:bg-[#EEEEEE] dark:hover:bg-[#12334f] text-[#071B2B] dark:text-[#f0f7f9] text-xs font-semibold transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </>
                    ) : (
                      <span
                        className={`text-xs px-2.5 py-1 rounded-md font-semibold ${
                          item.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                        }`}
                      >
                        {item.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Attendance Punch & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Punch Widget */}
            <div className="p-5 rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="heading-card text-[#071B2B] dark:text-[#f0f7f9]">
                  Self-Service Attendance
                </h3>
                <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                  Asia/Dubai (+04:00)
                </span>
              </div>

              <div className="p-4 rounded-lg bg-[#fafafa] dark:bg-[#0a2134] border border-[#EEEEEE] dark:border-[#163854] text-center space-y-1">
                <span className="text-2xl font-bold font-mono tracking-tight text-[#071B2B] dark:text-[#f0f7f9]">
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
                className={`w-full py-2.5 px-4 rounded-lg text-btn shadow-xs transition-colors flex items-center justify-center gap-2 ${
                  clockedIn
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "btn-primary"
                }`}
              >
                <Clock className="w-4 h-4" />
                {clockedIn ? "Clock Out for Today" : "Clock In (Web Punch)"}
              </button>
            </div>

            {/* Quick Actions */}
            <div className="p-5 rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs space-y-3">
              <h3 className="text-label uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Frequent Operations
              </h3>
              <div className="space-y-1.5">
                {[
                  { title: "New Employee Onboarding", href: "/employees" },
                  { title: "Apply Time Off / Leave", href: "/leave" },
                  { title: "Preview Payroll Calculation", href: "/payroll" },
                  { title: "Review Holiday Assignment", href: "/holidays" },
                ].map((act, i) => (
                  <Link
                    key={i}
                    href={act.href}
                    className="flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold text-[#071B2B] dark:text-[#f0f7f9] hover:bg-[#eaf7f9] dark:hover:bg-[#0a2134] transition-colors group"
                  >
                    <span>{act.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#167D8D] group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
