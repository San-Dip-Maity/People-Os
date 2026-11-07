"use client";

import * as React from "react";
import {
  Send,
  Calendar,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "@/components/ui/toast";

export default function TimesheetsPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [timesheetInfo, setTimesheetInfo] = React.useState({
    weekNumber: 45,
    weekRange: "Nov 02 — Nov 06, 2026",
    reviewer: "Marcus Vance (VP Engineering)",
    totalHours: 40.0,
    status: "SUBMITTED",
  });

  React.useEffect(() => {
    async function loadTimesheet() {
      try {
        const res = await fetch("/api/timesheets");
        if (res.ok) {
          const data = await res.json();
          if (data.timesheets && data.timesheets.length > 0) {
            const latest = data.timesheets[0];
            setSubmitted(latest.status === "SUBMITTED" || latest.status === "APPROVED");
            setTimesheetInfo({
              weekNumber: latest.weekNumber,
              weekRange: latest.weekRange,
              reviewer: latest.reviewer || "Marcus Vance (VP Engineering)",
              totalHours: latest.totalHours,
              status: latest.status,
            });
          }
        }
      } catch (err) {
        console.error("Failed to load timesheet:", err);
      }
    }
    loadTimesheet();
  }, []);

  const handleSubmitTimesheet = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/timesheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weekNumber: 45,
          weekRange: "Nov 02 — Nov 06, 2026",
          totalHours: 40.0,
          reviewer: "Marcus Vance (VP Engineering)",
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error("Submission Failed", data.error || "Could not submit timesheet.");
        return;
      }

      setSubmitted(true);
      setTimesheetInfo((prev) => ({ ...prev, status: "SUBMITTED" }));

      toast.success(
        "Timesheet Submitted",
        data.message || "Weekly allocation (40.0h) saved to database and submitted for manager approval."
      );
    } catch (err) {
      console.error("Timesheet submit error:", err);
      toast.error("Network Error", "Could not reach database API.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#071B2B] dark:text-[#f0f7f9] flex items-center gap-2">
              Timesheet & Project Allocation
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Log billable hours, project deliverables, and submit weekly timesheets for approval.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSubmitTimesheet}
              disabled={submitting || submitted}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-white text-xs font-semibold shadow-xs transition-colors ${
                submitted
                  ? "bg-zinc-600 cursor-not-allowed"
                  : "bg-[#167D8D] hover:bg-[#126876]"
              }`}
            >
              {submitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : submitted ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>{submitted ? "Timesheet Submitted" : "Submit Week For Review"}</span>
            </button>
          </div>
        </div>

        {/* Current Week Banner */}
        <div className="p-4 rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#eaf7f9] dark:bg-[#12334f] text-[#167D8D] dark:text-[#B9E4E8]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#071B2B] dark:text-[#f0f7f9]">
                Week {timesheetInfo.weekNumber}: {timesheetInfo.weekRange}
              </div>
              <div className="text-[11px] text-zinc-500">
                Assigned Reviewer: {timesheetInfo.reviewer}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-zinc-500">Weekly Total</div>
              <div className="text-lg font-bold text-[#071B2B] dark:text-[#f0f7f9]">
                {timesheetInfo.totalHours.toFixed(1)} hrs
              </div>
            </div>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                submitted
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                  : "bg-[#B9E4E8] text-[#071B2B]"
              }`}
            >
              {timesheetInfo.status}
            </span>
          </div>
        </div>

        {/* Weekly Timesheet Table */}
        <div className="rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafafa] dark:bg-[#0a2134] border-b border-[#EEEEEE] dark:border-[#163854] text-zinc-500 uppercase font-semibold">
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
              <tbody className="divide-y divide-[#EEEEEE] dark:divide-[#163854]">
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
                    <td className="px-5 py-3.5 font-semibold text-[#071B2B] dark:text-[#f0f7f9]">
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
                    <td className="px-4 py-3.5 text-right font-bold text-[#167D8D] dark:text-[#B9E4E8]">
                      {row.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
