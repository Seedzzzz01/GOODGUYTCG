import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code")?.toUpperCase().trim();

  if (!code) {
    return NextResponse.json({ valid: false });
  }

  const user = await prisma.user.findUnique({
    where: { referralCode: code },
    select: { id: true, displayName: true },
  });

  return NextResponse.json({
    valid: !!user,
    referrerName: user?.displayName || null,
  });
}
