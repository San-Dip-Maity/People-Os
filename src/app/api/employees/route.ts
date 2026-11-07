import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const employeeSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid corporate email address"),
  department: z.string().min(1, "Department is required"),
  designation: z.string().min(1, "Designation is required"),
  legalEntity: z.string().min(1, "Legal Entity is required"),
  workLocation: z.string().min(1, "Work Location is required"),
  phone: z.string().optional().default("+971 50 000 0000"),
  employmentType: z.string().optional().default("Full-Time Permanent"),
  status: z.enum(["ACTIVE", "PROBATION", "NOTICE", "TERMINATED"]).optional().default("PROBATION"),
});

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
    const employees = await prisma.employee.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ employees });
  } catch (error) {
    console.error("GET /api/employees error:", error);
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 });
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
    const validated = employeeSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      department,
      designation,
      legalEntity,
      workLocation,
      phone,
      employmentType,
      status,
    } = validated.data;

    // Check for existing employee with email in tenant
    const existing = await prisma.employee.findFirst({
      where: { tenantId, email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An employee with this corporate email already exists in this tenant" },
        { status: 409 }
      );
    }

    // Auto-generate employee code
    const totalCount = await prisma.employee.count({ where: { tenantId } });
    const code = `EMP-0${totalCount + 101}`;

    const avatar = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const employee = await prisma.employee.create({
      data: {
        tenantId,
        code,
        name,
        email: email.toLowerCase(),
        phone,
        department,
        designation,
        legalEntity,
        workLocation,
        employmentType,
        status,
        joinDate: new Date().toISOString().split("T")[0],
        manager: `${session.user.firstName} ${session.user.lastName}`,
        avatar,
      },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        tenantId,
        actorId: session.user.id,
        action: "CREATE",
        resource: "Employee",
        resourceId: employee.id,
        details: { code: employee.code, name: employee.name, department: employee.department },
      },
    });

    return NextResponse.json(
      { success: true, message: `Employee ${name} (${code}) onboarded successfully`, employee },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/employees error:", error);
    return NextResponse.json({ error: "Failed to onboard employee to database" }, { status: 500 });
  }
}

