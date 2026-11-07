"use client";

import * as React from "react";
import {
  Sparkles,
  ChevronRight,
  Plus,
  Briefcase,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "@/components/ui/toast";

interface JobRequisition {
  id: string;
  code: string;
  title: string;
  department: string;
  legalEntity: string;
  workLocation: string;
  applicantsCount: number;
  status: string;
}

export default function RecruitmentPage() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [stats, setStats] = React.useState({
    activeOpenings: 3,
    candidatesInPipeline: 142,
    interviewsScheduled: 19,
    offersPending: 4,
  });
  const [requisitions, setRequisitions] = React.useState<JobRequisition[]>([
    {
      id: "req-1",
      code: "REQ-0101",
      title: "Senior Cloud Platform Engineer",
      department: "Engineering",
      legalEntity: "Acme Holdings UAE Ltd",
      workLocation: "Dubai or Remote",
      applicantsCount: 48,
      status: "PUBLISHED",
    },
    {
      id: "req-2",
      code: "REQ-0102",
      title: "Frontend Technical Lead (Next.js)",
      department: "Engineering",
      legalEntity: "Acme Technologies India Pvt Ltd",
      workLocation: "Bengaluru Tech Park",
      applicantsCount: 62,
      status: "PUBLISHED",
    },
    {
      id: "req-3",
      code: "REQ-0103",
      title: "People Analytics Specialist",
      department: "Human Resources",
      legalEntity: "Acme Holdings UAE Ltd",
      workLocation: "Dubai Internet City",
      applicantsCount: 32,
      status: "INTERVIEWING",
    },
  ]);

  const [form, setForm] = React.useState({
    title: "",
    department: "Engineering",
    legalEntity: "Acme Holdings UAE Ltd",
    workLocation: "Dubai Internet City",
  });

  React.useEffect(() => {
    async function loadRecruitment() {
      try {
        const res = await fetch("/api/recruitment");
        if (res.ok) {
          const data = await res.json();
          if (data.requisitions && data.requisitions.length > 0) {
            setRequisitions(data.requisitions);
          }
          if (data.stats) {
            setStats(data.stats);
          }
        }
      } catch (err) {
        console.error("Failed to load recruitment data:", err);
      }
    }
    loadRecruitment();
  }, []);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.warning("Title Required", "Please enter a job title.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/recruitment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error("Creation Failed", data.error || "Could not create job requisition.");
        return;
      }

      setRequisitions((prev) => [data.requisition, ...prev]);
      setStats((prev) => ({
        ...prev,
        activeOpenings: prev.activeOpenings + 1,
      }));
      setModalOpen(false);
      setForm({
        title: "",
        department: "Engineering",
        legalEntity: "Acme Holdings UAE Ltd",
        workLocation: "Dubai Internet City",
      });

      toast.success(
        "Job Opening Published",
        `Requisition ${data.requisition.code} for "${data.requisition.title}" was saved to database and published.`
      );
    } catch (err) {
      console.error("Job create error:", err);
      toast.error("Network Error", "Could not reach database API.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#071B2B] dark:text-[#f0f7f9] flex items-center gap-2">
              Recruitment & Applicant Tracking (ATS)
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Manage job requisitions, candidate pipelines, interview scheduling, and AI-assisted screening.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#167D8D] hover:bg-[#126876] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Job Opening</span>
            </button>
          </div>
        </div>

        {/* AI Assistance Notice */}
        <div className="p-4 rounded-xl border border-[#B9E4E8] dark:border-[#163854] bg-[#eaf7f9] dark:bg-[#0a2134] text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-[#167D8D] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-[#071B2B] dark:text-[#B9E4E8]">
              Human-in-the-Loop AI Recruiter Assistance
            </h4>
            <p className="text-zinc-600 dark:text-zinc-400">
              AI extracts skills and summarizes candidate resumes to accelerate recruiter review. The system strictly prohibits autonomous hiring or elimination decisions.
            </p>
          </div>
        </div>

        {/* Pipeline Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs space-y-1">
            <span className="text-xs text-zinc-500">Active Job Openings</span>
            <div className="text-2xl font-bold text-[#071B2B] dark:text-[#f0f7f9]">
              {stats.activeOpenings}
            </div>
            <p className="text-[11px] text-zinc-500">Across 3 entities</p>
          </div>

          <div className="p-5 rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs space-y-1">
            <span className="text-xs text-zinc-500">Candidates in Pipeline</span>
            <div className="text-2xl font-bold text-[#071B2B] dark:text-[#f0f7f9]">
              {stats.candidatesInPipeline}
            </div>
            <p className="text-[11px] text-[#167D8D]">28 new this week</p>
          </div>

          <div className="p-5 rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs space-y-1">
            <span className="text-xs text-zinc-500">Interviews Scheduled</span>
            <div className="text-2xl font-bold text-[#071B2B] dark:text-[#f0f7f9]">
              {stats.interviewsScheduled}
            </div>
            <p className="text-[11px] text-zinc-500">Next 7 days</p>
          </div>

          <div className="p-5 rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs space-y-1">
            <span className="text-xs text-zinc-500">Offers Pending</span>
            <div className="text-2xl font-bold text-[#071B2B] dark:text-[#f0f7f9]">
              {stats.offersPending}
            </div>
            <p className="text-[11px] text-emerald-600">Awaiting candidate sign</p>
          </div>
        </div>

        {/* Job Openings Table */}
        <div className="rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#EEEEEE] dark:border-[#163854] flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#071B2B] dark:text-[#f0f7f9]">
              Active Job Requisitions
            </h3>
            <span className="text-xs text-zinc-500">Live database registry</span>
          </div>

          <div className="divide-y divide-[#EEEEEE] dark:divide-[#163854] text-xs">
            {requisitions.map((job) => (
              <div
                key={job.id}
                className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-[#071B2B] dark:text-[#f0f7f9] text-sm">
                    {job.title}{" "}
                    <span className="text-xs font-mono font-normal text-zinc-400">
                      ({job.code})
                    </span>
                  </div>
                  <div className="text-zinc-500">
                    {job.department} • {job.legalEntity} • {job.workLocation}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    {job.applicantsCount} Applicants
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      job.status === "PUBLISHED"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : job.status === "INTERVIEWING"
                        ? "bg-[#B9E4E8] text-[#071B2B]"
                        : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    }`}
                  >
                    {job.status}
                  </span>
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal: Create Job Opening */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white dark:bg-[#0c263d] rounded-2xl border border-[#EEEEEE] dark:border-[#163854] max-w-lg w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEE] dark:border-[#163854]">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#167D8D]" />
                  <h3 className="font-bold text-[#071B2B] dark:text-[#f0f7f9]">
                    Create Job Opening
                  </h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-semibold">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Senior Backend Engineer (Node.js)"
                    className="w-full px-3 py-2 rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-[#fafafa] dark:bg-[#0a2134] text-[#071B2B] dark:text-[#f0f7f9] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-semibold">
                      Department *
                    </label>
                    <select
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-[#fafafa] dark:bg-[#0a2134] text-[#071B2B] dark:text-[#f0f7f9] focus:outline-none"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Finance & Payroll">Finance & Payroll</option>
                      <option value="Product & Design">Product & Design</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-semibold">
                      Legal Entity *
                    </label>
                    <select
                      value={form.legalEntity}
                      onChange={(e) => setForm({ ...form, legalEntity: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-[#fafafa] dark:bg-[#0a2134] text-[#071B2B] dark:text-[#f0f7f9] focus:outline-none"
                    >
                      <option value="Acme Holdings UAE Ltd">Acme Holdings UAE Ltd</option>
                      <option value="Acme Americas Delaware Corp">Acme Americas Delaware Corp</option>
                      <option value="Acme Technologies India Pvt Ltd">Acme Technologies India Pvt Ltd</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-semibold">
                    Work Location
                  </label>
                  <input
                    type="text"
                    value={form.workLocation}
                    onChange={(e) => setForm({ ...form, workLocation: e.target.value })}
                    placeholder="e.g. Dubai Internet City or Remote"
                    className="w-full px-3 py-2 rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-[#fafafa] dark:bg-[#0a2134] text-[#071B2B] dark:text-[#f0f7f9] focus:outline-none"
                  />
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
                    <span>{submitting ? "Publishing..." : "Publish Job Requisition"}</span>
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
