"use client";

import { use, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { formatPrice } from "@/lib/constants";
import { useToast } from "@/hooks/useToast";

interface OrderItem {
  productName: string;
  productCode: string;
  price: number;
  quantity: number;
}

interface PaymentProof {
  id: string;
  imageUrl: string;
  status: string;
  createdAt: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  discountAmount: number;
  discountRank: string;
  total: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingProvince: string;
  shippingZipcode: string;
  trackingNumber: string;
  items: OrderItem[];
  paymentProofs: PaymentProof[];
  createdAt: string;
}

const STATUS_STEPS = [
  { key: "PENDING", label: "รอชำระเงิน", icon: "💰" },
  { key: "PAYMENT_UPLOADED", label: "อัพโหลดสลิปแล้ว", icon: "📤" },
  { key: "PAYMENT_CONFIRMED", label: "ยืนยันชำระเงิน", icon: "✅" },
  { key: "PACKING", label: "กำลังแพ็ค", icon: "📦" },
  { key: "SHIPPED", label: "จัดส่งแล้ว", icon: "🚚" },
  { key: "DELIVERED", label: "ได้รับสินค้า", icon: "🎉" },
];

const BANK_INFO = {
  bank: "ธนาคารกสิกรไทย (KBank)",
  account: "223-1-55533-4",
  name: "พิชิต สุจริตจินดานนท์",
};

export default function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const { data: session } = useSession();
  const { addToast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [needsPhone, setNeedsPhone] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchOrder = async (phone?: string) => {
    setLoading(true);
    setError("");
    const qs = phone ? `?phone=${encodeURIComponent(phone)}` : "";
    const res = await fetch(`/api/orders/${orderId}${qs}`);
    if (res.ok) {
      setOrder(await res.json());
      setNeedsPhone(false);
    } else if (res.status === 403) {
      setNeedsPhone(true);
    } else {
      setError("ไม่พบออเดอร์นี้");
    }
    setLoading(false);
  };

  useEffect(() => { fetchOrder(); }, [orderId]);

  const handleSlipUpload = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("slip", file);
    if (!session?.user && guestPhone) fd.append("phone", guestPhone);
    if (!session?.user && order?.shippingPhone) fd.append("phone", order.shippingPhone);

    const res = await fetch(`/api/orders/${order!.id}/upload-slip`, { method: "POST", body: fd });
    if (res.ok) {
      addToast({ title: "อัพโหลดสำเร็จ!", message: "สลิปถูกส่งแล้ว รอยืนยันภายใน 1 ชม.", icon: "✅", type: "success" });
      fetchOrder(guestPhone || undefined);
    } else {
      const err = await res.json();
      addToast({ title: "อัพโหลดไม่สำเร็จ", message: err.error, icon: "❌", type: "warning" });
    }
    setUploading(false);
  };

  const copyAccount = () => {
    navigator.clipboard.writeText(BANK_INFO.account.replace(/-/g, ""));
    setCopied(true);
    addToast({ title: "คัดลอกแล้ว!", message: BANK_INFO.account, icon: "📋", type: "success" });
    setTimeout(() => setCopied(false), 2000);
  };

  // Guest phone verification
  if (needsPhone) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-[#0f1535] border border-amber-500/10 rounded-2xl p-8 max-w-md w-full text-center">
          <p className="text-3xl mb-3">🔐</p>
          <h2 className="text-xl font-black text-amber-100 mb-2">ยืนยันตัวตน</h2>
          <p className="text-amber-100/40 text-sm mb-5">กรอกเบอร์โทรที่ใช้สั่งซื้อ</p>
          <input
            type="tel"
            value={guestPhone}
            onChange={e => setGuestPhone(e.target.value)}
            placeholder="08X-XXX-XXXX"
            className="w-full bg-[#1a2040] border border-amber-500/10 rounded-lg px-4 py-3 text-amber-100 text-center text-lg mb-4"
          />
          <button
            onClick={() => fetchOrder(guestPhone)}
            className="w-full bg-amber-500 hover:bg-amber-400 text-[#0a0e27] font-black py-3 rounded-full transition-colors"
          >
            ดูออเดอร์
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-3">📦</p>
          <h2 className="text-xl font-black text-amber-100 mb-2">{error || "ไม่พบออเดอร์"}</h2>
          <Link href="/shop" className="text-amber-400 text-sm">← กลับไปหน้าร้าน</Link>
        </div>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.findIndex(s => s.key === order.status);
  const isPending = order.status === "PENDING";
  const isUploaded = order.status === "PAYMENT_UPLOADED";
  const isShipped = ["SHIPPED", "DELIVERED"].includes(order.status);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <p className="text-amber-400/60 text-xs tracking-[0.2em] uppercase">Order</p>
          <h1 className="text-3xl font-black text-amber-100 mt-1">#{order.orderNumber}</h1>
          <p className="text-amber-100/30 text-xs mt-1">
            {new Date(order.createdAt).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </motion.div>

        {/* Status Timeline */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-[#0f1535] border border-amber-500/10 rounded-2xl p-5 mb-6">
          <div className="flex justify-between items-center">
            {STATUS_STEPS.map((step, i) => {
              const isActive = i <= currentStepIndex;
              const isCurrent = i === currentStepIndex;
              return (
                <div key={step.key} className="flex flex-col items-center flex-1 relative">
                  {i > 0 && (
                    <div className={`absolute top-4 right-1/2 w-full h-0.5 -z-10 ${i <= currentStepIndex ? "bg-amber-500" : "bg-amber-500/10"}`} />
                  )}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm z-10 ${
                    isCurrent ? "bg-amber-500 text-[#0a0e27] ring-2 ring-amber-500/30 ring-offset-2 ring-offset-[#0f1535]" :
                    isActive ? "bg-amber-500/20 text-amber-400" : "bg-[#1a2040] text-amber-100/20"
                  }`}>
                    {step.icon}
                  </div>
                  <p className={`text-[8px] mt-1.5 text-center ${isCurrent ? "text-amber-400 font-bold" : isActive ? "text-amber-100/50" : "text-amber-100/20"}`}>
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Payment Section — PENDING */}
        <AnimatePresence>
          {isPending && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0f1535] border border-amber-500/20 rounded-2xl p-6 mb-6">
              <h3 className="text-amber-400 font-bold text-sm tracking-wider uppercase mb-4">💰 ชำระเงิน</h3>

              {/* Amount to pay */}
              <div className="text-center mb-5">
                <p className="text-amber-100/40 text-xs">ยอดที่ต้องโอน</p>
                <p className="text-amber-400 font-black text-4xl">฿{formatPrice(order.total)}</p>
                {order.discountAmount > 0 && (
                  <p className="text-emerald-400/60 text-xs mt-1">ส่วนลด {order.discountRank}: -฿{formatPrice(order.discountAmount)}</p>
                )}
              </div>

              {/* Bank info card */}
              <div className="bg-[#1a2040] rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#138f2d] rounded-lg flex items-center justify-center text-white font-black text-xs">K</div>
                  <div>
                    <p className="text-amber-100 font-bold text-sm">{BANK_INFO.bank}</p>
                    <p className="text-amber-100/40 text-xs">{BANK_INFO.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-mono font-bold text-xl flex-1 tracking-wider">{BANK_INFO.account}</span>
                  <button onClick={copyAccount} className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold px-4 py-2 rounded-lg text-sm transition-colors">
                    {copied ? "✓ คัดลอกแล้ว" : "คัดลอก"}
                  </button>
                </div>
              </div>

              {/* Upload slip */}
              <div className="border-t border-amber-500/10 pt-4">
                <p className="text-amber-100/50 text-xs mb-3">โอนแล้ว อัพโหลดสลิปที่นี่:</p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleSlipUpload(f); }}
                />
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-[#0a0e27] font-black rounded-full transition-colors flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <><div className="w-4 h-4 border-2 border-[#0a0e27]/20 border-t-[#0a0e27] rounded-full animate-spin" /> กำลังอัพโหลด...</>
                  ) : (
                    <>📤 อัพโหลดสลิปการโอนเงิน</>
                  )}
                </button>
                <p className="text-amber-100/20 text-[10px] text-center mt-2">JPG, PNG, WebP ไม่เกิน 5MB</p>
              </div>

              <p className="text-amber-100/20 text-xs text-center mt-4">
                หรือแจ้งผ่าน LINE: <a href="https://line.me/R/ti/p/@luckytcgthailand" className="text-amber-400">@luckytcgthailand</a>
                <br />เราตรวจสอบภายใน 1 ชั่วโมง (เวลาทำการ 9:00-21:00)
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Uploaded slip — waiting verification */}
        {isUploaded && (
          <div className="bg-[#0f1535] border border-yellow-500/20 rounded-2xl p-6 mb-6 text-center">
            <p className="text-2xl mb-2">⏳</p>
            <h3 className="text-yellow-400 font-bold text-sm mb-1">อัพโหลดสลิปแล้ว — รอตรวจสอบ</h3>
            <p className="text-amber-100/40 text-xs">เราจะยืนยันภายใน 1 ชั่วโมง (เวลาทำการ)</p>
            {order.paymentProofs.length > 0 && (
              <div className="flex justify-center gap-2 mt-4">
                {order.paymentProofs.map(p => (
                  <div key={p.id} className="relative w-16 h-16 rounded-lg overflow-hidden border border-amber-500/10">
                    <Image src={p.imageUrl} alt="Slip" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tracking info */}
        {isShipped && order.trackingNumber && (
          <div className="bg-[#0f1535] border border-emerald-500/20 rounded-2xl p-6 mb-6 text-center">
            <p className="text-2xl mb-2">🚚</p>
            <h3 className="text-emerald-400 font-bold text-sm mb-1">จัดส่งแล้ว!</h3>
            <p className="text-amber-100/40 text-xs mb-3">เลข tracking:</p>
            <p className="text-amber-100 font-mono font-bold text-xl">{order.trackingNumber}</p>
          </div>
        )}

        {/* Order Items */}
        <div className="bg-[#0f1535] border border-amber-500/10 rounded-2xl p-5 mb-6">
          <h3 className="text-amber-400 font-bold text-sm tracking-wider uppercase mb-3">สินค้า</h3>
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-amber-500/5 last:border-0">
              <div>
                <p className="text-amber-100 font-bold text-sm">{item.productName}</p>
                <p className="text-amber-100/30 text-xs">{item.productCode} × {item.quantity}</p>
              </div>
              <p className="text-amber-400 font-bold">฿{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
          <div className="border-t border-amber-500/10 mt-2 pt-3 space-y-1">
            <div className="flex justify-between text-xs text-amber-100/40">
              <span>Subtotal</span>
              <span>฿{formatPrice(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-xs text-emerald-400/60">
                <span>ส่วนลด ({order.discountRank})</span>
                <span>-฿{formatPrice(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-amber-400">
              <span>Total</span>
              <span>฿{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Shipping info */}
        <div className="bg-[#0f1535] border border-amber-500/10 rounded-2xl p-5">
          <h3 className="text-amber-400 font-bold text-sm tracking-wider uppercase mb-3">ที่อยู่จัดส่ง</h3>
          <p className="text-amber-100 font-bold text-sm">{order.shippingName}</p>
          <p className="text-amber-100/40 text-xs">{order.shippingPhone}</p>
          <p className="text-amber-100/40 text-xs mt-1">{order.shippingAddress}</p>
          {order.shippingProvince && <p className="text-amber-100/40 text-xs">{order.shippingProvince} {order.shippingZipcode}</p>}
        </div>
      </div>
    </div>
  );
}
