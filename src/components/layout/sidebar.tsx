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
        "flex flex-col h-full bg-[#071B2B] text-[#f0f7f9] border-r border-[#163854] transition-all duration-200 select-none shadow-md",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Brand Header */}
      <div
        className={cn(
          "flex items-center h-16 border-b border-[#163854] transition-all",
          collapsed ? "justify-center px-2" : "justify-between px-5"
        )}
      >
        {collapsed ? (
          <button
            onClick={onToggleCollapse}
            aria-label="Expand sidebar"
            title="Expand sidebar"
            data-testid="expand-sidebar"
            className="p-1.5 rounded-lg text-[#8ca3b5] hover:text-white hover:bg-[#0c263d] transition-colors"
          >
            <PanelLeftOpen className="w-5 h-5 text-[#B9E4E8]" />
          </button>
        ) : (
          <>
            <Link
              href="/dashboard"
              onClick={onItemClick}
              className="flex items-center gap-2.5 min-w-0"
            >
              <div className="w-8 h-8 rounded-lg bg-[#167D8D] flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-[#167D8D]/30 shrink-0">
                P
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                  PeopleOS
                  <span className="text-[10px] px-1.5 py-0.2 font-bold bg-[#B9E4E8] text-[#071B2B] rounded-full">
                    v1.0
                  </span>
                </span>
                <span className="text-[10px] text-[#8ca3b5] truncate font-medium">
                  People Operations Platform
                </span>
              </div>
            </Link>

            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
                data-testid="collapse-sidebar"
                className="p-1 rounded text-[#8ca3b5] hover:text-white hover:bg-[#0c263d] transition-colors"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )}
          </>
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
                  className="w-full px-2.5 py-1 text-[10px] font-semibold text-[#8ca3b5] hover:text-white uppercase tracking-wider flex items-center justify-between transition-colors"
                >
                  <span>{section.title}</span>
                  {isSectionCollapsed ? (
                    <ChevronRight className="w-3 h-3 text-[#8ca3b5]" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-[#8ca3b5]" />
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
                            ? "bg-[#167D8D] text-white font-semibold shadow-xs"
                            : "text-[#c2d3e0] hover:bg-[#0c263d] hover:text-white"
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={cn(
                              "w-4 h-4 shrink-0 transition-colors",
                              isActive
                                ? "text-white"
                                : "text-[#8ca3b5] group-hover:text-[#B9E4E8]"
                            )}
                          />
                          {!collapsed && (
                            <span className="truncate">{item.title}</span>
                          )}
                        </div>

                        {!collapsed && item.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-[#B9E4E8] text-[#071B2B] shrink-0">
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

      {/* AI Assistant Quick Pill */}
      <div className="p-2 border-t border-[#163854]">
        {collapsed ? (
          <Link
            href="/copilot"
            onClick={onItemClick}
            title="AI People Copilot"
            className="flex items-center justify-center p-2.5 rounded-lg bg-[#0c263d] text-[#B9E4E8] hover:bg-[#12334f] border border-[#163854] transition-colors"
          >
            <Sparkles className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            href="/copilot"
            onClick={onItemClick}
            className="flex items-center justify-between p-2.5 rounded-lg bg-[#0c263d] hover:bg-[#12334f] border border-[#163854] text-white group transition-all"
          >
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-[#167D8D] text-white shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold">AI Copilot</div>
                <div className="text-[10px] text-[#8ca3b5]">
                  Ask policy & analytics
                </div>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#B9E4E8] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>
    </aside>
  );
}
