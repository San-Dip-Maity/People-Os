"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { toast } from "@/components/ui/toast";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/dashboard";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data.error || "Authentication failed. Please verify your credentials.";
        setError(errorMsg);
        toast.error("Sign In Failed", errorMsg);
        setLoading(false);
        return;
      }

      setSuccess(true);
      toast.success("Welcome Back", "Authentication successful. Redirecting to your dashboard...");
      setTimeout(() => {
        router.push(returnUrl);
        router.refresh();
      }, 500);
    } catch {
      const networkError = "An unexpected network error occurred. Please check your connection.";
      setError(networkError);
      toast.error("Network Error", networkError);
      setLoading(false);
    }
  };

  const handleFillDemoAdmin = () => {
    setEmail("admin@peopleos.dev");
    setPassword("Admin@PeopleOS2026!");
    setError(null);
    toast.info("Demo Account Filled", "Admin credentials filled for Acme Global Technologies.");
  };

  return (
    <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0c263d] border border-[#EEEEEE] dark:border-[#163854] shadow-xl">
      {/* Header */}
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-10 h-10 rounded-xl bg-[#167D8D] flex items-center justify-center text-white font-bold text-lg shadow-xs group-hover:scale-105 transition-transform">
            P
          </div>
          <span className="font-bold text-xl tracking-tight text-[#071B2B] dark:text-white">
            PeopleOS
          </span>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-[#071B2B] dark:text-white">
          Sign in to your organization
        </h1>
        <p className="text-supporting text-[#4a6173] dark:text-[#8ca3b5] mt-1">
          Access your unified workforce and people operations portal
        </p>
      </div>

      {/* Demo Credentials Quick-Fill Pill */}
      <div className="mb-6 p-3 rounded-xl bg-[#e8f4f6] dark:bg-[#12334f] border border-[#B9E4E8] dark:border-[#163854] flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[#071B2B] dark:text-[#f0f7f9]">
          <Sparkles className="w-4 h-4 text-[#167D8D] dark:text-[#B9E4E8] shrink-0" />
          <span>Demo admin account available</span>
        </div>
        <button
          type="button"
          onClick={handleFillDemoAdmin}
          className="text-xs font-semibold text-[#167D8D] dark:text-[#B9E4E8] hover:underline"
        >
          Auto-fill
        </button>
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
          <span>Authentication successful. Redirecting to workspace...</span>
        </div>
      )}

      {/* Form */}
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

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-label text-[#071B2B] dark:text-[#c2d3e0] font-semibold">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-[#167D8D] dark:text-[#B9E4E8] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
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

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded-sm border-[#EEEEEE] dark:border-[#163854] text-[#167D8D] focus:ring-[#167D8D] dark:bg-[#071B2B]"
            />
            <span className="text-supporting text-[#4a6173] dark:text-[#8ca3b5]">
              Keep me signed in (30 days)
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || success}
          className="w-full py-2.5 px-4 rounded-lg bg-[#167D8D] hover:bg-[#126876] disabled:opacity-60 text-white font-semibold text-sm shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying credentials...</span>
            </>
          ) : (
            <>
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-6 pt-5 border-t border-[#EEEEEE] dark:border-[#163854] text-center">
        <p className="text-supporting text-[#4a6173] dark:text-[#8ca3b5]">
          Don&apos;t have an organization tenant yet?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#167D8D] dark:text-[#B9E4E8] hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#071B2B] flex flex-col justify-between p-4 sm:p-6 transition-colors">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between h-12">
        <Link href="/" className="text-xs font-semibold text-[#4a6173] hover:text-[#071B2B] dark:text-[#8ca3b5] dark:hover:text-white transition-colors">
          &larr; Back to PeopleOS Home
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex items-center justify-center py-8">
        <React.Suspense fallback={<div className="text-xs text-[#4a6173]">Loading sign in form...</div>}>
          <LoginForm />
        </React.Suspense>
      </div>

      <div className="text-center py-4 text-xs text-[#4a6173] dark:text-[#8ca3b5]">
        &copy; 2026 PeopleOS Platform. Multi-Tenant Enterprise Security.
      </div>
    </div>
  );
}
