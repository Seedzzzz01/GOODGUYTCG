"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import CloudTransition from "@/components/layout/CloudTransition";
import IslandMap from "@/components/shop/IslandMap";
import PremiumCards from "@/components/shop/PremiumCards";
import RankBadge from "@/components/gamification/RankBadge";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { SAMPLE_SETS, BOUNTY_RANKS } from "@/lib/constants";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);


  return (
    <div>
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Parallax Ocean Background with Hero Image */}
        <motion.div
          style={{ y: bgY }}
          className="absolute inset-0"
        >
          <Image
            src="/images/hero-banner.png"
            alt="Grand Line"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e27]/70 via-[#0a0e27]/50 to-[#0a0e27]" />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          style={{ opacity: textOpacity }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block mb-4">
              <span className="text-amber-400/60 text-xs tracking-[0.4em] uppercase border border-amber-500/20 rounded-full px-4 py-1.5">
                One Piece Trading Card Game
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black mb-4 leading-none">
              <span className="text-amber-400 drop-shadow-[0_0_30px_rgba(255,215,0,0.3)]">
                GOODGUY
              </span>
              <br />
              <span className="text-amber-100/90 text-3xl sm:text-4xl lg:text-5xl tracking-wider">
                TCG STORE
              </span>
            </h1>

            <p className="text-amber-100/50 text-base sm:text-lg max-w-lg mx-auto mb-8 leading-relaxed">
              การ์ด One Piece ของแท้ ส่งตรงถึงบ้าน
              <br />
              สมาชิก Bounty Rank ลดเพิ่มทุกออเดอร์
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-[#0a0e27] font-black text-lg rounded-full transition-colors shadow-[0_0_30px_rgba(255,215,0,0.3)]"
                >
                  Explore Shop
                </motion.button>
              </Link>
              <Link href="/profile">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3.5 border border-amber-500/30 hover:border-amber-500/60 text-amber-400 font-bold rounded-full transition-colors"
                >
                  Join Bounty Crew
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-amber-400/40"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs tracking-wider">SCROLL</span>
            <span>↓</span>
          </div>
        </motion.div>
      </section>

      {/* Cloud Transition → Island Map */}
      <CloudTransition>
        <section className="relative py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <IslandMap sets={SAMPLE_SETS} />
          </div>
        </section>
      </CloudTransition>

      {/* Premium Singles — High Value Cards */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Treasure Vault BG */}
        <div className="absolute inset-0 z-0">
          <Image src="/images/sections/treasure-vault.jpg" alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-[#0a0e27]/70" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <ScrollReveal variant="fadeUp" className="text-center mb-12">
            <span className="text-amber-400/60 text-xs tracking-[0.3em] uppercase">
              Treasure Vault
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-amber-100 mt-2">
              Premium Singles
            </h2>
            <p className="text-amber-100/40 text-sm mt-2">
              การ์ดแพง หายาก เก็บไว้ไม่ผิดหวัง
            </p>
            <div className="w-16 h-0.5 bg-amber-500/40 mx-auto mt-4" />
          </ScrollReveal>

          <PremiumCards />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link href="/cards">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 border border-amber-500/30 hover:border-amber-500/60 text-amber-400 font-bold rounded-full transition-colors"
              >
                Browse All Cards →
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Buy From Us */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal variant="fadeUp" className="text-center mb-12">
            <span className="text-amber-400/60 text-xs tracking-[0.3em] uppercase">
              Why GOODGUY TCG
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-amber-100 mt-2">
              ทำไมต้องซื้อกับเรา?
            </h2>
            <div className="w-16 h-0.5 bg-amber-500/40 mx-auto mt-4" />
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: "✅", title: "ของแท้ 100%", desc: "การ์ด Bandai JP แท้ทุกกล่อง นำเข้าจากญี่ปุ่นโดยตรง ไม่มีของปลอม", color: "#27ae60" },
              { icon: "🚚", title: "ส่งไว 1-3 วัน", desc: "แพ็คอย่างดี กันกระแทก ส่งทั่วไทยผ่าน Kerry/Flash Express", color: "#3498db" },
              { icon: "🔒", title: "ชำระเงินปลอดภัย", desc: "โอนผ่าน PromptPay, Mobile Banking ยืนยันออเดอร์ภายใน 1 ชม.", color: "#8e44ad" },
              { icon: "💬", title: "ซัพพอร์ตตลอด", desc: "แชท LINE @goodguytcg ตอบภายใน 30 นาที ทุกวัน 9:00-21:00", color: "#f5a623" },
            ].map((item, i) => (
              <ScrollReveal key={item.title} variant="fadeUp" delay={i * 0.1}>
                <div className="bg-[#0f1535] border border-amber-500/5 rounded-2xl p-6 text-center h-full hover:border-amber-500/20 transition-colors">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mx-auto mb-4"
                    style={{ backgroundColor: item.color + "15" }}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-amber-100 font-black text-sm mb-2">{item.title}</h3>
                  <p className="text-amber-100/40 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Trust stats */}
          <ScrollReveal variant="fadeUp" className="mt-10">
            <div className="bg-[#0f1535]/50 border border-amber-500/5 rounded-2xl p-6 flex flex-wrap justify-center gap-8 sm:gap-12">
              {[
                { value: "100%", label: "ของแท้ Bandai JP" },
                { value: "1-3 วัน", label: "จัดส่งทั่วไทย" },
                { value: "30 นาที", label: "ตอบแชทเฉลี่ย" },
                { value: "7 วัน", label: "เปลี่ยน/คืนสินค้า" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-amber-400 font-black text-xl">{stat.value}</p>
                  <p className="text-amber-100/30 text-[10px] mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Bounty Rank Preview */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Bounty Board BG */}
        <div className="absolute inset-0 z-0">
          <Image src="/images/sections/bounty-board.jpg" alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-[#0a0e27]/60" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <ScrollReveal variant="fadeUp" className="text-center mb-12">
            <span className="text-amber-400/60 text-xs tracking-[0.3em] uppercase">
              Loyalty Program
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-amber-100 mt-2">
              Bounty Rank System
            </h2>
            <p className="text-amber-100/40 mt-3 max-w-md mx-auto text-sm">
              ซื้อเยอะ Rank ยิ่งสูง ส่วนลดยิ่งโหด
            </p>
            <div className="w-16 h-0.5 bg-amber-500/40 mx-auto mt-4" />
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {BOUNTY_RANKS.map((rank, i) => (
              <motion.div
                key={rank.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -5 }}
                className="bg-[#0f1535] border border-amber-500/10 rounded-2xl p-6 text-center hover:border-amber-500/30 transition-colors flex flex-col items-center"
              >
                {/* Badge */}
                <div className="mb-4">
                  <RankBadge rankName={rank.name} color={rank.color} size={64} />
                </div>

                <h3
                  className="font-black text-lg mb-1"
                  style={{ color: rank.color }}
                >
                  {rank.name}
                </h3>
                <p className="text-amber-100/30 text-xs mb-3">
                  {rank.minSpent === 0 ? "เริ่มต้น" : `฿${new Intl.NumberFormat("th-TH").format(rank.minSpent)}+`}
                </p>
                <div
                  className="inline-block rounded-full px-4 py-1.5"
                  style={{ backgroundColor: rank.color + "15" }}
                >
                  <span className="text-sm font-bold" style={{ color: rank.color }}>
                    {rank.discount > 0 ? `ลด ${rank.discount}%` : "Welcome"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Set Sail BG */}
        <div className="absolute inset-0 z-0">
          <Image src="/images/sections/set-sail.jpg" alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-[#0a0e27]/60" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-[#0a0e27]/50 backdrop-blur-sm border border-amber-500/20 rounded-3xl p-10"
          >
            <h2 className="text-2xl sm:text-3xl font-black text-amber-100 mb-3">
              Ready to Set Sail?
            </h2>
            <p className="text-amber-100/40 mb-6 text-sm">
              สนใจสั่งได้เลย ส่งทั่วไทย แชท LINE มาได้ตลอด
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/shop">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-[#0a0e27] font-black rounded-full transition-colors"
                >
                  Shop Now
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold rounded-full transition-colors"
              >
                LINE: @goodguytcg
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
