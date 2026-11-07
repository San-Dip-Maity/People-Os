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
    const requisitions = await prisma.jobRequisition.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });

    const activeCount = requisitions.filter((r) => r.status !== "CLOSED").length;
    const totalApplicants = requisitions.reduce((acc, curr) => acc + curr.applicantsCount, 0);

    return NextResponse.json({
      success: true,
      requisitions,
      stats: {
        activeOpenings: activeCount,
        candidatesInPipeline: totalApplicants,
        interviewsScheduled: 19,
        offersPending: 4,
      },
    });
  } catch (error) {
    console.error("GET /api/recruitment error:", error);
    return NextResponse.json({ error: "Failed to fetch recruitment data" }, { status: 500 });
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
    const { title, department, legalEntity, workLocation } = body;

    if (!title || !department || !legalEntity) {
      return NextResponse.json({ error: "Title, department, and legal entity are required" }, { status: 400 });
    }

    const count = await prisma.jobRequisition.count({ where: { tenantId } });
    const code = `REQ-${String(count + 101).padStart(4, "0")}`;

    const requisition = await prisma.jobRequisition.create({
      data: {
        tenantId,
        code,
        title,
        department,
        legalEntity,
        workLocation: workLocation || "Global / Remote",
        applicantsCount: 0,
        status: "PUBLISHED",
      },
    });

    await prisma.auditLog.create({
      data: {
        tenantId,
        actorId: session.user.id,
        action: "CREATE_REQUISITION",
        resource: "JobRequisition",
        resourceId: requisition.id,
        details: { code, title, department },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Job requisition ${code} created and published.`,
      requisition,
    });
  } catch (error) {
    console.error("POST /api/recruitment error:", error);
    return NextResponse.json({ error: "Failed to create job requisition" }, { status: 500 });
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
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Requisition ID and status are required" }, { status: 400 });
    }

    const updated = await prisma.jobRequisition.update({
      where: { id },
      data: { status },
    });

    await prisma.auditLog.create({
      data: {
        tenantId,
        actorId: session.user.id,
        action: "UPDATE_REQUISITION",
        resource: "JobRequisition",
        resourceId: id,
        details: { status },
      },
    });

    return NextResponse.json({
      success: true,
      requisition: updated,
    });
  } catch (error) {
    console.error("PATCH /api/recruitment error:", error);
    return NextResponse.json({ error: "Failed to update requisition" }, { status: 500 });
  }
}

