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
          timezone: "America/New_York",
          workWeek: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
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

