import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: Record<string, unknown> = { role: "CUSTOMER" };

  if (search) {
    where.OR = [
      { email: { contains: search, mode: "insensitive" } },
      { displayName: { contains: search, mode: "insensitive" } },
    ];
  }

  const [customers, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true, email: true, displayName: true, phone: true,
        totalSpent: true, orderCount: true, createdAt: true,
      },
      orderBy: { totalSpent: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({ customers, total, page, limit });
}
