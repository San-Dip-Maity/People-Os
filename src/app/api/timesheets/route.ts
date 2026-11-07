import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    const timesheets = await prisma.timesheet.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      timesheets,
    });
  } catch (error) {
    console.error("GET /api/timesheets error:", error);
    return NextResponse.json({ error: "Failed to fetch timesheets" }, { status: 500 });
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
    const { weekNumber, weekRange, totalHours, reviewer } = body;
    const userFullName = `${session.user.firstName} ${session.user.lastName}`;

    const timesheet = await prisma.timesheet.create({
      data: {
        tenantId,
        employeeName: userFullName,
        weekNumber: weekNumber || 45,
        weekRange: weekRange || "Nov 02 — Nov 06, 2026",
        totalHours: totalHours ? Number(totalHours) : 40.0,
        status: "SUBMITTED",
        reviewer: reviewer || "Marcus Vance (VP Engineering)",
      },
    });

    const wfCount = await prisma.workflowItem.count({ where: { tenantId } });
    const wfCode = `WF-${String(wfCount + 1095).padStart(4, "0")}`;

    await prisma.workflowItem.create({
      data: {
        tenantId,
        code: wfCode,
        title: `Timesheet Review (Week ${timesheet.weekNumber})`,
        type: "Timesheet Approval",
        employee: userFullName,
        details: `${timesheet.totalHours} billable hours (${timesheet.weekRange})`,
        entity: "Acme Holdings UAE Ltd",
        level: "L1 Manager Approval",
        status: "PENDING",
      },
    });

    await prisma.auditLog.create({
      data: {
        tenantId,
        actorId: session.user.id,
        action: "SUBMIT_TIMESHEET",
        resource: "Timesheet",
        resourceId: timesheet.id,
        details: { weekNumber: timesheet.weekNumber, totalHours: timesheet.totalHours },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Weekly timesheet (${timesheet.totalHours}h) submitted for review. Created approval item ${wfCode}.`,
      timesheet,
    });
  } catch (error) {
    console.error("POST /api/timesheets error:", error);
    return NextResponse.json({ error: "Failed to submit timesheet" }, { status: 500 });
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
    const { id, decision } = body; // "APPROVED" | "REJECTED"

    if (!id || !decision) {
      return NextResponse.json({ error: "ID and decision required" }, { status: 400 });
    }

    const updated = await prisma.timesheet.update({
      where: { id },
      data: { status: decision },
    });

    return NextResponse.json({
      success: true,
      timesheet: updated,
    });
  } catch (error) {
    console.error("PATCH /api/timesheets error:", error);
    return NextResponse.json({ error: "Failed to update timesheet" }, { status: 500 });
  }
}

