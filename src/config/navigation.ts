import {
  Users,
  Building2,
  CalendarDays,
  Clock,
  Briefcase,
  FileText,
  DollarSign,
  TrendingUp,
  Bot,
  GitBranch,
  ShieldCheck,
  Settings,
  Bell,
  Home,
  CheckSquare,
  Award,
} from "lucide-react";
import React from "react";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  moduleKey: string;
  requiredPermission?: string;
  children?: NavItem[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navigationConfig: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: Home,
        moduleKey: "DASHBOARD",
      },
      {
        title: "AI People Copilot",
        href: "/copilot",
        icon: Bot,
        badge: "AI",
        moduleKey: "AI_COPILOT",
      },
    ],
  },
  {
    title: "Workforce",
    items: [
      {
        title: "Employees",
        href: "/employees",
        icon: Users,
        moduleKey: "EMPLOYEE_MANAGEMENT",
      },
      {
        title: "Organization Structure",
        href: "/organization",
        icon: Building2,
        moduleKey: "ORG_MANAGEMENT",
      },
      {
        title: "Self-Service Portal",
        href: "/self-service",
        icon: Award,
        moduleKey: "SELF_SERVICE",
      },
    ],
  },
  {
    title: "Time & Attendance",
    items: [
      {
        title: "Leave Management",
        href: "/leave",
        icon: CalendarDays,
        moduleKey: "LEAVE_MANAGEMENT",
      },
      {
        title: "Holiday Calendar",
        href: "/holidays",
        icon: CalendarDays,
        moduleKey: "HOLIDAY_MANAGEMENT",
      },
      {
        title: "Attendance & Shifts",
        href: "/attendance",
        icon: Clock,
        moduleKey: "ATTENDANCE_MANAGEMENT",
      },
      {
        title: "Timesheets",
        href: "/timesheets",
        icon: CheckSquare,
        moduleKey: "TIMESHEET_MANAGEMENT",
      },
    ],
  },
  {
    title: "Payroll & Operations",
    items: [
      {
        title: "Payroll & Compensation",
        href: "/payroll",
        icon: DollarSign,
        moduleKey: "PAYROLL_MANAGEMENT",
      },
      {
        title: "Talent & Recruitment",
        href: "/recruitment",
        icon: Briefcase,
        moduleKey: "RECRUITMENT",
      },
      {
        title: "Performance & Goals",
        href: "/performance",
        icon: TrendingUp,
        moduleKey: "PERFORMANCE_MANAGEMENT",
      },
      {
        title: "Documents",
        href: "/documents",
        icon: FileText,
        moduleKey: "DOCUMENT_MANAGEMENT",
      },
    ],
  },
  {
    title: "Automation & Governance",
    items: [
      {
        title: "Workflow Engine",
        href: "/workflows",
        icon: GitBranch,
        moduleKey: "WORKFLOW_ENGINE",
      },
      {
        title: "Notifications",
        href: "/notifications",
        icon: Bell,
        moduleKey: "NOTIFICATIONS",
      },
      {
        title: "Audit & Compliance",
        href: "/audit",
        icon: ShieldCheck,
        moduleKey: "AUDIT_COMPLIANCE",
      },
      {
        title: "Tenant Settings",
        href: "/settings",
        icon: Settings,
        moduleKey: "TENANT_SETTINGS",
      },
    ],
  },
];
