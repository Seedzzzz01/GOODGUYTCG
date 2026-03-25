"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { OPTCGCard } from "@/types";
import { getCardImageUrl, getRarityColor, RARITY_LABELS } from "@/lib/optcg-api";

// Approximate JP/EN price multiplier (EN typically 1.5-2.5x JP for singles)
const EN_MULTIPLIER = 2.0;
const USD_TO_THB = 34.5;

export default function PriceComparePage() {
  const [sets, setSets] = useState<{ set_id: string; set_name: string }[]>([]);
  const [selectedSet, setSelectedSet] = useState("OP-01");
  const [cards, setCards] = useState<OPTCGCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"price" | "name" | "rarity">("price");

  useEffect(() => {
    fetch("/api/card-sets").then((r) => r.json()).then(setSets);
  }, []);

  useEffect(() => {
    if (!selectedSet) return;
    setLoading(true);
    fetch(`/api/cards?setId=${selectedSet}`)
      .then((r) => r.json())
      .then((data: OPTCGCard[]) => {
        // Only show cards with market price, dedupe
        const seen = new Set<string>();
        const filtered = data.filter((c) => {
          if (seen.has(c.card_set_id)) return false;
          seen.add(c.card_set_id);
          return c.market_price && c.market_price > 0;
        });
        setCards(filtered);
        setLoading(false);
      });
  }, [selectedSet]);

  const sorted = useMemo(() => {
    const arr = [...cards];
    if (sortBy === "price") arr.sort((a, b) => (b.market_price || 0) - (a.market_price || 0));
    if (sortBy === "name") arr.sort((a, b) => a.card_name.localeCompare(b.card_name));
    if (sortBy === "rarity") {
      const order = ["TR", "SEC", "SP", "L", "SR", "R", "UC", "C"];
      arr.sort((a, b) => order.indexOf(a.rarity) - order.indexOf(b.rarity));
    }
    return arr;
  }, [cards, sortBy]);

  const topHits = useMemo(() => sorted.filter((c) => (c.market_price || 0) >= 5).slice(0, 10), [sorted]);

  const totalBoxValue = useMemo(() => {
    const total = cards.reduce((sum, c) => sum + (c.market_price || 0), 0);
    return total;
  }, [cards]);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <span className="text-amber-400/60 text-xs tracking-[0.3em] uppercase">Free Tool</span>
          <h1 className="text-4xl sm:text-5xl font-black text-amber-100 mt-2">
            💰 Price Compare
          </h1>
          <p className="text-amber-100/40 mt-2 text-sm max-w-lg mx-auto">
            เปรียบเทียบราคาการ์ดแต่ละใบ — ดูว่าการ์ดไหนมีมูลค่าสูง
          </p>
          <div className="w-16 h-0.5 bg-amber-500/40 mx-auto mt-4" />
        </motion.div>

        {/* Set Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {sets.map((s) => (
            <button
              key={s.set_id}
              onClick={() => setSelectedSet(s.set_id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedSet === s.set_id
                  ? "bg-amber-500 text-[#0a0e27]"
                  : "bg-amber-500/10 text-amber-400/60 hover:bg-amber-500/20"
              }`}
            >
              {s.set_id}
            </button>
          ))}
        </div>

        {/* Summary Stats */}
        {!loading && cards.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-[#0f1535] border border-amber-500/5 rounded-xl p-3 text-center">
              <p className="text-amber-400 font-black text-xl">{cards.length}</p>
              <p className="text-amber-100/30 text-[10px]">Cards with Price</p>
            </div>
            <div className="bg-[#0f1535] border border-amber-500/5 rounded-xl p-3 text-center">
              <p className="text-emerald-400 font-black text-xl">${totalBoxValue.toFixed(0)}</p>
              <p className="text-amber-100/30 text-[10px]">Total Set Value (EN)</p>
            </div>
            <div className="bg-[#0f1535] border border-amber-500/5 rounded-xl p-3 text-center">
              <p className="text-blue-400 font-black text-xl">${(totalBoxValue / EN_MULTIPLIER).toFixed(0)}</p>
              <p className="text-amber-100/30 text-[10px]">Est. Set Value (JP)</p>
            </div>
            <div className="bg-[#0f1535] border border-amber-500/5 rounded-xl p-3 text-center">
              <p className="text-purple-400 font-black text-xl">{topHits.length}</p>
              <p className="text-amber-100/30 text-[10px]">High Value ($5+)</p>
            </div>
          </div>
        )}

        {/* Top Hits */}
        {topHits.length > 0 && (
          <div className="bg-[#0f1535] border border-amber-500/10 rounded-2xl p-6 mb-6">
            <h3 className="text-amber-400 font-bold text-sm tracking-wider uppercase mb-4">
              🏆 Top Value Cards — {selectedSet}
            </h3>
            <div className="space-y-2">
              {topHits.map((card, i) => {
                const enPrice = card.market_price || 0;
                const jpPrice = enPrice / EN_MULTIPLIER;
                const thbPrice = jpPrice * USD_TO_THB;
                return (
                  <Link key={card.card_set_id} href={`/cards/${card.card_set_id}`}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 bg-[#1a2040] hover:bg-[#1e2450] rounded-xl p-3 transition-colors cursor-pointer"
                    >
                      <span className="text-amber-100/20 text-xs font-bold w-5">#{i + 1}</span>
                      <div className="relative w-10 h-14 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={getCardImageUrl(card, "JP")} alt="" fill className="object-cover" onError={(e) => { (e.target as HTMLImageElement).src = card.card_image; }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-amber-100 font-bold text-sm truncate">{card.card_name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold px-1.5 py-px rounded text-white" style={{ backgroundColor: getRarityColor(card.rarity) }}>
                            {card.rarity}
                          </span>
                          <span className="text-amber-100/30 text-[10px]">{card.card_set_id}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="text-red-400 font-bold text-xs">🇯🇵 ${jpPrice.toFixed(2)}</p>
                            <p className="text-amber-100/20 text-[9px]">~฿{thbPrice.toFixed(0)}</p>
                          </div>
                          <div>
                            <p className="text-blue-400 font-bold text-xs">🇺🇸 ${enPrice.toFixed(2)}</p>
                            <p className="text-amber-100/20 text-[9px]">~฿{(enPrice * USD_TO_THB).toFixed(0)}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Full Price Table */}
        <div className="bg-[#0f1535] border border-amber-500/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-amber-400 font-bold text-sm tracking-wider uppercase">
              All Cards — {selectedSet}
            </h3>
            <div className="flex gap-2">
              {(["price", "rarity", "name"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    sortBy === s ? "bg-amber-500/20 text-amber-400" : "text-amber-100/30 hover:text-amber-100/50"
                  }`}
                >
                  {s === "price" ? "💰 Price" : s === "rarity" ? "⭐ Rarity" : "🔤 Name"}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-1">
              {/* Header */}
              <div className="hidden sm:grid grid-cols-[1fr_60px_80px_80px_80px] gap-2 px-3 py-1 text-[9px] text-amber-100/30 uppercase tracking-wider">
                <span>Card</span>
                <span>Rarity</span>
                <span className="text-right">🇯🇵 JP Est.</span>
                <span className="text-right">🇺🇸 EN</span>
                <span className="text-right">฿ THB</span>
              </div>
              {sorted.map((card) => {
                const enPrice = card.market_price || 0;
                const jpPrice = enPrice / EN_MULTIPLIER;
                return (
                  <Link key={card.card_set_id} href={`/cards/${card.card_set_id}`}>
                    <div className="grid grid-cols-[1fr_60px_80px_80px_80px] gap-2 items-center px-3 py-2 rounded-lg hover:bg-[#1a2040] transition-colors cursor-pointer text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-amber-100/60 truncate">{card.card_name}</span>
                        <span className="text-amber-100/20 text-[9px] flex-shrink-0">{card.card_set_id}</span>
                      </div>
                      <span className="text-[9px] font-bold px-1.5 py-px rounded text-white text-center" style={{ backgroundColor: getRarityColor(card.rarity) }}>
                        {card.rarity}
                      </span>
                      <span className="text-red-400/70 text-xs text-right">${jpPrice.toFixed(2)}</span>
                      <span className="text-blue-400/70 text-xs text-right">${enPrice.toFixed(2)}</span>
                      <span className="text-amber-400/70 text-xs text-right">฿{(jpPrice * USD_TO_THB).toFixed(0)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Info */}
        <p className="text-amber-100/15 text-[10px] text-center mt-4">
          * ราคา EN จาก TCGPlayer market price. ราคา JP ประมาณการ (EN ÷ {EN_MULTIPLIER}). อัตราแลกเปลี่ยน {USD_TO_THB} THB/USD
        </p>
      </div>
    </div>
  );
}
