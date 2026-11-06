import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, generateSessionToken } from "@/lib/auth";
import { loginSchema, registerSchema } from "@/lib/validations/auth";

describe("Authentication Utilities", () => {
  it("hashes and verifies passwords securely", async () => {
    const password = "StrongPassword123!";
    const hash = await hashPassword(password);

    expect(hash).not.toBe(password);
    expect(hash.startsWith("$2")).toBe(true);

    const isMatch = await verifyPassword(password, hash);
    expect(isMatch).toBe(true);

    const isWrongMatch = await verifyPassword("WrongPassword", hash);
    expect(isWrongMatch).toBe(false);
  });

  it("generates 64-char crypto hex session tokens", () => {
    const token1 = generateSessionToken();
    const token2 = generateSessionToken();

    expect(token1).toHaveLength(64);
    expect(token2).toHaveLength(64);
    expect(token1).not.toBe(token2);
  });

  it("validates login input with Zod schema", () => {
    const valid = loginSchema.safeParse({
      email: "hr@peopleos.internal",
      password: "securePassword123",
    });
    expect(valid.success).toBe(true);

    const invalidEmail = loginSchema.safeParse({
      email: "not-an-email",
      password: "securePassword123",
    });
    expect(invalidEmail.success).toBe(false);

    const shortPassword = loginSchema.safeParse({
      email: "hr@peopleos.internal",
      password: "short",
    });
    expect(shortPassword.success).toBe(false);
  });

  it("validates registration input and tenant slug restrictions", () => {
    const valid = registerSchema.safeParse({
      email: "admin@acme.com",
      password: "complexPassword#1",
      firstName: "Admin",
      lastName: "User",
      tenantName: "Acme Corp",
      tenantSlug: "acme-corp",
    });
    expect(valid.success).toBe(true);

    const invalidSlug = registerSchema.safeParse({
      email: "admin@acme.com",
      password: "complexPassword#1",
      firstName: "Admin",
      lastName: "User",
      tenantName: "Acme Corp",
      tenantSlug: "Acme_Corp 123!", // Uppercase & symbols not allowed
    });
    expect(invalidSlug.success).toBe(false);
  });
});

