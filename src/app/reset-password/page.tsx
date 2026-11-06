"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
} from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordStrong = hasMinLength && hasUppercase && hasLowercase && hasNumber;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Missing or invalid password reset token. Please request a new link.");
      return;
    }

    if (!isPasswordStrong) {
      setError("Password must meet all complexity requirements (8+ characters, uppercase, lowercase, and a number).");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unable to reset password.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch {
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0c263d] border border-[#EEEEEE] dark:border-[#163854] shadow-xl">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-[#e8f4f6] dark:bg-[#12334f] text-[#167D8D] dark:text-[#B9E4E8] flex items-center justify-center mx-auto mb-4">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#071B2B] dark:text-white">
          Set New Password
        </h1>
        <p className="text-supporting text-[#4a6173] dark:text-[#8ca3b5] mt-1.5">
          Enter your updated credentials to restore access to your account.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-800 dark:text-emerald-200 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Password Successfully Updated
            </div>
            <p>
              Your credentials have been securely updated and previous sessions have been invalidated. Redirecting to sign in...
            </p>
          </div>

          <Link
            href="/login"
            className="w-full py-2.5 px-4 rounded-lg bg-[#167D8D] hover:bg-[#126876] text-white font-semibold text-sm shadow-xs transition-all flex items-center justify-center gap-2"
          >
            Sign In Now
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-label text-[#071B2B] dark:text-[#c2d3e0] mb-1.5 font-semibold">
              New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#4a6173] dark:text-[#8ca3b5] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2 text-sm rounded-lg bg-[#fafafa] dark:bg-[#071B2B] border border-[#EEEEEE] dark:border-[#163854] text-[#071B2B] dark:text-[#f0f7f9] placeholder-[#8ca3b5] focus:outline-none focus:ring-2 focus:ring-[#167D8D] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a6173] dark:text-[#8ca3b5] hover:text-[#071B2B] dark:hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-label text-[#071B2B] dark:text-[#c2d3e0] mb-1.5 font-semibold">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#4a6173] dark:text-[#8ca3b5] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-[#fafafa] dark:bg-[#071B2B] border border-[#EEEEEE] dark:border-[#163854] text-[#071B2B] dark:text-[#f0f7f9] placeholder-[#8ca3b5] focus:outline-none focus:ring-2 focus:ring-[#167D8D] transition-all"
              />
            </div>
          </div>

          {/* Password Strength Checklist */}
          <div className="p-3 rounded-lg bg-[#e8f4f6] dark:bg-[#12334f] border border-[#B9E4E8] dark:border-[#163854] space-y-1 text-[11px]">
            <div className="font-semibold text-[#071B2B] dark:text-[#f0f7f9] mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#167D8D] dark:text-[#B9E4E8]" />
              Password requirements:
            </div>
            <div className="grid grid-cols-2 gap-1 text-[#4a6173] dark:text-[#8ca3b5]">
              <span className={hasMinLength ? "text-[#167D8D] dark:text-[#B9E4E8] font-bold" : ""}>
                {hasMinLength ? "✓" : "•"} At least 8 characters
              </span>
              <span className={hasUppercase ? "text-[#167D8D] dark:text-[#B9E4E8] font-bold" : ""}>
                {hasUppercase ? "✓" : "•"} One uppercase letter
              </span>
              <span className={hasLowercase ? "text-[#167D8D] dark:text-[#B9E4E8] font-bold" : ""}>
                {hasLowercase ? "✓" : "•"} One lowercase letter
              </span>
              <span className={hasNumber ? "text-[#167D8D] dark:text-[#B9E4E8] font-bold" : ""}>
                {hasNumber ? "✓" : "•"} One number
              </span>
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
                <span>Updating credentials...</span>
              </>
            ) : (
              <>
                <span>Save New Password</span>
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
  );
}

export default function ResetPasswordPage() {
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
        <React.Suspense fallback={<div className="text-xs text-[#4a6173]">Loading password reset form...</div>}>
          <ResetPasswordForm />
        </React.Suspense>
      </div>

      <div className="text-center py-4 text-xs text-[#4a6173] dark:text-[#8ca3b5]">
        &copy; 2026 PeopleOS Platform. Cryptographic Authentication Protocol.
      </div>
    </div>
  );
}
