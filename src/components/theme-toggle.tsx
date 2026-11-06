"use client";

import * as React from "react";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg bg-[#EEEEEE] dark:bg-[#0c263d] animate-pulse" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle theme"
        aria-expanded={open}
        title={`Current theme: ${theme} (${resolvedTheme}). Click to choose Light, Dark, or System.`}
        className={cn(
          "inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] text-[#071B2B] dark:text-[#f0f7f9] hover:bg-[#EEEEEE] dark:hover:bg-[#12334f] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#167D8D]",
          open && "ring-2 ring-[#167D8D]/30 border-[#167D8D]"
        )}
      >
        {theme === "system" ? (
          <Monitor className="w-4 h-4 text-[#167D8D]" />
        ) : isDark ? (
          <Moon className="w-4 h-4 text-[#B9E4E8]" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-[#4a6173] dark:text-[#8ca3b5] uppercase tracking-wider">
            Appearance
          </div>

          <button
            onClick={() => {
              setTheme("light");
              setOpen(false);
            }}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors",
              theme === "light"
                ? "bg-[#e8f4f6] text-[#167D8D] dark:bg-[#12334f] dark:text-[#B9E4E8] font-semibold"
                : "text-[#071B2B] dark:text-[#f0f7f9] hover:bg-[#EEEEEE] dark:hover:bg-[#12334f]"
            )}
          >
            <span className="flex items-center gap-2">
              <Sun className="w-3.5 h-3.5 text-amber-500" /> Light
            </span>
            {theme === "light" && <Check className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => {
              setTheme("dark");
              setOpen(false);
            }}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors",
              theme === "dark"
                ? "bg-[#e8f4f6] text-[#167D8D] dark:bg-[#12334f] dark:text-[#B9E4E8] font-semibold"
                : "text-[#071B2B] dark:text-[#f0f7f9] hover:bg-[#EEEEEE] dark:hover:bg-[#12334f]"
            )}
          >
            <span className="flex items-center gap-2">
              <Moon className="w-3.5 h-3.5 text-[#B9E4E8]" /> Dark
            </span>
            {theme === "dark" && <Check className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => {
              setTheme("system");
              setOpen(false);
            }}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors",
              theme === "system"
                ? "bg-[#e8f4f6] text-[#167D8D] dark:bg-[#12334f] dark:text-[#B9E4E8] font-semibold"
                : "text-[#071B2B] dark:text-[#f0f7f9] hover:bg-[#EEEEEE] dark:hover:bg-[#12334f]"
            )}
          >
            <span className="flex items-center gap-2">
              <Monitor className="w-3.5 h-3.5 text-[#167D8D]" /> System
            </span>
            {theme === "system" && <Check className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}
    </div>
  );
}
