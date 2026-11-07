import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenantId = session.user.memberships[0]?.tenantId;
  if (!tenantId) {
    return NextResponse.json({ error: "Tenant context required" }, { status: 400 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const resource = searchParams.get("resource");

    const auditLogs = await prisma.auditLog.findMany({
      where: {
        tenantId,
        ...(action && action !== "ALL" ? { action } : {}),
        ...(resource && resource !== "ALL" ? { resource } : {}),
      },
      include: {
        actor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const formatted = auditLogs.map((log) => ({
      id: log.id,
      actor: log.actor
        ? `${log.actor.firstName} ${log.actor.lastName} (${log.actor.email})`
        : "System Background / API",
      action: log.action,
      resource: log.resourceId ? `${log.resource} (${log.resourceId.slice(0, 8)})` : log.resource,
      details: typeof log.details === "object" ? JSON.stringify(log.details) : String(log.details || "Action executed"),
      ip: log.ipAddress || "Internal RPC",
      time: log.createdAt.toISOString().replace("T", " ").slice(0, 19) + " UTC",
      badge:
        log.action === "APPROVE" || log.action === "LOGIN"
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
          : log.action === "REJECT" || log.action.includes("DELETE")
          ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
          : log.action.includes("AI")
          ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
          : "bg-[#B9E4E8] text-[#071B2B]",
    }));

    return NextResponse.json({
      success: true,
      logs: formatted,
      totalCount: auditLogs.length,
    });
  } catch (error) {
    console.error("GET /api/audit error:", error);
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });
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
    const { action, resource, resourceId, details } = body;

    const log = await prisma.auditLog.create({
      data: {
        tenantId,
        actorId: session.user.id,
        action: action || "MANUAL_AUDIT_ENTRY",
        resource: resource || "System",
        resourceId: resourceId || null,
        details: details || {},
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
        userAgent: req.headers.get("user-agent") || null,
      },
    });

    return NextResponse.json({
      success: true,
      log,
    });
  } catch (error) {
    console.error("POST /api/audit error:", error);
    return NextResponse.json({ error: "Failed to record audit event" }, { status: 500 });
  }
}

