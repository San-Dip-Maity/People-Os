import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonForm({ fields = 6 }: { fields?: number }) {
  return (
    <div className="p-6 rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-sm space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-[#EEEEEE] dark:border-[#163854]">
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  );
}

