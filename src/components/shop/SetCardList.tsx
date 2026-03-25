"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { OPTCGCard } from "@/types";
import { RARITY_LABELS, COLOR_MAP, getRarityColor, getCardImageUrl } from "@/lib/optcg-api";

interface SetCardListProps {
  setCode: string; // e.g. "OP-01"
}

const RARITY_ORDER = ["L", "SEC", "SR", "R", "UC", "C", "SP", "P"];

export default function SetCardList({ setCode }: SetCardListProps) {
  const [cards, setCards] = useState<OPTCGCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRarity, setSelectedRarity] = useState<string>("all");
  const [cardLang, setCardLang] = useState<"JP" | "EN">("JP");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/cards?setId=${setCode}`)
      .then((r) => r.json())
      .then((data: OPTCGCardType[]) => {
        setCards(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [setCode]);

  // Group by rarity + calculate percentages
  const rarityGroups = useMemo(() => {
    const groups: Record<string, OPTCGCard[]> = {};
    for (const card of cards) {
      if (!groups[card.rarity]) groups[card.rarity] = [];
      groups[card.rarity].push(card);
    }
    return groups;
  }, [cards]);

  const rarityStats = useMemo(() => {
    const total = cards.length;
    return RARITY_ORDER
      .filter((r) => rarityGroups[r])
      .map((r) => ({
        rarity: r,
        label: RARITY_LABELS[r] || r,
        count: rarityGroups[r].length,
        percent: ((rarityGroups[r].length / total) * 100).toFixed(1),
        color: getRarityColor(r),
      }));
  }, [cards, rarityGroups]);

  const filteredCards = useMemo(() => {
    if (selectedRarity === "all") return cards;
    return cards.filter((c) => c.rarity === selectedRarity);
  }, [cards, selectedRarity]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full"
        />
      </div>
    );
  }

  if (cards.length === 0) return null;

  return (
    <div>
      {/* Rarity breakdown bar */}
      <div className="bg-[#0f1535] border border-amber-500/10 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-amber-400 font-bold text-sm tracking-wider uppercase">
            Card Distribution — {cards.length} cards total
          </h3>

          {/* JP / EN toggle */}
          <div className="flex items-center bg-[#1a2040] rounded-full p-0.5 border border-amber-500/10">
            <button
              onClick={() => setCardLang("JP")}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                cardLang === "JP"
                  ? "bg-red-600 text-white shadow-md"
                  : "text-amber-100/40 hover:text-amber-100/60"
              }`}
            >
              🇯🇵 JP
            </button>
            <button
              onClick={() => setCardLang("EN")}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                cardLang === "EN"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-amber-100/40 hover:text-amber-100/60"
              }`}
            >
              🇺🇸 EN
            </button>
          </div>
        </div>

        {/* Visual bar */}
        <div className="h-4 rounded-full overflow-hidden flex mb-4">
          {rarityStats.map((stat) => (
            <motion.div
              key={stat.rarity}
              initial={{ width: 0 }}
              animate={{ width: `${stat.percent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full cursor-pointer hover:brightness-125 transition-all relative group"
              style={{ backgroundColor: stat.color }}
              onClick={() => setSelectedRarity(selectedRarity === stat.rarity ? "all" : stat.rarity)}
            >
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                <div className="bg-black/90 rounded px-2 py-1 text-[10px] text-white whitespace-nowrap">
                  {stat.label}: {stat.count} ({stat.percent}%)
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Rarity pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedRarity("all")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedRarity === "all"
                ? "bg-amber-500 text-[#0a0e27]"
                : "bg-amber-500/10 text-amber-400/60 hover:bg-amber-500/20"
            }`}
          >
            All ({cards.length})
          </button>
          {rarityStats.map((stat) => (
            <button
              key={stat.rarity}
              onClick={() => setSelectedRarity(selectedRarity === stat.rarity ? "all" : stat.rarity)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
                selectedRarity === stat.rarity
                  ? "text-white"
                  : "text-amber-100/50 hover:text-amber-100/80"
              }`}
              style={{
                backgroundColor: selectedRarity === stat.rarity ? stat.color : stat.color + "20",
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: stat.color }}
              />
              {stat.label} ({stat.count}) — {stat.percent}%
            </button>
          ))}
        </div>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {filteredCards.map((card, i) => (
          <motion.div
            key={card.card_set_id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: Math.min(i * 0.015, 0.5) }}
          >
            <Link href={`/cards/${card.card_set_id}`}>
              <motion.div
                whileHover={{ y: -4, scale: 1.05 }}
                className="group relative rounded-lg overflow-hidden bg-[#0f1535] border border-amber-500/5 hover:border-amber-500/30 transition-all cursor-pointer"
              >
                <div className="relative aspect-[5/7]">
                  <Image
                    src={getCardImageUrl(card, cardLang)}
                    alt={card.card_name}
                    fill
                    sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 12vw"
                    className="object-cover"
                    onError={(e) => {
                      // Fallback to optcgapi EN image if Limitless CDN fails
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes("optcgapi.com")) {
                        target.src = card.card_image;
                      }
                    }}
                  />
                  {/* Rarity badge */}
                  <div
                    className="absolute top-1 right-1 px-1 py-px rounded text-[8px] font-bold text-white"
                    style={{ backgroundColor: getRarityColor(card.rarity) }}
                  >
                    {card.rarity}
                  </div>

                  {/* Shimmer on rare+ */}
                  {(card.rarity === "SEC" || card.rarity === "SR" || card.rarity === "L") && (
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity"
                      style={{
                        background: "linear-gradient(105deg, transparent 35%, rgba(255,215,0,0.4) 42%, transparent 55%)",
                      }}
                      animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                </div>

                {/* Name */}
                <div className="p-1.5">
                  <p className="text-amber-100/80 text-[9px] font-medium truncate group-hover:text-amber-400 transition-colors">
                    {card.card_name}
                  </p>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-amber-100/30 text-[8px]">{card.card_set_id}</span>
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: COLOR_MAP[card.card_color] || "#666" }}
                    />
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
