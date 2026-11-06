"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
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
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              Employee Self-Service (ESS)
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Manage your personal HR requests, time off, entitlements, and tax documents.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHrRequestOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit HR Request</span>
            </button>
          </div>
        </div>

        {/* Profile Summary Card */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-2xl flex items-center justify-center shrink-0 shadow-md">
            AM
          </div>
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
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
              className="px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold text-xs text-center hover:bg-blue-100 transition-colors"
            >
              Apply For Leave
            </Link>
          </div>
        </div>

        {/* Balance Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Annual Leave</span>
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              18.5 <span className="text-xs font-normal text-zinc-500">Days</span>
            </div>
            <p className="text-[11px] text-zinc-500">Accrues 2.08 days / month</p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Sick Leave</span>
              <AlertCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              12.0 <span className="text-xs font-normal text-zinc-500">Days</span>
            </div>
            <p className="text-[11px] text-zinc-500">Full statutory coverage</p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Air Ticket Entitlement</span>
              <Plane className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              1 <span className="text-xs font-normal text-zinc-500">Ticket</span>
            </div>
            <p className="text-[11px] text-zinc-500">Service milestone earned (1 Yr)</p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Latest Payslip</span>
              <DollarSign className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Oct 2026
            </div>
            <p className="text-[11px] text-zinc-500">Finalized & Credited</p>
          </div>
        </div>

        {/* Quick Documents & Payslip Download */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50">
              Personal Employment Documents & Payslips
            </h3>
            <Link href="/documents" className="text-xs text-blue-600 hover:underline">
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
                className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
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
            <div className="relative w-full max-w-md bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 z-10">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50">
                Submit HR Inquiry / Request
              </h3>
              {submitted ? (
                <div className="p-6 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
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
                    <select className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none">
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
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setHrRequestOpen(false)}
                      className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-semibold"
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
    </AppShell>
  );
}
