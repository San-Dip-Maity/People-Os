"use client";

import * as React from "react";
import {
  Building2,
  MapPin,
  History,
  ShieldCheck,
  ArrowRight,
  Layers,
} from "lucide-react";

export default function OrganizationPage() {
  const [tab, setTab] = React.useState<"entities" | "locations" | "departments" | "transfers">("entities");

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              Organization Structure & Entity Governance
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Multi-entity hierarchy, physical work locations, and decoupled assignment rules.
            </p>
          </div>
        </div>

        {/* Critical Business Rule Banner */}
        <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/20 text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-blue-900 dark:text-blue-200">
              Architectural Invariant: Legal Entity vs. Work Location Decoupling
            </h4>
            <p className="text-zinc-600 dark:text-zinc-400">
              In PeopleOS, an employee may be employed by a UAE legal entity but operate from India.
              The legal entity governs contracts, currency, and liability, while physical work location governs attendance, shifts, and holiday calendars with explicit effective dates.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 text-xs font-medium">
          {[
            { key: "entities", label: "Legal Entities (3)", icon: Building2 },
            { key: "locations", label: "Work Locations (3)", icon: MapPin },
            { key: "departments", label: "Departments (5)", icon: Layers },
            { key: "transfers", label: "Assignment History", icon: History },
          ].map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key as typeof tab)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-colors ${
                  active
                    ? "bg-blue-600 text-white font-semibold shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {tab === "entities" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: "Acme Holdings UAE Ltd",
                registration: "FZ-LLC-2021-9921",
                jurisdiction: "United Arab Emirates",
                currency: "AED (د.إ)",
                headcount: 842,
                status: "PRIMARY HOLDING",
              },
              {
                name: "Acme Technologies India Pvt Ltd",
                registration: "U72200KA2022PTC15",
                jurisdiction: "India (Karnataka)",
                currency: "INR (₹)",
                headcount: 326,
                status: "OPERATING SUBSIDIARY",
              },
              {
                name: "Acme Americas Delaware Corp",
                registration: "SR-2023-01994",
                jurisdiction: "United States (Delaware)",
                currency: "USD ($)",
                headcount: 80,
                status: "SUBSIDIARY",
              },
            ].map((ent, i) => (
              <div
                key={i}
                className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
                    {ent.status}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {ent.name}
                  </h4>
                  <p className="text-xs text-zinc-500 font-mono">
                    {ent.registration}
                  </p>
                </div>
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs space-y-1.5 text-zinc-600 dark:text-zinc-400">
                  <div className="flex justify-between">
                    <span>Jurisdiction:</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{ent.jurisdiction}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Base Currency:</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{ent.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Contracts:</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{ent.headcount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "locations" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                city: "Dubai",
                facility: "Dubai Internet City, Building 3",
                timezone: "Asia/Dubai (+04:00)",
                workingWeek: "Monday - Friday (Half day Friday)",
                holidayCalendar: "UAE Statutory Public Calendar 2026",
              },
              {
                city: "Bengaluru",
                facility: "Outer Ring Road Tech Park, Floor 4",
                timezone: "Asia/Kolkata (+05:30)",
                workingWeek: "Monday - Friday",
                holidayCalendar: "India National & Karnataka State 2026",
              },
              {
                city: "New York",
                facility: "Hudson Yards, Suite 1200",
                timezone: "America/New_York (-05:00)",
                workingWeek: "Monday - Friday",
                holidayCalendar: "US Federal Holiday Calendar 2026",
              },
            ].map((loc, i) => (
              <div
                key={i}
                className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs space-y-3"
              >
                <div className="p-2 w-fit rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {loc.city} Facility
                  </h4>
                  <p className="text-xs text-zinc-500">{loc.facility}</p>
                </div>
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs space-y-1.5 text-zinc-600 dark:text-zinc-400">
                  <div className="flex justify-between">
                    <span>Local Timezone:</span>
                    <span className="font-mono text-zinc-900 dark:text-zinc-100">{loc.timezone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Working Week:</span>
                    <span className="text-zinc-900 dark:text-zinc-100">{loc.workingWeek}</span>
                  </div>
                  <div className="pt-1 border-t border-zinc-100 dark:border-zinc-900 text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                    Calendar: {loc.holidayCalendar}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "departments" && (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs divide-y divide-zinc-200 dark:divide-zinc-800">
            {[
              { name: "Engineering & Architecture", head: "Sarah Connor", headcount: 780, costCenter: "CC-ENG-101" },
              { name: "Product Strategy & Design", head: "Daniel Lee", headcount: 140, costCenter: "CC-PRD-201" },
              { name: "People Operations & HR", head: "Alex Morgan", headcount: 45, costCenter: "CC-HRM-301" },
              { name: "Finance & Global Payroll", head: "Aisha Al-Mansoor", headcount: 38, costCenter: "CC-FIN-401" },
              { name: "Legal & Regulatory Compliance", head: "Elena Rostova", headcount: 25, costCenter: "CC-LGL-501" },
            ].map((d, i) => (
              <div key={i} className="p-4 flex items-center justify-between text-xs hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                <div className="space-y-0.5">
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">{d.name}</div>
                  <div className="text-zinc-500">Department Lead: {d.head} • Cost Center: {d.costCenter}</div>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold text-xs">
                  {d.headcount} Members
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === "transfers" && (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50">Effective-Dated Assignment Transfer Ledger</h3>
              <p className="text-xs text-zinc-500">Immutable historical audit trail of employee transfers between entities and locations.</p>
            </div>
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
              {[
                {
                  employee: "Rajesh Kumar (EMP-0102)",
                  date: "2024-01-10",
                  from: "Dubai Internet City (UAE Holding)",
                  to: "Bengaluru Tech Park (UAE Contract / India Location)",
                  reason: "International Remote Relocation Assignment",
                  approvedBy: "Alex Morgan (HR Admin)",
                },
                {
                  employee: "Elena Rostova (EMP-0104)",
                  date: "2023-08-01",
                  from: "Acme Americas Delaware Corp",
                  to: "Acme Holdings UAE Ltd",
                  reason: "Global HQ Promotion to People Ops Lead",
                  approvedBy: "Marcus Vance (VP HR)",
                },
              ].map((t, i) => (
                <div key={i} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{t.employee}</span>
                    <span className="text-[11px] text-zinc-400 font-mono">Effective: {t.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <span className="line-through">{t.from}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">{t.to}</span>
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Reason: {t.reason} • Approved by: {t.approvedBy}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
