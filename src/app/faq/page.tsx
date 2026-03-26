"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

const FAQS: FAQItem[] = [
  // สินค้า
  { category: "สินค้า", q: "การ์ดที่ขายเป็นของแท้หรือไม่?", a: "ของแท้ 100% จาก Bandai ญี่ปุ่น (JP version) นำเข้าจากแหล่งผลิตโดยตรง ทุกกล่องมีซีลจากโรงงาน ไม่มีของปลอม ไม่มีของ repack" },
  { category: "สินค้า", q: "ขาย JP version หรือ EN version?", a: "เราขาย JP version (ภาษาญี่ปุ่น) เป็นหลัก เพราะราคาถูกกว่า EN version 1.5-2 เท่า และเป็นเวอร์ชันต้นฉบับที่นักสะสมนิยม สามารถดูการ์ดทั้ง JP และ EN ได้ในเว็บ" },
  { category: "สินค้า", q: "1 กล่องมีอะไรบ้าง?", a: "Booster Box (JP) มี 24 ซอง ซองละ 6 ใบ รวม 144 ใบ/กล่อง โดยปกติจะได้ Leader 1 ใบ, SEC 1 ใบ, SR 3-5 ใบ, R หลายใบ ดูรายละเอียด Drop Rate ได้ในหน้าสินค้าแต่ละ set" },
  { category: "สินค้า", q: "Pre-Order คืออะไร?", a: "สินค้าที่ยังไม่วางจำหน่าย สามารถจองล่วงหน้าได้ เราจะจัดส่งทันทีที่ของถึงไทย ปกติภายใน 1-3 วันหลัง release date" },
  { category: "สินค้า", q: "มีกล่องไหนแนะนำสำหรับมือใหม่?", a: "แนะนำ OP-01 Romance Dawn เป็น set แรก มีตัวละครหลักครบ ราคาไม่แพง หรือลอง Starter Deck ก่อนก็ได้ อ่านบทความ 'คู่มือมือใหม่' ในหน้า Blog ได้เลย" },

  // สั่งซื้อ
  { category: "สั่งซื้อ", q: "สั่งซื้อยังไง?", a: "1. เลือกสินค้า → Add to Cart 2. กด Checkout → กรอกที่อยู่จัดส่ง 3. Place Order → โอนเงินตามยอด 4. อัพโหลดสลิป → รอรับของ (1-3 วัน)" },
  { category: "สั่งซื้อ", q: "ชำระเงินได้ช่องทางไหน?", a: "โอนผ่าน Mobile Banking หรือ PromptPay ได้เลย หลังสั่งซื้อจะแสดงข้อมูลบัญชี อัพโหลดสลิปในระบบ เรายืนยันภายใน 1 ชั่วโมง (ในเวลาทำการ)" },
  { category: "สั่งซื้อ", q: "มีขั้นต่ำในการสั่งซื้อไหม?", a: "ไม่มีขั้นต่ำ สั่ง 1 กล่องก็ได้ แต่ถ้าสั่ง 3 กล่องขึ้นไปจะคุ้มค่าค่าส่งมากกว่า" },
  { category: "สั่งซื้อ", q: "มีส่วนลดไหม?", a: "มี! ระบบ Bounty Rank ให้ส่วนลดถาวร 3-8% ตามยอดซื้อสะสม + สมัครด้วย Referral Code ได้ส่วนลด 3% ออเดอร์แรก ดูรายละเอียดได้ที่หน้า Membership" },
  { category: "สั่งซื้อ", q: "ยกเลิกออเดอร์ได้ไหม?", a: "ยกเลิกได้ก่อนแพ็คสินค้า แจ้งผ่าน LINE @goodguytcg หากชำระเงินแล้วจะคืนเงินภายใน 3 วันทำการ" },

  // จัดส่ง
  { category: "จัดส่ง", q: "ส่งกี่วัน?", a: "แพ็คภายใน 1 วันหลังยืนยันชำระเงิน ส่งผ่าน Kerry Express / Flash Express ถึงภายใน 1-3 วันทำการ (กรุงเทพ 1 วัน, ต่างจังหวัด 2-3 วัน)" },
  { category: "จัดส่ง", q: "ค่าส่งเท่าไหร่?", a: "ค่าส่งเริ่มต้น 50-80 บาท ขึ้นอยู่กับจำนวนกล่อง สมาชิก New World ขึ้นไปส่งฟรีทุกออเดอร์" },
  { category: "จัดส่ง", q: "แพ็คสินค้ายังไง?", a: "แพ็คอย่างดี ห่อ Bubble Wrap 2 ชั้น ใส่กล่องกันกระแทก การ์ดถึงมือสมบูรณ์ ไม่บุบ ไม่ยับ เหมาะสำหรับส่งเกรดได้เลย" },
  { category: "จัดส่ง", q: "ติดตามพัสดุได้ไหม?", a: "ได้ เราจะแจ้งเลข tracking ผ่าน LINE หลังส่งของ สามารถเช็คสถานะได้ที่เว็บ Kerry/Flash Express" },

  // คืน/เปลี่ยน
  { category: "คืน/เปลี่ยน", q: "คืนสินค้าได้ไหม?", a: "ได้ภายใน 7 วันหลังรับของ กรณีสินค้ามีปัญหา (ซีลฉีก, ของไม่ตรง, เสียหายจากขนส่ง) แจ้งพร้อมรูปถ่ายผ่าน LINE เราเปลี่ยนให้ใหม่หรือคืนเงิน" },
  { category: "คืน/เปลี่ยน", q: "ถ้าสินค้าเสียหายจากการขนส่ง?", a: "ถ่ายรูปสภาพกล่องและสินค้า แจ้ง LINE @goodguytcg ภายใน 24 ชม. หลังรับของ เราส่งให้ใหม่ฟรีไม่มีค่าใช้จ่าย" },

  // สมาชิก
  { category: "สมาชิก", q: "สมัครสมาชิกฟรีไหม?", a: "ฟรี! แค่กรอกอีเมลและรหัสผ่าน ได้ Bounty Rank ทันที ยอดซื้อนับอัตโนมัติ ไม่ต้องทำอะไรเพิ่ม" },
  { category: "สมาชิก", q: "Bounty Rank หมดอายุไหม?", a: "ไม่หมดอายุ เป็นแบบตลอดชีพ Rank ขึ้นได้อย่างเดียว ไม่มีลด" },
  { category: "สมาชิก", q: "Referral Code ใช้ยังไง?", a: "แชร์ Code ส่วนตัว (เช่น GG-K7NH3P) ให้เพื่อน เพื่อนใส่ตอนสมัคร → ได้ส่วนลด 3% ออเดอร์แรก ดู Code ได้ในหน้า Profile" },
];

const CATEGORIES = ["ทั้งหมด", "สินค้า", "สั่งซื้อ", "จัดส่ง", "คืน/เปลี่ยน", "สมาชิก"];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [category, setCategory] = useState("ทั้งหมด");

  const filtered = category === "ทั้งหมด" ? FAQS : FAQS.filter((f) => f.category === category);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="text-amber-400/60 text-xs tracking-[0.3em] uppercase">Help Center</span>
          <h1 className="text-4xl sm:text-5xl font-black text-amber-100 mt-2">คำถามที่พบบ่อย</h1>
          <p className="text-amber-100/40 mt-2 text-sm">FAQ — {FAQS.length} คำถาม</p>
          <div className="w-16 h-0.5 bg-amber-500/40 mx-auto mt-4" />
        </motion.div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setOpenIndex(null); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                category === cat
                  ? "bg-amber-500 text-[#0a0e27]"
                  : "bg-amber-500/10 text-amber-400/60 hover:bg-amber-500/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-2">
          {filtered.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className={`w-full text-left bg-[#0f1535] border rounded-xl px-5 py-4 transition-colors ${
                    isOpen ? "border-amber-500/30" : "border-amber-500/5 hover:border-amber-500/15"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-amber-400/40 text-xs font-bold flex-shrink-0 bg-amber-500/5 px-2 py-0.5 rounded">
                        {faq.category}
                      </span>
                      <span className="text-amber-100 font-bold text-sm truncate">{faq.q}</span>
                    </div>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      className="text-amber-400/40 flex-shrink-0"
                    >
                      ▾
                    </motion.span>
                  </div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="text-amber-100/50 text-sm mt-3 leading-relaxed border-t border-amber-500/10 pt-3">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Still have questions? */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-12 bg-[#0f1535] border border-amber-500/10 rounded-2xl p-8">
          <p className="text-amber-400 font-bold text-lg mb-2">ยังมีคำถาม?</p>
          <p className="text-amber-100/40 text-sm mb-5">แชทหาเราได้ตลอด ตอบไวภายใน 30 นาที</p>
          <div className="flex justify-center gap-3">
            <a href="https://line.me/R/ti/p/@goodguytcg" target="_blank" rel="noopener noreferrer" className="bg-[#06C755] hover:bg-[#05b04c] text-white font-bold px-6 py-2.5 rounded-full text-sm transition-colors">
              💬 LINE @goodguytcg
            </a>
            <a href="mailto:support@goodguytcg.com" className="border border-amber-500/30 text-amber-400 font-bold px-6 py-2.5 rounded-full text-sm hover:bg-amber-500/5 transition-colors">
              ✉️ Email
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
