import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers/auth";

test.describe("PeopleOS — Complete Application, Landing Page & Auth Verification", () => {
  // -------------------------------------------------------------
  // Journey A: Public Visitor Experience
  // -------------------------------------------------------------
  test("Journey A: Public visitor lands on '/', browses features, navigates to login and signup", async ({
    page,
  }) => {
    // 1. Visit root landing page
    await page.goto("/");
    await expect(page).toHaveTitle(/PeopleOS/);

    // 2. Verify branding and header
    await expect(page.getByText("People Operations Platform").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: /The Intelligent HRMS for Modern Global Enterprise/i })).toBeVisible();

    // 3. Verify sections exist and are populated
    await expect(page.getByText("Multi-Tenant & Multi-Entity Isolation")).toBeVisible();
    await expect(page.getByText("16 Integrated Enterprise HRMS Modules")).toBeVisible();
    await expect(page.getByText("AI Copilot for People Operations & Policy Guidance")).toBeVisible();
    await expect(page.getByText("Enterprise-Grade Data Isolation & Compliance")).toBeVisible();

    // 4. Click Sign In CTA from landing page header
    const signInBtn = page.getByRole("link", { name: "Sign In", exact: true }).first();
    await expect(signInBtn).toBeVisible();
    await signInBtn.click();
    await page.waitForURL("**/login");
    await expect(page.getByRole("heading", { name: /Sign in to your organization/i })).toBeVisible();

    // 5. Navigate back to landing page
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /The Intelligent HRMS/i })).toBeVisible();

    // 6. Click Get Started CTA
    const getStartedBtn = page.getByRole("link", { name: /Get Started/i }).first();
    await expect(getStartedBtn).toBeVisible();
    await getStartedBtn.click();
    await page.waitForURL("**/signup");
    await expect(page.getByRole("heading", { name: /Create an Organization Account/i })).toBeVisible();
  });

  // -------------------------------------------------------------
  // Journey B: Signup & Validation
  // -------------------------------------------------------------
  test("Journey B: Registration validation, weak password enforcement, duplicate email rejection, and account creation", async ({
    page,
  }) => {
    await page.goto("/signup");

    // 1. Test weak password validation
    await page.getByPlaceholder("Sarah Connor").fill("Jane Doe");
    await page.getByPlaceholder("sarah@acme.com").fill("jane.doe@example.com");
    await page.getByPlaceholder("Acme Global Inc").fill("Acme Corp Innovations");
    await page.locator('input[type="password"]').first().fill("short");
    await page.locator('input[type="password"]').nth(1).fill("short");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: /Create Organization/i }).click();

    // Should display validation error
    await expect(page.getByText(/Password must meet all complexity requirements/i)).toBeVisible();

    // 2. Test duplicate email rejection (admin@peopleos.dev is already seeded)
    await page.getByPlaceholder("sarah@acme.com").fill("admin@peopleos.dev");
    await page.locator('input[type="password"]').first().fill("StrongPass2026!");
    await page.locator('input[type="password"]').nth(1).fill("StrongPass2026!");
    await page.getByRole("button", { name: /Create Organization/i }).click();

    await expect(page.getByText(/An account with this work email address already exists/i)).toBeVisible();

    // 3. Test successful fresh registration
    const uniqueEmail = `test.user.${Date.now()}@domain-${Math.random().toString(36).substring(2, 6)}.dev`;
    await page.getByPlaceholder("sarah@acme.com").fill(uniqueEmail);
    await page.getByPlaceholder("Acme Global Inc").fill("Nova Dynamics Global");
    await page.locator('input[type="password"]').first().fill("NovaEnterprise2026!");
    await page.locator('input[type="password"]').nth(1).fill("NovaEnterprise2026!");
    await page.getByRole("button", { name: /Create Organization/i }).click();

    // Verify success banner and redirect into dashboard
    await expect(page.getByText(/Workspace provisioned successfully/i)).toBeVisible();
    await page.waitForURL("**/dashboard", { timeout: 15000 });
    await expect(page.getByRole("heading", { name: /Operations Command Center/i })).toBeVisible();
  });

  // -------------------------------------------------------------
  // Journey C: Login & Invalid Credential Handling
  // -------------------------------------------------------------
  test("Journey C: Login handles incorrect credentials, accepts valid admin, and redirects correctly", async ({
    page,
  }) => {
    await page.goto("/login");

    // 1. Test invalid password
    await page.getByPlaceholder("name@company.com").fill("admin@peopleos.dev");
    await page.getByPlaceholder("••••••••").fill("WrongPassword123!");
    await page.getByRole("button", { name: /Sign In to Dashboard/i }).click();

    await expect(page.getByText(/Invalid email or password/i)).toBeVisible();

    // 2. Test valid admin login with Remember Me
    await page.getByPlaceholder("••••••••").fill("Admin@PeopleOS2026!");
    await page.getByLabel("Keep me signed in (30 days)").check();
    await page.getByRole("button", { name: /Sign In to Dashboard/i }).click();

    // Verify dashboard arrival
    await page.waitForURL("**/dashboard", { timeout: 15000 });
    await expect(page.getByRole("heading", { name: /Operations Command Center/i })).toBeVisible();

    // Verify authenticated user cannot re-open /login without logging out
    await page.goto("/login");
    await page.waitForURL("**/dashboard");
  });

  // -------------------------------------------------------------
  // Journey D: Logout & Route Protection
  // -------------------------------------------------------------
  test("Journey D: Logout terminates session, clears cookies, and blocks access to protected routes", async ({
    page,
  }) => {
    // 1. Sign in as admin
    await loginAsAdmin(page);

    // 2. Open user profile menu in header
    const profileBtn = page.getByRole("button", { name: "User profile menu" });
    await expect(profileBtn).toBeVisible();
    await profileBtn.click();

    // 3. Click Sign Out
    const signOutBtn = page.getByRole("button", { name: "Sign Out" });
    await expect(signOutBtn).toBeVisible();
    await signOutBtn.click();

    // 4. Verify redirected to /login
    await page.waitForURL("**/login");
    await expect(page.getByRole("heading", { name: /Sign in to your organization/i })).toBeVisible();

    // 5. Attempt direct access to protected /dashboard
    await page.goto("/dashboard");
    // Should be redirected back to /login with returnUrl parameter
    await page.waitForURL("**/login**");
    await expect(page.getByRole("heading", { name: /Sign in to your organization/i })).toBeVisible();

    // 6. Attempt direct access to protected /employees
    await page.goto("/employees");
    await page.waitForURL("**/login?returnUrl=%2Femployees");
  });

  // -------------------------------------------------------------
  // Journey E: Theme Persistence Across Landing and Auth Pages
  // -------------------------------------------------------------
  test("Journey E: Theme switcher responds immediately and persists across landing, login, and refresh", async ({
    page,
  }) => {
    await page.goto("/");

    const themeButton = page.getByRole("button", { name: "Toggle theme" });
    await expect(themeButton).toBeVisible();

    // Switch to Dark Mode on landing page
    await themeButton.click();
    await page.getByRole("button", { name: /Dark/i }).click();
    await page.waitForTimeout(200);
    const html = page.locator("html");
    await expect(html).toHaveClass(/dark/);

    // Navigate to /login and verify Dark Mode persists
    await page.goto("/login");
    await page.waitForTimeout(200);
    await expect(html).toHaveClass(/dark/);

    // Switch to Light Mode
    const loginThemeBtn = page.getByRole("button", { name: "Toggle theme" });
    await loginThemeBtn.click();
    await page.getByRole("button", { name: /Light/i }).click();
    await page.waitForTimeout(200);
    await expect(html).toHaveClass(/light/);

    // Refresh and verify persistence
    await page.reload();
    await page.waitForTimeout(200);
    await expect(html).toHaveClass(/light/);
  });
});
