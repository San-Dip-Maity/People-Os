"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationConfig } from "@/config/navigation";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  ChevronDown,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

interface SidebarProps {
  className?: string;
  onItemClick?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({
  className,
  onItemClick,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const [collapsedSections, setCollapsedSections] = React.useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-200 select-none",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Brand Header */}
      <div className={cn(
        "flex items-center h-16 border-b border-zinc-200 dark:border-zinc-800 transition-all",
        collapsed ? "justify-center px-2" : "justify-between px-5"
      )}>
        <Link
          href="/dashboard"
          onClick={onItemClick}
          className="flex items-center gap-2.5 min-w-0"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-blue-500/20 shrink-0">
            P
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                PeopleOS
                <span className="text-[10px] px-1.5 py-0.2 font-medium bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800">
                  v1.0
                </span>
              </span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                People Operations Platform
              </span>
            </div>
          )}
        </Link>

        {!collapsed && onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
            className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {navigationConfig.map((section) => {
          const isSectionCollapsed = !!collapsedSections[section.title];

          return (
            <div key={section.title} className="space-y-1">
              {!collapsed && (
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full px-2.5 py-1 text-[10px] font-semibold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 uppercase tracking-wider flex items-center justify-between transition-colors"
                >
                  <span>{section.title}</span>
                  {isSectionCollapsed ? (
                    <ChevronRight className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </button>
              )}

              {(!isSectionCollapsed || collapsed) && (
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/dashboard" &&
                        pathname?.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onItemClick}
                        title={collapsed ? `${item.title}${item.badge ? ` (${item.badge})` : ""}` : undefined}
                        className={cn(
                          "flex items-center rounded-lg text-xs font-medium transition-all group relative",
                          collapsed
                            ? "justify-center p-2.5"
                            : "justify-between px-3 py-2",
                          isActive
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold"
                            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={cn(
                              "w-4 h-4 shrink-0 transition-colors",
                              isActive
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200"
                            )}
                          />
                          {!collapsed && (
                            <span className="truncate">{item.title}</span>
                          )}
                        </div>

                        {!collapsed && item.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Assistant Quick Pill / Collapsed Button */}
      <div className="p-2 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
        {collapsed ? (
          <Link
            href="/copilot"
            onClick={onItemClick}
            title="AI People Copilot"
            className="flex items-center justify-center p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            href="/copilot"
            onClick={onItemClick}
            className="flex items-center justify-between p-2.5 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-900/50 text-blue-900 dark:text-blue-100 group transition-all"
          >
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-blue-600 text-white shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold">AI Copilot</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  Ask policy & analytics
                </div>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}

        {/* Collapsed expand toggle button */}
        {collapsed && onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            aria-label="Expand sidebar"
            title="Expand sidebar"
            className="w-full flex items-center justify-center p-2 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
}
