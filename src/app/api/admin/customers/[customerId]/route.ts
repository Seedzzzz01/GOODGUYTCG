import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ customerId: string }> }
) {
  const { customerId } = await params;

  const customer = await prisma.user.findUnique({
    where: { id: customerId },
    select: {
      id: true, email: true, displayName: true, phone: true,
      lineId: true, avatarUrl: true, totalSpent: true, orderCount: true,
      role: true, createdAt: true,
      orders: {
        select: {
          id: true, orderNumber: true, status: true,
          subtotal: true, discountAmount: true, total: true,
          discountRank: true, createdAt: true,
          items: {
            select: {
              productName: true, productCode: true, quantity: true, price: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      },
      shippingAddresses: {
        select: {
          id: true, name: true, phone: true, address: true,
          province: true, zipcode: true, isDefault: true,
        },
        orderBy: { isDefault: "desc" },
      },
    },
  });

  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  return NextResponse.json(customer);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ customerId: string }> }
) {
  const { customerId } = await params;
  const body = await request.json();

  const allowed = ["displayName", "phone", "lineId", "role", "totalSpent"];
  const data: Record<string, unknown> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) data[key] = body[key];
  }

  const customer = await prisma.user.update({
    where: { id: customerId },
    data,
    select: {
      id: true, email: true, displayName: true, phone: true,
      lineId: true, totalSpent: true, orderCount: true, role: true,
    },
  });

  return NextResponse.json(customer);
}
