"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { OPTCGCard, OPTCGSet } from "@/types";
import {
  RARITY_LABELS,
  COLOR_MAP,
  getRarityColor,
  getCardImageUrl,
} from "@/lib/optcg-api";

export default function CardsPage() {
  const [sets, setSets] = useState<OPTCGSet[]>([]);
  const [cards, setCards] = useState<OPTCGCard[]>([]);
  const [selectedSet, setSelectedSet] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [colorFilter, setColorFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [rarityFilter, setRarityFilter] = useState<string>("all");
  const [cardLang, setCardLang] = useState<"JP" | "EN">("JP");

  // Load sets from DB
  useEffect(() => {
    fetch("/api/card-sets")
      .then((r) => r.json())
      .then((data: OPTCGSet[]) => {
        setSets(data);
        if (data.length > 0) setSelectedSet(data[0].set_id);
      })
      .catch(console.error);
  }, []);

  // Load cards when set changes
  useEffect(() => {
    if (!selectedSet) return;
    setLoading(true);
    fetch(`/api/cards?setId=${selectedSet}`)
      .then((r) => r.json())
      .then((data: OPTCGCard[]) => {
        setCards(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedSet]);

  // Deduplicate cards (API returns normal + parallel versions)
  const uniqueCards = useMemo(() => {
    const seen = new Set<string>();
    return cards.filter((card) => {
      if (seen.has(card.card_set_id)) return false;
      seen.add(card.card_set_id);
      return true;
    });
  }, [cards]);

  // Apply filters
  const filteredCards = useMemo(() => {
    return uniqueCards.filter((card) => {
      if (searchQuery && !card.card_name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (colorFilter !== "all" && card.card_color !== colorFilter) return false;
      if (typeFilter !== "all" && card.card_type !== typeFilter) return false;
      if (rarityFilter !== "all" && card.rarity !== rarityFilter) return false;
      return true;
    });
  }, [uniqueCards, searchQuery, colorFilter, typeFilter, rarityFilter]);

  // Get unique values for filter options
  const colors = useMemo(() => [...new Set(uniqueCards.map((c) => c.card_color))].sort(), [uniqueCards]);
  const types = useMemo(() => [...new Set(uniqueCards.map((c) => c.card_type))].sort(), [uniqueCards]);
  const rarities = useMemo(() => [...new Set(uniqueCards.map((c) => c.rarity))].sort(), [uniqueCards]);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="text-amber-400/60 text-xs tracking-[0.3em] uppercase">
            Card Database
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-amber-100 mt-2">
            Card Browser
          </h1>
          <p className="text-amber-100/40 mt-2 text-sm">
            ค้นหาการ์ดจากทุกเซ็ตได้ที่นี่
          </p>
          <div className="w-16 h-0.5 bg-amber-500/40 mx-auto mt-4" />
        </motion.div>

        {/* Set Selector */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {sets.map((set) => (
              <button
                key={set.set_id}
                onClick={() => {
                  setSelectedSet(set.set_id);
                  setSearchQuery("");
                  setColorFilter("all");
                  setTypeFilter("all");
                  setRarityFilter("all");
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedSet === set.set_id
                    ? "bg-amber-500 text-[#0a0e27]"
                    : "bg-amber-500/10 text-amber-400/60 hover:bg-amber-500/20"
                }`}
              >
                {set.set_id}
              </button>
            ))}
          </div>
          {selectedSet && (
            <p className="text-center text-amber-400/60 text-sm mt-3">
              {sets.find((s) => s.set_id === selectedSet)?.set_name} —{" "}
              {filteredCards.length} cards
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="bg-[#0f1535] border border-amber-500/10 rounded-2xl p-4 mb-8">
          {/* JP/EN toggle */}
          <div className="flex justify-end mb-3">
            <div className="flex items-center bg-[#1a2040] rounded-full p-0.5 border border-amber-500/10">
              <button
                onClick={() => setCardLang("JP")}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  cardLang === "JP" ? "bg-red-600 text-white shadow-md" : "text-amber-100/40 hover:text-amber-100/60"
                }`}
              >
                🇯🇵 JP
              </button>
              <button
                onClick={() => setCardLang("EN")}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  cardLang === "EN" ? "bg-blue-600 text-white shadow-md" : "text-amber-100/40 hover:text-amber-100/60"
                }`}
              >
                🇺🇸 EN
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <input
              type="text"
              placeholder="Search card name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0a0e27] border border-amber-500/20 text-amber-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/50 placeholder:text-amber-100/20"
            />

            {/* Color Filter */}
            <select
              value={colorFilter}
              onChange={(e) => setColorFilter(e.target.value)}
              className="bg-[#0a0e27] border border-amber-500/20 text-amber-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/50"
            >
              <option value="all">All Colors</option>
              {colors.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-[#0a0e27] border border-amber-500/20 text-amber-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/50"
            >
              <option value="all">All Types</option>
              {types.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            {/* Rarity Filter */}
            <select
              value={rarityFilter}
              onChange={(e) => setRarityFilter(e.target.value)}
              className="bg-[#0a0e27] border border-amber-500/20 text-amber-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/50"
            >
              <option value="all">All Rarities</option>
              {rarities.map((r) => (
                <option key={r} value={r}>{RARITY_LABELS[r] || r} ({r})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-500 rounded-full"
            />
          </div>
        )}

        {/* Card Grid */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredCards.map((card, i) => (
                <motion.div
                  key={card.card_set_id + card.card_image_id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: Math.min(i * 0.02, 0.5) }}
                >
                  <Link href={`/cards/${card.card_set_id}`}>
                    <div className="group relative rounded-xl overflow-hidden bg-[#0f1535] border border-amber-500/5 hover:border-amber-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,215,0,0.1)]">
                      {/* Card Image */}
                      <div className="relative aspect-[5/7] overflow-hidden">
                        <Image
                          src={getCardImageUrl(card, cardLang)}
                          alt={card.card_name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (!target.src.includes("optcgapi.com")) target.src = card.card_image;
                          }}
                        />

                        {/* Holographic shimmer on hover */}
                        <motion.div
                          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                          style={{
                            background:
                              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0.1) 50%, transparent 55%)",
                          }}
                          animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Rarity badge */}
                        <div
                          className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold text-white"
                          style={{ backgroundColor: getRarityColor(card.rarity) }}
                        >
                          {card.rarity}
                        </div>
                      </div>

                      {/* Card Info */}
                      <div className="p-2.5">
                        <p className="text-amber-100 text-xs font-bold truncate group-hover:text-amber-400 transition-colors">
                          {card.card_name}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-amber-100/30 text-[10px]">
                            {card.card_set_id}
                          </span>
                          <div className="flex items-center gap-1">
                            <div
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: COLOR_MAP[card.card_color] || "#666" }}
                            />
                            <span className="text-amber-100/30 text-[10px]">
                              {card.card_type}
                            </span>
                          </div>
                        </div>
                        {card.market_price && (
                          <p className="text-amber-400/60 text-[10px] mt-1">
                            ${card.market_price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredCards.length === 0 && (
          <div className="text-center py-20 text-amber-100/30">
            <p className="text-4xl mb-4">🃏</p>
            <p>No cards found</p>
          </div>
        )}
      </div>
    </div>
  );
}
