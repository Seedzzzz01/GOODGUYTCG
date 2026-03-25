"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  productName: string;
  onComplete: () => void;
}

export default function LootBoxAnimation({ isOpen, productName, onComplete }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center pointer-events-none"
        >
          {/* Radial burst */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 2], opacity: [0, 0.3, 0] }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute w-64 h-64 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(255,215,0,0.4) 0%, transparent 70%)",
            }}
          />

          {/* Treasure chest */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{
              scale: [0, 1.2, 1, 0.8, 0],
              rotate: [-10, 5, 0, 0, 0],
              y: [0, 0, 0, -20, -60],
            }}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            onAnimationComplete={onComplete}
            className="relative"
          >
            {/* Chest body */}
            <div className="text-6xl">📦</div>

            {/* Sparkles flying out */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0.5],
                  x: [0, (Math.cos((i / 6) * Math.PI * 2) * 80)],
                  y: [0, (Math.sin((i / 6) * Math.PI * 2) * 80) - 20],
                  opacity: [0, 1, 0],
                }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg"
              >
                {["✨", "⭐", "💎", "🌟", "✨", "⭐"][i]}
              </motion.div>
            ))}
          </motion.div>

          {/* Product name badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: [0, 1, 1, 0], y: [20, -10, -10, -30], scale: [0.8, 1, 1, 0.9] }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="absolute mt-24"
          >
            <div className="bg-amber-500/90 text-[#0a0e27] font-black text-sm px-4 py-1.5 rounded-full shadow-lg">
              +1 {productName}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
