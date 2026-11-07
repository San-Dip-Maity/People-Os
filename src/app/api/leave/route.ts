import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const leaveSchema = z.object({
  employeeName: z.string().min(2, "Employee name is required"),
  department: z.string().min(1, "Department is required"),
  type: z.string().min(1, "Leave type is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  daysCount: z.number().positive("Days count must be positive"),
  reason: z.string().min(3, "Reason must be at least 3 characters"),
});

const decisionSchema = z.object({
  id: z.string().uuid("Invalid leave ID"),
  decision: z.enum(["APPROVED", "REJECTED"]),
  decisionNotes: z.string().optional(),
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
    const leaveRequests = await prisma.leaveRequest.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ leaveRequests });
  } catch (error) {
    console.error("GET /api/leave error:", error);
    return NextResponse.json({ error: "Failed to fetch leave records" }, { status: 500 });
  }
}

export async function POST(req: Request) {
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
    const validated = leaveSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { employeeName, department, type, startDate, endDate, daysCount, reason } =
      validated.data;

    // Check if start date is after end date
    if (new Date(startDate) > new Date(endDate)) {
      return NextResponse.json(
        { error: "Start date cannot be after end date" },
        { status: 400 }
      );
    }

    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        tenantId,
        employeeName,
        department,
        type,
        startDate,
        endDate,
        daysCount,
        reason,
        status: "PENDING",
      },
    });

    // Also register workflow queue item so it appears across dashboard and workflows engine
    const wfCount = await prisma.workflowItem.count({ where: { tenantId } });
    await prisma.workflowItem.create({
      data: {
        tenantId,
        code: `WF-${1100 + wfCount}`,
        title: `${type} Request`,
        type,
        employee: employeeName,
        details: `${daysCount} days (${startDate} to ${endDate})`,
        entity: "Acme Holdings UAE Ltd",
        level: "L1 Manager Approval",
        status: "PENDING",
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        tenantId,
        actorId: session.user.id,
        action: "CREATE",
        resource: "LeaveRequest",
        resourceId: leaveRequest.id,
        details: { type, daysCount, startDate, endDate },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Leave application for ${daysCount} day(s) submitted successfully`,
        leaveRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/leave error:", error);
    return NextResponse.json({ error: "Failed to submit leave application" }, { status: 500 });
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
    const validated = decisionSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { id, decision, decisionNotes } = validated.data;

    const existing = await prisma.leaveRequest.findUnique({
      where: { id },
    });

    if (!existing || existing.tenantId !== tenantId) {
      return NextResponse.json({ error: "Leave request not found" }, { status: 404 });
    }

    const updated = await prisma.leaveRequest.update({
      where: { id },
      data: {
        status: decision,
        approvedBy: `${session.user.firstName} ${session.user.lastName}`,
        decisionNotes: decisionNotes || `Request ${decision.toLowerCase()} by HR/Manager`,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        tenantId,
        actorId: session.user.id,
        action: decision,
        resource: "LeaveRequest",
        resourceId: id,
        details: { status: decision, approvedBy: updated.approvedBy },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Leave request ${decision.toLowerCase()} successfully`,
      leaveRequest: updated,
    });
  } catch (error) {
    console.error("PATCH /api/leave error:", error);
    return NextResponse.json({ error: "Failed to update leave status" }, { status: 500 });
  }
}

