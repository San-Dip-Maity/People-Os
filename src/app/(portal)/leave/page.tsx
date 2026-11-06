"use client";

import * as React from "react";
import {
  CalendarDays,
  Plus,
  Plane,
  Clock,
  AlertCircle,
  Check,
  X,
} from "lucide-react";

interface LeaveRequest {
  id: string;
  employee: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export default function LeavePage() {
  const [applyModalOpen, setApplyModalOpen] = React.useState(false);
  const [requests, setRequests] = React.useState<LeaveRequest[]>([
    {
      id: "LR-901",
      employee: "Sarah Connor",
      type: "Annual Leave",
      startDate: "2026-11-15",
      endDate: "2026-11-19",
      days: 5,
      reason: "Family vacation to Europe",
      status: "PENDING",
    },
    {
      id: "LR-902",
      employee: "Daniel Lee",
      type: "Sick Leave",
      startDate: "2026-11-04",
      endDate: "2026-11-04",
      days: 1,
      reason: "Doctor appointment & recovery",
      status: "APPROVED",
    },
    {
      id: "LR-903",
      employee: "Rajesh Kumar",
      type: "Air Ticket Entitlement",
      startDate: "2026-12-20",
      endDate: "2026-12-28",
      days: 8,
      reason: "Annual home leave flight ticket booking",
      status: "PENDING",
    },
  ]);

  const [form, setForm] = React.useState({
    type: "Annual Leave",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.startDate || !form.endDate) return;

    const newReq: LeaveRequest = {
      id: `LR-${Math.floor(1000 + Math.random() * 9000)}`,
      employee: "Alex Morgan",
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      days: 3,
      reason: form.reason || "Personal leave request",
      status: "PENDING",
    };

    setRequests([newReq, ...requests]);
    setApplyModalOpen(false);
    setForm({ type: "Annual Leave", startDate: "", endDate: "", reason: "" });
  };

  const handleAction = (id: string, newStatus: "APPROVED" | "REJECTED") => {
    setRequests(
      requests.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              Leave & Air Entitlement Engine
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Manage multi-type leave policies, accrual calculations, and service-based entitlements.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setApplyModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Apply For Leave</span>
            </button>
          </div>
        </div>

        {/* Leave Balances Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Annual Leave</span>
              <CalendarDays className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              24.0 <span className="text-xs font-normal text-zinc-500">Total / Yr</span>
            </div>
            <div className="flex justify-between text-[11px] text-zinc-500">
              <span>Used: 5.5 days</span>
              <span className="font-semibold text-emerald-600">Available: 18.5</span>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Sick Leave</span>
              <AlertCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              15.0 <span className="text-xs font-normal text-zinc-500">Days</span>
            </div>
            <div className="flex justify-between text-[11px] text-zinc-500">
              <span>Used: 3.0 days</span>
              <span className="font-semibold text-emerald-600">Available: 12.0</span>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Air Ticket Entitlement</span>
              <Plane className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              1 <span className="text-xs font-normal text-zinc-500">Ticket</span>
            </div>
            <div className="flex justify-between text-[11px] text-zinc-500">
              <span>Qual: 12 Mos Service</span>
              <span className="font-semibold text-purple-600">ID: AIR-2026-AM</span>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Pending Reviews</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {requests.filter((r) => r.status === "PENDING").length}
            </div>
            <p className="text-[11px] text-amber-600">Requires workflow action</p>
          </div>
        </div>

        {/* Requests Table */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50">
              Leave & Air Entitlement Requests Queue
            </h3>
            <span className="text-xs text-zinc-500">
              Integrated with Unified Workflow Engine
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3">ID & Employee</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Duration</th>
                  <th className="px-5 py-3">Reason</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {r.employee}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono">
                        {r.id}
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-medium bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        {r.type}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-zinc-700 dark:text-zinc-300">
                      <div>
                        {r.startDate} to {r.endDate}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        {r.days} working day(s)
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-zinc-600 dark:text-zinc-400 max-w-xs truncate">
                      {r.reason}
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          r.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : r.status === "REJECTED"
                            ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      {r.status === "PENDING" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleAction(r.id, "APPROVED")}
                            className="p-1 rounded-md bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            title="Approve"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleAction(r.id, "REJECTED")}
                            className="p-1 rounded-md bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-950 dark:text-red-300"
                            title="Reject"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-zinc-400">Locked</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Apply Modal */}
        {applyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setApplyModalOpen(false)}
            />
            <div className="relative w-full max-w-md bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 z-10">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50">
                Apply For Leave / Entitlement
              </h3>
              <form onSubmit={handleApply} className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                    Leave Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  >
                    <option>Annual Leave</option>
                    <option>Sick Leave</option>
                    <option>Air Ticket Entitlement Claim</option>
                    <option>Unpaid Sabbatical</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={form.startDate}
                      onChange={(e) =>
                        setForm({ ...form, startDate: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                      End Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={form.endDate}
                      onChange={(e) =>
                        setForm({ ...form, endDate: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                    Reason / Comments
                  </label>
                  <textarea
                    rows={2}
                    value={form.reason}
                    onChange={(e) =>
                      setForm({ ...form, reason: e.target.value })
                    }
                    placeholder="Brief description for manager approval..."
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setApplyModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-semibold"
                  >
                    Submit for Approval
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
