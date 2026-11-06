"use client";

import * as React from "react";
import {
  Lock,
  Download,
  ShieldCheck,
} from "lucide-react";

export default function PayrollPage() {
  const [locked, setLocked] = React.useState(false);

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#071B2B] dark:text-[#f0f7f9] flex items-center gap-2">
              Payroll & Compensation Engine
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Deterministic, decimal-safe compensation calculations with localized statutory deductions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLocked(!locked)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors ${
                locked
                  ? "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{locked ? "Unlock For Revisions" : "Lock & Finalize Run"}</span>
            </button>
            <button
              onClick={() => alert("Downloading bank payment batch file (WPS / ISO 20022 XML)")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#EEEEEE] dark:border-[#163854] hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Bank File</span>
            </button>
          </div>
        </div>

        {/* Audit Callout Banner */}
        <div className="p-4 rounded-xl border border-[#B9E4E8] dark:border-[#163854] bg-[#eaf7f9] dark:bg-[#0a2134] text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-[#167D8D] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-[#071B2B] dark:text-[#B9E4E8]">
              Deterministic & Decimal-Safe Compensation Guarantee
            </h4>
            <p className="text-zinc-600 dark:text-zinc-400">
              Calculations are computed without floating-point inaccuracies using localized statutory rules (UAE WPS / Gratuity, India PF & ESI, US FICA & State Tax). Finalized payroll runs are strictly immutable.
            </p>
          </div>
        </div>

        {/* Cycle Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs space-y-1">
            <span className="text-xs text-zinc-500">Gross Payroll Amount</span>
            <div className="text-2xl font-bold text-[#071B2B] dark:text-[#f0f7f9]">
              $1,428,500.00
            </div>
            <p className="text-[11px] text-zinc-500">Across 1,248 active employees</p>
          </div>

          <div className="p-5 rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs space-y-1">
            <span className="text-xs text-zinc-500">Statutory Deductions</span>
            <div className="text-2xl font-bold text-[#071B2B] dark:text-[#f0f7f9]">
              $142,320.50
            </div>
            <p className="text-[11px] text-zinc-500">Tax, PF, Social Security</p>
          </div>

          <div className="p-5 rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs space-y-1">
            <span className="text-xs text-zinc-500">Net Disbursements</span>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              $1,286,179.50
            </div>
            <p className="text-[11px] text-emerald-600">Calculated to 4 decimal places</p>
          </div>

          <div className="p-5 rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs space-y-1">
            <span className="text-xs text-zinc-500">Cycle Status</span>
            <div className="text-2xl font-bold text-[#071B2B] dark:text-[#f0f7f9]">
              {locked ? "FINALIZED" : "PREVIEW"}
            </div>
            <p className="text-[11px] text-[#167D8D]">November 2026 Run</p>
          </div>
        </div>

        {/* Employee Compensation Breakdown Table */}
        <div className="rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#EEEEEE] dark:border-[#163854] flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#071B2B] dark:text-[#f0f7f9]">
              Employee Compensation Roll
            </h3>
            <span className="text-xs text-zinc-500">
              Entity: All Subsidiaries
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafafa] dark:bg-[#0a2134] border-b border-[#EEEEEE] dark:border-[#163854] text-zinc-500 uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3">Employee</th>
                  <th className="px-5 py-3">Legal Entity</th>
                  <th className="px-5 py-3">Currency</th>
                  <th className="px-5 py-3">Base Salary</th>
                  <th className="px-5 py-3">Allowances</th>
                  <th className="px-5 py-3">Deductions</th>
                  <th className="px-5 py-3 text-right">Net Payable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEEEEE] dark:divide-[#163854]">
                {[
                  {
                    name: "Sarah Connor (EMP-0101)",
                    entity: "Acme Holdings UAE Ltd",
                    currency: "AED",
                    base: "28,000.00",
                    allowances: "4,500.00",
                    deductions: "0.00",
                    net: "32,500.00",
                  },
                  {
                    name: "Rajesh Kumar (EMP-0102)",
                    entity: "Acme Holdings UAE Ltd",
                    currency: "AED",
                    base: "18,500.00",
                    allowances: "2,200.00",
                    deductions: "0.00",
                    net: "20,700.00",
                  },
                  {
                    name: "Daniel Lee (EMP-0103)",
                    entity: "Acme Americas Corp",
                    currency: "USD",
                    base: "12,500.00",
                    allowances: "1,000.00",
                    deductions: "2,850.00",
                    net: "10,650.00",
                  },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                    <td className="px-5 py-3.5 font-semibold text-[#071B2B] dark:text-[#f0f7f9]">
                      {row.name}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-600 dark:text-zinc-400">
                      {row.entity}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-zinc-500">
                      {row.currency}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[#071B2B] dark:text-[#f0f7f9]">
                      {row.base}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-emerald-600">
                      +{row.allowances}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-red-600">
                      -{row.deductions}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-bold text-[#071B2B] dark:text-[#f0f7f9]">
                      {row.currency} {row.net}
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
