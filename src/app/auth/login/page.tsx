"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/profile";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

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
              เข้าสู่ระบบ
            </h1>
            <p className="text-amber-100/40 text-sm">
              เข้าสู่ระบบเพื่อสั่งซื้อและสะสม Bounty Rank
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-amber-100/60 text-sm mb-1.5">
                อีเมล
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1a2040] border border-amber-500/10 rounded-xl px-4 py-3 text-amber-100 placeholder-amber-100/20 focus:outline-none focus:border-amber-500/40 transition-colors"
                placeholder="••••••"
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
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>

          {/* LINE Login — uncomment when LINE OAuth is configured */}
          {/* <div className="mt-4">
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-amber-500/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#0f1535] px-4 text-amber-100/30">หรือ</span>
              </div>
            </div>
            <button
              onClick={() => signIn("line", { callbackUrl })}
              className="w-full bg-[#06C755] hover:bg-[#05b34d] text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <span className="text-xl">💬</span>
              เข้าสู่ระบบด้วย LINE
            </button>
          </div> */}

          <p className="text-center text-amber-100/30 text-sm mt-6">
            ยังไม่มีบัญชี?{" "}
            <Link
              href="/auth/register"
              className="text-amber-400 hover:text-amber-300 font-bold"
            >
              สมัครสมาชิก
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
