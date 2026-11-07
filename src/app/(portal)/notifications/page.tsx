"use client";

import * as React from "react";
import {
  CheckCheck,
  Calendar,
  DollarSign,
  UserCheck,
  FileText,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/toast";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  category: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
}

export default function NotificationsPage() {
  const [filter, setFilter] = React.useState<"ALL" | "UNREAD" | "APPROVALS">("ALL");
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([
    {
      id: "1",
      title: "New Leave Application",
      description: "Sarah Connor requested 5 days Annual Leave (Nov 15 - Nov 19)",
      category: "APPROVALS",
      createdAt: new Date().toISOString(),
      isRead: false,
      link: "/leave",
    },
    {
      id: "2",
      title: "Payroll Calculations Ready for Review",
      description: "November 2026 payroll preview generated across all entities",
      category: "APPROVALS",
      createdAt: new Date().toISOString(),
      isRead: false,
      link: "/payroll",
    },
    {
      id: "3",
      title: "Employee Probation Confirmation",
      description: "Daniel Lee completed 6 months probation period successfully",
      category: "SYSTEM",
      createdAt: new Date().toISOString(),
      isRead: true,
      link: "/employees",
    },
    {
      id: "4",
      title: "Updated Cross-Border Holiday Calendar Assigned",
      description: "Rajesh Kumar reassigned to India Public Calendar with effective date Nov 10",
      category: "SYSTEM",
      createdAt: new Date().toISOString(),
      isRead: true,
      link: "/holidays",
    },
  ]);

  React.useEffect(() => {
    async function loadNotifications() {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          if (data.notifications && data.notifications.length > 0) {
            setNotifications(data.notifications);
          }
        }
      } catch (err) {
        console.error("Failed to load notifications:", err);
      }
    }
    loadNotifications();
  }, []);

  const filtered = notifications.filter((n) => {
    if (filter === "UNREAD") return !n.isRead;
    if (filter === "APPROVALS") return n.category === "APPROVALS";
    return true;
  });

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      if (res.ok) {
        toast.info("Notifications Cleared", "All alerts marked as read in database.");
      }
    } catch (err) {
      console.error("Mark all read error:", err);
    }
  };

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  const getIcon = (category: string) => {
    switch (category) {
      case "APPROVALS":
        return Calendar;
      case "PAYROLL":
        return DollarSign;
      case "EMPLOYEE":
        return UserCheck;
      case "COMPLIANCE":
        return FileText;
      default:
        return Bell;
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#071B2B] dark:text-[#f0f7f9] flex items-center gap-2">
              Notification Center & Alert Broadcasts
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Live in-app alert feeds, workflow approvals, and policy updates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#EEEEEE] dark:border-[#163854] hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs font-semibold transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All As Read</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 border-b border-[#EEEEEE] dark:border-[#163854] pb-2 text-xs font-medium">
          {[
            { key: "ALL", label: `All (${notifications.length})` },
            {
              key: "UNREAD",
              label: `Unread (${notifications.filter((n) => !n.isRead).length})`,
            },
            { key: "APPROVALS", label: "Approvals Only" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as typeof filter)}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-colors",
                filter === tab.key
                  ? "bg-[#167D8D] text-white font-semibold shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs divide-y divide-[#EEEEEE] dark:divide-[#163854] overflow-hidden text-xs">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">
              No notifications matching this filter.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = getIcon(item.category);
              return (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={cn(
                    "p-4 flex items-start gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer",
                    !item.isRead && "bg-[#eaf7f9] dark:bg-[#0a2134]"
                  )}
                >
                  <div className="p-2.5 rounded-xl bg-[#B9E4E8] dark:bg-[#12334f] text-[#167D8D] dark:text-[#B9E4E8] shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-[#071B2B] dark:text-[#f0f7f9]">
                        {item.title}
                      </h4>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {item.description}
                    </p>
                    {item.link && (
                      <div className="pt-1">
                        <Link
                          href={item.link}
                          className="text-[#167D8D] dark:text-[#B9E4E8] font-medium hover:underline inline-flex items-center gap-1"
                        >
                          Navigate to Record →
                        </Link>
                      </div>
                    )}
                  </div>

                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#167D8D] shrink-0 mt-2" />
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
