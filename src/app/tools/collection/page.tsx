"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { OPTCGCard } from "@/types";
import { getCardImageUrl, getRarityColor, RARITY_LABELS } from "@/lib/optcg-api";

// Store collection in localStorage
const STORAGE_KEY = "luckytcg_collection";

function loadCollection(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch { return {}; }
}

function saveCollection(data: Record<string, boolean>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function CollectionPage() {
  const [sets, setSets] = useState<{ set_id: string; set_name: string }[]>([]);
  const [selectedSet, setSelectedSet] = useState("OP-01");
  const [cards, setCards] = useState<OPTCGCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [collection, setCollection] = useState<Record<string, boolean>>({});
  const [filterMode, setFilterMode] = useState<"all" | "owned" | "missing">("all");
  const [cardLang, setCardLang] = useState<"JP" | "EN">("JP");

  useEffect(() => { setCollection(loadCollection()); }, []);
  useEffect(() => { fetch("/api/card-sets").then((r) => r.json()).then(setSets); }, []);

  useEffect(() => {
    if (!selectedSet) return;
    setLoading(true);
    fetch(`/api/cards?setId=${selectedSet}`)
      .then((r) => r.json())
      .then((data: OPTCGCard[]) => { setCards(data); setLoading(false); });
  }, [selectedSet]);

  const toggleCard = useCallback((cardId: string) => {
    setCollection((prev) => {
      const next = { ...prev };
      if (next[cardId]) delete next[cardId];
      else next[cardId] = true;
      saveCollection(next);
      return next;
    });
  }, []);

  const filtered = useMemo(() => {
    if (filterMode === "owned") return cards.filter((c) => collection[c.card_set_id]);
    if (filterMode === "missing") return cards.filter((c) => !collection[c.card_set_id]);
    return cards;
  }, [cards, collection, filterMode]);

  // Stats per set
  const setStats = useMemo(() => {
    const owned = cards.filter((c) => collection[c.card_set_id]).length;
    return { total: cards.length, owned, pct: cards.length > 0 ? Math.round((owned / cards.length) * 100) : 0 };
  }, [cards, collection]);

  // Global stats
  const globalStats = useMemo(() => {
    const total = Object.keys(collection).length;
    const value = cards
      .filter((c) => collection[c.card_set_id])
      .reduce((sum, c) => sum + (c.market_price || 0), 0);
    return { total, value };
  }, [cards, collection]);

  // Rarity breakdown
  const rarityStats = useMemo(() => {
    const stats: Record<string, { total: number; owned: number }> = {};
    for (const c of cards) {
      if (!stats[c.rarity]) stats[c.rarity] = { total: 0, owned: 0 };
      stats[c.rarity].total++;
      if (collection[c.card_set_id]) stats[c.rarity].owned++;
    }
    return stats;
  }, [cards, collection]);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <span className="text-amber-400/60 text-xs tracking-[0.3em] uppercase">Free Tool</span>
          <h1 className="text-4xl sm:text-5xl font-black text-amber-100 mt-2">
            📋 Collection Tracker
          </h1>
          <p className="text-amber-100/40 mt-2 text-sm max-w-lg mx-auto">
            ติดตามว่ามีการ์ดใบไหนแล้ว ใบไหนยังขาด — ข้อมูลเก็บในเครื่อง
          </p>
          <div className="w-16 h-0.5 bg-amber-500/40 mx-auto mt-4" />
        </motion.div>

        {/* Global Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-[#0f1535] border border-amber-500/5 rounded-xl p-3 text-center">
            <p className="text-amber-400 font-black text-2xl">{globalStats.total}</p>
            <p className="text-amber-100/30 text-[10px]">Cards Collected</p>
          </div>
          <div className="bg-[#0f1535] border border-amber-500/5 rounded-xl p-3 text-center">
            <p className="text-emerald-400 font-black text-2xl">${globalStats.value.toFixed(0)}</p>
            <p className="text-amber-100/30 text-[10px]">Est. Collection Value</p>
          </div>
          <div className="bg-[#0f1535] border border-amber-500/5 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
            <p className="text-purple-400 font-black text-2xl">{setStats.pct}%</p>
            <p className="text-amber-100/30 text-[10px]">{selectedSet} Completion</p>
          </div>
        </div>

        {/* Set Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {sets.map((s) => {
            // Count owned per set
            return (
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
            );
          })}
        </div>

        {/* Set Progress */}
        <div className="bg-[#0f1535] border border-amber-500/10 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-amber-400 font-bold text-sm">{selectedSet}: {setStats.owned}/{setStats.total}</h3>
            <div className="flex gap-2">
              {/* Filter */}
              {(["all", "owned", "missing"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterMode(f)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    filterMode === f ? "bg-amber-500/20 text-amber-400" : "text-amber-100/30"
                  }`}
                >
                  {f === "all" ? "All" : f === "owned" ? "✓ Owned" : "✗ Missing"}
                </button>
              ))}
              {/* JP/EN */}
              <div className="flex items-center bg-[#1a2040] rounded-full p-0.5 border border-amber-500/10 ml-2">
                <button onClick={() => setCardLang("JP")} className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cardLang === "JP" ? "bg-red-600 text-white" : "text-amber-100/30"}`}>JP</button>
                <button onClick={() => setCardLang("EN")} className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cardLang === "EN" ? "bg-blue-600 text-white" : "text-amber-100/30"}`}>EN</button>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-[#1a2040] rounded-full overflow-hidden mb-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${setStats.pct}%` }}
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full"
            />
          </div>

          {/* Rarity breakdown */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(rarityStats)
              .sort(([a], [b]) => {
                const order = ["L", "SEC", "SR", "R", "UC", "C", "SP", "PR", "TR"];
                return order.indexOf(a) - order.indexOf(b);
              })
              .map(([rarity, stat]) => (
                <span key={rarity} className="text-[10px] text-amber-100/40">
                  <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ backgroundColor: getRarityColor(rarity) }} />
                  {RARITY_LABELS[rarity] || rarity}: {stat.owned}/{stat.total}
                </span>
              ))}
          </div>
        </div>

        {/* Card Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {filtered.map((card) => {
              const owned = !!collection[card.card_set_id];
              return (
                <motion.div
                  key={card.card_set_id}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleCard(card.card_set_id)}
                  className={`relative rounded-lg overflow-hidden cursor-pointer transition-all ${
                    owned ? "ring-2 ring-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.2)]" : "opacity-40 grayscale hover:opacity-70 hover:grayscale-0"
                  }`}
                >
                  <div className="relative aspect-[5/7]">
                    <Image
                      src={getCardImageUrl(card, cardLang)}
                      alt={card.card_name}
                      fill
                      sizes="80px"
                      className="object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = card.card_image; }}
                    />
                    {/* Rarity dot */}
                    <div className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full" style={{ backgroundColor: getRarityColor(card.rarity) }} />
                    {/* Owned check */}
                    {owned && (
                      <div className="absolute bottom-0 inset-x-0 bg-emerald-500/90 text-white text-[8px] font-bold text-center py-px">
                        ✓
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <p className="text-amber-100/15 text-[10px] text-center mt-6">
          * กดที่การ์ดเพื่อ mark ว่ามีแล้ว กดอีกทีเพื่อเอาออก — ข้อมูลเก็บใน browser ของคุณ
        </p>
      </div>
    </div>
  );
}
