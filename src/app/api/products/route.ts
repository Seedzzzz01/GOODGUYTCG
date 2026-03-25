import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = {};

  if (status) {
    const statusMap: Record<string, string> = {
      "in-stock": "IN_STOCK",
      "pre-order": "PRE_ORDER",
      "sold-out": "SOLD_OUT",
    };
    where.status = statusMap[status] || status;
  }

  if (category) {
    where.category = category.toUpperCase();
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { code: { contains: search, mode: "insensitive" } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { releaseDate: "desc" },
  });

  return NextResponse.json(products);
}
