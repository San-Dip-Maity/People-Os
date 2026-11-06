import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  hasFilterBar?: boolean;
}

export function SkeletonTable({
  rows = 5,
  columns = 5,
  hasFilterBar = true,
}: SkeletonTableProps) {
  return (
    <div className="w-full space-y-4">
      {hasFilterBar && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <Skeleton className="h-10 w-full sm:w-72 rounded-lg" />
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-28 rounded-lg" />
          </div>
        </div>
      )}

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="flex items-center px-6 py-3.5 bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="flex-1">
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {Array.from({ length: rows }).map((_, r) => (
            <div key={r} className="flex items-center px-6 py-4 space-x-4">
              {Array.from({ length: columns }).map((_, c) => (
                <div key={c} className="flex-1 flex items-center space-x-3">
                  {c === 0 && <Skeleton className="h-8 w-8 rounded-full shrink-0" />}
                  <Skeleton
                    className="h-4"
                    style={{
                      width: c === 0 ? "70%" : `${Math.floor(50 + ((c * 17) % 40))}%`,
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Table Pagination */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-zinc-50 dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-800">
          <Skeleton className="h-4 w-36" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
