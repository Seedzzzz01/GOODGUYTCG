"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { TCGSet } from "@/types";
import { formatPrice } from "@/lib/constants";

interface SetCardProps {
  set: TCGSet;
  index: number;
}

export default function SetCard({ set, index }: SetCardProps) {
  const statusConfig = {
    "in-stock": { label: "In Stock", color: "bg-emerald-500" },
    "pre-order": { label: "Pre-Order", color: "bg-amber-500" },
    "sold-out": { label: "Sold Out", color: "bg-red-500" },
  };

  const status = statusConfig[set.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <Link href={`/shop/${set.slug}`}>
        <div className="group relative cursor-pointer">
          <div className="relative bg-[#0f1535]/80 border border-amber-500/10 hover:border-amber-500/30 rounded-xl overflow-hidden transition-all duration-300">
            {/* Product Image — centered, visible */}
            <div className="relative h-56 flex items-center justify-center p-4 overflow-hidden">
              {/* Gradient bg */}
              <div className={`absolute inset-0 bg-gradient-to-br ${set.islandTheme.gradient} opacity-20`} />

              {/* Product box image */}
              <div className="relative w-28 h-40 group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={set.image}
                  alt={set.name}
                  fill
                  sizes="112px"
                  className="object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
                />
              </div>

              {/* Badges */}
              <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1">
                <span className="text-white text-[10px] font-bold tracking-wider">{set.code}</span>
              </div>
              <div className="absolute top-2 right-2">
                <span className={`${status.color} text-white text-[10px] font-bold px-2 py-1 rounded-full`}>
                  {status.label}
                </span>
              </div>

              {/* Island name subtle */}
              <div className="absolute bottom-2 left-0 right-0 text-center">
                <span className="text-white/30 text-[10px] tracking-[0.2em] uppercase">
                  {set.islandTheme.name}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="text-amber-100 font-bold text-sm mb-1 group-hover:text-amber-400 transition-colors truncate">
                {set.name}
              </h3>
              <p className="text-amber-100/30 text-[11px] mb-3 line-clamp-1">
                {set.description}
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-amber-100/30 text-[10px] block">per Box</span>
                  <span className="text-amber-400 font-black text-lg">
                    ฿{formatPrice(set.pricePerBox)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {set.stock > 0 && (
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      set.stock <= 3
                        ? "bg-red-500/20 text-red-400"
                        : set.stock <= 8
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-emerald-500/20 text-emerald-400"
                    }`}>
                      {set.stock} left
                    </span>
                  )}
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                    <span className="text-amber-400 group-hover:text-[#0a0e27] transition-colors text-sm">→</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
