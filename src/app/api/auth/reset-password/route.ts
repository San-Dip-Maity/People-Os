import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { resetPasswordSchema } from "@/lib/validations/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = resetPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { token, password } = result.data;

    // 1. Verify token
    const tokenRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!tokenRecord) {
      return NextResponse.json(
        { error: "Invalid or expired reset link. Please request a new one." },
        { status: 400 }
      );
    }

    if (tokenRecord.usedAt !== null) {
      return NextResponse.json(
        { error: "This password reset link has already been used. Please request a new one." },
        { status: 400 }
      );
    }

    if (new Date() > tokenRecord.expiresAt) {
      return NextResponse.json(
        { error: "This password reset link has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // 2. Fetch user
    const user = await prisma.user.findUnique({
      where: { email: tokenRecord.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Associated user account not found." },
        { status: 404 }
      );
    }

    // 3. Hash new password
    const newPasswordHash = await hashPassword(password);

    // 4. Update password, mark token used, and revoke existing sessions
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: { passwordHash: newPasswordHash },
      });

      await tx.passwordResetToken.update({
        where: { id: tokenRecord.id },
        data: { usedAt: new Date() },
      });

      // Revoke all existing sessions for security
      await tx.session.deleteMany({
        where: { userId: user.id },
      });

      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: "PASSWORD_RESET_SUCCESS",
          resource: "User",
          resourceId: user.id,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Password reset successfully. You can now sign in with your new credentials.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

