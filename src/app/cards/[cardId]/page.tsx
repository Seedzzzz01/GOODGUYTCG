"use client";

import { use, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { OPTCGCard } from "@/types";
import { getCard, RARITY_LABELS, COLOR_MAP, getRarityColor, getCardImageUrl } from "@/lib/optcg-api";

export default function CardDetailPage({
  params,
}: {
  params: Promise<{ cardId: string }>;
}) {
  const { cardId } = use(params);
  const [versions, setVersions] = useState<OPTCGCard[]>([]);
  const [selected, setSelected] = useState<OPTCGCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [cardLang, setCardLang] = useState<"JP" | "EN">("JP");

  useEffect(() => {
    getCard(cardId)
      .then((data) => {
        setVersions(data);
        if (data.length > 0) setSelected(data[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [cardId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-500 rounded-full"
        />
      </div>
    );
  }

  if (!selected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🃏</p>
          <h1 className="text-2xl font-bold text-amber-100 mb-2">Card Not Found</h1>
          <Link href="/cards" className="text-amber-400 hover:text-amber-300">
            ← Back to Cards
          </Link>
        </div>
      </div>
    );
  }

  const card = selected;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <Link href="/cards" className="text-amber-400/60 hover:text-amber-400 transition-colors">
            Cards
          </Link>
          <span className="text-amber-100/20 mx-2">/</span>
          <span className="text-amber-100/60">{card.card_set_id}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Card Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-center"
          >
            {/* JP / EN toggle */}
            <div className="flex items-center gap-2 mb-4 bg-[#0f1535] rounded-full p-1 border border-amber-500/10 self-center">
              <button
                onClick={() => setCardLang("JP")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  cardLang === "JP"
                    ? "bg-red-600 text-white shadow-md"
                    : "text-amber-100/40 hover:text-amber-100/60"
                }`}
              >
                🇯🇵 Japanese
              </button>
              <button
                onClick={() => setCardLang("EN")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  cardLang === "EN"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-amber-100/40 hover:text-amber-100/60"
                }`}
              >
                🇺🇸 English
              </button>
            </div>

            <div className="relative w-full max-w-sm aspect-[5/7] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(255,215,0,0.1)]">
              <Image
                src={getCardImageUrl(card, cardLang)}
                alt={card.card_name}
                fill
                className="object-cover"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes("optcgapi.com")) {
                    target.src = card.card_image;
                  }
                }}
              />
            </div>

            {/* Version switcher */}
            {versions.length > 1 && (
              <div className="flex gap-2 mt-4">
                {versions.map((v, i) => (
                  <button
                    key={v.card_image_id}
                    onClick={() => setSelected(v)}
                    className={`w-16 h-[90px] rounded-lg overflow-hidden border-2 transition-colors ${
                      selected.card_image_id === v.card_image_id
                        ? "border-amber-500"
                        : "border-amber-500/10 hover:border-amber-500/30"
                    }`}
                  >
                    <Image
                      src={v.card_image}
                      alt={`Version ${i + 1}`}
                      width={64}
                      height={90}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Card Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                style={{ backgroundColor: getRarityColor(card.rarity) }}
              >
                {RARITY_LABELS[card.rarity] || card.rarity}
              </span>
              <div
                className="w-4 h-4 rounded-full border border-white/20"
                style={{ backgroundColor: COLOR_MAP[card.card_color] || "#666" }}
              />
              <span className="text-amber-100/40 text-sm">{card.card_color}</span>
            </div>

            <h1 className="text-3xl font-black text-amber-100 mb-1">
              {card.card_name}
            </h1>
            <p className="text-amber-400/60 text-sm mb-6">
              {card.card_set_id} — {card.set_name}
            </p>

            {/* Stats Grid */}
            <div className="bg-[#0f1535] border border-amber-500/10 rounded-xl p-5 mb-6">
              <h3 className="text-amber-400 font-bold text-sm tracking-wider uppercase mb-3">
                Card Stats
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-amber-100/30 text-xs">Type</p>
                  <p className="text-amber-100 font-bold">{card.card_type}</p>
                </div>
                {card.card_cost && (
                  <div>
                    <p className="text-amber-100/30 text-xs">Cost</p>
                    <p className="text-amber-100 font-bold">{card.card_cost}</p>
                  </div>
                )}
                {card.card_power && (
                  <div>
                    <p className="text-amber-100/30 text-xs">Power</p>
                    <p className="text-amber-100 font-bold">{card.card_power}</p>
                  </div>
                )}
                {card.counter_amount != null && (
                  <div>
                    <p className="text-amber-100/30 text-xs">Counter</p>
                    <p className="text-amber-100 font-bold">
                      {card.counter_amount > 0 ? `+${card.counter_amount}` : "—"}
                    </p>
                  </div>
                )}
                {card.life && (
                  <div>
                    <p className="text-amber-100/30 text-xs">Life</p>
                    <p className="text-amber-100 font-bold">{card.life}</p>
                  </div>
                )}
                {card.attribute && (
                  <div>
                    <p className="text-amber-100/30 text-xs">Attribute</p>
                    <p className="text-amber-100 font-bold">{card.attribute}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Card Text */}
            {card.card_text && (
              <div className="bg-[#0f1535] border border-amber-500/10 rounded-xl p-5 mb-6">
                <h3 className="text-amber-400 font-bold text-sm tracking-wider uppercase mb-3">
                  Card Effect
                </h3>
                <p className="text-amber-100/70 text-sm leading-relaxed">
                  {card.card_text}
                </p>
              </div>
            )}

            {/* Sub Types */}
            {card.sub_types && (
              <div className="mb-6">
                <p className="text-amber-100/30 text-xs mb-2">Types</p>
                <div className="flex flex-wrap gap-2">
                  {card.sub_types.split(/[\/,]/).map((type) => (
                    <span
                      key={type.trim()}
                      className="bg-amber-500/10 text-amber-400/70 text-xs px-2.5 py-1 rounded-full"
                    >
                      {type.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Market Price */}
            {card.market_price && (
              <div className="bg-[#0f1535] border border-amber-500/10 rounded-xl p-5">
                <h3 className="text-amber-400 font-bold text-sm tracking-wider uppercase mb-3">
                  Market Price
                </h3>
                <div className="flex gap-6">
                  <div>
                    <p className="text-amber-100/30 text-xs">Market</p>
                    <p className="text-amber-400 font-black text-2xl">
                      ${card.market_price.toFixed(2)}
                    </p>
                  </div>
                  {card.inventory_price && (
                    <div>
                      <p className="text-amber-100/30 text-xs">TCGPlayer</p>
                      <p className="text-amber-100 font-bold text-2xl">
                        ${card.inventory_price.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
