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
    const category = searchParams.get("category");

    const notifications = await prisma.notification.findMany({
      where: {
        tenantId,
        ...(category && category !== "ALL" ? { category: category.toUpperCase() } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
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
    const { id, all } = body;

    if (all) {
      await prisma.notification.updateMany({
        where: { tenantId, isRead: false },
        data: { isRead: true },
      });

      return NextResponse.json({
        success: true,
        message: "All notifications marked as read.",
      });
    }

    if (id) {
      const updated = await prisma.notification.update({
        where: { id },
        data: { isRead: true },
      });

      return NextResponse.json({
        success: true,
        notification: updated,
      });
    }

    return NextResponse.json({ error: "ID or all flag required" }, { status: 400 });
  } catch (error) {
    console.error("PATCH /api/notifications error:", error);
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 });
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
    const { title, description, category, link } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description required" }, { status: 400 });
    }

    const notification = await prisma.notification.create({
      data: {
        tenantId,
        title,
        description,
        category: category || "SYSTEM",
        link: link || null,
        isRead: false,
      },
    });

    return NextResponse.json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error("POST /api/notifications error:", error);
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
  }
}

