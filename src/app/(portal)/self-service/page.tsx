"use client";

import * as React from "react";
import {
  Calendar,
  DollarSign,
  FileText,
  Plane,
  Download,
  CheckCircle2,
  Send,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function SelfServicePage() {
  const [hrRequestOpen, setHrRequestOpen] = React.useState(false);
  const [requestText, setRequestText] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestText.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRequestText("");
      setHrRequestOpen(false);
    }, 1500);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#071B2B] dark:text-[#f0f7f9] flex items-center gap-2">
              Employee Self-Service (ESS)
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Manage your personal HR requests, time off, entitlements, and tax documents.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHrRequestOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#167D8D] hover:bg-[#126876] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit HR Request</span>
            </button>
          </div>
        </div>

        {/* Profile Summary Card */}
        <div className="p-6 rounded-2xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-[#167D8D] text-white font-bold text-2xl flex items-center justify-center shrink-0 shadow-md">
            AM
          </div>
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div>
              <h3 className="font-bold text-lg text-[#071B2B] dark:text-[#f0f7f9]">
                Alex Morgan
              </h3>
              <p className="text-xs text-zinc-500">
                People Operations Lead • Acme Holdings UAE Ltd
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs text-zinc-600 dark:text-zinc-400">
              <span className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900">
                ID: EMP-0001
              </span>
              <span className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900">
                Dubai Internet City
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                Permanent Full-Time
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <Link
              href="/leave"
              className="px-4 py-2 rounded-lg bg-[#eaf7f9] dark:bg-[#12334f] text-[#167D8D] dark:text-[#B9E4E8] font-semibold text-xs text-center hover:bg-[#B9E4E8]/40 transition-colors"
            >
              Apply For Leave
            </Link>
          </div>
        </div>

        {/* Balance Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Annual Leave</span>
              <Calendar className="w-4 h-4 text-[#167D8D]" />
            </div>
            <div className="text-2xl font-bold text-[#071B2B] dark:text-[#f0f7f9]">
              18.5 <span className="text-xs font-normal text-zinc-500">Days</span>
            </div>
            <p className="text-[11px] text-zinc-500">Accrues 2.08 days / month</p>
          </div>

          <div className="p-5 rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Sick Leave</span>
              <AlertCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-[#071B2B] dark:text-[#f0f7f9]">
              12.0 <span className="text-xs font-normal text-zinc-500">Days</span>
            </div>
            <p className="text-[11px] text-zinc-500">Full statutory coverage</p>
          </div>

          <div className="p-5 rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Air Ticket Entitlement</span>
              <Plane className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-[#071B2B] dark:text-[#f0f7f9]">
              1 <span className="text-xs font-normal text-zinc-500">Ticket</span>
            </div>
            <p className="text-[11px] text-zinc-500">Service milestone earned (1 Yr)</p>
          </div>

          <div className="p-5 rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Latest Payslip</span>
              <DollarSign className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-[#071B2B] dark:text-[#f0f7f9]">
              Oct 2026
            </div>
            <p className="text-[11px] text-zinc-500">Finalized & Credited</p>
          </div>
        </div>

        {/* Quick Documents & Payslip Download */}
        <div className="rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#071B2B] dark:text-[#f0f7f9]">
              Personal Employment Documents & Payslips
            </h3>
            <Link href="/documents" className="text-xs text-[#167D8D] hover:underline">
              View All Documents
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { title: "October 2026 Payslip", size: "184 KB PDF", date: "2026-10-31" },
              { title: "Employment Contract (UAE)", size: "1.2 MB PDF", date: "2023-04-15" },
              { title: "Health Insurance Card 2026", size: "420 KB PDF", date: "2026-01-01" },
            ].map((doc, i) => (
              <div
                key={i}
                className="p-3 rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-zinc-50/50 dark:bg-zinc-900/40 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#167D8D]" />
                  <div>
                    <div className="text-xs font-medium text-[#071B2B] dark:text-[#f0f7f9]">
                      {doc.title}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      {doc.size} • {doc.date}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => alert(`Downloading secure copy of ${doc.title}`)}
                  className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                  title="Download file"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit HR Request Modal */}
        {hrRequestOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setHrRequestOpen(false)}
            />
            <div className="relative w-full max-w-md bg-white dark:bg-[#0c263d] rounded-2xl shadow-2xl border border-[#EEEEEE] dark:border-[#163854] p-6 space-y-4 z-10">
              <h3 className="font-bold text-sm text-[#071B2B] dark:text-[#f0f7f9]">
                Submit HR Inquiry / Request
              </h3>
              {submitted ? (
                <div className="p-6 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <p className="text-xs font-semibold text-[#071B2B] dark:text-[#f0f7f9]">
                    Request Submitted Successfully!
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Your HR ticket has been routed to the People Operations team.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitRequest} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                      Category
                    </label>
                    <select className="w-full px-3 py-2 rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-[#fafafa] dark:bg-[#0a2134] text-[#071B2B] dark:text-[#f0f7f9] focus:outline-none">
                      <option>Salary Certificate Request</option>
                      <option>Air Ticket Claim Invoicing</option>
                      <option>Insurance Endorsement</option>
                      <option>General HR Policy Query</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                      Details / Notes *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={requestText}
                      onChange={(e) => setRequestText(e.target.value)}
                      placeholder="Describe your request..."
                      className="w-full px-3 py-2 rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-[#fafafa] dark:bg-[#0a2134] text-[#071B2B] dark:text-[#f0f7f9] focus:outline-none focus:ring-2 focus:ring-[#167D8D]/20"
                    />
                  </div>
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setHrRequestOpen(false)}
                      className="px-3 py-1.5 rounded-lg border border-[#EEEEEE] dark:border-[#163854] text-zinc-600 dark:text-zinc-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-[#167D8D] text-white font-semibold"
                    >
                      Submit Ticket
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
