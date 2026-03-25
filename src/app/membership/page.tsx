"use client";

import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import RankBadge from "@/components/gamification/RankBadge";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { BOUNTY_RANKS, getRankBySpent, formatPrice } from "@/lib/constants";

const TIER_BENEFITS: Record<string, { perks: string[]; exclusive: string }> = {
  "East Blue": {
    perks: [
      "สมาชิกพื้นฐาน",
      "เข้าถึงร้านค้าออนไลน์",
      "สะสมยอดซื้อเลื่อน Rank",
      "Spin Wheel ลุ้นรางวัลทุกออเดอร์",
    ],
    exclusive: "ยินดีต้อนรับสู่ Grand Line!",
  },
  Paradise: {
    perks: [
      "ส่วนลด 3% ทุกออเดอร์",
      "แจ้งเตือนสินค้าใหม่ก่อนใคร",
      "Pre-order ก่อนเปิดขายทั่วไป",
      "Spin Wheel ลุ้นรางวัลทุกออเดอร์",
    ],
    exclusive: "Early access สำหรับ Pre-order",
  },
  "New World": {
    perks: [
      "ส่วนลด 5% ทุกออเดอร์",
      "ส่งฟรีทุกออเดอร์",
      "ของแถม Sleeve/Sticker เซ็ตพิเศษ",
      "Priority packing ส่งก่อนใคร",
      "สิทธิ์ Pre-order สินค้า Limited",
    ],
    exclusive: "ส่งฟรี + ของแถมทุกกล่อง",
  },
  Yonko: {
    perks: [
      "ส่วนลด 8% ทุกออเดอร์",
      "ส่งฟรีทุกออเดอร์ + Priority Express",
      "ของแถม Exclusive Promo Card",
      "เข้าร่วมงาน VIP Event",
      "ส่วนลดพิเศษเฉพาะ Yonko",
      "LINE กลุ่มลับ Yonko — ข่าวสาร Meta ก่อนใคร",
    ],
    exclusive: "Exclusive Promo Card + VIP Event",
  },
};

export default function MembershipPage() {
  const { data: session } = useSession();
  const userSpent = (session?.user as { totalSpent?: number })?.totalSpent ?? 0;
  const currentRank = getRankBySpent(userSpent);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/sections/bounty-board.jpg" alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-[#0a0e27]/70" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center max-w-3xl mx-auto"
        >
          <span className="text-amber-400/60 text-xs tracking-[0.3em] uppercase">
            Bounty Rank Program
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-amber-100 mt-2">
            Membership Tiers
          </h1>
          <p className="text-amber-100/40 mt-3 text-sm max-w-lg mx-auto">
            ยิ่งซื้อเยอะ Rank ยิ่งสูง สิทธิพิเศษยิ่งโหด ส่วนลดสะสมตลอดชีพ
          </p>
          <div className="w-16 h-0.5 bg-amber-500/40 mx-auto mt-4" />

          {/* Current rank indicator */}
          {session?.user && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 inline-flex items-center gap-3 bg-[#0f1535]/80 backdrop-blur-sm border border-amber-500/20 rounded-full px-5 py-2.5"
            >
              <RankBadge rankName={currentRank.name} color={currentRank.color} size={28} />
              <span className="text-amber-100 text-sm font-bold">
                Rank ปัจจุบัน: <span style={{ color: currentRank.color }}>{currentRank.name}</span>
              </span>
            </motion.div>
          )}
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* How it works */}
        <ScrollReveal variant="fadeUp" className="text-center mb-16">
          <h2 className="text-2xl font-black text-amber-100 mb-6">ทำงานยังไง?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: "🛒", title: "ซื้อสินค้า", desc: "สั่งซื้อกล่องการ์ดจากร้าน ยอดสะสมนับอัตโนมัติ" },
              { icon: "⬆️", title: "เลื่อน Rank", desc: "ยอดสะสมถึงเกณฑ์ Rank ขึ้นอัตโนมัติ ไม่มีหมดอายุ" },
              { icon: "🎁", title: "รับสิทธิพิเศษ", desc: "ส่วนลด ของแถม ส่งฟรี และสิทธิ์ Exclusive" },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-[#0f1535] border border-amber-500/5 rounded-2xl p-6"
              >
                <p className="text-3xl mb-3">{step.icon}</p>
                <h3 className="text-amber-400 font-bold text-sm mb-1">{step.title}</h3>
                <p className="text-amber-100/40 text-xs">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        {/* Tier Cards */}
        <div className="space-y-6">
          {BOUNTY_RANKS.map((rank, i) => {
            const benefits = TIER_BENEFITS[rank.name];
            const isCurrentRank = rank.name === currentRank.name;
            const isAchieved = userSpent >= rank.minSpent;
            const nextRank = BOUNTY_RANKS[i + 1];

            return (
              <ScrollReveal key={rank.name} variant={i % 2 === 0 ? "fadeLeft" : "fadeRight"} delay={i * 0.1}>
                <div
                  className={`relative bg-[#0f1535] border rounded-2xl overflow-hidden transition-all ${
                    isCurrentRank
                      ? "border-amber-500/40 shadow-[0_0_30px_rgba(255,215,0,0.1)]"
                      : isAchieved
                      ? "border-amber-500/15"
                      : "border-amber-500/5 opacity-70"
                  }`}
                >
                  {/* Current rank badge */}
                  {isCurrentRank && (
                    <div className="absolute top-4 right-4 bg-amber-500 text-[#0a0e27] text-[10px] font-black px-3 py-1 rounded-full">
                      RANK ปัจจุบัน
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-6 p-6">
                    {/* Rank Badge */}
                    <div className="flex flex-col items-center sm:w-40 flex-shrink-0">
                      <RankBadge
                        rankName={rank.name}
                        color={rank.color}
                        size={80}
                        animate={isCurrentRank}
                      />
                      <h3 className="text-xl font-black mt-2" style={{ color: rank.color }}>
                        {rank.name}
                      </h3>
                      <p className="text-amber-100/30 text-xs mt-1">
                        ฿{formatPrice(rank.minSpent)}+
                      </p>
                      {rank.discount > 0 && (
                        <div
                          className="mt-2 text-sm font-black px-3 py-1 rounded-full"
                          style={{ color: rank.color, backgroundColor: rank.color + "15" }}
                        >
                          -{rank.discount}%
                        </div>
                      )}
                    </div>

                    {/* Benefits */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                          สิทธิพิเศษ
                        </span>
                        {benefits?.exclusive && (
                          <span className="text-[10px] text-amber-100/30 bg-amber-500/5 px-2 py-0.5 rounded-full">
                            {benefits.exclusive}
                          </span>
                        )}
                      </div>
                      <ul className="space-y-2">
                        {benefits?.perks.map((perk) => (
                          <li key={perk} className="flex items-start gap-2 text-sm">
                            <span className={`mt-0.5 flex-shrink-0 ${isAchieved ? "text-emerald-400" : "text-amber-100/20"}`}>
                              {isAchieved ? "✓" : "○"}
                            </span>
                            <span className={isAchieved ? "text-amber-100/70" : "text-amber-100/30"}>
                              {perk}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Progress to this rank */}
                      {!isAchieved && (
                        <div className="mt-4 bg-[#1a2040] rounded-lg p-3">
                          <div className="flex justify-between text-xs text-amber-100/30 mb-1.5">
                            <span>฿{formatPrice(userSpent)}</span>
                            <span>฿{formatPrice(rank.minSpent)}</span>
                          </div>
                          <div className="h-1.5 bg-[#0a0e27] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${Math.min((userSpent / rank.minSpent) * 100, 100)}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: rank.color }}
                            />
                          </div>
                          <p className="text-xs text-amber-100/20 mt-1.5">
                            อีก ฿{formatPrice(rank.minSpent - userSpent)} ถึง {rank.name}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* CTA */}
        <ScrollReveal variant="fadeUp" className="text-center mt-12">
          <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-2xl p-8">
            <p className="text-amber-400 font-bold text-lg mb-2">เริ่มสะสมวันนี้</p>
            <p className="text-amber-100/40 text-sm mb-5">
              ทุกออเดอร์นับยอดสะสมอัตโนมัติ Rank ไม่มีหมดอายุ
            </p>
            <div className="flex justify-center gap-3">
              <Link href="/shop">
                <motion.button whileHover={{ scale: 1.05 }} className="bg-amber-500 hover:bg-amber-400 text-[#0a0e27] font-black px-6 py-2.5 rounded-full transition-colors text-sm">
                  เลือกซื้อสินค้า
                </motion.button>
              </Link>
              {!session && (
                <Link href="/auth/register">
                  <motion.button whileHover={{ scale: 1.05 }} className="border border-amber-500/30 text-amber-400 font-bold px-6 py-2.5 rounded-full hover:bg-amber-500/5 transition-colors text-sm">
                    สมัครสมาชิก
                  </motion.button>
                </Link>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
