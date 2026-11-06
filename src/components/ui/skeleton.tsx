import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shimmer?: boolean;
}

export function Skeleton({
  className,
  shimmer = false,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-md bg-zinc-200 dark:bg-zinc-800",
        shimmer ? "animate-shimmer" : "animate-pulse",
        className
      )}
      {...props}
    />
  );
}
