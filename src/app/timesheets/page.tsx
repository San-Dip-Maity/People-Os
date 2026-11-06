"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import {
  Send,
  Calendar,
} from "lucide-react";

export default function TimesheetsPage() {
  const [submitted, setSubmitted] = React.useState(false);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              Timesheet & Project Allocation
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Log billable hours, project deliverables, and submit weekly timesheets for approval.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSubmitted(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitted ? "Timesheet Submitted" : "Submit Week For Review"}</span>
            </button>
          </div>
        </div>

        {/* Current Week Banner */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                Week 45: Nov 02 — Nov 06, 2026
              </div>
              <div className="text-[11px] text-zinc-500">
                Assigned Reviewer: Marcus Vance (VP Engineering)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-zinc-500">Weekly Total</div>
              <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                40.0 hrs
              </div>
            </div>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                submitted
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                  : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              }`}
            >
              {submitted ? "UNDER REVIEW" : "DRAFT"}
            </span>
          </div>
        </div>

        {/* Weekly Timesheet Table */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3">Project / Client</th>
                  <th className="px-5 py-3">Task Deliverable</th>
                  <th className="px-3 py-3 text-center">Mon</th>
                  <th className="px-3 py-3 text-center">Tue</th>
                  <th className="px-3 py-3 text-center">Wed</th>
                  <th className="px-3 py-3 text-center">Thu</th>
                  <th className="px-3 py-3 text-center">Fri</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {[
                  {
                    project: "PeopleOS Core Platform",
                    task: "Multi-tenant tenant isolation and RBAC security layer",
                    hours: [8, 8, 8, 8, 4],
                    total: "36.0 hrs",
                  },
                  {
                    project: "Internal Architecture",
                    task: "Cross-entity holiday calendar synchronization",
                    hours: [0, 0, 0, 0, 4],
                    total: "4.0 hrs",
                  },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                    <td className="px-5 py-3.5 font-semibold text-zinc-900 dark:text-zinc-100">
                      {row.project}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-600 dark:text-zinc-400">
                      {row.task}
                    </td>
                    {row.hours.map((h, d) => (
                      <td key={d} className="px-3 py-3.5 text-center font-mono">
                        {h > 0 ? (
                          <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-medium">
                            {h}h
                          </span>
                        ) : (
                          <span className="text-zinc-400">-</span>
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3.5 text-right font-bold text-blue-600 dark:text-blue-400">
                      {row.total}
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
