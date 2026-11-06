import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonDrawer() {
  return (
    <div className="w-full max-w-md h-full p-6 border-l border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#EEEEEE] dark:border-[#163854]">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>

      <div className="space-y-3 pt-4 border-t border-[#EEEEEE] dark:border-[#163854]">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>

      <div className="pt-6 flex gap-3">
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 flex-1 rounded-lg" />
      </div>
    </div>
  );
}

