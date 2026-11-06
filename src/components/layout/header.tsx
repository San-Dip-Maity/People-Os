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
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface HeaderProps {
  onMenuToggle?: () => void;
  activeOrgName?: string;
  userName?: string;
  userRole?: string;
}

export function Header({
  onMenuToggle,
  activeOrgName = "Acme Technologies Global",
  userName = "Alex Morgan",
  userRole = "HR Administrator",
}: HeaderProps) {
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [notificationOpen, setNotificationOpen] = React.useState(false);

  return (
    <header className="h-16 px-4 sm:px-6 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between sticky top-0 z-30">
      {/* Left side: Hamburger + Organization Switcher */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Organization Switcher */}
        <div className="relative">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-850 text-xs font-medium text-zinc-900 dark:text-zinc-100 transition-colors">
            <Building className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold max-w-[140px] sm:max-w-[200px] truncate">
              {activeOrgName}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Middle: Global Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search employees, policies, workflows (Ctrl + K)..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Right side: Notifications, Theme Toggle, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="relative p-2 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-zinc-950" />
          </button>
        </div>

        <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
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
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2">
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
                <button
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  <User className="w-3.5 h-3.5" />
                  My Profile
                </button>
                <button
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Security & MFA
                </button>
              </div>

              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-1">
                <button
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
