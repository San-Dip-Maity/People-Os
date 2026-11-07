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
    const payrollRun = await prisma.payrollRun.findFirst({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      include: {
        records: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return NextResponse.json({
      success: true,
      payrollRun,
    });
  } catch (error) {
    console.error("GET /api/payroll error:", error);
    return NextResponse.json({ error: "Failed to fetch payroll data" }, { status: 500 });
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
    const { action } = body; // "lock", "unlock", or "export"

    const latestRun = await prisma.payrollRun.findFirst({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });

    if (!latestRun) {
      return NextResponse.json({ error: "No active payroll run found" }, { status: 404 });
    }

    if (action === "lock") {
      const updated = await prisma.payrollRun.update({
        where: { id: latestRun.id },
        data: {
          locked: true,
          status: "FINALIZED",
          lockedAt: new Date(),
          lockedBy: `${session.user.firstName} ${session.user.lastName}`,
        },
      });

      await prisma.auditLog.create({
        data: {
          tenantId,
          actorId: session.user.id,
          action: "LOCK_PAYROLL",
          resource: "PayrollRun",
          resourceId: latestRun.id,
          details: { cycle: latestRun.cycleName, status: "FINALIZED" },
        },
      });

      return NextResponse.json({
        success: true,
        message: `${latestRun.cycleName} cycle finalized and locked for disbursement.`,
        payrollRun: updated,
      });
    } else if (action === "unlock") {
      const updated = await prisma.payrollRun.update({
        where: { id: latestRun.id },
        data: {
          locked: false,
          status: "PREVIEW",
          lockedAt: null,
          lockedBy: null,
        },
      });

      await prisma.auditLog.create({
        data: {
          tenantId,
          actorId: session.user.id,
          action: "UNLOCK_PAYROLL",
          resource: "PayrollRun",
          resourceId: latestRun.id,
          details: { cycle: latestRun.cycleName, status: "PREVIEW" },
        },
      });

      return NextResponse.json({
        success: true,
        message: `${latestRun.cycleName} cycle reopened for manual retro-adjustments.`,
        payrollRun: updated,
      });
    } else if (action === "export") {
      await prisma.auditLog.create({
        data: {
          tenantId,
          actorId: session.user.id,
          action: "EXPORT_WPS",
          resource: "PayrollRun",
          resourceId: latestRun.id,
          details: { format: "ISO 20022 / SIF", cycle: latestRun.cycleName },
        },
      });

      return NextResponse.json({
        success: true,
        message: "Bank file payment batch generated and logged to audit trail.",
        downloadUrl: `/api/payroll/export?runId=${latestRun.id}`,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("POST /api/payroll error:", error);
    return NextResponse.json({ error: "Failed to update payroll run" }, { status: 500 });
  }
}
