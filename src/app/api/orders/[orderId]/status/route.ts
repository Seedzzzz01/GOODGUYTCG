import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await params;
  const { status, trackingNumber } = await request.json();

  const validStatuses = [
    "PENDING", "PAYMENT_UPLOADED", "PAYMENT_CONFIRMED",
    "PACKING", "SHIPPED", "DELIVERED", "CANCELLED",
  ];

  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const data: Record<string, unknown> = { status };
  if (trackingNumber !== undefined) {
    data.trackingNumber = trackingNumber;
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data,
    include: { items: true },
  });

  return NextResponse.json(order);
}
