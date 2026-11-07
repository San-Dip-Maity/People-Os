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
    const goals = await prisma.goalOKR.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      cycle: {
        name: "Annual Performance Cycle 2026 (H2 Review)",
        phase: "Self-Assessments & Manager Check-ins (Deadline: Dec 15, 2026)",
        status: "ACTIVE",
      },
      goals,
    });
  } catch (error) {
    console.error("GET /api/performance error:", error);
    return NextResponse.json({ error: "Failed to fetch performance goals" }, { status: 500 });
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
    const { title, category, owner, department, targetDate } = body;

    if (!title || !department) {
      return NextResponse.json({ error: "Title and department are required" }, { status: 400 });
    }

    const goal = await prisma.goalOKR.create({
      data: {
        tenantId,
        title,
        category: category || "DEPARTMENT",
        owner: owner || `${session.user.firstName} ${session.user.lastName}`,
        department,
        progress: 0,
        targetDate: targetDate || "2026-12-31",
        status: "ON_TRACK",
      },
    });

    await prisma.auditLog.create({
      data: {
        tenantId,
        actorId: session.user.id,
        action: "CREATE_GOAL",
        resource: "GoalOKR",
        resourceId: goal.id,
        details: { title, category, department },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Goal "${title}" defined successfully.`,
      goal,
    });
  } catch (error) {
    console.error("POST /api/performance error:", error);
    return NextResponse.json({ error: "Failed to create goal" }, { status: 500 });
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
    const { id, progress, status } = body;

    if (!id) {
      return NextResponse.json({ error: "Goal ID is required" }, { status: 400 });
    }

    const updated = await prisma.goalOKR.update({
      where: { id },
      data: {
        ...(progress !== undefined ? { progress: Math.min(100, Math.max(0, Number(progress))) } : {}),
        ...(status ? { status } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      goal: updated,
    });
  } catch (error) {
    console.error("PATCH /api/performance error:", error);
    return NextResponse.json({ error: "Failed to update goal" }, { status: 500 });
  }
}
