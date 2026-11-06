"use client";

import * as React from "react";
import {
  CheckCheck,
  Calendar,
  DollarSign,
  UserCheck,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const [filter, setFilter] = React.useState<"ALL" | "UNREAD" | "APPROVALS">("ALL");
  const [notifications, setNotifications] = React.useState([
    {
      id: "1",
      title: "New Leave Application",
      description: "Sarah Connor requested 5 days Annual Leave (Nov 15 - Nov 19)",
      category: "APPROVALS",
      time: "10m ago",
      read: false,
      icon: Calendar,
      link: "/leave",
    },
    {
      id: "2",
      title: "Payroll Calculations Ready for Review",
      description: "November 2026 payroll preview generated across all entities",
      category: "APPROVALS",
      time: "1h ago",
      read: false,
      icon: DollarSign,
      link: "/payroll",
    },
    {
      id: "3",
      title: "Employee Probation Confirmation",
      description: "Daniel Lee completed 6 months probation period successfully",
      category: "SYSTEM",
      time: "3h ago",
      read: true,
      icon: UserCheck,
      link: "/employees",
    },
    {
      id: "4",
      title: "Updated Cross-Border Holiday Calendar Assigned",
      description: "Rajesh Kumar reassigned to India Public Calendar with effective date Nov 10",
      category: "SYSTEM",
      time: "1d ago",
      read: true,
      icon: FileText,
      link: "/holidays",
    },
  ]);

  const filtered = notifications.filter((n) => {
    if (filter === "UNREAD") return !n.read;
    if (filter === "APPROVALS") return n.category === "APPROVALS";
    return true;
  });

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              Notification Center & Alert Broadcasts
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              In-app alert feeds, workflow approvals, and policy updates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs font-semibold transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All As Read</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 text-xs font-medium">
          {[
            { key: "ALL", label: `All (${notifications.length})` },
            {
              key: "UNREAD",
              label: `Unread (${notifications.filter((n) => !n.read).length})`,
            },
            { key: "APPROVALS", label: "Approvals Only" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as typeof filter)}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-colors",
                filter === tab.key
                  ? "bg-blue-600 text-white font-semibold shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs divide-y divide-zinc-200 dark:divide-zinc-800 overflow-hidden text-xs">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">
              No notifications matching this filter.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={cn(
                    "p-4 flex items-start gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors",
                    !item.read && "bg-blue-50/40 dark:bg-blue-950/20"
                  )}
                >
                  <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                        {item.title}
                      </h4>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="pt-1">
                      <Link
                        href={item.link}
                        className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center gap-1"
                      >
                        Navigate to Record →
                      </Link>
                    </div>
                  </div>

                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-2" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
