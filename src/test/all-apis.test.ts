import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";

// Mock getCurrentSession so API routes run as authenticated admin
vi.mock("@/lib/auth", async () => {
  const actual = await vi.importActual<typeof import("@/lib/auth")>("@/lib/auth");
  return {
    ...actual,
    getCurrentSession: vi.fn(async () => {
      const tenant = await prisma.tenant.findUnique({ where: { slug: "acme-global" } });
      const user = await prisma.user.findFirst({ where: { email: "admin@peopleos.dev" } });
      return {
        id: "mock-session-id",
        user: {
          id: user?.id || "mock-user-id",
          email: "admin@peopleos.dev",
          firstName: "Alex",
          lastName: "Morgan",
          isSuperAdmin: true,
          memberships: [
            {
              id: "mock-mem-id",
              tenantId: tenant?.id || "mock-tenant-id",
              role: "ORG_ADMIN",
            },
          ],
        },
      };
    }),
  };
});

describe("All Operations API Routes & Database Persistence", () => {
  beforeAll(async () => {
    const tenant = await prisma.tenant.findUnique({ where: { slug: "acme-global" } });
    expect(tenant?.id).toBeDefined();
  });

  afterAll(async () => {
    // cleanup any test-created records if needed
  });

  it("GET and POST /api/payroll (fetch run, lock and export actions)", async () => {
    const { GET, POST } = await import("@/app/api/payroll/route");

    // 1. GET payroll
    const getRes = await GET();
    expect(getRes.status).toBe(200);
    const getData = await getRes.json();
    expect(getData.success).toBe(true);
    expect(getData.payrollRun).toBeDefined();
    expect(getData.payrollRun.records).toBeDefined();

    // 2. POST lock
    const postReqLock = new Request("http://localhost:3000/api/payroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "lock" }),
    });
    const lockRes = await POST(postReqLock);
    expect(lockRes.status).toBe(200);
    const lockData = await lockRes.json();
    expect(lockData.success).toBe(true);
    expect(lockData.payrollRun.locked).toBe(true);
    expect(lockData.payrollRun.status).toBe("FINALIZED");

    // 3. POST export
    const postReqExp = new Request("http://localhost:3000/api/payroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "export" }),
    });
    const expRes = await POST(postReqExp);
    expect(expRes.status).toBe(200);
    const expData = await expRes.json();
    expect(expData.success).toBe(true);
    expect(expData.downloadUrl).toBeDefined();

    // 4. Reset to unlock
    const postReqUnlock = new Request("http://localhost:3000/api/payroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "unlock" }),
    });
    await POST(postReqUnlock);
  }, 35000);

  it("GET, POST, and PATCH /api/recruitment (requisition management)", async () => {
    const { GET, POST, PATCH } = await import("@/app/api/recruitment/route");

    // 1. GET requisitions
    const getRes = await GET();
    expect(getRes.status).toBe(200);
    const getData = await getRes.json();
    expect(getData.success).toBe(true);
    expect(Array.isArray(getData.requisitions)).toBe(true);
    expect(getData.stats).toBeDefined();

    // 2. POST create job opening
    const postReq = new Request("http://localhost:3000/api/recruitment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Test Automation Engineer",
        department: "Engineering",
        legalEntity: "Acme Holdings UAE Ltd",
        workLocation: "Dubai Internet City",
      }),
    });
    const postRes = await POST(postReq);
    expect(postRes.status).toBe(200);
    const postData = await postRes.json();
    expect(postData.success).toBe(true);
    expect(postData.requisition.code).toBeDefined();

    const createdId = postData.requisition.id;

    // 3. PATCH update status
    const patchReq = new Request("http://localhost:3000/api/recruitment", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: createdId, status: "INTERVIEWING" }),
    });
    const patchRes = await PATCH(patchReq);
    expect(patchRes.status).toBe(200);
    const patchData = await patchRes.json();
    expect(patchData.requisition.status).toBe("INTERVIEWING");

    // Cleanup
    await prisma.jobRequisition.delete({ where: { id: createdId } });
  }, 35000);

  it("GET, POST, and PATCH /api/performance (goals and OKRs)", async () => {
    const { GET, POST, PATCH } = await import("@/app/api/performance/route");

    // 1. GET performance
    const getRes = await GET();
    expect(getRes.status).toBe(200);
    const getData = await getRes.json();
    expect(getData.success).toBe(true);
    expect(getData.cycle).toBeDefined();
    expect(Array.isArray(getData.goals)).toBe(true);

    // 2. POST define goal
    const postReq = new Request("http://localhost:3000/api/performance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "O5: Scale Neon Database Read Replicas",
        category: "DEPARTMENT",
        department: "Engineering",
        owner: "Sarah Connor",
        targetDate: "2026-12-31",
      }),
    });
    const postRes = await POST(postReq);
    expect(postRes.status).toBe(200);
    const postData = await postRes.json();
    expect(postData.success).toBe(true);
    expect(postData.goal.id).toBeDefined();

    const createdId = postData.goal.id;

    // 3. PATCH update progress
    const patchReq = new Request("http://localhost:3000/api/performance", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: createdId, progress: 95 }),
    });
    const patchRes = await PATCH(patchReq);
    expect(patchRes.status).toBe(200);
    const patchData = await patchRes.json();
    expect(patchData.goal.progress).toBe(95);

    // Cleanup
    await prisma.goalOKR.delete({ where: { id: createdId } });
  }, 35000);

  it("GET, POST, and DELETE /api/documents (document vault)", async () => {
    const { GET, POST, DELETE } = await import("@/app/api/documents/route");

    // 1. GET documents
    const getRes = await GET();
    expect(getRes.status).toBe(200);
    const getData = await getRes.json();
    expect(getData.success).toBe(true);
    expect(Array.isArray(getData.documents)).toBe(true);

    // 2. POST create document
    const postReq = new Request("http://localhost:3000/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Test Compliance Policy Document",
        category: "Policies & Handbooks",
        scope: "All Employees",
        expiresAt: "2027-01-01",
      }),
    });
    const postRes = await POST(postReq);
    expect(postRes.status).toBe(200);
    const postData = await postRes.json();
    expect(postData.success).toBe(true);
    expect(postData.document.id).toBeDefined();

    const createdId = postData.document.id;

    // 3. DELETE document
    const deleteReq = new Request(`http://localhost:3000/api/documents?id=${createdId}`, {
      method: "DELETE",
    });
    const deleteRes = await DELETE(deleteReq);
    expect(deleteRes.status).toBe(200);
    const deleteData = await deleteRes.json();
    expect(deleteData.success).toBe(true);
  }, 35000);

  it("GET and POST /api/organization (structure and transfer logs)", async () => {
    const { GET, POST } = await import("@/app/api/organization/route");

    const getRes = await GET();
    expect(getRes.status).toBe(200);
    const getData = await getRes.json();
    expect(getData.success).toBe(true);
    expect(getData.entities.length).toBeGreaterThanOrEqual(1);
    expect(getData.locations.length).toBeGreaterThanOrEqual(1);
    expect(getData.departments.length).toBeGreaterThanOrEqual(1);

    const postReq = new Request("http://localhost:3000/api/organization", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "effective_transfer",
        payload: { employee: "Sarah Connor", location: "Dubai Internet City" },
      }),
    });
    const postRes = await POST(postReq);
    expect(postRes.status).toBe(200);
    const postData = await postRes.json();
    expect(postData.success).toBe(true);
  }, 35000);

  it("GET and POST /api/holidays (location-scoped calendars)", async () => {
    const { GET, POST } = await import("@/app/api/holidays/route");

    // 1. GET holidays
    const getReq = new Request("http://localhost:3000/api/holidays");
    const getRes = await GET(getReq);
    expect(getRes.status).toBe(200);
    const getData = await getRes.json();
    expect(getData.success).toBe(true);
    expect(getData.holidays.UAE).toBeDefined();
    expect(getData.holidays.IND).toBeDefined();

    // 2. POST add holiday
    const postReq = new Request("http://localhost:3000/api/holidays", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        calendarCode: "UAE",
        name: "Test Statutory Holiday",
        date: "2026-12-31",
        type: "Statutory Public",
        daysCount: 1,
      }),
    });
    const postRes = await POST(postReq);
    expect(postRes.status).toBe(200);
    const postData = await postRes.json();
    expect(postData.success).toBe(true);
    expect(postData.holiday.id).toBeDefined();

    // Cleanup
    await prisma.holiday.delete({ where: { id: postData.holiday.id } });
  }, 35000);

  it("GET, POST, and PATCH /api/timesheets (weekly project allocation)", async () => {
    const { GET, POST, PATCH } = await import("@/app/api/timesheets/route");

    // 1. GET timesheets
    const getRes = await GET();
    expect(getRes.status).toBe(200);
    const getData = await getRes.json();
    expect(getData.success).toBe(true);
    expect(Array.isArray(getData.timesheets)).toBe(true);

    // 2. POST submit timesheet
    const postReq = new Request("http://localhost:3000/api/timesheets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        weekNumber: 46,
        weekRange: "Nov 09 — Nov 13, 2026",
        totalHours: 40.0,
      }),
    });
    const postRes = await POST(postReq);
    expect(postRes.status).toBe(200);
    const postData = await postRes.json();
    expect(postData.success).toBe(true);
    expect(postData.timesheet.id).toBeDefined();

    const createdId = postData.timesheet.id;

    // 3. PATCH decision
    const patchReq = new Request("http://localhost:3000/api/timesheets", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: createdId, decision: "APPROVED" }),
    });
    const patchRes = await PATCH(patchReq);
    expect(patchRes.status).toBe(200);
    const patchData = await patchRes.json();
    expect(patchData.timesheet.status).toBe("APPROVED");

    // Cleanup
    await prisma.timesheet.delete({ where: { id: createdId } });
  }, 35000);

  it("GET, POST, and PATCH /api/notifications (alert management)", async () => {
    const { GET, POST, PATCH } = await import("@/app/api/notifications/route");

    // 1. POST create notification
    const postReq = new Request("http://localhost:3000/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Test System Notification",
        description: "Test description for notification route",
        category: "SYSTEM",
      }),
    });
    const postRes = await POST(postReq);
    expect(postRes.status).toBe(200);
    const postData = await postRes.json();
    expect(postData.success).toBe(true);
    expect(postData.notification.id).toBeDefined();

    const createdId = postData.notification.id;

    // 2. GET notifications
    const getReq = new Request("http://localhost:3000/api/notifications");
    const getRes = await GET(getReq);
    expect(getRes.status).toBe(200);
    const getData = await getRes.json();
    expect(getData.success).toBe(true);
    expect(getData.unreadCount).toBeGreaterThanOrEqual(1);

    // 3. PATCH mark as read
    const patchReq = new Request("http://localhost:3000/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: createdId }),
    });
    const patchRes = await PATCH(patchReq);
    expect(patchRes.status).toBe(200);
    const patchData = await patchRes.json();
    expect(patchData.notification.isRead).toBe(true);

    // Cleanup
    await prisma.notification.delete({ where: { id: createdId } });
  }, 35000);

  it("GET and POST /api/audit (audit log stream)", async () => {
    const { GET, POST } = await import("@/app/api/audit/route");

    // 1. POST audit event
    const postReq = new Request("http://localhost:3000/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "TEST_VERIFICATION",
        resource: "TestSuite",
        details: { test: "all-apis.test.ts" },
      }),
    });
    const postRes = await POST(postReq);
    expect(postRes.status).toBe(200);
    const postData = await postRes.json();
    expect(postData.success).toBe(true);

    // 2. GET audit logs
    const getReq = new Request("http://localhost:3000/api/audit");
    const getRes = await GET(getReq);
    expect(getRes.status).toBe(200);
    const getData = await getRes.json();
    expect(getData.success).toBe(true);
    expect(Array.isArray(getData.logs)).toBe(true);
    expect(getData.logs.length).toBeGreaterThanOrEqual(1);
  }, 35000);

  it("POST /api/copilot (AI workforce assistant)", async () => {
    const { POST } = await import("@/app/api/copilot/route");

    const postReq = new Request("http://localhost:3000/api/copilot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "How many annual leave days do I have left?" }),
    });
    const postRes = await POST(postReq);
    expect(postRes.status).toBe(200);
    const postData = await postRes.json();
    expect(postData.success).toBe(true);
    expect(postData.replyText).toContain("Annual Leave");
    expect(postData.citation).toBeDefined();
    expect(postData.citation.policyTitle).toBeDefined();
  }, 35000);

  it("GET and POST /api/self-service (employee self-service portal)", async () => {
    const { GET, POST } = await import("@/app/api/self-service/route");

    // 1. GET self-service
    const getRes = await GET();
    expect(getRes.status).toBe(200);
    const getData = await getRes.json();
    expect(getData.success).toBe(true);
    expect(getData.profile).toBeDefined();
    expect(getData.balances).toBeDefined();
    expect(getData.balances.annualLeave).toBeDefined();

    // 2. POST HR ticket
    const postReq = new Request("http://localhost:3000/api/self-service", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: "Salary Certificate Request",
        inquiryText: "Need official salary certificate for bank loan processing.",
      }),
    });
    const postRes = await POST(postReq);
    expect(postRes.status).toBe(200);
    const postData = await postRes.json();
    expect(postData.success).toBe(true);
    expect(postData.workflowItem.code).toBeDefined();

    // Cleanup
    await prisma.workflowItem.delete({ where: { id: postData.workflowItem.id } });
  }, 35000);
});
