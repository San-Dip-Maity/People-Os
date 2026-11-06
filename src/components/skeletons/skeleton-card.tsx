import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonCardProps {
  hasHeader?: boolean;
  hasFooter?: boolean;
  lines?: number;
}

export function SkeletonCard({
  hasHeader = true,
  hasFooter = false,
  lines = 3,
}: SkeletonCardProps) {
  return (
    <div className="p-6 rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-sm space-y-4">
      {hasHeader && (
        <div className="flex items-center justify-between pb-2 border-b border-[#EEEEEE] dark:border-[#163854]">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-16" />
        </div>
      )}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-4"
            style={{ width: `${Math.max(45, 95 - i * 15)}%` }}
          />
        ))}
      </div>
      {hasFooter && (
        <div className="pt-2 flex justify-end gap-2 border-t border-[#EEEEEE] dark:border-[#163854]">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      )}
    </div>
  );
}

