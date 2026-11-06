import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonProfile() {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="p-6 rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <Skeleton className="h-24 w-24 rounded-full shrink-0" />
        <div className="space-y-2.5 flex-1 text-center sm:text-left">
          <Skeleton className="h-7 w-48 mx-auto sm:mx-0" />
          <Skeleton className="h-4 w-64 mx-auto sm:mx-0" />
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#EEEEEE] dark:border-[#163854] pb-2">
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      {/* Tab Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] space-y-4">
          <Skeleton className="h-5 w-36" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between py-1 border-b border-[#EEEEEE] dark:border-[#163854]">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] space-y-4">
          <Skeleton className="h-5 w-40" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between py-1 border-b border-[#EEEEEE] dark:border-[#163854]">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-36" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

