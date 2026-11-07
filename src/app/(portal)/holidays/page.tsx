"use client";

import * as React from "react";
import {
  Info,
  Calendar,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "@/components/ui/toast";

interface HolidayItem {
  id: string;
  name: string;
  date: string;
  type: string;
  daysCount: number;
  calendarCode: string;
}

export default function HolidaysPage() {
  const [selectedCalendar, setSelectedCalendar] = React.useState<"UAE" | "IND" | "USA">("IND");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const [holidays, setHolidays] = React.useState<Record<string, HolidayItem[]>>({
    UAE: [
      { id: "1", calendarCode: "UAE", name: "New Year's Day", date: "2026-01-01", type: "Statutory Public", daysCount: 1 },
      { id: "2", calendarCode: "UAE", name: "Eid Al-Fitr (Estimated)", date: "2026-03-20 to 2026-03-23", type: "Religious Public", daysCount: 4 },
      { id: "3", calendarCode: "UAE", name: "UAE National Day", date: "2026-12-02 to 2026-12-03", type: "National Holiday", daysCount: 2 },
    ],
    IND: [
      { id: "4", calendarCode: "IND", name: "Republic Day", date: "2026-01-26", type: "National Holiday", daysCount: 1 },
      { id: "5", calendarCode: "IND", name: "Independence Day", date: "2026-08-15", type: "National Holiday", daysCount: 1 },
      { id: "6", calendarCode: "IND", name: "Diwali (Deepavali)", date: "2026-11-08 to 2026-11-09", type: "Festival Public", daysCount: 2 },
    ],
    USA: [
      { id: "7", calendarCode: "USA", name: "New Year's Day", date: "2026-01-01", type: "Federal Statutory", daysCount: 1 },
      { id: "8", calendarCode: "USA", name: "Independence Day", date: "2026-07-04", type: "Federal Holiday", daysCount: 1 },
      { id: "9", calendarCode: "USA", name: "Thanksgiving Day", date: "2026-11-26", type: "Federal Holiday", daysCount: 1 },
    ],
  });

  const [form, setForm] = React.useState({
    name: "",
    date: "",
    type: "Public Holiday",
    daysCount: 1,
  });

  React.useEffect(() => {
    async function loadHolidays() {
      try {
        const res = await fetch("/api/holidays");
        if (res.ok) {
          const data = await res.json();
          if (data.holidays) {
            setHolidays(data.holidays);
          }
        }
      } catch (err) {
        console.error("Failed to load holidays:", err);
      }
    }
    loadHolidays();
  }, []);

  const handleAddHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.date.trim()) {
      toast.warning("Incomplete Fields", "Holiday name and date are required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/holidays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          calendarCode: selectedCalendar,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error("Failed to Add Holiday", data.error || "Could not register holiday.");
        return;
      }

      setHolidays((prev) => ({
        ...prev,
        [selectedCalendar]: [...(prev[selectedCalendar] || []), data.holiday],
      }));
      setModalOpen(false);
      setForm({ name: "", date: "", type: "Public Holiday", daysCount: 1 });

      toast.success(
        "Holiday Added",
        `"${data.holiday.name}" saved to database for ${selectedCalendar} calendar.`
      );
    } catch (err) {
      console.error("Holiday add error:", err);
      toast.error("Network Error", "Could not reach database API.");
    } finally {
      setSubmitting(false);
    }
  };

  const currentList = holidays[selectedCalendar] || [];

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

          <div className="flex items-center gap-2">
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#167D8D] hover:bg-[#126876] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Holiday ({selectedCalendar})</span>
            </button>
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
                Official Observed Holidays ({currentList.length} days)
              </h3>
              <p className="text-xs text-zinc-500">
                Live database registry integrated with leave accrual and shift engines
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              Active Calendar ({selectedCalendar})
            </span>
          </div>

          <div className="divide-y divide-[#EEEEEE] dark:divide-[#163854]">
            {currentList.map((h) => (
              <div
                key={h.id}
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
                    {h.daysCount} day(s)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal: Add Holiday */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white dark:bg-[#0c263d] rounded-2xl border border-[#EEEEEE] dark:border-[#163854] max-w-lg w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEE] dark:border-[#163854]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#167D8D]" />
                  <h3 className="font-bold text-[#071B2B] dark:text-[#f0f7f9]">
                    Add Holiday to {selectedCalendar} Calendar
                  </h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddHoliday} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-semibold">
                    Holiday Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Regional Cultural Festival"
                    className="w-full px-3 py-2 rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-[#fafafa] dark:bg-[#0a2134] text-[#071B2B] dark:text-[#f0f7f9] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-semibold">
                      Date (or Range) *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      placeholder="YYYY-MM-DD"
                      className="w-full px-3 py-2 rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-[#fafafa] dark:bg-[#0a2134] text-[#071B2B] dark:text-[#f0f7f9] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-semibold">
                      Days Count
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={14}
                      value={form.daysCount}
                      onChange={(e) => setForm({ ...form, daysCount: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-[#fafafa] dark:bg-[#0a2134] text-[#071B2B] dark:text-[#f0f7f9] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-semibold">
                    Holiday Classification
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-[#fafafa] dark:bg-[#0a2134] text-[#071B2B] dark:text-[#f0f7f9] focus:outline-none"
                  >
                    <option value="Statutory Public">Statutory Public</option>
                    <option value="National Holiday">National Holiday</option>
                    <option value="Religious Public">Religious Public</option>
                    <option value="State Statutory">State Statutory</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-3.5 py-1.5 rounded-lg border border-[#EEEEEE] dark:border-[#163854] text-zinc-600 dark:text-zinc-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#167D8D] text-white font-semibold disabled:opacity-50"
                  >
                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{submitting ? "Adding..." : "Save to Calendar"}</span>
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
