import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I/O/0/1 to avoid confusion
  let code = "GG-";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// GET — get or create user's referral code + stats
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { referralCode: true, referredById: true },
  });

  // Generate code if not exists
  if (!user?.referralCode) {
    let code = generateCode();
    // Ensure unique
    while (await prisma.user.findUnique({ where: { referralCode: code } })) {
      code = generateCode();
    }
    user = await prisma.user.update({
      where: { id: session.user.id },
      data: { referralCode: code },
      select: { referralCode: true, referredById: true },
    });
  }

  // Count referrals
  const referralCount = await prisma.user.count({
    where: { referredById: session.user.id },
  });

  // Get referred users with their spend
  const referrals = await prisma.user.findMany({
    where: { referredById: session.user.id },
    select: {
      displayName: true,
      createdAt: true,
      totalSpent: true,
      orderCount: true,
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json({
    referralCode: user!.referralCode,
    referralCount,
    referrals,
    referredBy: !!user!.referredById,
  });
}
