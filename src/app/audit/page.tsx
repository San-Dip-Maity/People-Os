"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import {
  ShieldCheck,
  Download,
} from "lucide-react";

export default function AuditPage() {
  const [filterAction, setFilterAction] = React.useState("ALL");

  const logs = [
    {
      id: "AUD-8901",
      actor: "Alex Morgan (HR Admin)",
      action: "APPROVE",
      resource: "LeaveRequest (LR-901)",
      details: "Approved 5-day annual leave for Sarah Connor",
      ip: "192.168.1.42",
      time: "2026-11-06 15:42:10 UTC",
      badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    },
    {
      id: "AUD-8902",
      actor: "Copilot AI (Tool Sandbox)",
      action: "AI_ACTION",
      resource: "PolicyQuery",
      details: "Retrieved Global Leave Policy Sec 4.2 with citation",
      ip: "Internal RPC",
      time: "2026-11-06 15:30:00 UTC",
      badge: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
    },
    {
      id: "AUD-8903",
      actor: "Aisha Al-Mansoor (Finance)",
      action: "UPDATE",
      resource: "PayrollRun (PR-NOV26)",
      details: "Updated statutory social security deduction for UAE entity",
      ip: "10.0.4.19",
      time: "2026-11-06 14:15:22 UTC",
      badge: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    },
    {
      id: "AUD-8904",
      actor: "Alex Morgan (HR Admin)",
      action: "LOGIN",
      resource: "Session",
      details: "Authenticated via password + session token",
      ip: "192.168.1.42",
      time: "2026-11-06 09:00:15 UTC",
      badge: "bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300",
    },
  ];

  const filtered = logs.filter(
    (l) => filterAction === "ALL" || l.action === filterAction
  );

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              Audit Ledger & Compliance Governance
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Cryptographically timestamped audit trail of sensitive actions, permissions, and AI queries.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Exporting tamper-evident compliance audit trail (CSV / JSON)")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit Trail</span>
            </button>
          </div>
        </div>

        {/* Security Invariant */}
        <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/20 text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-blue-900 dark:text-blue-200">
              Immutable Append-Only Audit Trail
            </h4>
            <p className="text-zinc-600 dark:text-zinc-400">
              Audit records cannot be modified or deleted by application users or administrators. Every privileged action, payroll lock, permission change, and AI-assisted data access is permanently preserved.
            </p>
          </div>
        </div>

        {/* Audit Table */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50">
              Audit Event Stream
            </h3>

            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 focus:outline-none"
            >
              <option value="ALL">All Event Types</option>
              <option value="APPROVE">Approvals</option>
              <option value="UPDATE">Updates</option>
              <option value="LOGIN">Authentication</option>
              <option value="AI_ACTION">AI Actions</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3">Audit ID & Timestamp</th>
                  <th className="px-5 py-3">Actor</th>
                  <th className="px-5 py-3">Action</th>
                  <th className="px-5 py-3">Resource Target</th>
                  <th className="px-5 py-3">Action Details</th>
                  <th className="px-5 py-3 text-right">IP / Origin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                    <td className="px-5 py-3.5">
                      <div className="font-mono text-zinc-400">{log.id}</div>
                      <div className="text-[11px] text-zinc-500 font-mono">
                        {log.time}
                      </div>
                    </td>

                    <td className="px-5 py-3.5 font-medium text-zinc-800 dark:text-zinc-200">
                      {log.actor}
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${log.badge}`}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 font-mono text-zinc-700 dark:text-zinc-300">
                      {log.resource}
                    </td>

                    <td className="px-5 py-3.5 text-zinc-600 dark:text-zinc-400 max-w-xs">
                      {log.details}
                    </td>

                    <td className="px-5 py-3.5 text-right font-mono text-zinc-400 text-[11px]">
                      {log.ip}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
