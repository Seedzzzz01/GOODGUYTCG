"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  productName: string;
  onComplete: () => void;
}

/**
 * Anime-style add-to-cart animation.
 * Features: golden burst, pirate treasure items flying out,
 * manga speed lines, impact text with bounce.
 */
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
          {/* Flash bang */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-amber-400/20"
          />

          {/* Golden burst rays */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={`ray-${i}`}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: [0, 1.2, 0], opacity: [0, 0.5, 0] }}
              transition={{ duration: 0.8, delay: 0.15 + i * 0.03, ease: "easeOut" }}
              className="absolute w-0.5 h-28 bg-gradient-to-t from-amber-500/50 to-transparent"
              style={{ transformOrigin: "bottom center", rotate: `${i * 30}deg` }}
            />
          ))}

          {/* Pirate treasure flying out */}
          {["🪙", "⚓", "🏴‍☠️", "🗡️", "💎", "🪙"].map((emoji, i) => {
            const angle = (i / 6) * Math.PI * 2;
            const dist = 70 + Math.random() * 30;
            return (
              <motion.div
                key={`loot-${i}`}
                initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.3, 0.6],
                  x: Math.cos(angle) * dist,
                  y: [0, Math.sin(angle) * dist - 20],
                  opacity: [0, 1, 0],
                }}
                transition={{ duration: 1, delay: 0.25 + i * 0.05, ease: "easeOut" }}
                className="absolute text-xl"
              >
                {emoji}
              </motion.div>
            );
          })}

          {/* Center — Chest + impact text */}
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{
              scale: [0, 1.4, 1, 0.8, 0],
              rotate: [-15, 8, 0, 0, 0],
              y: [0, 0, 0, -15, -50],
            }}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            onAnimationComplete={onComplete}
            className="relative"
          >
            <div className="text-6xl">🏴‍☠️</div>
          </motion.div>

          {/* Impact text — anime style bounce */}
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{
              opacity: [0, 1, 1, 1, 0],
              scale: [0, 1.3, 1, 1, 0.9],
              y: [20, -5, -5, -5, -25],
            }}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            className="absolute mt-28"
          >
            <div className="bg-[#0a0e27]/90 backdrop-blur-sm border border-amber-500/30 rounded-xl px-5 py-2">
              <p className="text-amber-400 font-black text-sm tracking-wider">
                +1 ADDED!
              </p>
              <p className="text-amber-100/40 text-[10px] truncate max-w-[180px]">
                {productName}
              </p>
            </div>
          </motion.div>

          {/* Manga speed lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
            {Array.from({ length: 16 }).map((_, i) => {
              const a = (i / 16) * Math.PI * 2;
              return (
                <motion.line
                  key={`sl-${i}`}
                  x1={50 + Math.cos(a) * 30} y1={50 + Math.sin(a) * 30}
                  x2={50 + Math.cos(a) * 55} y2={50 + Math.sin(a) * 55}
                  stroke="rgba(255,215,0,0.4)"
                  strokeWidth="0.2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1, 0] }}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.02 }}
                />
              );
            })}
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
