import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  SkeletonStat,
  SkeletonCard,
  SkeletonTable,
  SkeletonProfile,
  SkeletonForm,
  SkeletonPage,
} from "@/components/skeletons";

describe("Skeleton Loading System", () => {
  it("renders SkeletonStat without layout error", () => {
    const { container } = render(<SkeletonStat />);
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders SkeletonCard with custom lines", () => {
    const { container } = render(<SkeletonCard lines={4} hasHeader hasFooter />);
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(3);
  });

  it("renders SkeletonTable with matching row count", () => {
    const { container } = render(<SkeletonTable rows={4} columns={3} />);
    const rows = container.querySelectorAll(".divide-y > div");
    expect(rows.length).toBe(4);
  });

  it("renders SkeletonProfile and SkeletonForm", () => {
    const { container: profile } = render(<SkeletonProfile />);
    expect(profile.firstChild).toBeInTheDocument();

    const { container: form } = render(<SkeletonForm fields={4} />);
    expect(form.firstChild).toBeInTheDocument();
  });

  it("renders SkeletonPage containing stat grids and table placeholder", () => {
    const { container } = render(<SkeletonPage />);
    expect(container.querySelector(".grid")).toBeInTheDocument();
  });
});
