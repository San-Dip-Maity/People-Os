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
    const code = searchParams.get("code");

    const holidays = await prisma.holiday.findMany({
      where: {
        tenantId,
        ...(code ? { calendarCode: code.toUpperCase() } : {}),
      },
      orderBy: { date: "asc" },
    });

    const grouped: Record<string, typeof holidays> = {
      UAE: holidays.filter((h) => h.calendarCode === "UAE"),
      IND: holidays.filter((h) => h.calendarCode === "IND"),
      USA: holidays.filter((h) => h.calendarCode === "USA"),
    };

    return NextResponse.json({
      success: true,
      holidays: code ? holidays : grouped,
    });
  } catch (error) {
    console.error("GET /api/holidays error:", error);
    return NextResponse.json({ error: "Failed to fetch holidays" }, { status: 500 });
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
    const { calendarCode, name, date, type, daysCount } = body;

    if (!calendarCode || !name || !date) {
      return NextResponse.json({ error: "Calendar code, name, and date are required" }, { status: 400 });
    }

    const holiday = await prisma.holiday.create({
      data: {
        tenantId,
        calendarCode: calendarCode.toUpperCase(),
        name,
        date,
        type: type || "Public Holiday",
        daysCount: daysCount ? Number(daysCount) : 1,
      },
    });

    await prisma.auditLog.create({
      data: {
        tenantId,
        actorId: session.user.id,
        action: "ADD_HOLIDAY",
        resource: "Holiday",
        resourceId: holiday.id,
        details: { calendarCode, name, date },
      },
    });

    return NextResponse.json({
      success: true,
      holiday,
    });
  } catch (error) {
    console.error("POST /api/holidays error:", error);
    return NextResponse.json({ error: "Failed to add holiday" }, { status: 500 });
  }
}

