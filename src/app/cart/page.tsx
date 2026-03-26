"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { formatPrice, getRankBySpent } from "@/lib/constants";
import SpinWheel from "@/components/gamification/SpinWheel";
import { useToast } from "@/hooks/useToast";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice, totalItems } = useCart();
  const { data: session } = useSession();
  const { addToast } = useToast();
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [checkoutState, setCheckoutState] = useState<"idle" | "form" | "saving" | "done" | "error">("idle");
  const [orderNumber, setOrderNumber] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Shipping form
  const [shipping, setShipping] = useState({
    name: "", phone: "", address: "", province: "", zipcode: "", note: "", email: "",
  });

  // Use real session data for rank discount
  const userSession = session?.user as { totalSpent?: number; orderCount?: number; referredById?: string } | undefined;
  const userTotalSpent = userSession?.totalSpent ?? 0;
  const rank = getRankBySpent(userTotalSpent);
  const rankDiscountAmt = Math.round(totalPrice * (rank.discount / 100));
  // Referral 3% bonus on first order
  const isReferralFirstOrder = !!userSession?.referredById && (userSession?.orderCount ?? 0) === 0;
  const referralDiscountAmt = isReferralFirstOrder ? Math.round(totalPrice * 0.03) : 0;
  const discountAmount = rankDiscountAmt + referralDiscountAmt;
  const finalPrice = totalPrice - discountAmount;

  const handleCheckout = async () => {
    setCheckoutState("form");
  };

  const handleSubmitOrder = async () => {
    if (!shipping.name || !shipping.phone || !shipping.address) {
      setErrorMsg("กรุณากรอกชื่อ เบอร์โทร และที่อยู่");
      addToast({ title: "กรอกข้อมูลไม่ครบ", message: "กรุณากรอกชื่อ เบอร์โทร และที่อยู่", icon: "⚠️", type: "error" });
      return;
    }

    setCheckoutState("saving");
    setErrorMsg("");

    try {
      // Lookup DB product IDs by code
      const res = await fetch("/api/products");
      const products = await res.json();
      const codeToId = new Map(products.map((p: { code: string; id: string }) => [p.code, p.id]));

      const orderItems = items.map(item => ({
        productId: codeToId.get(item.set.code) || codeToId.get(item.set.id),
        quantity: item.quantity,
      })).filter(i => i.productId);

      if (orderItems.length === 0) {
        setErrorMsg("ไม่พบสินค้าในระบบ");
        setCheckoutState("form");
        return;
      }

      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: orderItems,
          shippingName: shipping.name,
          shippingPhone: shipping.phone,
          shippingAddress: shipping.address,
          shippingProvince: shipping.province,
          shippingZipcode: shipping.zipcode,
          note: shipping.note,
          guestEmail: !session?.user ? (shipping as Record<string, string>).email || "" : undefined,
        }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        setErrorMsg(err.error || "สร้างออเดอร์ไม่สำเร็จ");
        addToast({ title: "สั่งซื้อไม่สำเร็จ", message: err.error || "กรุณาลองใหม่", icon: "❌", type: "error" });
        setCheckoutState("form");
        return;
      }

      const order = await orderRes.json();
      setOrderNumber(order.orderNumber);
      setCheckoutState("done");
      addToast({ title: "สั่งซื้อสำเร็จ!", message: `Order #${order.orderNumber} — โอนเงินแล้วอัพโหลดสลิป`, icon: "🎉", type: "success" });

      // Show spin wheel after delay
      setTimeout(() => setShowSpinWheel(true), 2000);
    } catch {
      setErrorMsg("เกิดข้อผิดพลาด กรุณาลองใหม่");
      addToast({ title: "เกิดข้อผิดพลาด", message: "กรุณาลองใหม่อีกครั้ง", icon: "❌", type: "error" });
      setCheckoutState("form");
    }
  };

  if (!items.length && checkoutState === "idle") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <motion.p animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-6xl mb-4">🛒</motion.p>
          <h1 className="text-2xl font-bold text-amber-100 mb-2">Your cart is empty</h1>
          <p className="text-amber-100/40 mb-6">Start exploring the Grand Line for some treasures!</p>
          <Link href="/shop">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-[#0a0e27] font-black rounded-full transition-colors">
              Browse Sets
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black text-amber-100 mb-8">
            Shopping Cart
            <span className="text-amber-400/40 text-lg ml-2">({totalItems} items)</span>
          </h1>

          {/* Cart Items */}
          <div className="space-y-4 mb-8">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.set.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  className="bg-[#0f1535] border border-amber-500/10 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                >
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.set.islandTheme.gradient} flex-shrink-0 flex items-center justify-center`}>
                    <span className="text-white text-xs font-bold">{item.set.code}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-amber-100 font-bold truncate">{item.set.name}</h3>
                    <p className="text-amber-100/30 text-xs">{item.set.boxCount} Box/Carton</p>
                  </div>
                  <div className="flex items-center bg-[#0a0e27] border border-amber-500/10 rounded-full">
                    <button onClick={() => updateQuantity(item.set.id, item.quantity - 1)} className="w-8 h-8 text-amber-400 hover:text-amber-300 transition-colors text-sm">−</button>
                    <span className="w-8 text-center text-amber-100 text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.set.id, item.quantity + 1)} className="w-8 h-8 text-amber-400 hover:text-amber-300 transition-colors text-sm">+</button>
                  </div>
                  <div className="text-right">
                    <p className="text-amber-400 font-bold">฿{formatPrice(item.set.pricePerBox * item.quantity)}</p>
                    {item.quantity > 1 && <p className="text-amber-100/30 text-xs">฿{formatPrice(item.set.pricePerBox)} each</p>}
                  </div>
                  <button onClick={() => { removeItem(item.set.id); addToast({ title: "ลบสินค้าแล้ว", message: item.set.name, icon: "🗑️", type: "info" }); }} className="text-red-400/50 hover:text-red-400 transition-colors text-sm">✕</button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="bg-[#0f1535] border border-amber-500/10 rounded-2xl p-6">
            <h3 className="text-amber-400 font-bold text-sm tracking-wider uppercase mb-4">Order Summary</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-amber-100/40">Subtotal</span>
                <span className="text-amber-100">฿{formatPrice(totalPrice)}</span>
              </div>
              {rank.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-amber-100/40 flex items-center gap-2">
                    Bounty Rank
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: rank.color, backgroundColor: rank.color + "20" }}>
                      {rank.icon} {rank.name} (-{rank.discount}%)
                    </span>
                  </span>
                  <span className="text-emerald-400">-฿{formatPrice(rankDiscountAmt)}</span>
                </div>
              )}
              {isReferralFirstOrder && (
                <div className="flex justify-between text-sm">
                  <span className="text-amber-100/40 flex items-center gap-2">
                    โบนัสชวนเพื่อน
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full text-cyan-400 bg-cyan-400/10">
                      🎁 ออเดอร์แรก -3%
                    </span>
                  </span>
                  <span className="text-emerald-400">-฿{formatPrice(referralDiscountAmt)}</span>
                </div>
              )}
              <div className="border-t border-amber-500/10 pt-3 flex justify-between">
                <span className="text-amber-100 font-bold">Total</span>
                <span className="text-amber-400 font-black text-2xl">฿{formatPrice(finalPrice)}</span>
              </div>
            </div>

            {checkoutState === "idle" && (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-[#0a0e27] font-black text-lg rounded-full transition-colors"
                >
                  Checkout
                </motion.button>
                <p className="text-amber-100/20 text-xs text-center mt-3">สงสัยอะไร แชท LINE: @luckytcgthailand</p>
              </>
            )}
          </div>

          {/* Shipping Form */}
          <AnimatePresence>
            {checkoutState === "form" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 bg-[#0f1535] border border-amber-500/10 rounded-2xl p-6"
              >
                <h3 className="text-amber-400 font-bold text-sm tracking-wider uppercase mb-4">Shipping Info</h3>

                {/* Guest checkout notice */}
                {!session?.user && (
                  <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-3 mb-4 text-xs text-amber-100/50">
                    🛒 สั่งซื้อได้เลยไม่ต้องสมัครสมาชิก — แต่ถ้า{" "}
                    <a href="/auth/register" className="text-amber-400 underline">สมัครสมาชิก</a>{" "}
                    จะได้ส่วนลดสะสม Bounty Rank สูงสุด 8%
                  </div>
                )}

                {errorMsg && <p className="text-red-400 text-sm mb-3">{errorMsg}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input label="ชื่อ-นามสกุล *" value={shipping.name} onChange={v => setShipping(s => ({ ...s, name: v }))} />
                  <Input label="เบอร์โทร *" value={shipping.phone} onChange={v => setShipping(s => ({ ...s, phone: v }))} />
                  {/* Email for guest — for order updates */}
                  {!session?.user && (
                    <div className="sm:col-span-2">
                      <Input label="อีเมล (สำหรับแจ้งสถานะออเดอร์)" value={(shipping as Record<string, string>).email || ""} onChange={v => setShipping(s => ({ ...s, email: v }))} />
                    </div>
                  )}
                  <div className="sm:col-span-2">
                    <Input label="ที่อยู่ *" value={shipping.address} onChange={v => setShipping(s => ({ ...s, address: v }))} />
                  </div>
                  <Input label="จังหวัด" value={shipping.province} onChange={v => setShipping(s => ({ ...s, province: v }))} />
                  <Input label="รหัสไปรษณีย์" value={shipping.zipcode} onChange={v => setShipping(s => ({ ...s, zipcode: v }))} />
                  <div className="sm:col-span-2">
                    <Input label="หมายเหตุ" value={shipping.note} onChange={v => setShipping(s => ({ ...s, note: v }))} />
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button onClick={() => setCheckoutState("idle")} className="px-6 py-3 text-amber-100/40 hover:text-amber-100/60 font-bold">Back</button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmitOrder}
                    className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-[#0a0e27] font-black rounded-full transition-colors"
                  >
                    Place Order
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Saving state */}
          {checkoutState === "saving" && (
            <div className="mt-6 text-center py-8">
              <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-amber-100/40 text-sm">กำลังสร้างออเดอร์...</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Order Received */}
      <AnimatePresence>
        {checkoutState === "done" && !showSpinWheel && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#0f1535] border border-amber-500/20 rounded-3xl p-8 max-w-sm text-center">
              <motion.p animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5, repeat: 3 }} className="text-5xl mb-4">🎉</motion.p>
              <h2 className="text-amber-400 font-black text-xl mb-2">Order Received!</h2>
              <p className="text-amber-100/60 text-sm mb-1">Order #{orderNumber}</p>

              {/* Payment info */}
              <div className="bg-[#1a2040] border border-amber-500/10 rounded-xl p-4 mt-4 text-left">
                <p className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">โอนเงินมาที่</p>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-[#138f2d] rounded-lg flex items-center justify-center text-white text-xs font-black">K</div>
                  <div>
                    <p className="text-amber-100 text-sm font-bold">ธนาคารกสิกรไทย (KBank)</p>
                    <p className="text-amber-400 font-mono font-bold text-lg tracking-wider">223-1-55533-4</p>
                  </div>
                </div>
                <p className="text-amber-100/50 text-xs">ชื่อบัญชี: พิชิต สุจริตจินดานนท์</p>
                <p className="text-amber-100/30 text-[10px] mt-2">โอนแล้วอัพโหลดสลิปในหน้า Order หรือแจ้ง LINE @luckytcgthailand</p>
              </div>

              <p className="text-amber-100/40 text-xs mt-3">Preparing your reward spin...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spin Wheel */}
      <SpinWheel
        isOpen={showSpinWheel}
        onClose={() => {
          setShowSpinWheel(false);
          setCheckoutState("idle");
          clearCart();
        }}
      />
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-amber-100/50 text-xs font-medium mb-1">{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-[#1a2040] border border-amber-500/10 rounded-lg px-3 py-2 text-sm text-amber-100 placeholder-amber-100/20 focus:outline-none focus:border-amber-500/30"
      />
    </div>
  );
}
