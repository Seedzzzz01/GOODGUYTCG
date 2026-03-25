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
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await params;

  // Verify order exists and belongs to user
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("slip") as File | null;

  if (!file) {
    return NextResponse.json({ error: "กรุณาเลือกไฟล์สลิป" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "รองรับเฉพาะไฟล์ JPG, PNG, WebP" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "ไฟล์ต้องไม่เกิน 5MB" },
      { status: 400 }
    );
  }

  // Save file
  const ext = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
  const filename = `slip_${orderId}_${Date.now()}.${ext}`;

  await mkdir(UPLOAD_DIR, { recursive: true });
  const bytes = new Uint8Array(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), bytes);

  const imageUrl = `/uploads/slips/${filename}`;

  // Create payment proof record
  const proof = await prisma.paymentProof.create({
    data: {
      orderId,
      imageUrl,
    },
  });

  // Update order status
  await prisma.order.update({
    where: { id: orderId },
    data: { status: "PAYMENT_UPLOADED" },
  });

  return NextResponse.json({ proof, imageUrl }, { status: 201 });
}
