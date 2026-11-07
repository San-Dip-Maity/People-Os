"use client";

import * as React from "react";
import {
  GitBranch,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { toast } from "@/components/ui/toast";

export default function WorkflowsPage() {
  const workflows = [
    {
      id: "WF-1092",
      name: "Annual Leave Approval Sequence",
      module: "Leave Management",
      requester: "Sarah Connor (EMP-0101)",
      currentLevel: "Level 2: HR Operations Review",
      steps: [
        { name: "L1: Reporting Manager (Marcus Vance)", status: "APPROVED" },
        { name: "L2: HR Operations (Alex Morgan)", status: "PENDING" },
      ],
      sla: "Within SLA (14h remaining)",
      status: "ACTIVE",
    },
    {
      id: "WF-1093",
      name: "Attendance Regularization Request",
      module: "Attendance",
      requester: "Rajesh Kumar (EMP-0102)",
      currentLevel: "Level 1: Reporting Manager Approval",
      steps: [
        { name: "L1: Reporting Manager (Sarah Connor)", status: "PENDING" },
      ],
      sla: "Within SLA (22h remaining)",
      status: "ACTIVE",
    },
    {
      id: "WF-1090",
      name: "Probation Confirmation Sequence",
      module: "Employee Lifecycle",
      requester: "Daniel Lee (EMP-0103)",
      currentLevel: "Workflow Completed",
      steps: [
        { name: "L1: Performance Review", status: "APPROVED" },
        { name: "L2: HR Confirmation & Letter", status: "APPROVED" },
      ],
      sla: "Completed on 2026-11-04",
      status: "COMPLETED",
    },
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#071B2B] dark:text-[#f0f7f9] flex items-center gap-2">
              Unified Workflow & Approval Engine
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              State-machine workflow engine powering approvals, delegation, and escalation across all HR modules.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toast.info("Visual Workflow Builder", "Workflow template designer opened in preview mode.")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#167D8D] hover:bg-[#126876] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Define Workflow Template</span>
            </button>
          </div>
        </div>

        {/* Engine Principle Callout */}
        <div className="p-4 rounded-xl border border-[#B9E4E8] dark:border-[#163854] bg-[#eaf7f9] dark:bg-[#0a2134] text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-[#167D8D] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-[#071B2B] dark:text-[#B9E4E8]">
              Centralized Approval Engine Architecture
            </h4>
            <p className="text-zinc-600 dark:text-zinc-400">
              Individual domain modules (Leave, Shifts, Payroll, Onboarding) do not implement isolated approval logic. All approval transitions execute inside transaction-safe state machines to prevent duplicate approvals or race conditions.
            </p>
          </div>
        </div>

        {/* Workflow Instances List */}
        <div className="rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#EEEEEE] dark:border-[#163854] flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#071B2B] dark:text-[#f0f7f9]">
              Active Workflow Instances ({workflows.length})
            </h3>
            <span className="text-xs text-zinc-500">Real-time status</span>
          </div>

          <div className="divide-y divide-[#EEEEEE] dark:divide-[#163854] text-xs">
            {workflows.map((wf) => (
              <div key={wf.id} className="p-5 space-y-3 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-[#eaf7f9] dark:bg-[#12334f] text-[#167D8D] dark:text-[#B9E4E8]">
                      <GitBranch className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#071B2B] dark:text-[#f0f7f9] flex items-center gap-2">
                        {wf.name}
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-medium bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
                          {wf.id}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        Module: {wf.module} • Initiated by: {wf.requester}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-full font-semibold self-start sm:self-center ${
                      wf.status === "ACTIVE"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                    }`}
                  >
                    {wf.status}
                  </span>
                </div>

                {/* Steps Visual Bar */}
                <div className="p-3 rounded-lg bg-[#fafafa] dark:bg-[#0a2134] border border-[#EEEEEE] dark:border-[#163854] flex flex-wrap items-center gap-3">
                  {wf.steps.map((st, i) => (
                    <React.Fragment key={i}>
                      <div className="flex items-center gap-1.5">
                        {st.status === "APPROVED" ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                        <span className={`text-[11px] ${st.status === "APPROVED" ? "text-emerald-700 dark:text-emerald-300 font-medium" : "text-zinc-700 dark:text-zinc-300"}`}>
                          {st.name}
                        </span>
                      </div>
                      {i < wf.steps.length - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                  <span>Current Stage: <strong className="text-zinc-700 dark:text-zinc-300">{wf.currentLevel}</strong></span>
                  <span>{wf.sla}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
