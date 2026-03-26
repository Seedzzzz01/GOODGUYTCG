import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  const { orderId } = await params;
  const { approved } = await request.json();

  // Wrap in transaction for atomicity
  await prisma.$transaction(async (tx) => {
    await tx.paymentProof.updateMany({
      where: { orderId, status: "PENDING" },
      data: {
        status: approved ? "APPROVED" : "REJECTED",
        verifiedBy: session!.user.id,
        verifiedAt: new Date(),
      },
    });

    await tx.order.update({
      where: { id: orderId },
      data: {
        status: approved ? "PAYMENT_CONFIRMED" : "PENDING",
      },
    });
  });

  return NextResponse.json({ success: true });
}
