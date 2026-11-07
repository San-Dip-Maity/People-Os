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

interface OrgData {
  entities: Array<{
    id: string;
    name: string;
    jurisdiction: string;
    regNumber: string;
    currency: string;
    employeesCount: number;
  }>;
  locations: Array<{
    id: string;
    name: string;
    address: string;
    timezone: string;
    calendar: string;
  }>;
  departments: Array<{
    name: string;
    lead: string;
    count: number;
  }>;
  transfers: Array<{
    id: string;
    employee: string;
    from: string;
    to: string;
    legalEntity: string;
    effectiveDate: string;
    calendarChange: string;
    status: string;
  }>;
}

export default function OrganizationPage() {
  const [tab, setTab] = React.useState<"entities" | "locations" | "departments" | "transfers">("entities");
  const [orgData, setOrgData] = React.useState<OrgData | null>(null);

  React.useEffect(() => {
    async function loadOrg() {
      try {
        const res = await fetch("/api/organization");
        if (res.ok) {
          const data = await res.json();
          setOrgData(data);
        }
      } catch (err) {
        console.error("Failed to load organization data:", err);
      }
    }
    loadOrg();
  }, []);

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#071B2B] dark:text-[#f0f7f9] flex items-center gap-2">
              Organization Structure & Entity Governance
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Multi-entity hierarchy, physical work locations, and decoupled assignment rules.
            </p>
          </div>
        </div>

        {/* Critical Business Rule Banner */}
        <div className="p-4 rounded-xl border border-[#B9E4E8] dark:border-[#163854] bg-[#eaf7f9] dark:bg-[#0a2134] text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-[#167D8D] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-[#071B2B] dark:text-[#B9E4E8]">
              Architectural Invariant: Legal Entity vs. Work Location Decoupling
            </h4>
            <p className="text-zinc-600 dark:text-zinc-400">
              In PeopleOS, an employee may be employed by a UAE legal entity but operate from India.
              The legal entity governs contracts, currency, and liability, while physical work location governs attendance, shifts, and holiday calendars with explicit effective dates.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-[#EEEEEE] dark:border-[#163854] pb-2 text-xs font-medium">
          {[
            { key: "entities", label: `Legal Entities (${orgData?.entities?.length || 3})`, icon: Building2 },
            { key: "locations", label: `Work Locations (${orgData?.locations?.length || 3})`, icon: MapPin },
            { key: "departments", label: `Departments (${orgData?.departments?.length || 5})`, icon: Layers },
            { key: "transfers", label: `Assignment History (${orgData?.transfers?.length || 2})`, icon: History },
          ].map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key as typeof tab)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-colors ${
                  active
                    ? "bg-[#167D8D] text-white font-semibold shadow-xs"
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
                className="p-5 rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-[#eaf7f9] dark:bg-[#12334f] text-[#167D8D] dark:text-[#B9E4E8]">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
                    {ent.status}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#071B2B] dark:text-[#f0f7f9]">
                    {ent.name}
                  </h4>
                  <p className="text-xs text-zinc-500 font-mono">
                    {ent.registration}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#EEEEEE] dark:border-[#163854] text-xs space-y-1.5 text-zinc-600 dark:text-zinc-400">
                  <div className="flex justify-between">
                    <span>Jurisdiction:</span>
                    <span className="font-medium text-[#071B2B] dark:text-[#f0f7f9]">{ent.jurisdiction}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Base Currency:</span>
                    <span className="font-medium text-[#071B2B] dark:text-[#f0f7f9]">{ent.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Contracts:</span>
                    <span className="font-semibold text-[#167D8D] dark:text-[#B9E4E8]">{ent.headcount}</span>
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
                className="p-5 rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs space-y-3"
              >
                <div className="p-2 w-fit rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#071B2B] dark:text-[#f0f7f9]">
                    {loc.city} Facility
                  </h4>
                  <p className="text-xs text-zinc-500">{loc.facility}</p>
                </div>
                <div className="pt-2 border-t border-[#EEEEEE] dark:border-[#163854] text-xs space-y-1.5 text-zinc-600 dark:text-zinc-400">
                  <div className="flex justify-between">
                    <span>Local Timezone:</span>
                    <span className="font-mono text-[#071B2B] dark:text-[#f0f7f9]">{loc.timezone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Working Week:</span>
                    <span className="text-[#071B2B] dark:text-[#f0f7f9]">{loc.workingWeek}</span>
                  </div>
                  <div className="pt-1 border-t border-[#EEEEEE] dark:border-[#163854] text-[11px] text-[#167D8D] dark:text-[#B9E4E8] font-medium">
                    Calendar: {loc.holidayCalendar}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "departments" && (
          <div className="rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs divide-y divide-[#EEEEEE] dark:divide-[#163854]">
            {[
              { name: "Engineering & Architecture", head: "Sarah Connor", headcount: 780, costCenter: "CC-ENG-101" },
              { name: "Product Strategy & Design", head: "Daniel Lee", headcount: 140, costCenter: "CC-PRD-201" },
              { name: "People Operations & HR", head: "Alex Morgan", headcount: 45, costCenter: "CC-HRM-301" },
              { name: "Finance & Global Payroll", head: "Aisha Al-Mansoor", headcount: 38, costCenter: "CC-FIN-401" },
              { name: "Legal & Regulatory Compliance", head: "Elena Rostova", headcount: 25, costCenter: "CC-LGL-501" },
            ].map((d, i) => (
              <div key={i} className="p-4 flex items-center justify-between text-xs hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                <div className="space-y-0.5">
                  <div className="font-semibold text-[#071B2B] dark:text-[#f0f7f9] text-sm">{d.name}</div>
                  <div className="text-zinc-500">Department Lead: {d.head} • Cost Center: {d.costCenter}</div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#eaf7f9] dark:bg-[#12334f] text-[#071B2B] dark:text-[#B9E4E8] font-semibold text-xs">
                  {d.headcount} Members
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === "transfers" && (
          <div className="rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#EEEEEE] dark:border-[#163854]">
              <h3 className="font-bold text-sm text-[#071B2B] dark:text-[#f0f7f9]">Effective-Dated Assignment Transfer Ledger</h3>
              <p className="text-xs text-zinc-500">Immutable historical audit trail of employee transfers between entities and locations.</p>
            </div>
            <div className="divide-y divide-[#EEEEEE] dark:divide-[#163854] text-xs">
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
                    <span className="font-semibold text-[#071B2B] dark:text-[#f0f7f9]">{t.employee}</span>
                    <span className="text-[11px] text-zinc-400 font-mono">Effective: {t.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <span className="line-through">{t.from}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#167D8D] shrink-0" />
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
