import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashSync } from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Status mapping from our constants to Prisma enum
const statusMap: Record<string, "IN_STOCK" | "PRE_ORDER" | "SOLD_OUT"> = {
  "in-stock": "IN_STOCK",
  "pre-order": "PRE_ORDER",
  "sold-out": "SOLD_OUT",
};

const categoryMap: Record<string, "BOOSTER" | "EXTRA" | "PREMIUM" | "STARTER"> = {
  booster: "BOOSTER",
  extra: "EXTRA",
  premium: "PREMIUM",
  starter: "STARTER",
};

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Create Users ───
  // Admin credentials from env vars (never hardcode in production)
  const adminEmail = process.env.ADMIN_EMAIL || "admin@luckytcgthailand.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "changeme_in_production";

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: hashSync(adminPassword, 12),
      displayName: "Admin",
      name: "Admin",
      role: "ADMIN",
      totalSpent: 0,
      orderCount: 0,
    },
  });
  console.log(`  ✓ Admin user: ${adminUser.email}`);

  // Demo user only in development
  if (process.env.NODE_ENV !== "production") {
    const demoUser = await prisma.user.upsert({
      where: { email: "demo@luckytcgthailand.com" },
      update: {},
      create: {
        email: "demo@luckytcgthailand.com",
        passwordHash: hashSync("demo12345", 12),
        displayName: "Nakama Member",
        name: "Nakama Member",
        role: "CUSTOMER",
        totalSpent: 12500,
        orderCount: 4,
        phone: "081-234-5678",
        lineId: "@nakama",
      },
    });
    console.log(`  ✓ Demo user: ${demoUser.email}`);
  }

  // ─── Seed Products from SAMPLE_SETS ───
  // We import this dynamically to avoid TypeScript path alias issues in seed
  const { SAMPLE_SETS } = await import("../src/lib/constants");

  for (const set of SAMPLE_SETS) {
    await prisma.product.upsert({
      where: { slug: set.slug },
      update: {
        name: set.name,
        code: set.code,
        description: set.description,
        image: set.image,
        boxCount: set.boxCount,
        pricePerBox: set.pricePerBox,
        stock: set.stock,
        status: statusMap[set.status] || "IN_STOCK",
        releaseDate: set.releaseDate,
        packsPerBox: set.packsPerBox,
        cardsPerPack: set.cardsPerPack,
        category: set.category ? categoryMap[set.category] : null,
        islandTheme: set.islandTheme as object,
      },
      create: {
        name: set.name,
        slug: set.slug,
        code: set.code,
        description: set.description,
        image: set.image,
        boxCount: set.boxCount,
        pricePerBox: set.pricePerBox,
        stock: set.stock,
        status: statusMap[set.status] || "IN_STOCK",
        releaseDate: set.releaseDate,
        packsPerBox: set.packsPerBox,
        cardsPerPack: set.cardsPerPack,
        category: set.category ? categoryMap[set.category] : null,
        islandTheme: set.islandTheme as object,
      },
    });
  }
  console.log(`  ✓ ${SAMPLE_SETS.length} products seeded`);

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
