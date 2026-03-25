import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

const ALLOWED_FIELDS = [
  "name", "slug", "code", "description", "image",
  "boxCount", "pricePerBox", "stock", "status",
  "releaseDate", "packsPerBox", "cardsPerPack",
  "category", "islandTheme",
];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { productId } = await params;
  const body = await request.json();

  const data: Record<string, unknown> = {};
  for (const key of ALLOWED_FIELDS) {
    if (body[key] !== undefined) data[key] = body[key];
  }

  const product = await prisma.product.update({
    where: { id: productId },
    data,
  });

  return NextResponse.json(product);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { productId } = await params;

  // Check if product has any order items
  const orderCount = await prisma.orderItem.count({
    where: { productId },
  });

  if (orderCount > 0) {
    return NextResponse.json(
      { error: `Cannot delete: product has ${orderCount} order(s). Set status to SOLD_OUT instead.` },
      { status: 409 }
    );
  }

  await prisma.product.delete({ where: { id: productId } });

  return NextResponse.json({ success: true });
}
