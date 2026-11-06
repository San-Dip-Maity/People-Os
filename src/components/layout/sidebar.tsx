"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationConfig } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { ChevronRight, Sparkles } from "lucide-react";

interface SidebarProps {
  className?: string;
  onItemClick?: () => void;
}

export function Sidebar({ className, onItemClick }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 w-64 select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-zinc-200 dark:border-zinc-800">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-blue-500/20">
          P
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            PeopleOS
            <span className="text-[10px] px-1.5 py-0.2 font-medium bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800">
              v1.0
            </span>
          </span>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Intelligent People Ops
          </span>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navigationConfig.map((section) => (
          <div key={section.title} className="space-y-1">
            <h3 className="px-3 text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
              {section.title}
            </h3>
            <div className="space-y-0.5 pt-1">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname?.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onItemClick}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                      isActive
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={cn(
                          "w-4 h-4 shrink-0 transition-colors",
                          isActive
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                        )}
                      />
                      <span className="truncate">{item.title}</span>
                    </div>

                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* AI Assistant Quick Pill */}
      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800">
        <Link
          href="/copilot"
          onClick={onItemClick}
          className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-900/50 text-blue-900 dark:text-blue-100 group transition-all"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-blue-600 text-white shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-semibold">AI Copilot</div>
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                Ask HR policies & data
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </aside>
  );
}
