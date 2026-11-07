import { prisma } from "./prisma";
import { hashPassword } from "./auth";

export async function seedDatabase() {
  const adminEmail = "admin@peopleos.dev";
  const defaultPassword = "Admin@PeopleOS2026!";

  // 1. Check if default tenant exists
  let tenant = await prisma.tenant.findUnique({
    where: { slug: "acme-global" },
  });

  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        name: "Acme Global Technologies (HQ)",
        slug: "acme-global",
        isActive: true,
        settings: {
          currency: "USD",
          timezone: "Asia/Dubai",
          workWeek: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
          entities: ["Acme Holdings UAE Ltd", "Acme Americas Delaware Corp", "Acme India Pvt Ltd"],
          workLocations: ["Dubai Internet City", "Bengaluru Tech Park", "New York / Remote"],
        },
      },
    });
    console.log("Seeded tenant: Acme Global Technologies");
  }

  // 2. Check if default admin exists
  let user = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!user) {
    const passwordHash = await hashPassword(defaultPassword);
    user = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        firstName: "Alex",
        lastName: "Morgan",
        isSuperAdmin: true,
        isActive: true,
      },
    });

    await prisma.userMembership.create({
      data: {
        tenantId: tenant.id,
        userId: user.id,
        role: "ORG_ADMIN",
        isActive: true,
      },
    });

    console.log(`Seeded admin user: ${adminEmail} (password: ${defaultPassword})`);
  } else {
    // Ensure membership exists
    const membership = await prisma.userMembership.findUnique({
      where: {
        tenantId_userId: {
          tenantId: tenant.id,
          userId: user.id,
        },
      },
    });

    if (!membership) {
      await prisma.userMembership.create({
        data: {
          tenantId: tenant.id,
          userId: user.id,
          role: "ORG_ADMIN",
          isActive: true,
        },
      });
    }
  }

  // 3. Seed initial Employees if none exist
  const existingEmployees = await prisma.employee.count({
    where: { tenantId: tenant.id },
  });

  if (existingEmployees === 0) {
    const initialEmployees = [
      {
        code: "EMP-0101",
        name: "Sarah Connor",
        email: "sarah.connor@acme.com",
        phone: "+971 50 123 4567",
        department: "Engineering",
        designation: "Lead Infrastructure Architect",
        legalEntity: "Acme Holdings UAE Ltd",
        workLocation: "Dubai Internet City",
        employmentType: "Full-Time Permanent",
        status: "ACTIVE",
        joinDate: "2023-04-15",
        manager: "Marcus Vance",
        avatar: "SC",
      },
      {
        code: "EMP-0102",
        name: "Rajesh Kumar",
        email: "rajesh.kumar@acme.com",
        phone: "+91 98450 12345",
        department: "Engineering",
        designation: "Senior Full Stack Engineer",
        legalEntity: "Acme Holdings UAE Ltd",
        workLocation: "Bengaluru Tech Park",
        employmentType: "Full-Time Permanent",
        status: "ACTIVE",
        joinDate: "2024-01-10",
        manager: "Sarah Connor",
        avatar: "RK",
      },
      {
        code: "EMP-0103",
        name: "Daniel Lee",
        email: "daniel.lee@acme.com",
        phone: "+1 415 555 2671",
        department: "Product",
        designation: "Principal Product Manager",
        legalEntity: "Acme Americas Delaware Corp",
        workLocation: "New York / Remote",
        employmentType: "Full-Time Permanent",
        status: "PROBATION",
        joinDate: "2026-05-18",
        manager: "Alex Morgan",
        avatar: "DL",
      },
      {
        code: "EMP-0104",
        name: "Elena Rostova",
        email: "elena.rostova@acme.com",
        phone: "+971 52 987 6543",
        department: "Human Resources",
        designation: "People Operations Lead",
        legalEntity: "Acme Holdings UAE Ltd",
        workLocation: "Dubai Internet City",
        employmentType: "Full-Time Permanent",
        status: "ACTIVE",
        joinDate: "2022-09-01",
        manager: "Alex Morgan",
        avatar: "ER",
      },
      {
        code: "EMP-0105",
        name: "Aisha Al-Mansoor",
        email: "aisha.mansoor@acme.com",
        phone: "+971 54 321 0987",
        department: "Finance",
        designation: "Financial Controller",
        legalEntity: "Acme Holdings UAE Ltd",
        workLocation: "Dubai Internet City",
        employmentType: "Full-Time Permanent",
        status: "PROBATION",
        joinDate: "2026-05-24",
        manager: "Marcus Vance",
        avatar: "AA",
      },
    ];

    for (const emp of initialEmployees) {
      await prisma.employee.create({
        data: {
          ...emp,
          tenantId: tenant.id,
        },
      });
    }
    console.log(`Seeded ${initialEmployees.length} initial employees`);
  }

  // 4. Seed initial Workflow Items if none exist
  const existingWorkflows = await prisma.workflowItem.count({
    where: { tenantId: tenant.id },
  });

  if (existingWorkflows === 0) {
    const initialWorkflows = [
      {
        code: "WF-1092",
        title: "Annual Leave Approval",
        type: "Annual Leave",
        employee: "Sarah Connor",
        details: "5 days (Nov 15 - Nov 20)",
        entity: "Acme Holdings UAE Ltd",
        level: "L2 HR Approval",
        status: "PENDING",
      },
      {
        code: "WF-1093",
        title: "Attendance Regularization",
        type: "Attendance Regularization",
        employee: "Rajesh Kumar",
        details: "Missing Check-Out (Nov 4)",
        entity: "Acme India Pvt Ltd",
        level: "L1 Manager Approval",
        status: "PENDING",
      },
      {
        code: "WF-1094",
        title: "Flight Ticket Entitlement Claim",
        type: "Air Entitlement Claim",
        employee: "Daniel Lee",
        details: "Annual Flight Ticket (2 Yrs Service)",
        entity: "Acme Holdings UAE Ltd",
        level: "L2 HR & Finance",
        status: "PENDING",
      },
    ];

    for (const wf of initialWorkflows) {
      await prisma.workflowItem.create({
        data: {
          ...wf,
          tenantId: tenant.id,
        },
      });
    }
    console.log(`Seeded ${initialWorkflows.length} initial workflows`);
  }

  // 5. Seed initial Leave Requests if none exist
  const existingLeaves = await prisma.leaveRequest.count({
    where: { tenantId: tenant.id },
  });

  if (existingLeaves === 0) {
    const initialLeaves = [
      {
        employeeName: "Sarah Connor",
        department: "Engineering",
        type: "Annual Leave",
        startDate: "2026-11-15",
        endDate: "2026-11-20",
        daysCount: 5,
        reason: "Family travel and vacation",
        status: "PENDING",
      },
      {
        employeeName: "Rajesh Kumar",
        department: "Engineering",
        type: "Sick Leave",
        startDate: "2026-11-02",
        endDate: "2026-11-03",
        daysCount: 2,
        reason: "Viral flu and recovery",
        status: "APPROVED",
        approvedBy: "Alex Morgan",
        decisionNotes: "Medical certificate provided and verified",
      },
      {
        employeeName: "Daniel Lee",
        department: "Product",
        type: "Remote Work",
        startDate: "2026-11-10",
        endDate: "2026-11-12",
        daysCount: 3,
        reason: "Travel to client meeting",
        status: "APPROVED",
        approvedBy: "Alex Morgan",
        decisionNotes: "Client on-site alignment approved",
      },
    ];

    for (const lv of initialLeaves) {
      await prisma.leaveRequest.create({
        data: {
          ...lv,
          tenantId: tenant.id,
        },
      });
    }
    console.log(`Seeded ${initialLeaves.length} initial leave requests`);
  }

  // 6. Seed initial Attendance Records if none exist
  const existingAttendance = await prisma.attendanceRecord.count({
    where: { tenantId: tenant.id },
  });

  if (existingAttendance === 0) {
    const today = new Date().toISOString().split("T")[0];
    const initialAttendance = [
      {
        employeeName: "Sarah Connor",
        date: today,
        checkIn: "08:55 AM",
        checkOut: "05:45 PM",
        totalDuration: "08h 50m",
        status: "PRESENT",
        shift: "General (09:00 - 18:00)",
      },
      {
        employeeName: "Rajesh Kumar",
        date: today,
        checkIn: "09:15 AM",
        checkOut: "06:20 PM",
        totalDuration: "09h 05m",
        status: "PRESENT",
        shift: "General (09:00 - 18:00)",
      },
      {
        employeeName: "Daniel Lee",
        date: today,
        checkIn: "09:00 AM",
        checkOut: null,
        totalDuration: "07h 42m",
        status: "PRESENT",
        shift: "General (09:00 - 18:00)",
      },
    ];

    for (const att of initialAttendance) {
      await prisma.attendanceRecord.create({
        data: {
          ...att,
          tenantId: tenant.id,
        },
      });
    }
    console.log(`Seeded ${initialAttendance.length} initial attendance records`);
  }

  return { tenant, user };
}

if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("Database seeded successfully");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Seeding error:", err);
      process.exit(1);
    });
}
