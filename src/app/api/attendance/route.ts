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
    const today = new Date().toISOString().split("T")[0];
    const records = await prisma.attendanceRecord.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });

    const userFullName = `${session.user.firstName} ${session.user.lastName}`;
    const todayPunch = await prisma.attendanceRecord.findFirst({
      where: {
        tenantId,
        date: today,
        employeeName: userFullName,
      },
    });

    const isClockedIn = !!(todayPunch && todayPunch.checkIn && !todayPunch.checkOut);

    return NextResponse.json({
      records,
      todayPunch,
      clockedIn: isClockedIn,
      clockTime: todayPunch?.checkIn || null,
    });
  } catch (error) {
    console.error("GET /api/attendance error:", error);
    return NextResponse.json({ error: "Failed to fetch attendance records" }, { status: 500 });
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
    const body = await req.json().catch(() => ({}));
    const action = body.action || "toggle"; // "clockIn", "clockOut", or "toggle"
    const today = new Date().toISOString().split("T")[0];
    const userFullName = `${session.user.firstName} ${session.user.lastName}`;
    const nowTime = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const existingPunch = await prisma.attendanceRecord.findFirst({
      where: {
        tenantId,
        date: today,
        employeeName: userFullName,
      },
    });

    let record;
    let clockedIn = false;

    if (!existingPunch) {
      // First punch of the day: Clock In
      record = await prisma.attendanceRecord.create({
        data: {
          tenantId,
          employeeName: userFullName,
          date: today,
          checkIn: nowTime,
          checkOut: null,
          totalDuration: "00h 01m",
          status: "PRESENT",
          shift: "General (09:00 - 18:00)",
        },
      });
      clockedIn = true;
    } else if (!existingPunch.checkOut && (action === "clockOut" || action === "toggle")) {
      // Clock Out
      record = await prisma.attendanceRecord.update({
        where: { id: existingPunch.id },
        data: {
          checkOut: nowTime,
          totalDuration: "08h 15m",
        },
      });
      clockedIn = false;
    } else {
      // Re-clock in or update
      record = await prisma.attendanceRecord.update({
        where: { id: existingPunch.id },
        data: {
          checkIn: nowTime,
          checkOut: null,
          totalDuration: "00h 05m",
        },
      });
      clockedIn = true;
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        tenantId,
        actorId: session.user.id,
        action: clockedIn ? "CLOCK_IN" : "CLOCK_OUT",
        resource: "AttendanceRecord",
        resourceId: record.id,
        details: { time: nowTime, date: today },
      },
    });

    return NextResponse.json({
      success: true,
      message: clockedIn
        ? `Successfully clocked in at ${nowTime} (Web Punch recorded in database)`
        : `Successfully clocked out for today at ${nowTime}`,
      clockedIn,
      clockTime: nowTime,
      record,
    });
  } catch (error) {
    console.error("POST /api/attendance error:", error);
    return NextResponse.json({ error: "Failed to record web punch" }, { status: 500 });
  }
}

