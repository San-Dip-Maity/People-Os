import { Page, expect } from "@playwright/test";

export async function loginAsAdmin(page: Page) {
  await page.goto("/login");
  await page.getByPlaceholder("name@company.com").fill("admin@peopleos.dev");
  await page.getByPlaceholder("••••••••").fill("Admin@PeopleOS2026!");
  await page.getByRole("button", { name: /Sign In to Dashboard/i }).click();
  await page.waitForURL("**/dashboard", { timeout: 15000 });
  await expect(page.getByRole("heading", { name: /Operations Command Center/i })).toBeVisible();
}

