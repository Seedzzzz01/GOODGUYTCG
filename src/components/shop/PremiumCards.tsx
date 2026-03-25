"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { getRarityColor, RARITY_LABELS, COLOR_MAP, getCardImageUrl } from "@/lib/optcg-api";
import { OPTCGCard } from "@/types";
import TiltCard from "@/components/ui/TiltCard";

// Premium card IDs — SEC rarity cards
const PREMIUM_CARD_IDS = [
  "OP01-120", "OP02-120", "OP03-122",
  "OP04-118", "OP05-119", "OP06-118",
];

export default function PremiumCards() {
  const [cards, setCards] = useState<OPTCGCard[]>([]);

  useEffect(() => {
    fetch(`/api/cards?ids=${PREMIUM_CARD_IDS.join(",")}`)
      .then((r) => r.json())
      .then(setCards)
      .catch(() => {});
  }, []);

  if (cards.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, i) => {
        if (!card) return null;
        return (
          <motion.div
            key={card.card_image_id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={`/cards/${card.card_set_id}`}>
              <TiltCard tiltStrength={10} holographic glare className="group relative rounded-xl overflow-hidden cursor-pointer">
                {/* Glow effect */}
                <div
                  className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 blur-md"
                  style={{ backgroundColor: getRarityColor(card.rarity) }}
                />

                <div className="relative bg-[#0f1535] border border-amber-500/10 group-hover:border-amber-400/40 rounded-xl overflow-hidden transition-all duration-300">
                  {/* Card Image — default JP since we sell JP boxes */}
                  <div className="relative aspect-[5/7] overflow-hidden">
                    <Image
                      src={getCardImageUrl(card, "JP")}
                      alt={card.card_name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Rarity badge */}
                    <div
                      className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-lg"
                      style={{ backgroundColor: getRarityColor(card.rarity) }}
                    >
                      {RARITY_LABELS[card.rarity] || card.rarity}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <p className="text-amber-100 text-xs font-bold truncate group-hover:text-amber-400 transition-colors">
                      {card.card_name}
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-center gap-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: COLOR_MAP[card.card_color] || "#666" }}
                        />
                        <span className="text-amber-100/30 text-[10px]">
                          {card.card_set_id}
                        </span>
                      </div>
                      {card.market_price && (
                        <span className="text-amber-400 font-black text-sm">
                          ${card.market_price.toFixed(0)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </TiltCard>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
