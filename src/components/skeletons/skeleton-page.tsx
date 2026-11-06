import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonStatGrid } from "./skeleton-stat";
import { SkeletonTable } from "./skeleton-table";

export function SkeletonPage() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-1.5">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-28 rounded-lg" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
      </div>

      {/* KPI Cards */}
      <SkeletonStatGrid count={4} />

      {/* Main Content / Table */}
      <SkeletonTable rows={6} columns={5} />
    </div>
  );
}

