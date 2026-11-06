"use client";

import * as React from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // In production, log to audit service or monitoring
    console.error("PeopleOS Unhandled UI Error:", error);
  }, [error]);

  return (
    <div className="min-h-[480px] flex items-center justify-center p-6">
      <div className="max-w-md w-full p-8 rounded-2xl border border-red-200 dark:border-red-950/50 bg-white dark:bg-zinc-950 shadow-lg text-center space-y-5">
        <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            Something went wrong
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            An unexpected error occurred while rendering this view. Our team has
            been notified if this persists.
          </p>
          {error.digest && (
            <div className="p-2 rounded bg-zinc-100 dark:bg-zinc-900 text-[11px] font-mono text-zinc-500">
              Error Digest: {error.digest}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

