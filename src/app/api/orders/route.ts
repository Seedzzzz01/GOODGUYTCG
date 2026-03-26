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

// POST /api/orders — create order (supports both logged-in and guest checkout)
export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id || null;

  const body = await request.json();
  const {
    items, shippingName, shippingPhone, shippingAddress,
    shippingProvince, shippingZipcode, note, guestEmail,
  } = body as {
    items: { productId: string; quantity: number }[];
    shippingName: string;
    shippingPhone: string;
    shippingAddress: string;
    shippingProvince: string;
    shippingZipcode: string;
    note?: string;
    guestEmail?: string;
  };

  if (!items?.length) {
    return NextResponse.json({ error: "ไม่มีสินค้าในตะกร้า" }, { status: 400 });
  }

  if (!shippingName || !shippingPhone || !shippingAddress) {
    return NextResponse.json({ error: "กรุณากรอกชื่อ เบอร์โทร และที่อยู่" }, { status: 400 });
  }

  // Guest must provide phone at minimum (email optional)
  if (!userId && !shippingPhone) {
    return NextResponse.json({ error: "กรุณากรอกเบอร์โทรศัพท์" }, { status: 400 });
  }

  try {
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

      // 2. Get discount info (only for logged-in users)
      let rank = getRankBySpent(0);
      let isReferralFirstOrder = false;

      if (userId) {
        const user = await tx.user.findUnique({
          where: { id: userId },
          select: { totalSpent: true, orderCount: true, referredById: true },
        });
        rank = getRankBySpent(user?.totalSpent ?? 0);
        isReferralFirstOrder = !!user?.referredById && (user?.orderCount ?? 0) === 0;
      }

      // 3. Calculate totals
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
        subtotal += product.pricePerBox * item.quantity;
        orderItems.push({
          productId: product.id,
          productName: product.name,
          productCode: product.code,
          productImage: product.image,
          price: product.pricePerBox,
          quantity: item.quantity,
        });
      }

      const rankDiscount = userId ? Math.floor(subtotal * (rank.discount / 100)) : 0;
      const referralDiscount = isReferralFirstOrder ? Math.floor(subtotal * 0.03) : 0;
      const discountAmount = rankDiscount + referralDiscount;
      const total = subtotal - discountAmount;

      // 4. Generate order number: LK + YYMMdd + 4-digit random
      const now = new Date();
      const dateStr = [
        now.getFullYear().toString().slice(-2),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
      ].join("");
      const rand = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
      const orderNumber = `LK${dateStr}-${rand}`;

      // 5. Create order
      const created = await tx.order.create({
        data: {
          orderNumber,
          userId,
          guestEmail: guestEmail || "",
          guestPhone: !userId ? shippingPhone : "",
          subtotal,
          discountAmount,
          discountRank: [
            rank.discount > 0 ? rank.name : "",
            isReferralFirstOrder ? "Referral 3%" : "",
          ].filter(Boolean).join(" + ") || "",
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

      // 7. Update user stats (only if logged in)
      if (userId) {
        await tx.user.update({
          where: { id: userId },
          data: {
            totalSpent: { increment: total },
            orderCount: { increment: 1 },
          },
        });
      }

      return created;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "เกิดข้อผิดพลาด";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
