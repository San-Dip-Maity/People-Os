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
      <div className="max-w-md w-full p-8 rounded-2xl border border-red-200 dark:border-red-950/50 bg-white dark:bg-[#0c263d] shadow-lg text-center space-y-5">
        <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="heading-section text-[#071B2B] dark:text-[#f0f7f9]">
            Something went wrong
          </h2>
          <p className="text-supporting text-zinc-600 dark:text-zinc-400">
            An unexpected error occurred while rendering this view. Our team has
            been notified if this persists.
          </p>
          {error.digest && (
            <div className="p-2 rounded bg-[#fafafa] dark:bg-[#0a2134] text-[11px] font-mono text-zinc-500 border border-[#EEEEEE] dark:border-[#163854]">
              Error Digest: {error.digest}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="btn-primary"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="btn-secondary"
          >
            <Home className="w-3.5 h-3.5 mr-1.5" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
