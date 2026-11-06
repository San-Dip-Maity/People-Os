import * as React from "react";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { AppShell } from "@/components/layout/app-shell";

export const instant = false;

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  const currentUser = {
    id: session.user.id,
    name: `${session.user.firstName} ${session.user.lastName}`,
    email: session.user.email,
    role:
      session.user.memberships[0]?.role ||
      (session.user.isSuperAdmin ? "SUPER_ADMIN" : "EMPLOYEE"),
    organization:
      session.user.memberships[0]?.tenant?.name || "PeopleOS Organization",
  };

  return <AppShell user={currentUser}>{children}</AppShell>;
}
