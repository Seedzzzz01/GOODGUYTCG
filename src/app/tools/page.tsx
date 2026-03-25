"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const TOOLS = [
  {
    href: "/tools/pull-simulator",
    icon: "🎰",
    name: "Pack Opening Simulator",
    desc: "จำลองเปิดซองฟรี ดู pull rate ก่อนซื้อจริง",
    color: "#ffd700",
  },
  {
    href: "/tools/price-compare",
    icon: "💰",
    name: "Price Compare",
    desc: "เปรียบเทียบราคา JP vs EN ทุกใบ ดูว่าการ์ดไหนคุ้ม",
    color: "#27ae60",
  },
  {
    href: "/tools/collection",
    icon: "📋",
    name: "Collection Tracker",
    desc: "ติดตามว่ามีการ์ดใบไหนแล้ว ใบไหนยังขาด",
    color: "#3498db",
  },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="text-amber-400/60 text-xs tracking-[0.3em] uppercase">OPTCG Tools</span>
          <h1 className="text-4xl sm:text-5xl font-black text-amber-100 mt-2">
            🧰 เครื่องมือฟรี
          </h1>
          <p className="text-amber-100/40 mt-2 text-sm max-w-lg mx-auto">
            เครื่องมือช่วยเหลือนักเล่น OPTCG — ใช้ฟรีไม่ต้องสมัครสมาชิก
          </p>
          <div className="w-16 h-0.5 bg-amber-500/40 mx-auto mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TOOLS.map((tool, i) => (
            <Link key={tool.href} href={tool.href}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="bg-[#0f1535] border border-amber-500/10 hover:border-amber-500/30 rounded-2xl p-6 text-center cursor-pointer transition-colors h-full"
              >
                <p className="text-4xl mb-3">{tool.icon}</p>
                <h3 className="text-amber-100 font-black text-lg mb-2">{tool.name}</h3>
                <p className="text-amber-100/40 text-sm">{tool.desc}</p>
                <div className="mt-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ color: tool.color, backgroundColor: tool.color + "15" }}>
                    ใช้ฟรี →
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
