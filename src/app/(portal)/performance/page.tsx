"use client";

import * as React from "react";
import {
  Award,
  Plus,
  Target,
  X,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { toast } from "@/components/ui/toast";

interface Goal {
  id: string;
  title: string;
  category: string;
  owner: string;
  department: string;
  progress: number;
  targetDate: string;
  status: string;
}

export default function PerformancePage() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [cycle, setCycle] = React.useState({
    name: "Annual Performance Cycle 2026 (H2 Review)",
    phase: "Self-Assessments & Manager Check-ins (Deadline: Dec 15, 2026)",
    status: "CYCLE ACTIVE",
  });
  const [goals, setGoals] = React.useState<Goal[]>([
    {
      id: "goal-1",
      title: "O1: Complete PeopleOS Enterprise Core & Multi-Tenant Isolation",
      category: "COMPANY",
      owner: "Alex Morgan & Architecture Guild",
      department: "Executive & Security",
      progress: 85,
      targetDate: "2026-12-15",
      status: "ON_TRACK",
    },
    {
      id: "goal-2",
      title: "O2: Achieve 98% On-Time Payroll Finalization Across Global Entities",
      category: "DEPARTMENT",
      owner: "Aisha Al-Mansoor (Finance Lead)",
      department: "Finance & Payroll",
      progress: 92,
      targetDate: "2026-11-30",
      status: "ON_TRACK",
    },
    {
      id: "goal-3",
      title: "O3: Launch Cross-Border Decoupled Location & Holiday Calendar Architecture",
      category: "DEPARTMENT",
      owner: "Sarah Connor (Lead Architect)",
      department: "Engineering",
      progress: 100,
      targetDate: "2026-12-31",
      status: "COMPLETED",
    },
  ]);

  const [form, setForm] = React.useState({
    title: "",
    category: "DEPARTMENT",
    owner: "Alex Morgan",
    department: "Engineering",
    targetDate: "2026-12-31",
  });

  React.useEffect(() => {
    async function loadPerformance() {
      try {
        const res = await fetch("/api/performance");
        if (res.ok) {
          const data = await res.json();
          if (data.goals && data.goals.length > 0) {
            setGoals(data.goals);
          }
          if (data.cycle) {
            setCycle({
              name: data.cycle.name,
              phase: data.cycle.phase,
              status: "CYCLE ACTIVE",
            });
          }
        }
      } catch (err) {
        console.error("Failed to load performance data:", err);
      }
    }
    loadPerformance();
  }, []);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.warning("Title Required", "Please enter a strategic goal objective.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error("Creation Failed", data.error || "Could not define goal.");
        return;
      }

      setGoals((prev) => [data.goal, ...prev]);
      setModalOpen(false);
      setForm({
        title: "",
        category: "DEPARTMENT",
        owner: "Alex Morgan",
        department: "Engineering",
        targetDate: "2026-12-31",
      });

      toast.success(
        "Goal Defined",
        `OKR "${data.goal.title}" saved to database and linked to review cycle.`
      );
    } catch (err) {
      console.error("Goal create error:", err);
      toast.error("Network Error", "Could not reach database API.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleProgressBoost = async (id: string, current: number) => {
    const nextProgress = Math.min(100, current + 10);
    const nextStatus = nextProgress >= 100 ? "COMPLETED" : "ON_TRACK";

    setGoals((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, progress: nextProgress, status: nextStatus } : g
      )
    );

    try {
      const res = await fetch("/api/performance", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, progress: nextProgress, status: nextStatus }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error("Update Failed", data.error || "Could not update progress.");
        return;
      }

      toast.success(
        "Progress Updated",
        `Goal progress updated to ${nextProgress}% in database.`
      );
    } catch (err) {
      console.error("Boost progress error:", err);
      toast.error("Network Error", "Could not reach database API.");
    }
  };

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
              onClick={() => setModalOpen(true)}
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
                {cycle.name}
              </div>
              <div className="text-[11px] text-zinc-500">
                {cycle.phase}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#B9E4E8] text-[#071B2B]">
              {cycle.status}
            </span>
          </div>
        </div>

        {/* Company & Department OKRs */}
        <div className="rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#071B2B] dark:text-[#f0f7f9]">
              Active Strategic Objectives & Key Results (Live DB)
            </h3>
            <span className="text-xs text-zinc-500">
              {goals.length} Strategic Goals
            </span>
          </div>

          <div className="space-y-4">
            {goals.map((okr) => (
              <div
                key={okr.id}
                className="p-4 rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-zinc-50/50 dark:bg-zinc-900/40 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="font-semibold text-[#071B2B] dark:text-[#f0f7f9] text-sm">
                    {okr.title}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleProgressBoost(okr.id, okr.progress)}
                      title="Update progress +10%"
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#167D8D] text-white hover:bg-[#126876] transition-colors"
                    >
                      <TrendingUp className="w-3 h-3" /> +10%
                    </button>
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
                </div>

                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#167D8D] h-full rounded-full transition-all"
                    style={{ width: `${okr.progress}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-zinc-500">
                  <span>
                    Owner: {okr.owner} • Dept: {okr.department} • Target: {okr.targetDate}
                  </span>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    {okr.progress}% achieved
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal: Define Goal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white dark:bg-[#0c263d] rounded-2xl border border-[#EEEEEE] dark:border-[#163854] max-w-lg w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEE] dark:border-[#163854]">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#167D8D]" />
                  <h3 className="font-bold text-[#071B2B] dark:text-[#f0f7f9]">
                    Define Strategic Goal / OKR
                  </h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateGoal} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-semibold">
                    Objective Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. O4: Automate Multi-Tenant Bank SIF Payment Pipeline"
                    className="w-full px-3 py-2 rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-[#fafafa] dark:bg-[#0a2134] text-[#071B2B] dark:text-[#f0f7f9] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-semibold">
                      Category
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-[#fafafa] dark:bg-[#0a2134] text-[#071B2B] dark:text-[#f0f7f9] focus:outline-none"
                    >
                      <option value="COMPANY">Company Strategic</option>
                      <option value="DEPARTMENT">Departmental OKR</option>
                      <option value="INDIVIDUAL">Individual Goal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-semibold">
                      Department
                    </label>
                    <select
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-[#fafafa] dark:bg-[#0a2134] text-[#071B2B] dark:text-[#f0f7f9] focus:outline-none"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Finance & Payroll">Finance & Payroll</option>
                      <option value="Executive & Security">Executive & Security</option>
                      <option value="People Operations">People Operations</option>
                      <option value="Product & Design">Product & Design</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-semibold">
                      Owner
                    </label>
                    <input
                      type="text"
                      value={form.owner}
                      onChange={(e) => setForm({ ...form, owner: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-[#fafafa] dark:bg-[#0a2134] text-[#071B2B] dark:text-[#f0f7f9] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-semibold">
                      Target Date
                    </label>
                    <input
                      type="date"
                      value={form.targetDate}
                      onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-[#fafafa] dark:bg-[#0a2134] text-[#071B2B] dark:text-[#f0f7f9] focus:outline-none"
                    />
                  </div>
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
                    <span>{submitting ? "Saving..." : "Commit Goal to Review Cycle"}</span>
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
