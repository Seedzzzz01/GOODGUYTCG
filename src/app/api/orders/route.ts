import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { getRankBySpent } from "@/lib/constants";

// GET /api/orders — list user's orders
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true, paymentProofs: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

// POST /api/orders — create order (checkout)
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { items, shippingName, shippingPhone, shippingAddress, shippingProvince, shippingZipcode, note } = body as {
    items: { productId: string; quantity: number }[];
    shippingName: string;
    shippingPhone: string;
    shippingAddress: string;
    shippingProvince: string;
    shippingZipcode: string;
    note?: string;
  };

  if (!items?.length) {
    return NextResponse.json({ error: "ไม่มีสินค้าในตะกร้า" }, { status: 400 });
  }

  if (!shippingName || !shippingPhone || !shippingAddress) {
    return NextResponse.json({ error: "กรุณากรอกที่อยู่จัดส่ง" }, { status: 400 });
  }

  // Use a Prisma transaction for atomicity
  const order = await prisma.$transaction(async (tx) => {
    // 1. Fetch products and validate stock
    const productIds = items.map((i) => i.productId);
    const products = await tx.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) throw new Error(`สินค้า ${item.productId} ไม่พบ`);
      if (product.status === "SOLD_OUT") throw new Error(`${product.name} สินค้าหมด`);
      if (product.stock < item.quantity && product.status !== "PRE_ORDER") {
        throw new Error(`${product.name} เหลือ ${product.stock} กล่อง`);
      }
    }

    // 2. Get user's current totalSpent for bounty rank discount
    const user = await tx.user.findUnique({
      where: { id: session.user.id },
      select: { totalSpent: true },
    });

    const rank = getRankBySpent(user?.totalSpent ?? 0);

    // 3. Calculate totals server-side
    let subtotal = 0;
    const orderItems: {
      productId: string;
      productName: string;
      productCode: string;
      productImage: string;
      price: number;
      quantity: number;
    }[] = [];

    for (const item of items) {
      const product = productMap.get(item.productId)!;
      const lineTotal = product.pricePerBox * item.quantity;
      subtotal += lineTotal;
      orderItems.push({
        productId: product.id,
        productName: product.name,
        productCode: product.code,
        productImage: product.image,
        price: product.pricePerBox,
        quantity: item.quantity,
      });
    }

    const discountAmount = Math.floor(subtotal * (rank.discount / 100));
    const total = subtotal - discountAmount;

    // 4. Generate order number: GG + YYMMdd + 4-digit random
    const now = new Date();
    const dateStr = [
      now.getFullYear().toString().slice(-2),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("");
    const rand = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
    const orderNumber = `GG${dateStr}-${rand}`;

    // 5. Create order + items
    const created = await tx.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        subtotal,
        discountAmount,
        discountRank: rank.discount > 0 ? rank.name : "",
        total,
        shippingName,
        shippingPhone,
        shippingAddress,
        shippingProvince: shippingProvince || "",
        shippingZipcode: shippingZipcode || "",
        note: note || "",
        items: { create: orderItems },
      },
      include: { items: true },
    });

    // 6. Decrement stock
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // 7. Update user stats
    await tx.user.update({
      where: { id: session.user.id },
      data: {
        totalSpent: { increment: total },
        orderCount: { increment: 1 },
      },
    });

    return created;
  });

  return NextResponse.json(order, { status: 201 });
}
