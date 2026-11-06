"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import {
  RotateCcw,
  MapPin,
} from "lucide-react";

export default function AttendancePage() {
  const [regularizeOpen, setRegularizeOpen] = React.useState(false);
  const [records, setRecords] = React.useState([
    {
      id: "ATT-101",
      employee: "Sarah Connor",
      code: "EMP-0101",
      date: "2026-11-06 (Today)",
      checkIn: "08:55 AM",
      checkOut: "Active",
      hours: "7h 45m",
      status: "PRESENT",
      location: "Dubai Internet City (+04:00)",
    },
    {
      id: "ATT-102",
      employee: "Rajesh Kumar",
      code: "EMP-0102",
      date: "2026-11-06 (Today)",
      checkIn: "09:12 AM",
      checkOut: "Active",
      hours: "8h 18m",
      status: "PRESENT",
      location: "Bengaluru Tech Park (+05:30)",
    },
    {
      id: "ATT-103",
      employee: "Daniel Lee",
      code: "EMP-0103",
      date: "2026-11-05 (Yesterday)",
      checkIn: "09:05 AM",
      checkOut: "Missing Punch",
      hours: "--",
      status: "REGULARIZATION_PENDING",
      location: "New York (-05:00)",
    },
  ]);

  const [regForm, setRegForm] = React.useState({
    date: "2026-11-05",
    checkIn: "09:00",
    checkOut: "18:00",
    reason: "",
  });

  const handleRegularizeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRecords((prev) => [
      {
        id: `ATT-${Date.now()}`,
        employee: "Alex Morgan",
        code: "EMP-0001",
        date: regForm.date,
        checkIn: regForm.checkIn,
        checkOut: regForm.checkOut,
        hours: "9h 00m",
        status: "REGULARIZATION_PENDING",
        location: "Dubai Internet City (+04:00)",
      },
      ...prev,
    ]);
    setRegularizeOpen(false);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              Attendance & Shift Management
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Timezone-aware punch telemetry, shift assignment, and regularization requests.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRegularizeOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Request Regularization</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs space-y-1">
            <span className="text-xs text-zinc-500">Present Today</span>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              96.4%
            </div>
            <p className="text-[11px] text-emerald-600">1,203 checked in</p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs space-y-1">
            <span className="text-xs text-zinc-500">Late Arrivals</span>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              18
            </div>
            <p className="text-[11px] text-amber-600">&gt;15 mins grace period</p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs space-y-1">
            <span className="text-xs text-zinc-500">Missing Punches</span>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              4
            </div>
            <p className="text-[11px] text-amber-600">Pending correction</p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs space-y-1">
            <span className="text-xs text-zinc-500">Overtime Recorded</span>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              142 hrs
            </div>
            <p className="text-[11px] text-zinc-500">Payable in payroll cycle</p>
          </div>
        </div>

        {/* Daily Logs Table */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50">
              Live Attendance Telemetry Stream
            </h3>
            <span className="text-xs text-zinc-500 font-mono">
              Server UTC: 2026-11-06
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3">Employee</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Check-In</th>
                  <th className="px-5 py-3">Check-Out</th>
                  <th className="px-5 py-3">Total Time</th>
                  <th className="px-5 py-3">Work Location Timezone</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {rec.employee}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono">
                        {rec.code}
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-zinc-700 dark:text-zinc-300">
                      {rec.date}
                    </td>

                    <td className="px-5 py-3.5 font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                      {rec.checkIn}
                    </td>

                    <td className="px-5 py-3.5 font-mono text-zinc-600 dark:text-zinc-400">
                      {rec.checkOut}
                    </td>

                    <td className="px-5 py-3.5 font-semibold text-zinc-900 dark:text-zinc-100">
                      {rec.hours}
                    </td>

                    <td className="px-5 py-3.5 text-zinc-500">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-zinc-400" />
                        {rec.location}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          rec.status === "PRESENT"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Regularization Modal */}
        {regularizeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setRegularizeOpen(false)}
            />
            <div className="relative w-full max-w-md bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 z-10">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50">
                Request Attendance Correction
              </h3>
              <form onSubmit={handleRegularizeSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                    Date of Exception *
                  </label>
                  <input
                    type="date"
                    required
                    value={regForm.date}
                    onChange={(e) => setRegForm({ ...regForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                      Actual Check-In
                    </label>
                    <input
                      type="time"
                      required
                      value={regForm.checkIn}
                      onChange={(e) => setRegForm({ ...regForm, checkIn: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                      Actual Check-Out
                    </label>
                    <input
                      type="time"
                      required
                      value={regForm.checkOut}
                      onChange={(e) => setRegForm({ ...regForm, checkOut: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                    Reason for Missing Punch
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={regForm.reason}
                    onChange={(e) => setRegForm({ ...regForm, reason: e.target.value })}
                    placeholder="e.g. Biometric device offline / Client site visit"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRegularizeOpen(false)}
                    className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-semibold"
                  >
                    Submit Regularization
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
