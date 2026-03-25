"use client";

import { use, useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { SAMPLE_SETS, formatPrice } from "@/lib/constants";
import { TCGSet } from "@/types";
import { useCart } from "@/hooks/useCart";
import SetCardList from "@/components/shop/SetCardList";
import { getLocalSetCards } from "@/lib/card-data";
import { getRarityColor, RARITY_LABELS } from "@/lib/optcg-api";
import LootBoxAnimation from "@/components/ui/LootBoxAnimation";
import { useToast } from "@/hooks/useToast";

const RARITY_ORDER = ["L", "SEC", "SR", "R", "UC", "C"];
const RARITY_RATES: Record<string, string> = {
  L: "1 ใบ/กล่อง",
  SEC: "ลุ้น ~1 ใน 3 กล่อง",
  SR: "~2 ใบ/กล่อง",
  R: "~6 ใบ/กล่อง",
  UC: "~8 ใบ/กล่อง",
  C: "~7 ใบ/กล่อง",
};

const STATUS_MAP: Record<string, TCGSet["status"]> = {
  IN_STOCK: "in-stock", PRE_ORDER: "pre-order", SOLD_OUT: "sold-out",
};
const CAT_MAP: Record<string, TCGSet["category"]> = {
  BOOSTER: "booster", EXTRA: "extra", PREMIUM: "premium", STARTER: "starter",
};

export default function SetDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { addItem } = useCart();
  const { addToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showLootBox, setShowLootBox] = useState(false);

  // Try DB first, fallback to hardcoded
  const fallback = SAMPLE_SETS.find((s) => s.slug === slug) || null;
  const [set, setSet] = useState<TCGSet | null>(fallback);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(p => {
        if (!p) return;
        const theme = (p.islandTheme as Record<string, unknown>) || {};
        setSet({
          id: p.code, name: p.name, slug: p.slug, code: p.code,
          description: p.description || "", image: p.image || "",
          boxCount: p.boxCount || 1, pricePerBox: p.pricePerBox,
          stock: p.stock || 0, status: STATUS_MAP[p.status] || "in-stock",
          releaseDate: p.releaseDate || "", packsPerBox: p.packsPerBox || 24,
          cardsPerPack: p.cardsPerPack || 6,
          category: CAT_MAP[p.category] || undefined,
          islandTheme: {
            name: (theme.name as string) || "", color: (theme.color as string) || "#e74c3c",
            gradient: (theme.gradient as string) || "", description: (theme.description as string) || "",
            arc: (theme.arc as string) || "", keyCharacters: (theme.keyCharacters as string[]) || [],
          },
        });
      })
      .catch(() => {});
  }, [slug]);

  if (!set) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🏝️</p>
          <h1 className="text-2xl font-bold text-amber-100 mb-2">Island Not Found</h1>
          <Link href="/shop" className="text-amber-400 hover:text-amber-300">← Back to Shop</Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (set.stock <= 0 && set.status !== "pre-order") return;
    addItem(set, quantity);
    setAdded(true);
    setShowLootBox(true);
    addToast({
      title: `${set.name} x${quantity}`,
      message: "เพิ่มลงตะกร้าแล้ว!",
      icon: "📦",
      type: "reward",
    });
    setTimeout(() => setAdded(false), 2000);
  };

  const statusConfig = {
    "in-stock": { label: "In Stock", color: "bg-emerald-500" },
    "pre-order": { label: "Pre-Order", color: "bg-amber-500" },
    "sold-out": { label: "Sold Out", color: "bg-red-500" },
  };
  const status = statusConfig[set.status];
  const maxQty = set.status === "pre-order" ? 12 : set.stock;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <Link href="/shop" className="text-amber-400/60 hover:text-amber-400 transition-colors">Shop</Link>
          <span className="text-amber-100/20 mx-2">/</span>
          <span className="text-amber-100/60">{set.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Product Image Area */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="relative h-80 sm:h-96 rounded-3xl bg-[#0f1535] border border-amber-500/10 overflow-hidden">
              {/* Subtle island gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${set.islandTheme.gradient} opacity-20`} />
              {/* Dark vignette */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#0a0e27_100%)]" />

              {/* Product image */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <Image
                  src={set.image}
                  alt={set.name}
                  width={200}
                  height={280}
                  className="object-contain drop-shadow-[0_8px_32px_rgba(0,0,0,0.8)] z-10"
                />
              </div>

              {/* Set code */}
              <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm rounded-full px-4 py-1.5 z-20">
                <span className="text-white font-bold tracking-wider">{set.code}</span>
              </div>

              {/* Stock badge */}
              {set.stock > 0 && set.status === "in-stock" && (
                <div className={`absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full text-xs font-bold text-white ${
                  set.stock <= 3 ? "bg-red-500" : set.stock <= 8 ? "bg-amber-500" : "bg-emerald-500"
                }`}>
                  {set.stock} Box Left
                </div>
              )}

              {/* Island name */}
              <div className="absolute bottom-4 left-0 right-0 text-center z-10">
                <span className="text-white/40 text-xs tracking-[0.4em] uppercase">
                  ~ {set.islandTheme.name} ~
                </span>
              </div>

              {/* Holographic shimmer */}
              <motion.div
                className="absolute inset-0"
                style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0.05) 50%, transparent 55%)" }}
                animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <span className={`${status.color} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                {status.label}
              </span>
              <span className="text-amber-100/30 text-xs">
                Released: {new Date(set.releaseDate).toLocaleDateString("th-TH")}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-amber-100 mb-2">{set.name}</h1>
            <p className="text-amber-100/40 text-sm leading-relaxed mb-6">{set.description}</p>

            {/* Box Details */}
            <div className="bg-[#0f1535] border border-amber-500/10 rounded-xl p-5 mb-6">
              <h3 className="text-amber-400 font-bold text-sm tracking-wider uppercase mb-3">
                What&apos;s in a Box?
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-amber-100/30 text-xs">Packs</p>
                  <p className="text-amber-100 font-bold text-lg">{set.packsPerBox}</p>
                </div>
                <div>
                  <p className="text-amber-100/30 text-xs">Cards/Pack</p>
                  <p className="text-amber-100 font-bold text-lg">{set.cardsPerPack}</p>
                </div>
                <div>
                  <p className="text-amber-100/30 text-xs">Total Cards</p>
                  <p className="text-amber-100 font-bold text-lg">{set.packsPerBox * set.cardsPerPack}</p>
                </div>
              </div>
            </div>

            {/* Price & Add to Cart */}
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-amber-100/30 text-xs">Price per Box</p>
                <p className="text-amber-400 font-black text-3xl">
                  ฿{formatPrice(set.pricePerBox)}
                </p>
              </div>
              {set.stock > 0 && set.status === "in-stock" && (
                <p className={`text-xs font-medium ${
                  set.stock <= 3 ? "text-red-400" : "text-amber-100/40"
                }`}>
                  {set.stock <= 3 ? `Only ${set.stock} left!` : `${set.stock} in stock`}
                </p>
              )}
            </div>

            {set.status !== "sold-out" && set.stock > 0 && (
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center bg-[#0f1535] border border-amber-500/20 rounded-full">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 text-amber-400 hover:text-amber-300 transition-colors text-lg"
                  >−</button>
                  <span className="w-10 text-center text-amber-100 font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                    className="w-10 h-10 text-amber-400 hover:text-amber-300 transition-colors text-lg"
                  >+</button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 rounded-full font-black text-lg transition-colors ${
                    added
                      ? "bg-emerald-500 text-white"
                      : "bg-amber-500 hover:bg-amber-400 text-[#0a0e27]"
                  }`}
                >
                  {added ? "Added!" : `Add ${quantity} Box to Cart`}
                </motion.button>
              </div>
            )}

            {set.status === "pre-order" && set.stock === 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="w-full py-3 rounded-full font-black text-lg bg-amber-500 hover:bg-amber-400 text-[#0a0e27] transition-colors mb-4"
              >
                Pre-Order Now
              </motion.button>
            )}

            {set.status === "sold-out" && (
              <div className="py-3 text-center bg-red-500/10 border border-red-500/20 rounded-full text-red-400 font-bold mb-4">
                Sold Out
              </div>
            )}

            <p className="text-amber-100/30 text-xs text-center">
              สงสัยอะไร แชท LINE: @goodguytcg
            </p>
          </motion.div>
        </div>

        {/* Drop Rate Section — real cards by rarity */}
        <DropRateCards setCode={set.code} />

        {/* Island Lore Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <span className="text-amber-400/60 text-xs tracking-[0.3em] uppercase">
              Island Lore
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-100 mt-2">
              ~ {set.islandTheme.name} ~
            </h2>
            <div className="w-16 h-0.5 bg-amber-500/40 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Island Description */}
            <div className="bg-[#0f1535] rounded-2xl p-6 relative overflow-hidden border border-amber-500/10">
              <div className={`absolute inset-0 bg-gradient-to-br ${set.islandTheme.gradient} opacity-20`} />
              <div className="relative z-10">
                <p className="text-amber-400/60 text-xs tracking-wider uppercase mb-2">
                  {set.islandTheme.arc}
                </p>
                <h3 className="text-amber-100 font-black text-xl mb-3">
                  {set.islandTheme.name}
                </h3>
                <p className="text-amber-100/60 text-sm leading-relaxed">
                  {set.islandTheme.description}
                </p>
              </div>
            </div>

            {/* Key Characters */}
            <div className="bg-[#0f1535] border border-amber-500/10 rounded-2xl p-6">
              <h3 className="text-amber-400 font-bold text-sm tracking-wider uppercase mb-4">
                Key Characters
              </h3>
              <div className="flex flex-wrap gap-2">
                {set.islandTheme.keyCharacters.map((char) => (
                  <motion.span
                    key={char}
                    whileHover={{ scale: 1.05 }}
                    className="bg-amber-500/10 text-amber-100/80 text-xs px-3 py-1.5 rounded-full border border-amber-500/10 hover:border-amber-500/30 transition-colors cursor-default"
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>

        </motion.div>

        {/* Cards in this Set — from OPTCG API */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <span className="text-amber-400/60 text-xs tracking-[0.3em] uppercase">
              What&apos;s Inside?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-100 mt-2">
              Cards in {set.code}
            </h2>
            <p className="text-amber-100/40 text-sm mt-2">
              การ์ดทุกใบที่มีในกล่องนี้
            </p>
            <div className="w-16 h-0.5 bg-amber-500/40 mx-auto mt-4" />
          </div>

          <SetCardList setCode={set.code} />
        </motion.div>
      </div>

      {/* Loot Box Animation */}
      <LootBoxAnimation
        isOpen={showLootBox}
        productName={set.name}
        onComplete={() => setShowLootBox(false)}
      />
    </div>
  );
}

/* ─── Drop Rate Cards Component ─── */
function DropRateCards({ setCode }: { setCode: string }) {
  const cardsByRarity = useMemo(() => {
    const allCards = getLocalSetCards(setCode);
    // Deduplicate by card_set_id
    const seen = new Set<string>();
    const unique = allCards.filter((c) => {
      if (seen.has(c.card_set_id)) return false;
      seen.add(c.card_set_id);
      return true;
    });

    const groups: Record<string, typeof unique> = {};
    for (const card of unique) {
      if (!groups[card.rarity]) groups[card.rarity] = [];
      groups[card.rarity].push(card);
    }
    return groups;
  }, [setCode]);

  const total = Object.values(cardsByRarity).flat().length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-16"
    >
      <div className="text-center mb-8">
        <span className="text-amber-400/60 text-xs tracking-[0.3em] uppercase">
          What Can You Pull?
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-amber-100 mt-2">
          Drop Rates
        </h2>
        <p className="text-amber-100/40 text-sm mt-2">
          ในกล่องมี {total} ใบ โอกาสได้แต่ละแบบตามนี้
        </p>
        <div className="w-16 h-0.5 bg-amber-500/40 mx-auto mt-4" />
      </div>

      <div className="space-y-8">
        {RARITY_ORDER.filter((r) => cardsByRarity[r]?.length > 0).map((rarity) => {
          const cards = cardsByRarity[rarity];
          const color = getRarityColor(rarity);
          const percent = ((cards.length / total) * 100).toFixed(1);
          const rate = RARITY_RATES[rarity] || `${percent}%`;

          return (
            <div key={rarity}>
              {/* Rarity header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <h3 className="font-black text-base" style={{ color }}>
                  {RARITY_LABELS[rarity] || rarity}
                </h3>
                <span className="text-amber-100/30 text-xs">
                  {cards.length} cards
                </span>
                <div
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                  style={{ backgroundColor: color + "20", color }}
                >
                  {rate}
                </div>
              </div>

              {/* Card row — horizontal scroll */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {cards.slice(0, 12).map((card) => (
                  <Link key={card.card_set_id} href={`/cards/${card.card_set_id}`}>
                    <motion.div
                      whileHover={{ y: -4, scale: 1.05 }}
                      className="group relative flex-shrink-0 w-[90px] cursor-pointer"
                    >
                      {/* Glow on rare+ */}
                      {(rarity === "SEC" || rarity === "L") && (
                        <div
                          className="absolute -inset-1 rounded-lg opacity-0 group-hover:opacity-50 transition-opacity blur-md"
                          style={{ backgroundColor: color }}
                        />
                      )}
                      <div className="relative bg-[#0f1535] border border-amber-500/5 group-hover:border-amber-500/30 rounded-lg overflow-hidden transition-all">
                        <div className="relative aspect-[5/7]">
                          <Image
                            src={card.card_image}
                            alt={card.card_name}
                            fill
                            sizes="90px"
                            className="object-cover"
                          />
                        </div>
                        <div className="p-1.5">
                          <p className="text-amber-100/70 text-[8px] font-medium truncate group-hover:text-amber-400 transition-colors">
                            {card.card_name}
                          </p>
                          <p className="text-amber-100/30 text-[7px]">{card.card_set_id}</p>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
                {cards.length > 12 && (
                  <div className="flex-shrink-0 w-[90px] flex items-center justify-center">
                    <span className="text-amber-400/40 text-xs font-medium">
                      +{cards.length - 12} more
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
