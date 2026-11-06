"use client";

import * as React from "react";
import {
  Award,
  Plus,
} from "lucide-react";

export default function PerformancePage() {
  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#071B2B] dark:text-[#f0f7f9] flex items-center gap-2">
              Performance Management & OKRs
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Align organizational goals, track key results, and conduct continuous feedback reviews.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Open New OKR Goal form")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#167D8D] hover:bg-[#126876] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Define New Goal / OKR</span>
            </button>
          </div>
        </div>

        {/* Current Review Cycle Banner */}
        <div className="p-4 rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#071B2B] dark:text-[#f0f7f9]">
                Annual Performance Cycle 2026 (H2 Review)
              </div>
              <div className="text-[11px] text-zinc-500">
                Phase: Self-Assessments & Manager Check-ins (Deadline: Dec 15, 2026)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#B9E4E8] text-[#071B2B]">
              CYCLE ACTIVE
            </span>
          </div>
        </div>

        {/* Company & Department OKRs */}
        <div className="rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs p-5 space-y-4">
          <h3 className="font-bold text-sm text-[#071B2B] dark:text-[#f0f7f9]">
            Active Strategic Objectives & Key Results (Q4 2026)
          </h3>

          <div className="space-y-4">
            {[
              {
                title: "O1: Complete PeopleOS Enterprise Core & Multi-Tenant Isolation",
                progress: 85,
                owner: "Alex Morgan & Architecture Guild",
                status: "ON TRACK",
              },
              {
                title: "O2: Achieve 98% On-Time Payroll Finalization Across Global Entities",
                progress: 92,
                owner: "Aisha Al-Mansoor (Finance Lead)",
                status: "EXCEEDING",
              },
              {
                title: "O3: Launch Cross-Border Decoupled Location & Holiday Calendar Architecture",
                progress: 100,
                owner: "Sarah Connor (Lead Architect)",
                status: "COMPLETED",
              },
            ].map((okr, i) => (
              <div
                key={i}
                className="p-4 rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-zinc-50/50 dark:bg-zinc-900/40 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="font-semibold text-[#071B2B] dark:text-[#f0f7f9]">
                    {okr.title}
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      okr.progress === 100
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-[#B9E4E8] text-[#071B2B]"
                    }`}
                  >
                    {okr.status}
                  </span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#167D8D] h-full rounded-full transition-all"
                    style={{ width: `${okr.progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-zinc-500">
                  <span>Owner: {okr.owner}</span>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    {okr.progress}% achieved
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
