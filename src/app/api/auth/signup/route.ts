import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";
import { signupSchema } from "@/lib/validations/auth";

function slugify(text: string): string {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "org";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = signupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { fullName, email, password, organizationName } = result.data;
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check for duplicate email
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error:
            "An account with this work email address already exists. Please sign in instead.",
        },
        { status: 409 }
      );
    }

    // 2. Parse first & last name
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || "User";
    const lastName = nameParts.slice(1).join(" ") || "Admin";

    // 3. Generate unique tenant slug
    let tenantSlug = slugify(organizationName);
    const slugCollision = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
    });
    if (slugCollision) {
      tenantSlug = `${tenantSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    // 4. Hash password
    const passwordHash = await hashPassword(password);

    // 5. Atomic Tenant + User + Membership creation
    const { user, tenant } = await prisma.$transaction(async (tx) => {
      const newTenant = await tx.tenant.create({
        data: {
          name: organizationName.trim(),
          slug: tenantSlug,
          isActive: true,
          settings: {
            currency: "USD",
            timezone: "UTC",
            workWeek: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
          },
        },
      });

      const newUser = await tx.user.create({
        data: {
          email: normalizedEmail,
          passwordHash,
          firstName,
          lastName,
          isActive: true,
          isSuperAdmin: false,
        },
      });

      await tx.userMembership.create({
        data: {
          tenantId: newTenant.id,
          userId: newUser.id,
          role: "ORG_ADMIN",
          isActive: true,
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: newUser.id,
          tenantId: newTenant.id,
          action: "SIGNUP",
          resource: "Tenant",
          resourceId: newTenant.id,
          details: {
            organizationName: newTenant.name,
            creatorEmail: newUser.email,
          },
        },
      });

      return { user: newUser, tenant: newTenant };
    });

    // 6. Establish authenticated session
    const userAgent = req.headers.get("user-agent") || undefined;
    const ipAddress =
      req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || undefined;

    await createSession(user.id, userAgent, ipAddress);

    return NextResponse.json(
      {
        success: true,
        message: "Account and organization created successfully",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          organization: {
            id: tenant.id,
            name: tenant.name,
            slug: tenant.slug,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error during registration" },
      { status: 500 }
    );
  }
}
