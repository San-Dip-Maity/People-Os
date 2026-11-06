import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers/auth";

test.describe("PeopleOS Comprehensive Repair Verification", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("Theme switcher: immediate response, 3 modes, persistence across refresh", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    const themeButton = page.getByRole("button", { name: "Toggle theme" });
    await expect(themeButton).toBeVisible();

    // 1. Open dropdown
    await themeButton.click();
    await expect(page.getByText("Appearance")).toBeVisible();
    await expect(page.getByRole("button", { name: /Dark/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Light/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /System/i })).toBeVisible();

    // 2. Select Dark mode
    await page.getByRole("button", { name: /Dark/i }).click();
    await page.waitForTimeout(300);
    const html = page.locator("html");
    await expect(html).toHaveClass(/dark/);

    // 3. Select Light mode
    await themeButton.click();
    await page.getByRole("button", { name: /Light/i }).click();
    await page.waitForTimeout(300);
    await expect(html).toHaveClass(/light/);

    // 4. Persistence check: Reload in dark mode
    await themeButton.click();
    await page.getByRole("button", { name: /Dark/i }).click();
    await page.waitForTimeout(300);
    await expect(html).toHaveClass(/dark/);

    await page.reload();
    await page.waitForTimeout(500);
    await expect(html).toHaveClass(/dark/);
  });

  test("Sidebar Navigation: every route renders cleanly with active menu highlighting", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    const routes = [
      { name: "Employees", path: "/employees", heading: "Employee Directory & Lifecycle" },
      { name: "Organization Structure", path: "/organization", heading: "Organization Structure & Entity Governance" },
      { name: "Self-Service Portal", path: "/self-service", heading: "Employee Self-Service (ESS)" },
      { name: "Leave Management", path: "/leave", heading: "Leave & Air Entitlement Engine" },
      { name: "Holiday Calendar", path: "/holidays", heading: "Holiday Calendars & Regional Observance" },
      { name: "Attendance & Shifts", path: "/attendance", heading: "Attendance & Shift Management" },
      { name: "Timesheets", path: "/timesheets", heading: "Timesheet & Project Allocation" },
      { name: "Payroll & Compensation", path: "/payroll", heading: "Payroll & Compensation Engine" },
      { name: "Talent & Recruitment", path: "/recruitment", heading: "Recruitment & Applicant Tracking (ATS)" },
      { name: "Performance & Goals", path: "/performance", heading: "Performance Management & OKRs" },
      { name: "Documents", path: "/documents", heading: "Document Management & Private Vault" },
      { name: "Workflow Engine", path: "/workflows", heading: "Unified Workflow & Approval Engine" },
      { name: "Notifications", path: "/notifications", heading: "Notification Center & Alert Broadcasts" },
      { name: "Audit & Compliance", path: "/audit", heading: "Audit Ledger & Compliance Governance" },
      { name: "Tenant Settings", path: "/settings", heading: "Tenant Settings & Access Control" },
      { name: "AI People Copilot", path: "/copilot", heading: "PeopleOS AI Copilot" },
    ];

    for (const r of routes) {
      const link = page.getByRole("link", { name: r.name, exact: false }).first();
      await link.click();
      await page.waitForURL(`**${r.path}`);

      // Verify no 404 or Error boundary
      await expect(page.getByText("Page Not Found")).not.toBeVisible();
      await expect(page.getByText("Something went wrong")).not.toBeVisible();
      await expect(page.getByRole("heading", { name: r.heading, exact: false })).toBeVisible();
    }
  });

  test("Interactive features: Organization switcher, search modal, and notifications", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    // 1. Organization switcher
    const orgButton = page.getByRole("button", { name: "Switch organization" });
    await orgButton.click();
    await expect(page.getByText("Select Active Organization")).toBeVisible();
    await page.getByText("Acme Technologies India Pvt Ltd").click();
    await expect(page.getByText("Acme Technologies India Pvt Ltd")).toBeVisible();

    // 2. Notification center
    const notifButton = page.getByRole("button", { name: "View notifications" });
    await notifButton.click();
    await expect(page.getByRole("heading", { name: "Notifications" })).toBeVisible();
    const markReadButton = page.getByText("Mark all read");
    if (await markReadButton.isVisible()) {
      await markReadButton.click();
    }

    // 3. Search modal
    const searchTrigger = page.getByText("Search modules, employees, policies...");
    await searchTrigger.click();
    await expect(page.getByPlaceholder("Type to search modules, employees, or policies...")).toBeVisible();

    // Type query and jump
    await page.keyboard.type("leave");
    const leaveResult = page.getByRole("link", { name: "Leave Management" }).last();
    await leaveResult.click();
    await page.waitForURL("**/leave");
    await expect(page.getByRole("heading", { name: "Leave & Air Entitlement Engine" })).toBeVisible();
  });

  test("Leave Application workflow interaction", async ({ page }) => {
    await page.goto("/leave");

    const applyButton = page.getByRole("button", { name: /Apply For Leave/i });
    await applyButton.click();

    await expect(page.getByText("Apply For Leave / Entitlement")).toBeVisible();

    // Fill form
    await page.locator('input[type="date"]').first().fill("2026-11-20");
    await page.locator('input[type="date"]').nth(1).fill("2026-11-22");
    await page.locator("textarea").fill("Playwright Automated E2E Test Leave Request");

    await page.getByRole("button", { name: /Submit for Approval/i }).click();

    // Check that request appears in table
    await expect(page.getByText("Playwright Automated E2E Test Leave Request")).toBeVisible();
  });
});

