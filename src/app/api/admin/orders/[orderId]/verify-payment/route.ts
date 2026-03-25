import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

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
