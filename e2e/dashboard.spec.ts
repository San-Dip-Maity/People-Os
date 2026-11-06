import { test, expect } from "@playwright/test";
import path from "path";

test.describe("PeopleOS Dashboard E2E Browser Testing", () => {
  test("loads root and redirects to dashboard with full application shell", async ({
    page,
  }) => {
    // 1. Visit root
    await page.goto("/");
    await page.waitForURL("**/dashboard");

    // 2. Validate branding and layout
    await expect(page.getByText("PeopleOS").first()).toBeVisible();
    await expect(page.getByText("People Operations Platform")).toBeVisible();
    await expect(page.getByText("Operations Command Center")).toBeVisible();
    await expect(page.getByText("Tenant: Acme Global (UAE / IND)")).toBeVisible();

    // 3. Validate AI Insights banner
    await expect(
      page.getByText("AI Workforce Insight • Effective Date Aware")
    ).toBeVisible();

    // 4. Validate KPI cards
    await expect(page.getByText("Total Headcount")).toBeVisible();
    await expect(page.getByText("1,248")).toBeVisible();
    await expect(page.getByText("Today's Attendance")).toBeVisible();
    await expect(page.getByText("96.4%")).toBeVisible();
    await expect(page.getByText("Pending Approvals")).toBeVisible();
    await expect(page.getByText("Leaves, Regularizations & Air")).toBeVisible();

    // Take screenshot of Light Mode
    const screenshotDir = path.resolve(process.cwd(), "public/screenshots");
    await page.screenshot({
      path: path.join(screenshotDir, "dashboard-light.png"),
      fullPage: true,
    });

    // 5. Interact with Self-Service Attendance Punch
    const clockButton = page.getByRole("button", { name: /Clock In \(Web Punch\)/i });
    await expect(clockButton).toBeVisible();
    await clockButton.click();

    // Verify clock-out button appears
    await expect(
      page.getByRole("button", { name: /Clock Out for Today/i })
    ).toBeVisible();
    await expect(page.getByText("07h 42m")).toBeVisible();

    // 6. Test Theme Toggle (Light -> Dark)
    const themeButton = page.getByRole("button", { name: /Toggle theme/i });
    await expect(themeButton).toBeVisible();
    await themeButton.click();
    await page.getByRole("button", { name: /Dark/i }).click();

    // Give theme switch a moment
    await page.waitForTimeout(500);

    // Verify dark class on html
    const html = page.locator("html");
    await expect(html).toHaveClass(/dark/);

    // Take screenshot of Dark Mode
    await page.screenshot({
      path: path.join(screenshotDir, "dashboard-dark.png"),
      fullPage: true,
    });

    // 7. Test User Profile Dropdown
    const profileButton = page.getByText("Alex Morgan").first();
    await profileButton.click();
    await expect(page.getByText("alex.morgan@acmetech.com")).toBeVisible();
    await expect(page.getByText("Security & MFA")).toBeVisible();
    await expect(page.getByText("Sign Out")).toBeVisible();
  });
});
