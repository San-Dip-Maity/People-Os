"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-md bg-secondary/50 animate-pulse" />
    );
  }

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <button
      onClick={cycleTheme}
      aria-label="Toggle theme"
      title={`Current: ${theme}. Click to switch.`}
      className="inline-flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {theme === "light" && <Sun className="w-4 h-4 text-amber-500" />}
      {theme === "dark" && <Moon className="w-4 h-4 text-blue-400" />}
      {theme === "system" && <Monitor className="w-4 h-4 text-emerald-500" />}
    </button>
  );
}
