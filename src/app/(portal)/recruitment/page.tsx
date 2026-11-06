"use client";

import * as React from "react";
import {
  Sparkles,
  ChevronRight,
  Plus,
} from "lucide-react";

export default function RecruitmentPage() {
  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              Recruitment & Applicant Tracking (ATS)
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Manage job requisitions, candidate pipelines, interview scheduling, and AI-assisted screening.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Open New Job Opening requisition form")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Job Opening</span>
            </button>
          </div>
        </div>

        {/* AI Assistance Notice */}
        <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/20 text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-blue-900 dark:text-blue-200">
              Human-in-the-Loop AI Recruiter Assistance
            </h4>
            <p className="text-zinc-600 dark:text-zinc-400">
              AI extracts skills and summarizes candidate resumes to accelerate recruiter review. The system strictly prohibits autonomous hiring or elimination decisions.
            </p>
          </div>
        </div>

        {/* Pipeline Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs space-y-1">
            <span className="text-xs text-zinc-500">Active Job Openings</span>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">8</div>
            <p className="text-[11px] text-zinc-500">Across 3 entities</p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs space-y-1">
            <span className="text-xs text-zinc-500">Candidates in Pipeline</span>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">142</div>
            <p className="text-[11px] text-blue-600">28 new this week</p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs space-y-1">
            <span className="text-xs text-zinc-500">Interviews Scheduled</span>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">19</div>
            <p className="text-[11px] text-zinc-500">Next 7 days</p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs space-y-1">
            <span className="text-xs text-zinc-500">Offers Pending</span>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">4</div>
            <p className="text-[11px] text-emerald-600">Awaiting candidate sign</p>
          </div>
        </div>

        {/* Job Openings Table */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50">
              Active Job Requisitions
            </h3>
            <span className="text-xs text-zinc-500">Updated today</span>
          </div>

          <div className="divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
            {[
              {
                title: "Senior Cloud Platform Engineer",
                dept: "Engineering",
                entity: "Acme Holdings UAE Ltd",
                location: "Dubai or Remote",
                applicants: 48,
                status: "PUBLISHED",
              },
              {
                title: "Frontend Technical Lead (Next.js)",
                dept: "Engineering",
                entity: "Acme Technologies India Pvt Ltd",
                location: "Bengaluru Tech Park",
                applicants: 62,
                status: "PUBLISHED",
              },
              {
                title: "People Analytics Specialist",
                dept: "Human Resources",
                entity: "Acme Holdings UAE Ltd",
                location: "Dubai Internet City",
                applicants: 32,
                status: "INTERVIEWING",
              },
            ].map((job, i) => (
              <div
                key={i}
                className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                    {job.title}
                  </div>
                  <div className="text-zinc-500">
                    {job.dept} • {job.entity} • {job.location}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    {job.applicants} Applicants
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    {job.status}
                  </span>
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
