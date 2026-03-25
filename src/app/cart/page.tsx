"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { formatPrice, getRankBySpent } from "@/lib/constants";
import SpinWheel from "@/components/gamification/SpinWheel";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice, totalItems } =
    useCart();
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [showCheckoutMsg, setShowCheckoutMsg] = useState(false);

  // Demo: simulate user total spent for rank discount
  const userTotalSpent = 6000;
  const rank = getRankBySpent(userTotalSpent);
  const discountAmount = Math.round(totalPrice * (rank.discount / 100));
  const finalPrice = totalPrice - discountAmount;

  const handleCheckout = () => {
    setShowCheckoutMsg(true);
    setTimeout(() => {
      setShowSpinWheel(true);
    }, 1500);
  };

  if (!items.length && !showCheckoutMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <motion.p
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            🛒
          </motion.p>
          <h1 className="text-2xl font-bold text-amber-100 mb-2">
            Your cart is empty
          </h1>
          <p className="text-amber-100/40 mb-6">
            Start exploring the Grand Line for some treasures!
          </p>
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-[#0a0e27] font-black rounded-full transition-colors"
            >
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-black text-amber-100 mb-8">
            Shopping Cart
            <span className="text-amber-400/40 text-lg ml-2">
              ({totalItems} items)
            </span>
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
                  {/* Color swatch */}
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.set.islandTheme.gradient} flex-shrink-0 flex items-center justify-center`}
                  >
                    <span className="text-white text-xs font-bold">
                      {item.set.code}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-amber-100 font-bold truncate">
                      {item.set.name}
                    </h3>
                    <p className="text-amber-100/30 text-xs">
                      {item.set.boxCount} Box/Carton
                    </p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center bg-[#0a0e27] border border-amber-500/10 rounded-full">
                    <button
                      onClick={() =>
                        updateQuantity(item.set.id, item.quantity - 1)
                      }
                      className="w-8 h-8 text-amber-400 hover:text-amber-300 transition-colors text-sm"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-amber-100 text-sm font-bold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.set.id, item.quantity + 1)
                      }
                      className="w-8 h-8 text-amber-400 hover:text-amber-300 transition-colors text-sm"
                    >
                      +
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-amber-400 font-bold">
                      ฿{formatPrice(item.set.pricePerBox * item.quantity)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-amber-100/30 text-xs">
                        ฿{formatPrice(item.set.pricePerBox)} each
                      </p>
                    )}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.set.id)}
                    className="text-red-400/50 hover:text-red-400 transition-colors text-sm"
                  >
                    ✕
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="bg-[#0f1535] border border-amber-500/10 rounded-2xl p-6">
            <h3 className="text-amber-400 font-bold text-sm tracking-wider uppercase mb-4">
              Order Summary
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-amber-100/40">Subtotal</span>
                <span className="text-amber-100">
                  ฿{formatPrice(totalPrice)}
                </span>
              </div>

              {rank.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-amber-100/40 flex items-center gap-2">
                    Bounty Rank Discount
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        color: rank.color,
                        backgroundColor: rank.color + "20",
                      }}
                    >
                      {rank.icon} {rank.name} (-{rank.discount}%)
                    </span>
                  </span>
                  <span className="text-emerald-400">
                    -฿{formatPrice(discountAmount)}
                  </span>
                </div>
              )}

              <div className="border-t border-amber-500/10 pt-3 flex justify-between">
                <span className="text-amber-100 font-bold">Total</span>
                <span className="text-amber-400 font-black text-2xl">
                  ฿{formatPrice(finalPrice)}
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckout}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-[#0a0e27] font-black text-lg rounded-full transition-colors"
            >
              Checkout via LINE
            </motion.button>

            <p className="text-amber-100/20 text-xs text-center mt-3">
              กดแล้วแชทสั่งได้เลย LINE: @goodguytcg
            </p>
          </div>
        </motion.div>
      </div>

      {/* Checkout message */}
      <AnimatePresence>
        {showCheckoutMsg && !showSpinWheel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#0f1535] border border-amber-500/20 rounded-3xl p-8 max-w-sm text-center"
            >
              <motion.p
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="text-5xl mb-4"
              >
                🎉
              </motion.p>
              <h2 className="text-amber-400 font-black text-xl mb-2">
                Order Received!
              </h2>
              <p className="text-amber-100/40 text-sm">
                Preparing your reward spin...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spin Wheel */}
      <SpinWheel
        isOpen={showSpinWheel}
        onClose={() => {
          setShowSpinWheel(false);
          setShowCheckoutMsg(false);
          clearCart();
        }}
      />
    </div>
  );
}
