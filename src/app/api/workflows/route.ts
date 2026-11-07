import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const workflowDecisionSchema = z.object({
  id: z.string().min(1, "Workflow ID is required"),
  decision: z.enum(["APPROVED", "REJECTED"]),
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
    const workflows = await prisma.workflowItem.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ workflows });
  } catch (error) {
    console.error("GET /api/workflows error:", error);
    return NextResponse.json({ error: "Failed to fetch workflow queue" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenantId = session.user.memberships[0]?.tenantId;
  if (!tenantId) {
    return NextResponse.json({ error: "Tenant context required" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const validated = workflowDecisionSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { id, decision } = validated.data;

    // Support lookup by either database ID or business code (e.g. WF-1092)
    const existing = await prisma.workflowItem.findFirst({
      where: {
        tenantId,
        OR: [{ id }, { code: id }],
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Workflow request not found" }, { status: 404 });
    }

    const approverName = `${session.user.firstName} ${session.user.lastName}`;
    const updated = await prisma.workflowItem.update({
      where: { id: existing.id },
      data: {
        status: decision,
        approvedBy: approverName,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        tenantId,
        actorId: session.user.id,
        action: decision,
        resource: "WorkflowItem",
        resourceId: existing.id,
        details: { code: existing.code, decision, approver: approverName },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Workflow ${existing.code} (${existing.title}) has been ${decision.toLowerCase()} successfully`,
      workflow: updated,
    });
  } catch (error) {
    console.error("PATCH /api/workflows error:", error);
    return NextResponse.json({ error: "Failed to record workflow decision" }, { status: 500 });
  }
}
