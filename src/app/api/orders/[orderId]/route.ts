import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;
  const url = new URL(request.url);
  const phone = url.searchParams.get("phone");

  const order = await prisma.order.findFirst({
    where: {
      OR: [
        { id: orderId },
        { orderNumber: orderId },
      ],
    },
    include: { items: true, paymentProofs: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Auth check: logged-in user (owner or admin) OR guest with matching phone
  const session = await auth();
  const isOwner = session?.user?.id && order.userId === session.user.id;
  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";
  const isGuestMatch = !order.userId && phone && order.shippingPhone === phone;

  if (!isOwner && !isAdmin && !isGuestMatch) {
    return NextResponse.json({ error: "กรุณาใส่เบอร์โทรที่ใช้สั่งซื้อ" }, { status: 403 });
  }

  return NextResponse.json(order);
}
