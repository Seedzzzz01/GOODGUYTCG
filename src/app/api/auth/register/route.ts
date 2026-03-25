import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { hashSync } from "bcryptjs";
import { rateLimit, getIP } from "@/lib/rate-limit";

export async function POST(request: Request) {
  // Rate limit: 5 registrations per IP per 15 minutes
  const ip = getIP(request);
  const rl = rateLimit(`register:${ip}`, 5, 15 * 60 * 1000);
  if (rl.limited) {
    return NextResponse.json(
      { error: `ลองใหม่ในอีก ${rl.resetIn} วินาที` },
      { status: 429 }
    );
  }

  try {
    const { email, password, displayName, referralCode } = await request.json();

    if (!email || !password || !displayName) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบ" },
        { status: 400 }
      );
    }

    // Email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "รูปแบบอีเมลไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    // Stronger password policy
    if (password.length < 8) {
      return NextResponse.json(
        { error: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" },
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

    // Look up referrer if code provided
    let referredById: string | undefined;
    if (referralCode) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode: referralCode.toUpperCase().trim() },
        select: { id: true },
      });
      if (referrer) referredById = referrer.id;
    }

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashSync(password, 12),
        displayName,
        name: displayName,
        referredById,
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
