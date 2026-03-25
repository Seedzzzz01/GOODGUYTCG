import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const {
    name, code, description, image, boxCount, pricePerBox, stock,
    status, releaseDate, packsPerBox, cardsPerPack, category, islandTheme,
  } = body;

  if (!name || !code || !pricePerBox) {
    return NextResponse.json(
      { error: "name, code, pricePerBox are required" },
      { status: 400 }
    );
  }

  // Check unique code
  const existing = await prisma.product.findUnique({ where: { code } });
  if (existing) {
    return NextResponse.json({ error: `Code "${code}" already exists` }, { status: 409 });
  }

  // Generate unique slug
  let slug = slugify(name);
  const slugExists = await prisma.product.findUnique({ where: { slug } });
  if (slugExists) slug = `${slug}-${Date.now()}`;

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      code,
      description: description || "",
      image: image || `/images/sets/${code.toLowerCase().replace("-", "")}.png`,
      boxCount: boxCount || 1,
      pricePerBox,
      stock: stock || 0,
      status: status || "IN_STOCK",
      releaseDate: releaseDate || "",
      packsPerBox: packsPerBox || 24,
      cardsPerPack: cardsPerPack || 6,
      category: category || null,
      islandTheme: islandTheme || null,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
