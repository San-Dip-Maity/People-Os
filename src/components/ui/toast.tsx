"use client";

import * as React from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "warning" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

type ToastListener = (toasts: ToastItem[]) => void;

class ToastManager {
  private toasts: ToastItem[] = [];
  private listeners: Set<ToastListener> = new Set();

  subscribe(listener: ToastListener) {
    this.listeners.add(listener);
    listener([...this.toasts]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener([...this.toasts]));
  }

  show(type: ToastType, title: string, description?: string, duration: number = 4000) {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newToast: ToastItem = { id, type, title, description, duration };
    this.toasts = [...this.toasts, newToast];
    this.notify();

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }
    return id;
  }

  dismiss(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  clear() {
    this.toasts = [];
    this.notify();
  }
}

export const toastManager = new ToastManager();

export const toast = {
  success: (title: string, description?: string, duration?: number) =>
    toastManager.show("success", title, description, duration),
  warning: (title: string, description?: string, duration?: number) =>
    toastManager.show("warning", title, description, duration),
  error: (title: string, description?: string, duration?: number) =>
    toastManager.show("error", title, description, duration),
  info: (title: string, description?: string, duration?: number) =>
    toastManager.show("info", title, description, duration),
  dismiss: (id: string) => toastManager.dismiss(id),
  clear: () => toastManager.clear(),
};

export function Toaster() {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  React.useEffect(() => {
    return toastManager.subscribe((currentToasts) => {
      setToasts(currentToasts);
    });
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none p-2 sm:p-0"
    >
      {toasts.map((item) => (
        <ToastCard key={item.id} item={item} onDismiss={() => toast.dismiss(item.id)} />
      ))}
    </div>
  );
}

function ToastCard({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: () => void;
}) {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-[#167D8D] dark:text-[#B9E4E8] shrink-0" />,
  };

  const borders = {
    success: "border-emerald-200 dark:border-emerald-800/80 bg-white dark:bg-[#0c263d]",
    warning: "border-amber-200 dark:border-amber-800/80 bg-white dark:bg-[#0c263d]",
    error: "border-rose-200 dark:border-rose-800/80 bg-white dark:bg-[#0c263d]",
    info: "border-[#B9E4E8] dark:border-[#163854] bg-white dark:bg-[#0c263d]",
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-3 fade-in",
        borders[item.type]
      )}
    >
      <div className="mt-0.5">{icons[item.type]}</div>
      <div className="flex-1 min-w-0 pr-1">
        <h4 className="text-xs font-semibold text-[#071B2B] dark:text-[#f0f7f9] leading-tight">
          {item.title}
        </h4>
        {item.description && (
          <p className="mt-1 text-[11px] text-zinc-600 dark:text-zinc-300 leading-normal">
            {item.description}
          </p>
        )}
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-[#EEEEEE] dark:hover:bg-[#12334f] transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

