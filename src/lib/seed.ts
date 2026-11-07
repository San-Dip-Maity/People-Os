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

  // 7. Seed initial Payroll Run and Compensation Records
  const existingPayroll = await prisma.payrollRun.count({
    where: { tenantId: tenant.id },
  });

  if (existingPayroll === 0) {
    const payrollRun = await prisma.payrollRun.create({
      data: {
        tenantId: tenant.id,
        cycleName: "November 2026",
        grossAmount: "$1,428,500.00",
        statutoryDeductions: "$142,320.50",
        netAmount: "$1,286,179.50",
        status: "PREVIEW",
        locked: false,
      },
    });

    await prisma.compensationRecord.createMany({
      data: [
        {
          tenantId: tenant.id,
          payrollRunId: payrollRun.id,
          employeeName: "Sarah Connor (EMP-0101)",
          legalEntity: "Acme Holdings UAE Ltd",
          currency: "AED",
          baseSalary: "28,000.00",
          allowances: "4,500.00",
          deductions: "0.00",
          netPayable: "32,500.00",
        },
        {
          tenantId: tenant.id,
          payrollRunId: payrollRun.id,
          employeeName: "Rajesh Kumar (EMP-0102)",
          legalEntity: "Acme Holdings UAE Ltd",
          currency: "AED",
          baseSalary: "18,500.00",
          allowances: "2,200.00",
          deductions: "0.00",
          netPayable: "20,700.00",
        },
        {
          tenantId: tenant.id,
          payrollRunId: payrollRun.id,
          employeeName: "Daniel Lee (EMP-0103)",
          legalEntity: "Acme Americas Corp",
          currency: "USD",
          baseSalary: "12,500.00",
          allowances: "1,000.00",
          deductions: "2,850.00",
          netPayable: "10,650.00",
        },
      ],
    });
    console.log("Seeded initial payroll run and compensation records");
  }

  // 8. Seed initial Job Requisitions
  const existingJobs = await prisma.jobRequisition.count({
    where: { tenantId: tenant.id },
  });

  if (existingJobs === 0) {
    await prisma.jobRequisition.createMany({
      data: [
        {
          tenantId: tenant.id,
          code: "REQ-0101",
          title: "Senior Cloud Platform Engineer",
          department: "Engineering",
          legalEntity: "Acme Holdings UAE Ltd",
          workLocation: "Dubai or Remote",
          applicantsCount: 48,
          status: "PUBLISHED",
        },
        {
          tenantId: tenant.id,
          code: "REQ-0102",
          title: "Frontend Technical Lead (Next.js)",
          department: "Engineering",
          legalEntity: "Acme Technologies India Pvt Ltd",
          workLocation: "Bengaluru Tech Park",
          applicantsCount: 62,
          status: "PUBLISHED",
        },
        {
          tenantId: tenant.id,
          code: "REQ-0103",
          title: "People Analytics Specialist",
          department: "Human Resources",
          legalEntity: "Acme Holdings UAE Ltd",
          workLocation: "Dubai Internet City",
          applicantsCount: 32,
          status: "INTERVIEWING",
        },
      ],
    });
    console.log("Seeded initial job requisitions");
  }

  // 9. Seed initial Goals & OKRs
  const existingGoals = await prisma.goalOKR.count({
    where: { tenantId: tenant.id },
  });

  if (existingGoals === 0) {
    await prisma.goalOKR.createMany({
      data: [
        {
          tenantId: tenant.id,
          title: "Achieve SOC 2 Type II & ISO 27001 Certification",
          category: "COMPANY",
          owner: "Alex Morgan",
          department: "Executive & Security",
          progress: 85,
          targetDate: "2026-12-15",
          status: "ON_TRACK",
        },
        {
          tenantId: tenant.id,
          title: "Automate Cross-Border Entity Payroll WPS Reconciliation",
          category: "DEPARTMENT",
          owner: "Aisha Al-Mansoor",
          department: "Finance & Payroll",
          progress: 68,
          targetDate: "2026-11-30",
          status: "ON_TRACK",
        },
        {
          tenantId: tenant.id,
          title: "Maintain 99.95% Human Capital Telemetry Availability",
          category: "DEPARTMENT",
          owner: "Marcus Vance",
          department: "Engineering",
          progress: 94,
          targetDate: "2026-12-31",
          status: "ON_TRACK",
        },
      ],
    });
    console.log("Seeded initial goals and OKRs");
  }

  // 10. Seed initial Document Records
  const existingDocs = await prisma.documentRecord.count({
    where: { tenantId: tenant.id },
  });

  if (existingDocs === 0) {
    await prisma.documentRecord.createMany({
      data: [
        {
          tenantId: tenant.id,
          title: "Global Employee Code of Conduct 2026",
          category: "Policies & Handbooks",
          fileSize: "2.4 MB PDF",
          scope: "All Employees",
          expiresAt: "2027-01-01",
        },
        {
          tenantId: tenant.id,
          title: "Cross-Border Holiday Calendar Protocol",
          category: "Policies & Handbooks",
          fileSize: "840 KB PDF",
          scope: "UAE & India Entities",
          expiresAt: "Permanent",
        },
        {
          tenantId: tenant.id,
          title: "Standard Employment Agreement (UAE)",
          category: "Contracts & Letters",
          fileSize: "1.1 MB PDF",
          scope: "Acme Holdings UAE",
          expiresAt: "Permanent",
        },
        {
          tenantId: tenant.id,
          title: "Executive Residence Visa Copy — Sarah Connor",
          category: "IDs & Compliance",
          fileSize: "520 KB PDF",
          scope: "Confidential HR",
          expiresAt: "2026-11-28",
        },
      ],
    });
    console.log("Seeded initial document records");
  }

  // 11. Seed initial Holiday Calendars
  const existingHolidays = await prisma.holiday.count({
    where: { tenantId: tenant.id },
  });

  if (existingHolidays === 0) {
    await prisma.holiday.createMany({
      data: [
        { tenantId: tenant.id, calendarCode: "UAE", name: "New Year's Day", date: "2026-01-01", type: "Statutory Public", daysCount: 1 },
        { tenantId: tenant.id, calendarCode: "UAE", name: "Eid Al-Fitr (Estimated)", date: "2026-03-20 to 2026-03-23", type: "Religious Public", daysCount: 4 },
        { tenantId: tenant.id, calendarCode: "UAE", name: "UAE National Day", date: "2026-12-02 to 2026-12-03", type: "National Holiday", daysCount: 2 },
        { tenantId: tenant.id, calendarCode: "IND", name: "Republic Day", date: "2026-01-26", type: "National Holiday", daysCount: 1 },
        { tenantId: tenant.id, calendarCode: "IND", name: "Independence Day", date: "2026-08-15", type: "National Holiday", daysCount: 1 },
        { tenantId: tenant.id, calendarCode: "IND", name: "Diwali (Deepavali)", date: "2026-11-08 to 2026-11-09", type: "Festival Public", daysCount: 2 },
        { tenantId: tenant.id, calendarCode: "USA", name: "New Year's Day", date: "2026-01-01", type: "Federal Statutory", daysCount: 1 },
        { tenantId: tenant.id, calendarCode: "USA", name: "Independence Day", date: "2026-07-04", type: "Federal Holiday", daysCount: 1 },
        { tenantId: tenant.id, calendarCode: "USA", name: "Thanksgiving Day", date: "2026-11-26", type: "Federal Holiday", daysCount: 1 },
      ],
    });
    console.log("Seeded initial holiday records");
  }

  // 12. Seed initial Timesheets
  const existingTimesheets = await prisma.timesheet.count({
    where: { tenantId: tenant.id },
  });

  if (existingTimesheets === 0) {
    await prisma.timesheet.createMany({
      data: [
        {
          tenantId: tenant.id,
          employeeName: "Alex Morgan",
          weekNumber: 45,
          weekRange: "Nov 02 — Nov 06, 2026",
          totalHours: 40.0,
          status: "SUBMITTED",
          reviewer: "Marcus Vance (VP Engineering)",
        },
      ],
    });
    console.log("Seeded initial timesheets");
  }

  // 13. Seed initial Notifications
  const existingNotifications = await prisma.notification.count({
    where: { tenantId: tenant.id },
  });

  if (existingNotifications === 0) {
    await prisma.notification.createMany({
      data: [
        {
          tenantId: tenant.id,
          title: "New Leave Application",
          description: "Sarah Connor requested 5 days Annual Leave (Nov 15 - Nov 19)",
          category: "APPROVALS",
          isRead: false,
          link: "/leave",
        },
        {
          tenantId: tenant.id,
          title: "Payroll Calculations Ready for Review",
          description: "November 2026 payroll preview generated across all entities",
          category: "APPROVALS",
          isRead: false,
          link: "/payroll",
        },
        {
          tenantId: tenant.id,
          title: "Employee Probation Confirmation",
          description: "Daniel Lee completed 6 months probation period successfully",
          category: "SYSTEM",
          isRead: true,
          link: "/employees",
        },
        {
          tenantId: tenant.id,
          title: "Updated Cross-Border Holiday Calendar Assigned",
          description: "Rajesh Kumar reassigned to India Public Calendar with effective date Nov 10",
          category: "SYSTEM",
          isRead: true,
          link: "/holidays",
        },
      ],
    });
    console.log("Seeded initial notifications");
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
