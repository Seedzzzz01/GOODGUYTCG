"use client";

import { motion, AnimatePresence } from "framer-motion";
import RankBadge from "@/components/gamification/RankBadge";
import { type BountyRank } from "@/types";

interface Props {
  isOpen: boolean;
  newRank: BountyRank;
  onClose: () => void;
}

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
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          {/* Radial burst rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: [0, 3], opacity: [0.6, 0] }}
              transition={{ duration: 1.5, delay: i * 0.3, ease: "easeOut" }}
              className="absolute w-40 h-40 rounded-full border-2"
              style={{ borderColor: newRank.color }}
            />
          ))}

          {/* Floating sparkles */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const dist = 120 + Math.random() * 60;
            return (
              <motion.div
                key={`sparkle-${i}`}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1.5, 0],
                  x: Math.cos(angle) * dist,
                  y: Math.sin(angle) * dist,
                  opacity: [0, 1, 0],
                }}
                transition={{ duration: 1.2, delay: 0.4 + i * 0.05, ease: "easeOut" }}
                className="absolute text-lg"
              >
                {["✨", "⭐", "🌟", "💫"][i % 4]}
              </motion.div>
            );
          })}

          {/* Main content */}
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: [0, 1.15, 1], rotate: [-15, 5, 0] }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 text-center"
          >
            {/* Badge */}
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex justify-center mb-4"
            >
              <RankBadge rankName={newRank.name} color={newRank.color} size={120} />
            </motion.div>

            {/* RANK UP text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-amber-400/60 text-xs tracking-[0.3em] uppercase font-bold mb-1">
                Bounty Rank Up!
              </p>
              <h2
                className="text-4xl font-black mb-2"
                style={{ color: newRank.color }}
              >
                {newRank.name}
              </h2>
              {newRank.discount > 0 && (
                <p className="text-amber-100/60 text-sm">
                  ส่วนลด <span className="text-amber-400 font-bold">{newRank.discount}%</span> ทุกออเดอร์
                </p>
              )}
            </motion.div>

            {/* Close hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-amber-100/20 text-xs mt-6"
            >
              แตะเพื่อปิด
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
