import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalOrders,
    ordersToday,
    pendingPayments,
    totalRevenue,
    totalCustomers,
    lowStockProducts,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.order.count({ where: { status: "PAYMENT_UPLOADED" } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { notIn: ["CANCELLED", "PENDING"] } },
    }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count({ where: { stock: { lte: 3 }, status: "IN_STOCK" } }),
  ]);

  return NextResponse.json({
    totalOrders,
    ordersToday,
    pendingPayments,
    totalRevenue: totalRevenue._sum.total || 0,
    totalCustomers,
    lowStockProducts,
  });
}
