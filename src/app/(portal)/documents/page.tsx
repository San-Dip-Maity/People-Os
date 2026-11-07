"use client";

import * as React from "react";
import {
  FileText,
  Upload,
  Download,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { toast } from "@/components/ui/toast";

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
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#071B2B] dark:text-[#f0f7f9] flex items-center gap-2">
              Document Management & Private Vault
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Private object storage, signed download URLs, and document expiry tracking.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toast.info("Vault Upload", "Secure signed document upload modal initialized.")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#167D8D] hover:bg-[#126876] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          </div>
        </div>

        {/* Private S3 Security Callout */}
        <div className="p-4 rounded-xl border border-[#B9E4E8] dark:border-[#163854] bg-[#eaf7f9] dark:bg-[#0a2134] text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-[#167D8D] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-[#071B2B] dark:text-[#B9E4E8]">
              Private Object Storage & Ephemeral Signed URLs
            </h4>
            <p className="text-zinc-600 dark:text-zinc-400">
              Documents are never exposed via public web links. All downloads generate temporary cryptographic signed URLs (15-minute expiration) with strict tenant and permission validation.
            </p>
          </div>
        </div>

        {/* Documents Table */}
        <div className="rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#EEEEEE] dark:border-[#163854] flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#071B2B] dark:text-[#f0f7f9]">
              Document Repository ({docs.length} items)
            </h3>
            <span className="text-xs text-zinc-500">
              Private Storage Encrypted (AES-256)
            </span>
          </div>

          <div className="divide-y divide-[#EEEEEE] dark:divide-[#163854] text-xs">
            {docs.map((doc, i) => {
              const isExpiring = doc.expires.includes("2026-11");
              return (
                <div
                  key={i}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-[#eaf7f9] dark:bg-[#12334f] text-[#167D8D] dark:text-[#B9E4E8] shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#071B2B] dark:text-[#f0f7f9] text-sm">
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
                      onClick={() => toast.success("Signed URL Generated", `Ephemeral download link created for ${doc.title} (expires in 15 mins).`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EEEEEE] dark:border-[#163854] hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-medium transition-colors"
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
    </>
  );
}
