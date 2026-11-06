"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Lock,
  Mail,
  User,
  Building,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [organizationName, setOrganizationName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [terms, setTerms] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string[]>>({});
  const [success, setSuccess] = React.useState(false);

  // Password strength checks
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordStrong = hasMinLength && hasUppercase && hasLowercase && hasNumber;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Client-side validations
    if (!isPasswordStrong) {
      setError("Password must meet all complexity requirements (8+ characters, uppercase, lowercase, and a number).");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!terms) {
      setError("You must accept the terms of service and privacy policy to continue.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          organizationName,
          password,
          confirmPassword,
          terms,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details?.fieldErrors) {
          setFieldErrors(data.details.fieldErrors);
        }
        setError(data.error || "Registration failed. Please review the highlighted fields.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 700);
    } catch {
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#071B2B] flex flex-col justify-between p-4 sm:p-6 transition-colors">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between h-12">
        <Link
          href="/"
          className="text-xs font-semibold text-[#4a6173] hover:text-[#071B2B] dark:text-[#8ca3b5] dark:hover:text-white transition-colors"
        >
          &larr; Back to PeopleOS Home
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex items-center justify-center py-6">
        <div className="w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0c263d] border border-[#EEEEEE] dark:border-[#163854] shadow-xl">
          {/* Header */}
          <div className="text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-2 mb-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#167D8D] flex items-center justify-center text-white font-bold text-lg shadow-xs group-hover:scale-105 transition-transform">
                P
              </div>
              <span className="font-bold text-xl tracking-tight text-[#071B2B] dark:text-white">
                PeopleOS
              </span>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-[#071B2B] dark:text-white">
              Create an Organization Account
            </h1>
            <p className="text-supporting text-[#4a6173] dark:text-[#8ca3b5] mt-1">
              Stand up your dedicated multi-tenant people operations workspace
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-300 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Workspace provisioned successfully! Redirecting to dashboard...</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-label text-[#071B2B] dark:text-[#c2d3e0] mb-1.5 font-semibold">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#4a6173] dark:text-[#8ca3b5] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Sarah Connor"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-[#fafafa] dark:bg-[#071B2B] border border-[#EEEEEE] dark:border-[#163854] text-[#071B2B] dark:text-[#f0f7f9] placeholder-[#8ca3b5] focus:outline-none focus:ring-2 focus:ring-[#167D8D] transition-all"
                />
              </div>
              {fieldErrors.fullName && (
                <p className="text-[11px] text-red-600 dark:text-red-400 mt-1">
                  {fieldErrors.fullName[0]}
                </p>
              )}
            </div>

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
                  placeholder="sarah@acme.com"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-[#fafafa] dark:bg-[#071B2B] border border-[#EEEEEE] dark:border-[#163854] text-[#071B2B] dark:text-[#f0f7f9] placeholder-[#8ca3b5] focus:outline-none focus:ring-2 focus:ring-[#167D8D] transition-all"
                />
              </div>
              {fieldErrors.email && (
                <p className="text-[11px] text-red-600 dark:text-red-400 mt-1">
                  {fieldErrors.email[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-label text-[#071B2B] dark:text-[#c2d3e0] mb-1.5 font-semibold">
                Company / Organization Name
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-[#4a6173] dark:text-[#8ca3b5] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="Acme Global Inc"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-[#fafafa] dark:bg-[#071B2B] border border-[#EEEEEE] dark:border-[#163854] text-[#071B2B] dark:text-[#f0f7f9] placeholder-[#8ca3b5] focus:outline-none focus:ring-2 focus:ring-[#167D8D] transition-all"
                />
              </div>
              {fieldErrors.organizationName && (
                <p className="text-[11px] text-red-600 dark:text-red-400 mt-1">
                  {fieldErrors.organizationName[0]}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-label text-[#071B2B] dark:text-[#c2d3e0] mb-1.5 font-semibold">
                  Password
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
                  Confirm Password
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

            {/* Terms Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded-sm border-[#EEEEEE] dark:border-[#163854] text-[#167D8D] focus:ring-[#167D8D] dark:bg-[#071B2B]"
                />
                <span className="text-supporting text-[#4a6173] dark:text-[#8ca3b5] leading-snug">
                  I agree to the{" "}
                  <a href="#" className="text-[#167D8D] dark:text-[#B9E4E8] hover:underline font-semibold">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-[#167D8D] dark:text-[#B9E4E8] hover:underline font-semibold">
                    Privacy Policy
                  </a>
                  , and confirm I am authorized to register this organization.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-2.5 px-4 rounded-lg bg-[#167D8D] hover:bg-[#126876] disabled:opacity-60 text-white font-semibold text-sm shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-2 pt-2.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Provisioning workspace...</span>
                </>
              ) : (
                <>
                  <span>Create Organization & Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-5 border-t border-[#EEEEEE] dark:border-[#163854] text-center">
            <p className="text-supporting text-[#4a6173] dark:text-[#8ca3b5]">
              Already have an organization account?{" "}
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
        &copy; 2026 PeopleOS Platform. Multi-Tenant Isolated Infrastructure.
      </div>
    </div>
  );
}
