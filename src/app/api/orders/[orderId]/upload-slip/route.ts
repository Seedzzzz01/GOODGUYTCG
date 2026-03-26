import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "slips");
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;

  // Find order by ID or orderNumber
  const order = await prisma.order.findFirst({
    where: { OR: [{ id: orderId }, { orderNumber: orderId }] },
  });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Auth: logged-in owner, admin, or guest with phone match
  const session = await auth();
  const isOwner = session?.user?.id && order.userId === session.user.id;
  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";

  // For guest: check phone in FormData
  const formData = await request.formData();
  const guestPhone = formData.get("phone") as string | null;
  const isGuestMatch = !order.userId && guestPhone && order.shippingPhone === guestPhone;

  if (!isOwner && !isAdmin && !isGuestMatch) {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึงออเดอร์นี้" }, { status: 403 });
  }

  const file = formData.get("slip") as File | null;
  if (!file) {
    return NextResponse.json({ error: "กรุณาเลือกไฟล์สลิป" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "รองรับเฉพาะ JPG, PNG, WebP" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "ไฟล์ต้องไม่เกิน 5MB" }, { status: 400 });
  }

  // Save file
  const ext = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
  const filename = `slip_${order.id}_${Date.now()}.${ext}`;
  await mkdir(UPLOAD_DIR, { recursive: true });
  const bytes = new Uint8Array(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), bytes);

  const imageUrl = `/uploads/slips/${filename}`;

  const proof = await prisma.paymentProof.create({
    data: { orderId: order.id, imageUrl },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { status: "PAYMENT_UPLOADED" },
  });

  return NextResponse.json({ proof, imageUrl }, { status: 201 });
}
