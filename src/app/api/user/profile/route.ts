import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true, email: true, displayName: true, phone: true,
      lineId: true, avatarUrl: true, totalSpent: true, orderCount: true,
      role: true, createdAt: true,
    },
  });

  return NextResponse.json(user);
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const allowed = ["displayName", "phone", "lineId", "avatarUrl"];
  const data: Record<string, string> = {};

  for (const key of allowed) {
    if (body[key] !== undefined) data[key] = body[key];
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data,
    select: {
      id: true, email: true, displayName: true, phone: true,
      lineId: true, avatarUrl: true, totalSpent: true, orderCount: true,
      role: true, createdAt: true,
    },
  });

  return NextResponse.json(user);
}
