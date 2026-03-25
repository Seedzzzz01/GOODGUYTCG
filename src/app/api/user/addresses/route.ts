import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const addresses = await prisma.shippingAddress.findMany({
    where: { userId: session.user.id },
    orderBy: { isDefault: "desc" },
  });

  return NextResponse.json(addresses);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, phone, address, province, zipcode, isDefault } = body;

  if (!name || !phone || !address) {
    return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบ" }, { status: 400 });
  }

  // If setting as default, unset others first
  if (isDefault) {
    await prisma.shippingAddress.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

  const created = await prisma.shippingAddress.create({
    data: {
      userId: session.user.id,
      name,
      phone,
      address,
      province: province || "",
      zipcode: zipcode || "",
      isDefault: isDefault ?? false,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
