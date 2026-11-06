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
});

