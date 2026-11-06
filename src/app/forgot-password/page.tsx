"use client";

import * as React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Mail,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  KeyRound,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState(false);
  const [devResetUrl, setDevResetUrl] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unable to process password reset request.");
        setLoading(false);
        return;
      }

      setSubmitted(true);
      if (data.resetUrl) {
        setDevResetUrl(data.resetUrl);
      }
    } catch {
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#071B2B] flex flex-col justify-between p-4 sm:p-6 transition-colors">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between h-12">
        <Link
          href="/login"
          className="text-xs font-semibold text-[#4a6173] hover:text-[#071B2B] dark:text-[#8ca3b5] dark:hover:text-white transition-colors"
        >
          &larr; Back to Sign In
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex items-center justify-center py-8">
        <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0c263d] border border-[#EEEEEE] dark:border-[#163854] shadow-xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#e8f4f6] dark:bg-[#12334f] text-[#167D8D] dark:text-[#B9E4E8] flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#071B2B] dark:text-white">
              Reset Your Password
            </h1>
            <p className="text-supporting text-[#4a6173] dark:text-[#8ca3b5] mt-1.5">
              Enter your work email address and we will dispatch secure instructions to reset your password.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {submitted ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-800 dark:text-emerald-200 space-y-2">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Instructions Dispatched
                </div>
                <p>
                  If a registered PeopleOS account matches <strong>{email}</strong>, a password reset link has been generated. Please check your inbox.
                </p>
              </div>

              {devResetUrl && (
                <div className="p-3 rounded-lg bg-[#e8f4f6] dark:bg-[#12334f] border border-[#B9E4E8] dark:border-[#163854] text-xs text-[#071B2B] dark:text-[#f0f7f9] space-y-1.5">
                  <div className="font-semibold text-[11px] text-[#167D8D] dark:text-[#B9E4E8] uppercase tracking-wider">
                    Development Mode Testing Link
                  </div>
                  <p className="text-[11px] text-[#4a6173] dark:text-[#8ca3b5]">
                    In development/test environments, you can follow the token link directly:
                  </p>
                  <Link
                    href={devResetUrl}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#167D8D] dark:text-[#B9E4E8] hover:underline pt-1"
                  >
                    Open Password Reset Form &rarr;
                  </Link>
                </div>
              )}

              <Link
                href="/login"
                className="w-full py-2.5 px-4 rounded-lg bg-[#EEEEEE] hover:bg-[#e0e0e0] dark:bg-[#12334f] dark:hover:bg-[#1b4365] text-[#071B2B] dark:text-[#f0f7f9] font-semibold text-sm transition-all flex items-center justify-center gap-2 mt-4"
              >
                Return to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-label text-[#071B2B] dark:text-[#c2d3e0] mb-1.5 font-semibold">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#4a6173] dark:text-[#8ca3b5] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-[#fafafa] dark:bg-[#071B2B] border border-[#EEEEEE] dark:border-[#163854] text-[#071B2B] dark:text-[#f0f7f9] placeholder-[#8ca3b5] focus:outline-none focus:ring-2 focus:ring-[#167D8D] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-lg bg-[#167D8D] hover:bg-[#126876] disabled:opacity-60 text-white font-semibold text-sm shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Dispatching request...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-[#EEEEEE] dark:border-[#163854] text-center">
            <p className="text-supporting text-[#4a6173] dark:text-[#8ca3b5]">
              Remembered your password?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#167D8D] dark:text-[#B9E4E8] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="text-center py-4 text-xs text-[#4a6173] dark:text-[#8ca3b5]">
        &copy; 2026 PeopleOS Platform. Secure Account Recovery.
      </div>
    </div>
  );
}
