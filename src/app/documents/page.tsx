"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import {
  FileText,
  Upload,
  Download,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

export default function DocumentsPage() {
  const docs = [
    {
      title: "Global Employee Code of Conduct 2026",
      category: "Policies & Handbooks",
      size: "2.4 MB PDF",
      updated: "2026-01-01",
      expires: "2027-01-01",
      scope: "All Employees",
    },
    {
      title: "Cross-Border Holiday Calendar Protocol",
      category: "Policies & Handbooks",
      size: "840 KB PDF",
      updated: "2026-02-15",
      expires: "None",
      scope: "UAE & India Entities",
    },
    {
      title: "Standard Employment Agreement (UAE)",
      category: "Contracts & Letters",
      size: "1.1 MB PDF",
      updated: "2026-03-10",
      expires: "Permanent",
      scope: "Acme Holdings UAE",
    },
    {
      title: "Executive Residence Visa Copy — Sarah Connor",
      category: "IDs & Compliance",
      size: "520 KB PDF",
      updated: "2024-05-10",
      expires: "2026-11-28", // Expiring soon!
      scope: "Confidential HR",
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              Document Management & Private Vault
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Private object storage, signed download URLs, and document expiry tracking.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Upload document file with signed encryption")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          </div>
        </div>

        {/* Private S3 Security Callout */}
        <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/20 text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-blue-900 dark:text-blue-200">
              Private Object Storage & Ephemeral Signed URLs
            </h4>
            <p className="text-zinc-600 dark:text-zinc-400">
              Documents are never exposed via public web links. All downloads generate temporary cryptographic signed URLs (15-minute expiration) with strict tenant and permission validation.
            </p>
          </div>
        </div>

        {/* Documents Table */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50">
              Document Repository ({docs.length} items)
            </h3>
            <span className="text-xs text-zinc-500">
              Private Storage Encrypted (AES-256)
            </span>
          </div>

          <div className="divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
            {docs.map((doc, i) => {
              const isExpiring = doc.expires.includes("2026-11");
              return (
                <div
                  key={i}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                        {doc.title}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        {doc.category} • {doc.size} • Scope: {doc.scope}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    {isExpiring && (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                        <AlertTriangle className="w-3 h-3" /> Expiring: {doc.expires}
                      </span>
                    )}

                    <button
                      onClick={() => alert(`Generating ephemeral signed URL for: ${doc.title}`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-medium transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
