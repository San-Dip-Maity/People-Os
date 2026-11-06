"use client";

import * as React from "react";
import {
  Info,
  Calendar,
} from "lucide-react";

export default function HolidaysPage() {
  const [selectedCalendar, setSelectedCalendar] = React.useState<"UAE" | "IND" | "USA">("IND");

  const holidayData = {
    UAE: [
      { name: "New Year's Day", date: "2026-01-01", type: "Statutory Public", days: 1 },
      { name: "Eid Al-Fitr (Estimated)", date: "2026-03-20 to 2026-03-23", type: "Religious Public", days: 4 },
      { name: "Arafat Day", date: "2026-05-26", type: "Public Holiday", days: 1 },
      { name: "Eid Al-Adha", date: "2026-05-27 to 2026-05-29", type: "Religious Public", days: 3 },
      { name: "Islamic New Year", date: "2026-06-16", type: "Public Holiday", days: 1 },
      { name: "UAE National Day", date: "2026-12-02 to 2026-12-03", type: "National Holiday", days: 2 },
    ],
    IND: [
      { name: "Republic Day", date: "2026-01-26", type: "National Holiday", days: 1 },
      { name: "Ugadi (Karnataka New Year)", date: "2026-03-19", type: "State Public", days: 1 },
      { name: "May Day / Labour Day", date: "2026-05-01", type: "Gazetted Public", days: 1 },
      { name: "Independence Day", date: "2026-08-15", type: "National Holiday", days: 1 },
      { name: "Gandhi Jayanti", date: "2026-10-02", type: "National Holiday", days: 1 },
      { name: "Kannada Rajyotsava", date: "2026-11-01", type: "State Statutory", days: 1 },
      { name: "Diwali (Deepavali)", date: "2026-11-08 to 2026-11-09", type: "Festival Public", days: 2 },
    ],
    USA: [
      { name: "New Year's Day", date: "2026-01-01", type: "Federal Statutory", days: 1 },
      { name: "Martin Luther King Jr. Day", date: "2026-01-19", type: "Federal Holiday", days: 1 },
      { name: "Memorial Day", date: "2026-05-25", type: "Federal Holiday", days: 1 },
      { name: "Juneteenth National Independence Day", date: "2026-06-19", type: "Federal Holiday", days: 1 },
      { name: "Independence Day", date: "2026-07-04", type: "Federal Holiday", days: 1 },
      { name: "Labor Day", date: "2026-09-07", type: "Federal Holiday", days: 1 },
      { name: "Thanksgiving Day", date: "2026-11-26", type: "Federal Holiday", days: 1 },
      { name: "Christmas Day", date: "2026-12-25", type: "Federal Holiday", days: 1 },
    ],
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#071B2B] dark:text-[#f0f7f9] flex items-center gap-2">
              Holiday Calendars & Regional Observance
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Location-scoped holiday engines with explicit, auditable effective-dated assignment.
            </p>
          </div>
        </div>

        {/* Business Rule Banner */}
        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-950/60 bg-amber-50/60 dark:bg-amber-950/20 text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-amber-900 dark:text-amber-200">
              Rule Enforcement: No Automatic Assumptions
            </h4>
            <p className="text-zinc-600 dark:text-zinc-400">
              The system never infers a holiday calendar from IP address, browser timezone, or employing legal entity.
              Calendar assignments are explicit and version-controlled. For example, an employee employed under a UAE contract but working in Bengaluru receives the Karnataka India Calendar.
            </p>
          </div>
        </div>

        {/* Calendar Switcher Tabs */}
        <div className="flex gap-2 border-b border-[#EEEEEE] dark:border-[#163854] pb-2 text-xs font-medium">
          {[
            {
              key: "IND",
              label: "India / Karnataka 2026 (Bengaluru)",
              location: "Bengaluru Tech Park",
            },
            {
              key: "UAE",
              label: "UAE Statutory 2026 (Dubai)",
              location: "Dubai Internet City",
            },
            {
              key: "USA",
              label: "US Federal 2026 (New York)",
              location: "New York HQ",
            },
          ].map((c) => {
            const active = selectedCalendar === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setSelectedCalendar(c.key as typeof selectedCalendar)}
                className={`px-4 py-2 rounded-lg transition-colors text-left ${
                  active
                    ? "bg-[#167D8D] text-white font-semibold shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              >
                <div>{c.label}</div>
                <div
                  className={`text-[10px] ${
                    active ? "text-[#B9E4E8]" : "text-zinc-400"
                  }`}
                >
                  {c.location}
                </div>
              </button>
            );
          })}
        </div>

        {/* Holidays List */}
        <div className="rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#EEEEEE] dark:border-[#163854] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#071B2B] dark:text-[#f0f7f9]">
                Official Observed Holidays ({holidayData[selectedCalendar].length} days)
              </h3>
              <p className="text-xs text-zinc-500">
                Automatically integrated with Leave Accrual & Attendance proration engines
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              Active Calendar
            </span>
          </div>

          <div className="divide-y divide-[#EEEEEE] dark:divide-[#163854]">
            {holidayData[selectedCalendar].map((h, i) => (
              <div
                key={i}
                className="p-4 flex items-center justify-between text-xs hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-[#eaf7f9] dark:bg-[#12334f] text-[#167D8D] dark:text-[#B9E4E8] shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#071B2B] dark:text-[#f0f7f9] text-sm">
                      {h.name}
                    </div>
                    <div className="text-[11px] text-zinc-500 font-mono">
                      {h.date}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 font-medium text-[11px]">
                    {h.type}
                  </span>
                  <span className="font-semibold text-[#071B2B] dark:text-[#f0f7f9] w-16 text-right">
                    {h.days} day(s)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
