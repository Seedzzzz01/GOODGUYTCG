import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id || (session.user as { role?: string }).role !== "ADMIN") {
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

  // Use transaction for cancellation (need to restore stock)
  const order = await prisma.$transaction(async (tx) => {
    const current = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!current) throw new Error("Order not found");

    // Restore stock if cancelling a non-cancelled order
    if (status === "CANCELLED" && current.status !== "CANCELLED") {
      for (const item of current.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      // Revert user stats if logged-in order
      if (current.userId) {
        await tx.user.update({
          where: { id: current.userId },
          data: {
            totalSpent: { decrement: current.total },
            orderCount: { decrement: 1 },
          },
        });
      }
    }

    const data: Record<string, unknown> = { status };
    if (trackingNumber !== undefined) data.trackingNumber = trackingNumber;

    return tx.order.update({
      where: { id: orderId },
      data,
      include: { items: true },
    });
  });

  return NextResponse.json(order);
}
