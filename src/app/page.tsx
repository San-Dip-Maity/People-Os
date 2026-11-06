import * as React from "react";
import Link from "next/link";
import {
  Users,
  Building2,
  Calendar,
  Clock,
  Shield,
  Sparkles,
  DollarSign,
  Briefcase,
  FileText,
  GitBranch,
  Bell,
  CheckCircle2,
  ArrowRight,
  Lock,
  ChevronRight,
  TrendingUp,
  Cpu,
  Globe2,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col transition-colors selection:bg-blue-500 selection:text-white">
      {/* ---------------- Navigation Bar ---------------- */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
              P
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight flex items-center gap-1.5">
                PeopleOS
                <span className="text-[10px] px-1.5 py-0.5 font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800">
                  v1.0
                </span>
              </span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                People Operations Platform
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Features
            </a>
            <a href="#modules" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              HR Modules
            </a>
            <a href="#ai" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              AI Copilot
            </a>
            <a href="#security" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Security
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="px-3.5 py-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] rounded-lg shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ---------------- Hero Section ---------------- */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-zinc-200/60 dark:border-zinc-800/60">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Next-Gen Multi-Tenant People Operations & AI Platform
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight md:leading-tight">
            The Intelligent HRMS for Modern Global Enterprise
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            Unify workforce directories, multi-entity payroll, time & shifts, leave policies, and autonomous approval workflows into one high-performance, AI-assisted platform.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-6 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-3.5 text-base font-semibold text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Live Demo Login
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </Link>
          </div>

          {/* Metric Highlights Banner */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">99.98%</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">Attendance & Shift Fidelity</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">100+</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">Jurisdictions & Legal Entities</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">4.5x</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">Faster Approval Workflows</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">SOC2</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">Type II & Multi-Tenant Isolated</div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Core Pillars / Features Section ---------------- */}
      <section id="features" className="py-20 bg-zinc-50/50 dark:bg-zinc-900/30 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Enterprise Architecture
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
              Engineered for Scalable Workforce Governance
            </p>
            <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
              Traditional HR tools isolate departments. PeopleOS provides unified schema isolation, automated audits, and continuous multi-tenant governance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Multi-Tenant & Multi-Entity Isolation
              </h3>
              <p className="mt-2.5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Operate separate legal entities, branches, and subsidiaries under one tenant with strict data scoping, custom currencies, and localized tax profiles.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Unified Workflow Orchestration
              </h3>
              <p className="mt-2.5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Multi-level approval chains for leaves, compensation adjustments, and expense disbursements with policy-backed validation rules.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Audited & Role-Based Security
              </h3>
              <p className="mt-2.5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Granular RBAC down to field-level visibility with tamper-evident audit logs capturing actor, timestamp, IP, and payload state changes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 16 HR Modules Overview Grid ---------------- */}
      <section id="modules" className="py-20 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Complete HR Suite
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
              16 Integrated Enterprise HRMS Modules
            </p>
            <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
              Everything your People Operations team needs, from hiring and onboarding to payroll, compliance, and real-time analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "Employee Directory",
                desc: "Effective-dated records, employee lifecycle tracking, and historical position timeline.",
                icon: Users,
                href: "/employees",
              },
              {
                title: "Organization Structure",
                desc: "Legal entities, departments, reporting hierarchy, and work location management.",
                icon: Building2,
                href: "/organization",
              },
              {
                title: "Self-Service Portal",
                desc: "Employee self-service (ESS) for personal details, documents, and requests.",
                icon: CheckCircle2,
                href: "/self-service",
              },
              {
                title: "Leave Management",
                desc: "Configurable accruals, air ticket entitlements, balance ledgers, and approvals.",
                icon: Calendar,
                href: "/leave",
              },
              {
                title: "Holiday Calendar",
                desc: "Regional observance calendars by legal entity and work location.",
                icon: Calendar,
                href: "/holidays",
              },
              {
                title: "Attendance & Shifts",
                desc: "Biometric integration ready, shift rotation schedules, and overtime rules.",
                icon: Clock,
                href: "/attendance",
              },
              {
                title: "Timesheets",
                desc: "Project-level time tracking, billable hours, and managerial sign-offs.",
                icon: TrendingUp,
                href: "/timesheets",
              },
              {
                title: "Payroll & Comp",
                desc: "Multi-entity salary disbursement, tax withholdings, and pay slip vaults.",
                icon: DollarSign,
                href: "/payroll",
              },
              {
                title: "Talent Acquisition",
                desc: "Job requisition workflows, applicant tracking pipeline, and interview scoring.",
                icon: Briefcase,
                href: "/recruitment",
              },
              {
                title: "Performance & OKRs",
                desc: "Goal setting, 360-degree feedback cycles, and continuous performance reviews.",
                icon: TrendingUp,
                href: "/performance",
              },
              {
                title: "Document Vault",
                desc: "Encrypted contracts, ID proofs, visa expiries, and confidential storage.",
                icon: FileText,
                href: "/documents",
              },
              {
                title: "Workflow Engine",
                desc: "Multi-step visual approval workflows with conditional routing rules.",
                icon: GitBranch,
                href: "/workflows",
              },
              {
                title: "Notification Center",
                desc: "Centralized broadcast system with policy alerts and pending tasks.",
                icon: Bell,
                href: "/notifications",
              },
              {
                title: "Audit & Compliance",
                desc: "Immutable change logs, security compliance logs, and exportable audits.",
                icon: Shield,
                href: "/audit",
              },
              {
                title: "Tenant Settings",
                desc: "Custom currencies, fiscal calendars, branding, and policy rules.",
                icon: Lock,
                href: "/settings",
              },
              {
                title: "AI People Copilot",
                desc: "Intelligent policy assistant, workforce trends, and natural language analytics.",
                icon: Sparkles,
                href: "/copilot",
              },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.title}
                  className="p-5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-900 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/50 text-zinc-700 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-center transition-colors mb-3.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {m.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- AI Copilot Showcase ---------------- */}
      <section id="ai" className="py-20 bg-gradient-to-b from-blue-50/50 to-indigo-50/20 dark:from-blue-950/20 dark:to-zinc-950 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                Intelligent People Assistant
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                AI Copilot for People Operations & Policy Guidance
              </h2>
              <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Empower HR leaders and employees with contextual intelligence. PeopleOS Copilot analyzes policy handbooks, attendance trends, and payroll variances in seconds.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Ask questions about company leave entitlements and regional statutory holidays.",
                  "Detect attendance anomalies and shift conflicts before payroll cutoff.",
                  "Draft performance review summaries and job descriptions automatically.",
                  "Enforce zero data leakage with strict tenant-scoped AI boundaries.",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="p-0.5 rounded-full bg-blue-600 text-white mt-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Experience AI Copilot
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Simulated Chat Interface */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-4 font-mono text-xs">
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-sans text-xs font-semibold text-zinc-500">PeopleOS Copilot Console</span>
              </div>

              <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200">
                <span className="font-semibold text-blue-600 dark:text-blue-400">User: </span>
                How many days of Annual Leave is an employee entitled to under the UAE entity after 1 year?
              </div>

              <div className="p-3.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 text-blue-950 dark:text-blue-100 font-sans space-y-2">
                <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-semibold text-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  PeopleOS Assistant:
                </div>
                <p className="text-xs leading-relaxed">
                  Under the UAE Federal Decree Law No. 33 and your Acme Holdings UAE policy, employees who have completed one continuous year of service are entitled to <strong>30 calendar days</strong> of paid annual leave. Accrual is calculated at 2.5 days per month.
                </p>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                  Source: Acme-UAE-Leave-Policy-2026.pdf (Section 4.1)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Security Section ---------------- */}
      <section id="security" className="py-20 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Zero-Trust Security
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
              Enterprise-Grade Data Isolation & Compliance
            </p>
            <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
              People data is your most sensitive asset. PeopleOS is built with defense-in-depth isolation at every layer of the stack.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="font-bold text-base">Tenant Scoping</h3>
              <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Database queries strictly enforce tenant isolation from session context. Client-supplied tenant IDs are never trusted.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80">
              <Lock className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-4" />
              <h3 className="font-bold text-base">Encrypted Sessions</h3>
              <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Cryptographically signed 32-byte session tokens stored in HttpOnly, Secure, SameSite cookies with automatic expiration.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80">
              <FileText className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mb-4" />
              <h3 className="font-bold text-base">Complete Audit Trails</h3>
              <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Every create, update, delete, approval, and authentication event is immutably logged with actor, timestamp, and IP address.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80">
              <CheckCircle2 className="w-8 h-8 text-amber-600 dark:text-amber-400 mb-4" />
              <h3 className="font-bold text-base">Fine-Grained RBAC</h3>
              <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Role hierarchies (Super Admin, Org Admin, HR Admin, Dept Manager, Employee) with strict server-side authorization checks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Call to Action Banner ---------------- */}
      <section className="py-20 bg-blue-600 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Ready to Modernize Your People Operations?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-blue-100 max-w-2xl mx-auto">
            Get started in minutes with our enterprise multi-tenant platform. No credit card required.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-blue-600 bg-white hover:bg-blue-50 active:scale-[0.98] rounded-xl shadow-lg transition-all"
            >
              Create Organization Account
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-blue-700/60 hover:bg-blue-700 border border-blue-400/40 rounded-xl transition-all"
            >
              Sign In to Existing Tenant
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  P
                </div>
                <span className="font-bold text-sm tracking-tight">PeopleOS</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Next-generation enterprise people operations platform: multi-tenant, workflow automated, and AI-powered.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-3">
                Product
              </h4>
              <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                <li><a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400">Features</a></li>
                <li><a href="#modules" className="hover:text-blue-600 dark:hover:text-blue-400">HR Modules</a></li>
                <li><a href="#ai" className="hover:text-blue-600 dark:hover:text-blue-400">AI Copilot</a></li>
                <li><a href="#security" className="hover:text-blue-600 dark:hover:text-blue-400">Security</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-3">
                Access
              </h4>
              <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                <li><Link href="/login" className="hover:text-blue-600 dark:hover:text-blue-400">Sign In</Link></li>
                <li><Link href="/signup" className="hover:text-blue-600 dark:hover:text-blue-400">Create Account</Link></li>
                <li><Link href="/forgot-password" className="hover:text-blue-600 dark:hover:text-blue-400">Forgot Password</Link></li>
                <li><Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400">Portal Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-3">
                Compliance & Legal
              </h4>
              <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                <li><span>SOC2 Type II Ready</span></li>
                <li><span>GDPR Compliant</span></li>
                <li><span>Tenant Scoped Data</span></li>
                <li><span>256-Bit SSL Encryption</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <div>
              &copy; 2026 PeopleOS Platform Inc. All rights reserved.
            </div>
            <div className="flex items-center gap-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-zinc-700 dark:hover:text-zinc-300">Privacy Policy</a>
              <a href="#" className="hover:text-zinc-700 dark:hover:text-zinc-300">Terms of Service</a>
              <a href="#" className="hover:text-zinc-700 dark:hover:text-zinc-300">Security Whitepaper</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
