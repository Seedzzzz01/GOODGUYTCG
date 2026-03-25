import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await params;
  const { approved } = await request.json();

  // Update all pending proofs for this order
  await prisma.paymentProof.updateMany({
    where: { orderId, status: "PENDING" },
    data: {
      status: approved ? "APPROVED" : "REJECTED",
      verifiedBy: session.user.id,
      verifiedAt: new Date(),
    },
  });

  // Update order status
  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: approved ? "PAYMENT_CONFIRMED" : "PENDING",
    },
  });

  return NextResponse.json({ success: true });
}
