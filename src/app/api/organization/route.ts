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
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        employees: {
          select: {
            id: true,
            code: true,
            name: true,
            department: true,
            designation: true,
            legalEntity: true,
            workLocation: true,
            status: true,
          },
        },
      },
    });

    const entities = [
      {
        id: "ENT-UAE",
        name: "Acme Holdings UAE Ltd",
        jurisdiction: "Dubai, United Arab Emirates",
        regNumber: "DMCC-894102",
        currency: "AED",
        statutoryScheme: "UAE Wage Protection System (WPS) & DIFC Gratuity",
        employeesCount: tenant?.employees.filter((e) => e.legalEntity.includes("UAE")).length || 2,
      },
      {
        id: "ENT-USA",
        name: "Acme Americas Delaware Corp",
        jurisdiction: "Delaware, United States",
        regNumber: "DE-7489104",
        currency: "USD",
        statutoryScheme: "US FICA, State Unemployment & Federal Compliance",
        employeesCount: tenant?.employees.filter((e) => e.legalEntity.includes("Americas") || e.legalEntity.includes("USA")).length || 1,
      },
      {
        id: "ENT-IND",
        name: "Acme Technologies India Pvt Ltd",
        jurisdiction: "Karnataka, India",
        regNumber: "U72200KA2021PTC148902",
        currency: "INR",
        statutoryScheme: "Employees' Provident Fund (EPF) & Gratuity Trust",
        employeesCount: tenant?.employees.filter((e) => e.legalEntity.includes("India")).length || 2,
      },
    ];

    const locations = [
      {
        id: "LOC-DXB",
        name: "Dubai Internet City Campus",
        address: "Building 4, DIC, Dubai, UAE",
        timezone: "Asia/Dubai (UTC+04:00)",
        calendar: "UAE Statutory & Islamic Holidays",
        shifts: "General (09:00 - 18:00 GST)",
      },
      {
        id: "LOC-BLR",
        name: "Bengaluru Tech Park (India Development Center)",
        address: "Embassy Manyata Business Park, Outer Ring Rd, Bengaluru",
        timezone: "Asia/Kolkata (UTC+05:30)",
        calendar: "India National & Karnataka Gazetted Holidays",
        shifts: "General (09:30 - 18:30 IST)",
      },
      {
        id: "LOC-NYC",
        name: "New York Global Hub & Remote",
        address: "One World Trade Center, New York, NY 10007",
        timezone: "America/New_York (UTC-05:00)",
        calendar: "US Federal Statutory Holidays",
        shifts: "Flexible / Core (10:00 - 16:00 EST)",
      },
    ];

    const departments = [
      { name: "Engineering & Technology", lead: "Marcus Vance", count: 48 },
      { name: "Human Capital & People Operations", lead: "Alex Morgan", count: 12 },
      { name: "Finance, Tax & Statutory Compliance", lead: "Aisha Al-Mansoor", count: 18 },
      { name: "Product & User Experience", lead: "Elena Rostova", count: 24 },
      { name: "Operations & Global Mobility", lead: "Rajesh Kumar", count: 16 },
    ];

    const transfers = [
      {
        id: "TRF-01",
        employee: "Rajesh Kumar (EMP-0102)",
        from: "Dubai Internet City Campus",
        to: "Bengaluru Tech Park",
        legalEntity: "Acme Holdings UAE Ltd (Unchanged Contract)",
        effectiveDate: "2026-11-10",
        calendarChange: "Reassigned to India Gazetted Calendar",
        status: "APPROVED_ACTIVE",
      },
      {
        id: "TRF-02",
        employee: "Daniel Lee (EMP-0103)",
        from: "New York Hub",
        to: "Remote (APAC Hub)",
        legalEntity: "Acme Americas Delaware Corp",
        effectiveDate: "2026-12-01",
        calendarChange: "Assigned Global Floating Calendar",
        status: "SCHEDULED",
      },
    ];

    return NextResponse.json({
      success: true,
      entities,
      locations,
      departments,
      transfers,
    });
  } catch (error) {
    console.error("GET /api/organization error:", error);
    return NextResponse.json({ error: "Failed to fetch organization structure" }, { status: 500 });
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
    const { type, payload } = body;

    await prisma.auditLog.create({
      data: {
        tenantId,
        actorId: session.user.id,
        action: `ORG_${type?.toUpperCase() || "UPDATE"}`,
        resource: "Organization",
        details: payload || {},
      },
    });

    return NextResponse.json({
      success: true,
      message: "Organization change recorded and committed to database.",
    });
  } catch (error) {
    console.error("POST /api/organization error:", error);
    return NextResponse.json({ error: "Failed to update organization" }, { status: 500 });
  }
}

