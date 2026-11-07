import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const settingsSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters").optional(),
  timezone: z.string().optional(),
  currency: z.string().optional(),
  workWeek: z.array(z.string()).optional(),
  entities: z.array(z.string()).optional(),
  workLocations: z.array(z.string()).optional(),
});

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenantId = session.user.memberships[0]?.tenantId;
  if (!tenantId) {
    return NextResponse.json({ error: "Tenant context required" }, { status: 400 });
  }

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        _count: {
          select: {
            employees: true,
            users: true,
            leaveRequests: true,
            workflowItems: true,
          },
        },
      },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    return NextResponse.json({ tenant });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json({ error: "Failed to fetch tenant settings" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const membership = session.user.memberships[0];
  if (!membership || !["SUPER_ADMIN", "ORG_ADMIN", "HR_ADMIN"].includes(membership.role)) {
    return NextResponse.json(
      { error: "Insufficient permissions to modify tenant settings" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const validated = settingsSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { name, ...settingsPayload } = validated.data;
    const currentTenant = await prisma.tenant.findUnique({
      where: { id: membership.tenantId },
    });

    const existingSettings = (currentTenant?.settings as Record<string, unknown>) || {};
    const updatedSettings = {
      ...existingSettings,
      ...settingsPayload,
      updatedAt: new Date().toISOString(),
    };

    const updated = await prisma.tenant.update({
      where: { id: membership.tenantId },
      data: {
        ...(name ? { name } : {}),
        settings: updatedSettings,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        tenantId: membership.tenantId,
        actorId: session.user.id,
        action: "UPDATE",
        resource: "TenantSettings",
        resourceId: membership.tenantId,
        details: { updatedSettings, name },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Tenant settings and organization preferences saved successfully to database",
      tenant: updated,
    });
  } catch (error) {
    console.error("PUT /api/settings error:", error);
    return NextResponse.json({ error: "Failed to save tenant settings" }, { status: 500 });
  }
}

