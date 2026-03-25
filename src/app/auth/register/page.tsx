"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    setLoading(true);

    // Call register API
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
        displayName: form.displayName,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "เกิดข้อผิดพลาด");
      setLoading(false);
      return;
    }

    // Auto sign in after register
    const signInRes = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (signInRes?.error) {
      setError("สมัครสำเร็จ กรุณาเข้าสู่ระบบด้วยตนเอง");
    } else {
      router.push("/profile");
      router.refresh();
    }
  };

  const update = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#0f1535] border border-amber-500/10 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-amber-400 mb-2">
              สมัครสมาชิก
            </h1>
            <p className="text-amber-100/40 text-sm">
              เข้าร่วมลูกเรือและเริ่มสะสม Bounty Rank
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-amber-100/60 text-sm mb-1.5">
                ชื่อที่แสดง
              </label>
              <input
                type="text"
                value={form.displayName}
                onChange={(e) => update("displayName", e.target.value)}
                className="w-full bg-[#1a2040] border border-amber-500/10 rounded-xl px-4 py-3 text-amber-100 placeholder-amber-100/20 focus:outline-none focus:border-amber-500/40 transition-colors"
                placeholder="Monkey D. Luffy"
                required
              />
            </div>

            <div>
              <label className="block text-amber-100/60 text-sm mb-1.5">
                อีเมล
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="w-full bg-[#1a2040] border border-amber-500/10 rounded-xl px-4 py-3 text-amber-100 placeholder-amber-100/20 focus:outline-none focus:border-amber-500/40 transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-amber-100/60 text-sm mb-1.5">
                รหัสผ่าน
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                className="w-full bg-[#1a2040] border border-amber-500/10 rounded-xl px-4 py-3 text-amber-100 placeholder-amber-100/20 focus:outline-none focus:border-amber-500/40 transition-colors"
                placeholder="อย่างน้อย 6 ตัวอักษร"
                required
              />
            </div>

            <div>
              <label className="block text-amber-100/60 text-sm mb-1.5">
                ยืนยันรหัสผ่าน
              </label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => update("confirmPassword", e.target.value)}
                className="w-full bg-[#1a2040] border border-amber-500/10 rounded-xl px-4 py-3 text-amber-100 placeholder-amber-100/20 focus:outline-none focus:border-amber-500/40 transition-colors"
                placeholder="กรอกรหัสผ่านอีกครั้ง"
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center bg-red-400/10 rounded-lg py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-[#0a0e27] font-black py-3 rounded-xl transition-colors text-lg"
            >
              {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
            </button>
          </form>

          <p className="text-center text-amber-100/30 text-sm mt-6">
            มีบัญชีอยู่แล้ว?{" "}
            <Link
              href="/auth/login"
              className="text-amber-400 hover:text-amber-300 font-bold"
            >
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
