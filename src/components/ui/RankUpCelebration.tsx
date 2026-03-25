"use client";

import { motion, AnimatePresence } from "framer-motion";
import RankBadge from "@/components/gamification/RankBadge";
import { type BountyRank } from "@/types";

interface Props {
  isOpen: boolean;
  newRank: BountyRank;
  onClose: () => void;
}

/**
 * Anime-style rank-up celebration.
 * Features: Wanted poster tear-in effect, bounty stamp,
 * radial energy burst, manga speed lines, floating coins.
 */
export default function RankUpCelebration({ isOpen, newRank, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop with anime blur */}
          <motion.div
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          {/* Energy burst rings */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={`ring-${i}`}
              initial={{ scale: 0, opacity: 0.7 }}
              animate={{ scale: [0, 4], opacity: [0.7, 0] }}
              transition={{ duration: 1.5, delay: i * 0.2, ease: "easeOut" }}
              className="absolute w-32 h-32 rounded-full border"
              style={{ borderColor: newRank.color }}
            />
          ))}

          {/* Manga speed lines — radial */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
            {Array.from({ length: 24 }).map((_, i) => {
              const a = (i / 24) * Math.PI * 2;
              return (
                <motion.line
                  key={`speed-${i}`}
                  x1={100 + Math.cos(a) * 40}
                  y1={100 + Math.sin(a) * 40}
                  x2={100 + Math.cos(a) * 100}
                  y2={100 + Math.sin(a) * 100}
                  stroke={newRank.color}
                  strokeWidth="0.3"
                  opacity="0.3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1] }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.02 }}
                />
              );
            })}
          </svg>

          {/* Floating coins & treasure */}
          {["🪙", "⭐", "🪙", "💫", "🏴‍☠️", "⚓", "🪙", "✨", "🗡️", "🪙"].map((emoji, i) => {
            const angle = (i / 10) * Math.PI * 2;
            const dist = 100 + Math.random() * 60;
            return (
              <motion.div
                key={`coin-${i}`}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1.5, 0],
                  x: Math.cos(angle) * dist,
                  y: Math.sin(angle) * dist,
                  opacity: [0, 1, 0],
                  rotate: [0, 360],
                }}
                transition={{ duration: 1.5, delay: 0.4 + i * 0.06, ease: "easeOut" }}
                className="absolute text-lg"
              >
                {emoji}
              </motion.div>
            );
          })}

          {/* Center content — Wanted Poster style */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: [0, 1.2, 1], rotate: [-20, 5, 0] }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 text-center"
          >
            {/* Wanted poster frame */}
            <div className="bg-gradient-to-b from-[#d4a954] to-[#b8922e] rounded-lg p-1 shadow-[0_0_40px_rgba(255,215,0,0.3)]">
              <div className="bg-[#f5e6c3] rounded px-8 py-6 text-center relative overflow-hidden">
                {/* Aged paper texture */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: "radial-gradient(circle at 30% 40%, #8B4513 1px, transparent 1px), radial-gradient(circle at 70% 60%, #8B4513 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }} />

                {/* BOUNTY header */}
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-[#8B4513] font-black text-xs tracking-[0.4em] uppercase"
                >
                  BOUNTY RANK UP
                </motion.p>

                {/* Rank badge */}
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="flex justify-center my-3"
                >
                  <RankBadge rankName={newRank.name} color={newRank.color} size={90} />
                </motion.div>

                {/* Rank name */}
                <motion.h2
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 400 }}
                  className="text-3xl font-black mb-1"
                  style={{ color: newRank.color }}
                >
                  {newRank.name}
                </motion.h2>

                {/* Discount stamp — slammed in like anime impact */}
                {newRank.discount > 0 && (
                  <motion.div
                    initial={{ scale: 3, opacity: 0, rotate: -30 }}
                    animate={{ scale: 1, opacity: 1, rotate: -5 }}
                    transition={{ delay: 0.8, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="inline-block border-2 border-red-600 rounded px-3 py-0.5 mt-2"
                  >
                    <span className="text-red-600 font-black text-sm">
                      {newRank.discount}% OFF
                    </span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Tap hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-amber-100/20 text-xs mt-4"
            >
              แตะเพื่อปิด
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
