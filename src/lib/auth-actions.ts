"use server";

import { signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { hashSync } from "bcryptjs";

export async function loginAction(
  _prevState: { error?: string } | null,
  formData: FormData
) {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });
    return { success: true };
  } catch {
    return { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
  }
}

export async function registerAction(
  _prevState: { error?: string } | null,
  formData: FormData
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const displayName = formData.get("displayName") as string;

  if (!email || !password || !displayName) {
    return { error: "กรุณากรอกข้อมูลให้ครบ" };
  }

  if (password.length < 6) {
    return { error: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" };
  }

  if (password !== confirmPassword) {
    return { error: "รหัสผ่านไม่ตรงกัน" };
  }

  // Check if email already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "อีเมลนี้ถูกใช้งานแล้ว" };
  }

  // Create user
  await prisma.user.create({
    data: {
      email,
      passwordHash: hashSync(password, 12),
      displayName,
      name: displayName,
    },
  });

  // Auto sign in
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch {
    return { error: "สมัครสำเร็จแต่เข้าสู่ระบบไม่ได้ กรุณาเข้าสู่ระบบด้วยตนเอง" };
  }
}

export async function logoutAction() {
  await signOut({ redirect: false });
}
