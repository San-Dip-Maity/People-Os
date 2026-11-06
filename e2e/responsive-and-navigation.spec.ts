import { test, expect } from "@playwright/test";

test.describe("PeopleOS Responsive & Navigation E2E Tests", () => {
  test("mobile view renders hamburger menu and toggles drawer cleanly", async ({
    page,
  }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/dashboard");

    // Hamburger button should be visible on mobile
    const menuButton = page.getByLabel("Toggle navigation");
    await expect(menuButton).toBeVisible();

    // Click hamburger to open mobile sidebar
    await menuButton.click();

    // Mobile close button should appear
    const closeButton = page.getByLabel("Close sidebar");
    await expect(closeButton).toBeVisible();

    // Navigation links in mobile drawer
    await expect(page.getByText("AI People Copilot").last()).toBeVisible();

    // Click close button
    await closeButton.click();
    await expect(closeButton).not.toBeVisible();
  });

  test("not found 404 page renders gracefully with recovery button", async ({
    page,
  }) => {
    await page.goto("/non-existent-module-path");
    await expect(page.getByText("Page Not Found")).toBeVisible();
    await expect(
      page.getByText("The HR module or resource you requested does not exist")
    ).toBeVisible();

    const backButton = page.getByRole("link", { name: /Back to Dashboard/i });
    await expect(backButton).toBeVisible();
    await backButton.click();

    await page.waitForURL("**/dashboard");
    await expect(page.getByText("Operations Command Center")).toBeVisible();
  });

  test("unauthenticated session checks via API return 401 contract", async ({
    request,
  }) => {
    const res = await request.get("/api/auth/me");
    expect(res.status()).toBe(401);
    const data = await res.json();
    expect(data.authenticated).toBe(false);
    expect(data.user).toBeNull();
  });

  test("desktop sidebar layout persists across route navigation without reloading or unmounting", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/dashboard");

    // Check desktop sidebar is initially expanded
    const aside = page.locator("aside").first();
    await expect(aside).toBeVisible();
    await expect(aside).toHaveClass(/w-64/);

    // Collapse the sidebar
    const collapseBtn = page.getByTestId("collapse-sidebar");
    await expect(collapseBtn).toBeVisible();
    await collapseBtn.click();

    // Verify sidebar is now collapsed (w-16)
    await expect(aside).toHaveClass(/w-16/);

    // Navigate to Employees by clicking the collapsed icon link
    const employeesLink = aside.getByRole("link", { name: /Employees/i });
    await employeesLink.click();

    // Verify navigation occurred to /employees
    await page.waitForURL("**/employees");
    await expect(page.getByRole("heading", { name: /Employee Directory & Lifecycle/i })).toBeVisible();

    // Crucial check: Sidebar state MUST PERSIST (still w-16 collapsed) because AppShell was not unmounted!
    await expect(aside).toHaveClass(/w-16/);

    // Expand sidebar again
    const expandBtn = page.getByTestId("expand-sidebar");
    await expandBtn.scrollIntoViewIfNeeded();
    await expandBtn.click();
    await expect(aside).toHaveClass(/w-64/);

    // Navigate to Leave Management
    const leaveLink = aside.getByRole("link", { name: /Leave Management/i });
    await leaveLink.click();
    await page.waitForURL("**/leave");
    await expect(page.getByRole("heading", { name: /Leave & Air Entitlement Engine/i })).toBeVisible();

    // Sidebar remains expanded (w-64)
    await expect(aside).toHaveClass(/w-64/);
  });
});

