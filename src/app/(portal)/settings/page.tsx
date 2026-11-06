"use client";

import * as React from "react";
import {
  Building,
  Shield,
  Save,
  CheckCircle2,
} from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              Tenant Settings & Access Control
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Manage organization preferences, tenant isolation policies, and RBAC matrix.
            </p>
          </div>
        </div>

        {saved && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Tenant configurations saved successfully.
          </div>
        )}

        {/* Settings Form */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* General Tenant Settings */}
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" />
              Tenant Identity & Localization
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                  Tenant Organization Name
                </label>
                <input
                  type="text"
                  defaultValue="Acme Technologies Global"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                  Tenant Domain Slug
                </label>
                <input
                  type="text"
                  disabled
                  defaultValue="acme-global"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 font-mono focus:outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                  Primary Headquarters
                </label>
                <input
                  type="text"
                  defaultValue="Dubai Internet City, UAE"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                  Default Currency
                </label>
                <select className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none">
                  <option>AED — United Arab Emirates Dirham</option>
                  <option>USD — US Dollar</option>
                  <option>INR — Indian Rupee</option>
                </select>
              </div>
            </div>
          </div>

          {/* Granular RBAC Preview */}
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              Role-Based Access Control (RBAC) Hierarchy
            </h3>

            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              Configured roles and data-level scope boundary for this tenant:
            </div>

            <div className="divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
              {[
                { role: "Super Admin", scope: "Platform-wide", access: "Full system configuration & tenant management" },
                { role: "Organization Admin", scope: "Entire Organization", access: "Entity policies, workflow templates, user permissions" },
                { role: "HR Administrator / Manager", scope: "Assigned Entities", access: "Employee records, leave approvals, payroll review" },
                { role: "Department Manager", scope: "Direct Reports & Dept", access: "Approve team leaves, timesheets, performance reviews" },
                { role: "Employee", scope: "Own Records (Self)", access: "Profile view, leave apply, clock in/out, payslips" },
              ].map((r, i) => (
                <div key={i} className="py-2.5 flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">{r.role}</div>
                    <div className="text-[11px] text-zinc-500">{r.access}</div>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 shrink-0">
                    {r.scope}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Tenant Preferences</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
