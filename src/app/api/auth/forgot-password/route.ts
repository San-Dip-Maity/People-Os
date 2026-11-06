import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = forgotPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { email } = result.data;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    let resetToken: string | undefined = undefined;

    if (user && user.isActive) {
      // Generate secure 32-byte token
      resetToken = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration

      // Invalidate existing unused tokens for this email
      await prisma.passwordResetToken.deleteMany({
        where: { email: normalizedEmail, usedAt: null },
      });

      await prisma.passwordResetToken.create({
        data: {
          email: normalizedEmail,
          token: resetToken,
          expiresAt,
        },
      });

      // Audit log the password reset request
      await prisma.auditLog.create({
        data: {
          actorId: user.id,
          action: "PASSWORD_RESET_REQUEST",
          resource: "User",
          resourceId: user.id,
        },
      });
    }

    // Always return a neutral success message to prevent user enumeration
    return NextResponse.json({
      success: true,
      message:
        "If a registered account matches that work email address, a password reset link has been dispatched.",
      // Provide resetToken in non-production environments to allow end-to-end verification
      ...(process.env.NODE_ENV !== "production" && resetToken
        ? { debugToken: resetToken, resetUrl: `/reset-password?token=${resetToken}` }
        : {}),
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
