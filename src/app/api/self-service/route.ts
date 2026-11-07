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
    const userFullName = `${session.user.firstName} ${session.user.lastName}`;

    // Look for matching employee record or default to session user
    const employee = await prisma.employee.findFirst({
      where: {
        tenantId,
        OR: [
          { email: session.user.email },
          { name: userFullName },
        ],
      },
    });

    const leaveRequests = await prisma.leaveRequest.findMany({
      where: {
        tenantId,
        employeeName: userFullName,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const attendance = await prisma.attendanceRecord.findMany({
      where: {
        tenantId,
        employeeName: userFullName,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return NextResponse.json({
      success: true,
      profile: {
        name: userFullName,
        email: session.user.email,
        code: employee?.code || "EMP-0100",
        department: employee?.department || "People Operations",
        designation: employee?.designation || "HR Operations Lead",
        legalEntity: employee?.legalEntity || "Acme Holdings UAE Ltd",
        workLocation: employee?.workLocation || "Dubai Internet City",
        joinDate: employee?.joinDate || "2023-01-10",
      },
      balances: {
        annualLeave: 18.5,
        sickLeave: 12.0,
        casualLeave: 3.0,
        airTicketEntitlements: 1,
      },
      recentLeaves: leaveRequests,
      recentAttendance: attendance,
    });
  } catch (error) {
    console.error("GET /api/self-service error:", error);
    return NextResponse.json({ error: "Failed to fetch self-service data" }, { status: 500 });
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
    const { inquiryText, category } = body;

    if (!inquiryText || typeof inquiryText !== "string" || !inquiryText.trim()) {
      return NextResponse.json({ error: "Inquiry description is required" }, { status: 400 });
    }

    const userFullName = `${session.user.firstName} ${session.user.lastName}`;
    const wfCount = await prisma.workflowItem.count({ where: { tenantId } });
    const wfCode = `WF-${String(wfCount + 1096).padStart(4, "0")}`;

    const workflowItem = await prisma.workflowItem.create({
      data: {
        tenantId,
        code: wfCode,
        title: `HR Service Request: ${category || "General Inquiry"}`,
        type: "HR Inquiry",
        employee: userFullName,
        details: inquiryText.trim().slice(0, 120),
        entity: "Acme Holdings UAE Ltd",
        level: "L1 HR Operations",
        status: "PENDING",
      },
    });

    await prisma.auditLog.create({
      data: {
        tenantId,
        actorId: session.user.id,
        action: "CREATE_HR_TICKET",
        resource: "WorkflowItem",
        resourceId: workflowItem.id,
        details: { category, preview: inquiryText.trim().slice(0, 80) },
      },
    });

    return NextResponse.json({
      success: true,
      message: `HR Inquiry submitted successfully as ${wfCode}.`,
      workflowItem,
    });
  } catch (error) {
    console.error("POST /api/self-service error:", error);
    return NextResponse.json({ error: "Failed to submit HR request" }, { status: 500 });
  }
}

