import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { hashSync } from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password, displayName } = await request.json();

    if (!email || !password || !displayName) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบ" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "อีเมลนี้ถูกใช้งานแล้ว" },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashSync(password, 12),
        displayName,
        name: displayName,
      },
    });

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
