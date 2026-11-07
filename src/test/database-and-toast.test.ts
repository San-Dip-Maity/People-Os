import { describe, it, expect, beforeEach } from "vitest";
import { toast, toastManager, ToastItem } from "@/components/ui/toast";
import { prisma } from "@/lib/prisma";

describe("Toast Notification System", () => {
  beforeEach(() => {
    toast.clear();
  });

  it("emits a successful toast with correct type, title, and description", () => {
    let currentToasts: ToastItem[] = [];
    const unsubscribe = toastManager.subscribe((toasts) => {
      currentToasts = toasts;
    });

    toast.success("Employee Onboarded", "Saved to database successfully.");

    expect(currentToasts.length).toBe(1);
    expect(currentToasts[0].type).toBe("success");
    expect(currentToasts[0].title).toBe("Employee Onboarded");
    expect(currentToasts[0].description).toBe("Saved to database successfully.");

    unsubscribe();
  });

  it("emits a warning toast for validation issues", () => {
    let currentToasts: ToastItem[] = [];
    const unsubscribe = toastManager.subscribe((toasts) => {
      currentToasts = toasts;
    });

    toast.warning("Incomplete Information", "Full name and email are required.");

    expect(currentToasts.length).toBe(1);
    expect(currentToasts[0].type).toBe("warning");
    expect(currentToasts[0].title).toBe("Incomplete Information");
    expect(currentToasts[0].description).toBe("Full name and email are required.");

    unsubscribe();
  });

  it("emits an error toast for failures", () => {
    let currentToasts: ToastItem[] = [];
    const unsubscribe = toastManager.subscribe((toasts) => {
      currentToasts = toasts;
    });

    toast.error("Operation Failed", "Could not reach database server.");

    expect(currentToasts.length).toBe(1);
    expect(currentToasts[0].type).toBe("error");
    expect(currentToasts[0].title).toBe("Operation Failed");
    expect(currentToasts[0].description).toBe("Could not reach database server.");

    unsubscribe();
  });

  it("emits an info toast for operational status updates", () => {
    let currentToasts: ToastItem[] = [];
    const unsubscribe = toastManager.subscribe((toasts) => {
      currentToasts = toasts;
    });

    toast.info("Signed Out", "Your session has been terminated.");

    expect(currentToasts.length).toBe(1);
    expect(currentToasts[0].type).toBe("info");
    expect(currentToasts[0].title).toBe("Signed Out");

    unsubscribe();
  });

  it("allows manual dismissal and clearing of toasts", () => {
    let currentToasts: ToastItem[] = [];
    const unsubscribe = toastManager.subscribe((toasts) => {
      currentToasts = toasts;
    });

    const id1 = toast.success("First");
    const id2 = toast.warning("Second");

    expect(currentToasts.length).toBe(2);

    toast.dismiss(id1);
    expect(currentToasts.length).toBe(1);
    expect(currentToasts[0].id).toBe(id2);

    toast.clear();
    expect(currentToasts.length).toBe(0);

    unsubscribe();
  });
});

describe("Database Persistence Operations (Prisma & Neon PostgreSQL)", () => {
  it("persists employee records and queries them properly by tenant", async () => {
    const tenant = await prisma.tenant.findUnique({
      where: { slug: "acme-global" },
    });
    expect(tenant).not.toBeNull();

    const testEmail = `test.emp.${Date.now()}@acme.com`;
    const employee = await prisma.employee.create({
      data: {
        tenantId: tenant!.id,
        code: `EMP-TEST-${Date.now().toString().slice(-4)}`,
        name: "Test Verification Employee",
        email: testEmail,
        department: "Quality Assurance",
        designation: "Automation Specialist",
        legalEntity: "Acme Holdings UAE Ltd",
        workLocation: "Dubai Internet City",
        status: "ACTIVE",
        joinDate: "2026-11-07",
      },
    });

    expect(employee.id).toBeDefined();
    expect(employee.email).toBe(testEmail);

    // Verify retrieval from database
    const fetched = await prisma.employee.findUnique({
      where: { id: employee.id },
    });
    expect(fetched).not.toBeNull();
    expect(fetched?.name).toBe("Test Verification Employee");

    // Clean up test employee
    await prisma.employee.delete({ where: { id: employee.id } });
  }, 20000);

  it("persists leave requests and records decisions properly", async () => {
    const tenant = await prisma.tenant.findUnique({
      where: { slug: "acme-global" },
    });

    const leave = await prisma.leaveRequest.create({
      data: {
        tenantId: tenant!.id,
        employeeName: "Test Verification Employee",
        department: "Engineering",
        type: "Annual Leave",
        startDate: "2026-12-01",
        endDate: "2026-12-05",
        daysCount: 5,
        reason: "Year-end vacation test",
        status: "PENDING",
      },
    });

    expect(leave.id).toBeDefined();
    expect(leave.status).toBe("PENDING");

    // Update decision to APPROVED
    const updated = await prisma.leaveRequest.update({
      where: { id: leave.id },
      data: {
        status: "APPROVED",
        approvedBy: "Alex Morgan",
        decisionNotes: "Approved in automated test suite",
      },
    });

    expect(updated.status).toBe("APPROVED");
    expect(updated.approvedBy).toBe("Alex Morgan");

    // Clean up
    await prisma.leaveRequest.delete({ where: { id: leave.id } });
  }, 20000);

  it("persists attendance punches and records duration", async () => {
    const tenant = await prisma.tenant.findUnique({
      where: { slug: "acme-global" },
    });

    const punch = await prisma.attendanceRecord.create({
      data: {
        tenantId: tenant!.id,
        employeeName: "Test Verification Employee",
        date: "2026-11-07",
        checkIn: "08:45 AM",
        checkOut: null,
        totalDuration: "00h 01m",
        status: "PRESENT",
      },
    });

    expect(punch.id).toBeDefined();
    expect(punch.checkIn).toBe("08:45 AM");

    // Complete punch out
    const updated = await prisma.attendanceRecord.update({
      where: { id: punch.id },
      data: {
        checkOut: "05:15 PM",
        totalDuration: "08h 30m",
      },
    });

    expect(updated.checkOut).toBe("05:15 PM");
    expect(updated.totalDuration).toBe("08h 30m");

    // Clean up
    await prisma.attendanceRecord.delete({ where: { id: punch.id } });
  }, 20000);

  it("persists workflow approval queue items and status transitions", async () => {
    const tenant = await prisma.tenant.findUnique({
      where: { slug: "acme-global" },
    });

    const wf = await prisma.workflowItem.create({
      data: {
        tenantId: tenant!.id,
        code: `WF-TEST-${Date.now().toString().slice(-4)}`,
        title: "Test Claim Approval",
        type: "Expense Claim",
        employee: "Sarah Connor",
        details: "Travel reimbursement test",
        entity: "Acme Holdings UAE Ltd",
        level: "L1 Manager Approval",
        status: "PENDING",
      },
    });

    expect(wf.status).toBe("PENDING");

    const approved = await prisma.workflowItem.update({
      where: { id: wf.id },
      data: {
        status: "APPROVED",
        approvedBy: "Alex Morgan",
      },
    });

    expect(approved.status).toBe("APPROVED");

    // Clean up
    await prisma.workflowItem.delete({ where: { id: wf.id } });
  }, 20000);
});
