import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products");
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;

  const formData = await request.formData();
  const file = formData.get("image") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Only JPG, PNG, WebP allowed" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Max 5MB" }, { status: 400 });
  }

  const ext = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
  const filename = `product_${productId}_${Date.now()}.${ext}`;

  await mkdir(UPLOAD_DIR, { recursive: true });
  const bytes = new Uint8Array(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), bytes);

  const imageUrl = `/uploads/products/${filename}`;

  await prisma.product.update({
    where: { id: productId },
    data: { image: imageUrl },
  });

  return NextResponse.json({ imageUrl }, { status: 201 });
}
