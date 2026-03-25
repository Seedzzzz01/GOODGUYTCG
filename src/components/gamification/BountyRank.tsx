"use client";

import { motion } from "framer-motion";
import { BOUNTY_RANKS, getRankBySpent, formatPrice } from "@/lib/constants";
import { BountyRank as BountyRankType } from "@/types";
import RankBadge from "./RankBadge";

interface BountyRankProps {
  totalSpent: number;
  compact?: boolean;
}

export default function BountyRank({ totalSpent, compact = false }: BountyRankProps) {
  const currentRank = getRankBySpent(totalSpent);
  const currentIndex = BOUNTY_RANKS.findIndex(
    (r) => r.name === currentRank.name
  );
  const nextRank = BOUNTY_RANKS[currentIndex + 1];
  const progress = nextRank
    ? ((totalSpent - currentRank.minSpent) /
        (nextRank.minSpent - currentRank.minSpent)) *
      100
    : 100;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <RankBadge rankName={currentRank.name} color={currentRank.color} size={28} />
        <span
          className="font-bold text-sm"
          style={{ color: currentRank.color }}
        >
          {currentRank.name}
        </span>
        {currentRank.discount > 0 && (
          <span className="text-xs text-amber-400/60">
            (-{currentRank.discount}%)
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[#0f1535] border border-amber-500/10 rounded-2xl p-6">
      <h3 className="text-amber-400 font-bold text-sm tracking-wider uppercase mb-4">
        Bounty Rank
      </h3>

      {/* Current Rank Display */}
      <div className="text-center mb-6">
        <div className="mb-2 flex justify-center">
          <RankBadge rankName={currentRank.name} color={currentRank.color} size={100} animate />
        </div>
        <h4
          className="text-2xl font-black"
          style={{ color: currentRank.color }}
        >
          {currentRank.name}
        </h4>
        {currentRank.discount > 0 && (
          <p className="text-amber-400/60 text-sm mt-1">
            {currentRank.discount}% discount on all orders
          </p>
        )}
      </div>

      {/* Progress Bar */}
      {nextRank && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-amber-100/40 mb-2">
            <span>฿{formatPrice(totalSpent)}</span>
            <span>฿{formatPrice(nextRank.minSpent)}</span>
          </div>
          <div className="h-2 bg-[#1a2040] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${currentRank.color}, ${nextRank.color})`,
              }}
            />
          </div>
          <p className="text-center text-xs text-amber-100/30 mt-2">
            ฿{formatPrice(nextRank.minSpent - totalSpent)} more to{" "}
            <span style={{ color: nextRank.color }}>{nextRank.name}</span>
          </p>
        </div>
      )}

      {/* All Ranks */}
      <div className="space-y-2 mt-6">
        {BOUNTY_RANKS.map((rank, i) => (
          <div
            key={rank.name}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              rank.name === currentRank.name
                ? "bg-amber-500/10 border border-amber-500/20"
                : "opacity-50"
            }`}
          >
            <RankBadge rankName={rank.name} color={rank.color} size={32} />
            <span
              className="font-bold text-sm flex-1"
              style={{ color: rank.color }}
            >
              {rank.name}
            </span>
            <span className="text-xs text-amber-100/40">
              {rank.discount > 0 ? `-${rank.discount}%` : "—"}
            </span>
            <span className="text-xs text-amber-100/30">
              ฿{formatPrice(rank.minSpent)}+
            </span>
            {i <= currentIndex && (
              <span className="text-emerald-400 text-xs">✓</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
