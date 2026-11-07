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
    const documents = await prisma.documentRecord.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      documents,
    });
  } catch (error) {
    console.error("GET /api/documents error:", error);
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
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
    const { title, category, fileSize, scope, expiresAt } = body;

    if (!title || !category) {
      return NextResponse.json({ error: "Title and category are required" }, { status: 400 });
    }

    const doc = await prisma.documentRecord.create({
      data: {
        tenantId,
        title,
        category,
        fileSize: fileSize || "1.2 MB PDF",
        scope: scope || "All Employees",
        expiresAt: expiresAt || "Permanent",
      },
    });

    await prisma.auditLog.create({
      data: {
        tenantId,
        actorId: session.user.id,
        action: "UPLOAD_DOCUMENT",
        resource: "DocumentRecord",
        resourceId: doc.id,
        details: { title, category, scope },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Document "${title}" uploaded and registered in vault.`,
      document: doc,
    });
  } catch (error) {
    console.error("POST /api/documents error:", error);
    return NextResponse.json({ error: "Failed to upload document" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
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
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Document ID required" }, { status: 400 });
    }

    await prisma.documentRecord.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        tenantId,
        actorId: session.user.id,
        action: "DELETE_DOCUMENT",
        resource: "DocumentRecord",
        resourceId: id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Document removed from vault.",
    });
  } catch (error) {
    console.error("DELETE /api/documents error:", error);
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
  }
}
