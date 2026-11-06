"use client";

import * as React from "react";
import {
  Bell,
  Search,
  Menu,
  Building,
  ChevronDown,
  User,
  LogOut,
  ShieldAlert,
  Check,
  CheckCheck,
  Calendar,
  DollarSign,
  UserCheck,
  X,
  ArrowRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { navigationConfig } from "@/config/navigation";

interface HeaderProps {
  onMenuToggle?: () => void;
  activeOrgName?: string;
  onOrgChange?: (org: string) => void;
  userName?: string;
  userRole?: string;
}

export function Header({
  onMenuToggle,
  activeOrgName: initialOrg = "Acme Technologies Global (UAE HQ)",
  userName = "Alex Morgan",
  userRole = "HR Administrator",
}: HeaderProps) {
  const router = useRouter();
  const [activeOrg, setActiveOrg] = React.useState(initialOrg);
  const [orgOpen, setOrgOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [notificationOpen, setNotificationOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const orgRef = React.useRef<HTMLDivElement>(null);
  const profileRef = React.useRef<HTMLDivElement>(null);
  const notifRef = React.useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = React.useState([
    {
      id: "1",
      title: "New Leave Application",
      description: "Sarah Connor requested 5 days Annual Leave",
      time: "10m ago",
      read: false,
      icon: Calendar,
      type: "leave",
      link: "/leave",
    },
    {
      id: "2",
      title: "Payroll Preview Ready",
      description: "November 2026 payroll calculations ready for HR audit",
      time: "1h ago",
      read: false,
      icon: DollarSign,
      type: "payroll",
      link: "/payroll",
    },
    {
      id: "3",
      title: "Probation Milestone",
      description: "Daniel Lee completed 6 months probation period",
      time: "3h ago",
      read: true,
      icon: UserCheck,
      type: "employee",
      link: "/employees",
    },
  ]);

  const organizations = [
    {
      id: "org-1",
      name: "Acme Technologies Global (UAE HQ)",
      legalEntity: "Acme Holdings FZ-LLC",
      location: "Dubai Internet City",
    },
    {
      id: "org-2",
      name: "Acme Technologies India Pvt Ltd",
      legalEntity: "Acme India Software Pvt Ltd",
      location: "Bengaluru Tech Park",
    },
    {
      id: "org-3",
      name: "Acme US Operations Inc",
      legalEntity: "Acme Americas Delaware Corp",
      location: "New York / Remote",
    },
  ];

  // Outside click listener
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (orgRef.current && !orgRef.current.contains(e.target as Node)) {
        setOrgOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    setProfileOpen(false);
    router.push("/dashboard");
    router.refresh();
  };

  // Search filtered items
  const allNavItems = navigationConfig.flatMap((sec) => sec.items);
  const searchResults = searchQuery.trim()
    ? allNavItems.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allNavItems.slice(0, 6);

  return (
    <header className="h-16 px-4 sm:px-6 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Left side: Hamburger + Organization Switcher */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Organization Switcher Dropdown */}
        <div className="relative" ref={orgRef}>
          <button
            onClick={() => setOrgOpen(!orgOpen)}
            aria-label="Switch organization"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-850 text-xs font-medium text-zinc-900 dark:text-zinc-100 transition-colors"
          >
            <Building className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="font-semibold max-w-[140px] sm:max-w-[200px] truncate">
              {activeOrg}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          </button>

          {orgOpen && (
            <div className="absolute left-0 mt-2 w-72 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3.5 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Select Active Organization
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
                {organizations.map((org) => {
                  const isSelected = org.name === activeOrg;
                  return (
                    <button
                      key={org.id}
                      onClick={() => {
                        setActiveOrg(org.name);
                        setOrgOpen(false);
                      }}
                      className={cn(
                        "w-full px-3.5 py-2.5 text-left flex items-start justify-between gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors",
                        isSelected && "bg-blue-50/70 dark:bg-blue-950/40"
                      )}
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                          {org.name}
                        </div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          {org.legalEntity} • {org.location}
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Middle: Global Search Trigger */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <button
          onClick={() => setSearchOpen(true)}
          className="w-full flex items-center justify-between pl-3 pr-2.5 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all text-left"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-zinc-400" />
            <span>Search modules, employees, policies...</span>
          </span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-medium text-zinc-500 bg-zinc-200/60 dark:bg-zinc-800 rounded">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right side: Notifications, Theme Toggle, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />

        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className={cn(
              "relative p-2 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors",
              notificationOpen && "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
            )}
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-zinc-950" />
            )}
          </button>

          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 overflow-hidden">
              <div className="p-3.5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    Notifications
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    {unreadCount} unread action items
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-900">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-zinc-500">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.id}
                        href={item.link}
                        onClick={() => setNotificationOpen(false)}
                        className={cn(
                          "p-3.5 flex items-start gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-colors block text-left",
                          !item.read && "bg-blue-50/40 dark:bg-blue-950/20"
                        )}
                      >
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            {item.description}
                          </div>
                          <div className="text-[10px] text-zinc-400 dark:text-zinc-500">
                            {item.time}
                          </div>
                        </div>
                        {!item.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                        )}
                      </Link>
                    );
                  })
                )}
              </div>

              <div className="p-2 border-t border-zinc-100 dark:border-zinc-800 text-center">
                <Link
                  href="/notifications"
                  onClick={() => setNotificationOpen(false)}
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View All Notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="h-5 w-px bg-zinc-200 dark:border-zinc-800 hidden sm:block" />

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            aria-label="User profile menu"
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                {userName}
              </span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight">
                {userRole}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
                <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                  {userName}
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                  alex.morgan@acmetech.com
                </p>
                <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {userRole}
                </div>
              </div>

              <div className="py-1">
                <Link
                  href="/self-service"
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-zinc-500" />
                  My Profile & Portal
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-zinc-500" />
                  Security & MFA Settings
                </Link>
              </div>

              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-1">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Search Modal / Command Palette */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setSearchOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
              <Search className="w-4 h-4 text-zinc-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type to search modules, employees, or policies..."
                autoFocus
                className="w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2 max-h-80 overflow-y-auto space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                Modules & Quick Jump
              </div>
              {searchResults.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-500">
                  No matching module found.
                </div>
              ) : (
                searchResults.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/60 dark:hover:text-blue-300 transition-colors group"
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                        <span>{item.title}</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  );
                })
              )}
            </div>

            <div className="p-3 bg-zinc-50 dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500 flex items-center justify-between">
              <span>Press <kbd className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-[10px]">Esc</kbd> to exit</span>
              <span>PeopleOS Unified Search</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
