"use client";

import * as React from "react";
import {
  Building,
  Shield,
  Save,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { toast } from "@/components/ui/toast";

export default function SettingsPage() {
  const [saved, setSaved] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [tenantName, setTenantName] = React.useState("Acme Global Technologies (HQ)");
  const [hq, setHq] = React.useState("Dubai Internet City, UAE");
  const [currency, setCurrency] = React.useState("USD");

  React.useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.tenant) {
            setTenantName(data.tenant.name);
            if (data.tenant.settings?.currency) {
              setCurrency(data.tenant.settings.currency);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: tenantName,
          currency,
          timezone: "Asia/Dubai",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error("Save Failed", data.error || "Failed to persist tenant settings to database.");
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      toast.success(
        "Tenant Settings Saved",
        "Tenant identity and organization preferences committed to database successfully."
      );
    } catch (err) {
      console.error("Settings save error:", err);
      toast.error("Network Error", "Could not reach database.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="title-page text-[#071B2B] dark:text-[#f0f7f9] flex items-center gap-2">
              Tenant Settings & Access Control
            </h1>
            <p className="text-supporting text-zinc-500 dark:text-zinc-400">
              Manage organization preferences, tenant isolation policies, and RBAC matrix.
            </p>
          </div>
        </div>

        {saved && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Tenant configurations saved to database successfully.
          </div>
        )}

        {/* Settings Form */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* General Tenant Settings */}
          <div className="p-6 rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs space-y-4">
            <h3 className="heading-card text-[#071B2B] dark:text-[#f0f7f9] flex items-center gap-2">
              <Building className="w-4 h-4 text-[#167D8D]" />
              Tenant Identity & Localization
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-label block text-zinc-600 dark:text-zinc-400 mb-1">
                  Tenant Organization Name
                </label>
                <input
                  type="text"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-[#fafafa] dark:bg-[#0a2134] text-[#071B2B] dark:text-[#f0f7f9] focus:outline-none focus:ring-2 focus:ring-[#167D8D]/20 focus:border-[#167D8D]"
                />
              </div>

              <div>
                <label className="text-label block text-zinc-600 dark:text-zinc-400 mb-1">
                  Tenant Domain Slug
                </label>
                <input
                  type="text"
                  disabled
                  defaultValue="acme-global"
                  className="w-full px-3 py-2 rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-zinc-100 dark:bg-zinc-900 text-zinc-500 font-mono focus:outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-label block text-zinc-600 dark:text-zinc-400 mb-1">
                  Primary Headquarters
                </label>
                <input
                  type="text"
                  value={hq}
                  onChange={(e) => setHq(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-[#fafafa] dark:bg-[#0a2134] text-[#071B2B] dark:text-[#f0f7f9] focus:outline-none focus:ring-2 focus:ring-[#167D8D]/20 focus:border-[#167D8D]"
                />
              </div>

              <div>
                <label className="text-label block text-zinc-600 dark:text-zinc-400 mb-1">
                  Default Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-[#fafafa] dark:bg-[#0a2134] text-[#071B2B] dark:text-[#f0f7f9] focus:outline-none"
                >
                  <option value="USD">USD — US Dollar</option>
                  <option value="AED">AED — United Arab Emirates Dirham</option>
                  <option value="INR">INR — Indian Rupee</option>
                  <option value="EUR">EUR — Euro</option>
                </select>
              </div>
            </div>
          </div>

          {/* Granular RBAC Preview */}
          <div className="p-6 rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs space-y-4">
            <h3 className="heading-card text-[#071B2B] dark:text-[#f0f7f9] flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              Role-Based Access Control (RBAC) Hierarchy
            </h3>

            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              Configured roles and data-level scope boundary for this tenant:
            </div>

            <div className="divide-y divide-[#EEEEEE] dark:divide-[#163854] text-xs">
              {[
                { role: "Super Admin", scope: "Platform-wide", access: "Full system configuration & tenant management" },
                { role: "Organization Admin", scope: "Entire Organization", access: "Entity policies, workflow templates, user permissions" },
                { role: "HR Administrator / Manager", scope: "Assigned Entities", access: "Employee records, leave approvals, payroll review" },
                { role: "Department Manager", scope: "Direct Reports & Dept", access: "Approve team leaves, timesheets, performance reviews" },
                { role: "Employee", scope: "Own Records (Self)", access: "Profile view, leave apply, clock in/out, payslips" },
              ].map((r, i) => (
                <div key={i} className="py-2.5 flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-[#071B2B] dark:text-[#f0f7f9]">{r.role}</div>
                    <div className="text-[11px] text-zinc-500">{r.access}</div>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold bg-[#B9E4E8] text-[#071B2B] shrink-0">
                    {r.scope}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-1.5" />
                  <span>Save Tenant Preferences</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
