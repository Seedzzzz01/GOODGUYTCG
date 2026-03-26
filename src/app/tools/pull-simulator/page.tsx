"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { OPTCGCard } from "@/types";
import { getCardImageUrl, getRarityColor, RARITY_LABELS } from "@/lib/optcg-api";

// Pull rates based on real OPTCG JP box data (24 packs, 6 cards/pack)
const RARITY_WEIGHTS: Record<string, number> = {
  C: 50, UC: 25, R: 15, SR: 6, L: 2.5, SEC: 1, SP: 0.3, TR: 0.2,
};

function weightedRandom(cards: OPTCGCard[]): OPTCGCard {
  const grouped: Record<string, OPTCGCard[]> = {};
  for (const c of cards) {
    if (!grouped[c.rarity]) grouped[c.rarity] = [];
    grouped[c.rarity].push(c);
  }

  const entries = Object.entries(grouped).filter(([r]) => RARITY_WEIGHTS[r]);
  const totalWeight = entries.reduce((sum, [r]) => sum + (RARITY_WEIGHTS[r] || 0), 0);
  let roll = Math.random() * totalWeight;

  for (const [rarity, rarityCards] of entries) {
    roll -= RARITY_WEIGHTS[rarity] || 0;
    if (roll <= 0) {
      return rarityCards[Math.floor(Math.random() * rarityCards.length)];
    }
  }
  // Fallback
  return cards[Math.floor(Math.random() * cards.length)];
}

export default function PullSimulatorPage() {
  const [sets, setSets] = useState<{ set_id: string; set_name: string }[]>([]);
  const [selectedSet, setSelectedSet] = useState("OP-01");
  const [allCards, setAllCards] = useState<OPTCGCard[]>([]);
  const [pulled, setPulled] = useState<OPTCGCard[]>([]);
  const [revealing, setRevealing] = useState(false);
  const [revealIndex, setRevealIndex] = useState(-1);
  const [stats, setStats] = useState({ packs: 0, money: 0, hits: {} as Record<string, number> });
  const [bestPull, setBestPull] = useState<OPTCGCard | null>(null);
  const CARDS_PER_PACK = 6;
  const PRICE_PER_PACK = 183; // ~4,400 / 24 packs

  useEffect(() => {
    fetch("/api/card-sets").then((r) => r.json()).then(setSets);
  }, []);

  useEffect(() => {
    if (!selectedSet) return;
    fetch(`/api/cards?setId=${selectedSet}`).then((r) => r.json()).then(setAllCards);
  }, [selectedSet]);

  const openPack = useCallback(() => {
    if (allCards.length === 0 || revealing) return;

    const newPull: OPTCGCard[] = [];
    for (let i = 0; i < CARDS_PER_PACK; i++) {
      newPull.push(weightedRandom(allCards));
    }

    // Sort: rare last for dramatic reveal
    const rarityOrder = ["C", "UC", "R", "SR", "L", "SEC", "SP", "TR"];
    newPull.sort((a, b) => rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity));

    setPulled(newPull);
    setRevealing(true);
    setRevealIndex(-1);

    // Reveal one by one
    let idx = 0;
    const interval = setInterval(() => {
      setRevealIndex(idx);
      idx++;
      if (idx >= CARDS_PER_PACK) {
        clearInterval(interval);
        setTimeout(() => setRevealing(false), 300);
      }
    }, 400);

    // Update stats
    setStats((prev) => {
      const hits = { ...prev.hits };
      for (const card of newPull) {
        hits[card.rarity] = (hits[card.rarity] || 0) + 1;
      }
      return { packs: prev.packs + 1, money: prev.money + PRICE_PER_PACK, hits };
    });

    // Track best pull
    const best = newPull.reduce((a, b) => {
      const aRank = rarityOrder.indexOf(a.rarity);
      const bRank = rarityOrder.indexOf(b.rarity);
      return bRank > aRank ? b : a;
    });
    const bestRank = rarityOrder.indexOf(best.rarity);
    if (!bestPull || bestRank > rarityOrder.indexOf(bestPull.rarity)) {
      setBestPull(best);
    }
  }, [allCards, revealing, bestPull]);

  const resetStats = () => {
    setStats({ packs: 0, money: 0, hits: {} });
    setBestPull(null);
    setPulled([]);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <span className="text-amber-400/60 text-xs tracking-[0.3em] uppercase">Free Tool</span>
          <h1 className="text-4xl sm:text-5xl font-black text-amber-100 mt-2">
            🎰 Pack Opening Simulator
          </h1>
          <p className="text-amber-100/40 mt-2 text-sm max-w-lg mx-auto">
            จำลองเปิดซองฟรี! ลองดูว่า pull rate เป็นยังไง ก่อนซื้อจริง
          </p>
          <div className="w-16 h-0.5 bg-amber-500/40 mx-auto mt-4" />
        </motion.div>

        {/* Set Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {sets.map((s) => (
            <button
              key={s.set_id}
              onClick={() => { setSelectedSet(s.set_id); resetStats(); }}
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

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-[#0f1535] border border-amber-500/5 rounded-xl p-3 text-center">
            <p className="text-amber-400 font-black text-xl">{stats.packs}</p>
            <p className="text-amber-100/30 text-[10px]">Packs Opened</p>
          </div>
          <div className="bg-[#0f1535] border border-amber-500/5 rounded-xl p-3 text-center">
            <p className="text-amber-400 font-black text-xl">฿{stats.money.toLocaleString()}</p>
            <p className="text-amber-100/30 text-[10px]">Money Spent</p>
          </div>
          <div className="bg-[#0f1535] border border-amber-500/5 rounded-xl p-3 text-center">
            <p className="text-purple-400 font-black text-xl">{stats.hits["SEC"] || 0}</p>
            <p className="text-amber-100/30 text-[10px]">Secret Rares</p>
          </div>
          <div className="bg-[#0f1535] border border-amber-500/5 rounded-xl p-3 text-center">
            <p className="text-red-400 font-black text-xl">{stats.hits["SR"] || 0}</p>
            <p className="text-amber-100/30 text-[10px]">Super Rares</p>
          </div>
        </div>

        {/* Pull Area */}
        <div className="bg-[#0f1535] border border-amber-500/10 rounded-2xl p-6 mb-6">
          {/* Open Pack Button */}
          <div className="text-center mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openPack}
              disabled={revealing || allCards.length === 0}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:from-amber-500/30 disabled:to-amber-600/30 text-[#0a0e27] font-black px-8 py-3 rounded-full text-lg transition-all shadow-[0_0_20px_rgba(255,215,0,0.2)]"
            >
              {revealing ? "Opening..." : allCards.length === 0 ? "Loading..." : "🎴 Open Pack!"}
            </motion.button>
            <p className="text-amber-100/20 text-xs mt-2">
              {selectedSet} — {CARDS_PER_PACK} cards per pack
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            <AnimatePresence mode="popLayout">
              {pulled.map((card, i) => {
                const isRevealed = i <= revealIndex;
                const isRare = ["SEC", "SR", "L", "SP", "TR"].includes(card.rarity);
                return (
                  <motion.div
                    key={`${i}-${card.card_set_id}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={isRevealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative"
                  >
                    {isRevealed ? (
                      <Link href={`/cards/${card.card_set_id}`}>
                        <div className={`relative aspect-[5/7] rounded-lg overflow-hidden cursor-pointer ${
                          isRare ? "ring-2 shadow-lg" : ""
                        }`} style={isRare ? { boxShadow: `0 0 15px ${getRarityColor(card.rarity)}40, inset 0 0 0 2px ${getRarityColor(card.rarity)}` } : {}}>
                          <Image
                            src={getCardImageUrl(card, "JP")}
                            alt={card.card_name}
                            fill
                            sizes="120px"
                            className="object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = card.card_image; }}
                          />
                          <div
                            className="absolute top-1 right-1 px-1 py-px rounded text-[7px] font-bold text-white"
                            style={{ backgroundColor: getRarityColor(card.rarity) }}
                          >
                            {card.rarity}
                          </div>
                          {isRare && (
                            <motion.div
                              className="absolute inset-0"
                              style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,215,0,0.3) 45%, transparent 60%)" }}
                              animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
                              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                            />
                          )}
                        </div>
                      </Link>
                    ) : (
                      <div className="aspect-[5/7] rounded-lg bg-gradient-to-br from-[#1a2040] to-[#0f1535] border border-amber-500/10 flex items-center justify-center">
                        <span className="text-2xl">🃏</span>
                      </div>
                    )}
                    {isRevealed && (
                      <p className="text-amber-100/50 text-[8px] text-center mt-1 truncate">{card.card_name}</p>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {pulled.length === 0 && (
            <div className="text-center py-12 text-amber-100/20 text-sm">
              กด "Open Pack!" เพื่อเริ่มจำลองเปิดซอง
            </div>
          )}
        </div>

        {/* Pull Rate Table */}
        {stats.packs > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#0f1535] border border-amber-500/10 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-amber-400 font-bold text-sm tracking-wider uppercase">
                Your Pull Rates ({stats.packs} packs)
              </h3>
              <button onClick={resetStats} className="text-amber-100/30 hover:text-amber-100/60 text-xs font-bold">
                Reset
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {["C", "UC", "R", "SR", "L", "SEC", "SP", "TR"].map((r) => {
                const count = stats.hits[r] || 0;
                const total = Object.values(stats.hits).reduce((a, b) => a + b, 0);
                const pct = total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
                if (count === 0 && !["C", "UC", "R", "SR", "SEC"].includes(r)) return null;
                return (
                  <div key={r} className="bg-[#1a2040] rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getRarityColor(r) }} />
                      <span className="text-amber-100/60 text-xs font-bold">{RARITY_LABELS[r] || r}</span>
                    </div>
                    <p className="text-amber-100 font-black text-lg">{count}</p>
                    <p className="text-amber-100/30 text-[10px]">{pct}% actual</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Best Pull */}
        {bestPull && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#0f1535] border border-amber-500/10 rounded-2xl p-6 mb-6">
            <h3 className="text-amber-400 font-bold text-sm tracking-wider uppercase mb-3">Best Pull</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-28 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={getCardImageUrl(bestPull, "JP")} alt={bestPull.card_name} fill className="object-cover" onError={(e) => { (e.target as HTMLImageElement).src = bestPull.card_image; }} />
              </div>
              <div>
                <p className="text-amber-100 font-bold">{bestPull.card_name}</p>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: getRarityColor(bestPull.rarity) }}>
                  {RARITY_LABELS[bestPull.rarity] || bestPull.rarity}
                </span>
                {bestPull.market_price && (
                  <p className="text-amber-400 font-bold mt-1">${bestPull.market_price.toFixed(2)}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <div className="text-center">
          <p className="text-amber-100/30 text-sm mb-3">ชอบ set นี้? ซื้อกล่องจริงเลย!</p>
          <Link href="/shop">
            <motion.button whileHover={{ scale: 1.05 }} className="bg-amber-500 hover:bg-amber-400 text-[#0a0e27] font-black px-6 py-2.5 rounded-full text-sm">
              🛒 ไปร้านค้า
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
}
