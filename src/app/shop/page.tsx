"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import SetCard from "@/components/shop/SetCard";
import { SAMPLE_SETS } from "@/lib/constants";
import { TCGSet } from "@/types";

type StatusFilter = "all" | "in-stock" | "pre-order" | "sold-out";

export default function ShopPage() {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<"name" | "price" | "date">("date");

  const filters: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "All Sets" },
    { value: "in-stock", label: "In Stock" },
    { value: "pre-order", label: "Pre-Order" },
    { value: "sold-out", label: "Sold Out" },
  ];

  const filtered = SAMPLE_SETS.filter(
    (s) => filter === "all" || s.status === filter
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "price") return a.pricePerBox - b.pricePerBox;
    return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
  });

  return (
    <div className="min-h-screen">
      {/* Shop Header with Bazaar BG */}
      <div className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/sections/shop-bazaar.jpg" alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-[#0a0e27]/50" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center"
        >
          <span className="text-amber-400/60 text-xs tracking-[0.3em] uppercase">
            Grand Line Islands
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-amber-100 mt-2">
            All Sets
          </h1>
          <p className="text-amber-100/40 mt-2 text-sm">
            มีครบทุกเซ็ต ขายแยกเป็น Box
          </p>
          <div className="w-16 h-0.5 bg-amber-500/40 mx-auto mt-4" />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === f.value
                    ? "bg-amber-500 text-[#0a0e27]"
                    : "bg-amber-500/10 text-amber-400/60 hover:bg-amber-500/20"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-[#0f1535] border border-amber-500/20 text-amber-100 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-amber-500/50"
          >
            <option value="date">Latest First</option>
            <option value="name">Name A-Z</option>
            <option value="price">Price Low-High</option>
          </select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((set, i) => (
            <SetCard key={set.id} set={set} index={i} />
          ))}
        </div>

        {sorted.length === 0 && (
          <div className="text-center py-20 text-amber-100/30">
            <p className="text-4xl mb-4">🏝️</p>
            <p>No sets found for this filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
