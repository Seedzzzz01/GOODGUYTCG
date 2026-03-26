"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { TCGSet } from "@/types";
import { formatPrice } from "@/lib/constants";

interface IslandMapProps {
  sets: TCGSet[];
}

// Pin positions — placed along the Grand Line route on the map image
const PIN_POSITIONS: { x: string; y: string }[] = [
  { x: "7%",  y: "52%" },  // OP-01 Foosha Village — East Blue start
  { x: "18%", y: "60%" },  // OP-02 Marineford — near Alabasta area
  { x: "29%", y: "32%" },  // OP-03 Dressrosa — near Skypiea
  { x: "40%", y: "58%" },  // OP-04 Enies Lobby — near Water 7
  { x: "52%", y: "40%" },  // OP-05 Wano — center passage at Red Line
  { x: "63%", y: "62%" },  // OP-06 Whole Cake Island — near Thriller Bark
  { x: "76%", y: "60%" },  // OP-07 Egghead — near Sabaody Archipelago
  { x: "78%", y: "20%" },  // OP-08 God Valley — near Mary Geoise
  { x: "88%", y: "38%" },  // OP-09 Onigashima — near Punk Hazard
];

function MapPin({ set, index }: { set: TCGSet; index: number }) {
  const pos = PIN_POSITIONS[index % PIN_POSITIONS.length];
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 300 }}
      className="absolute z-10"
      style={{ left: pos.x, top: pos.y, translate: "-50% -50%" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/shop/${set.slug}`}>
        <div className="cursor-pointer flex flex-col items-center relative">
          {/* Card popup on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.7 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.7 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="absolute left-1/2 z-50"
                style={{ bottom: "calc(100% + 8px)", translate: "-50% 0" }}
              >
                <div className="bg-[#0a0e27]/95 backdrop-blur-sm rounded-xl p-2 border border-amber-500/30 flex flex-col items-center">
                  <div className="relative w-14 h-20 mb-1.5">
                    <Image
                      src={set.image}
                      alt={set.name}
                      fill
                      sizes="56px"
                      className="object-contain rounded-sm"
                    />
                  </div>
                  <p className="text-amber-300 text-[9px] font-black truncate max-w-[80px] text-center">{set.name}</p>
                  <p className="text-amber-400 text-[10px] font-bold">฿{formatPrice(set.pricePerBox)}</p>
                </div>
                {/* Arrow pointing down */}
                <div className="w-0 h-0 mx-auto border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#0a0e27]/95" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pin glow pulse */}
          {isHovered && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 2.5, opacity: [0, 0.5, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="absolute w-4 h-4 rounded-full"
              style={{ backgroundColor: set.islandTheme.color }}
            />
          )}

          {/* Pin dot */}
          <motion.div
            animate={isHovered ? { scale: 1.3 } : { scale: 1 }}
            className="w-4 h-4 rounded-full border-2 shadow-lg transition-colors duration-300"
            style={{
              backgroundColor: set.islandTheme.color,
              borderColor: isHovered ? "#ffd700" : "rgba(180,140,60,0.5)",
              boxShadow: isHovered
                ? `0 0 12px ${set.islandTheme.color}, 0 0 24px ${set.islandTheme.color}40`
                : "0 2px 4px rgba(0,0,0,0.5)",
            }}
          />

          {/* Pin needle */}
          <div
            className="w-0 h-0 mx-auto border-l-[3px] border-r-[3px] border-t-[5px] border-l-transparent border-r-transparent"
            style={{ borderTopColor: set.islandTheme.color }}
          />

          {/* Label */}
          <div className="mt-0.5 bg-[#1a0e04]/90 backdrop-blur-sm rounded px-1.5 py-px border border-amber-800/30">
            <p className="text-amber-200 text-[7px] font-bold text-center whitespace-nowrap">
              {set.code}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function SetGridCard({ set, delay }: { set: TCGSet; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <Link href={`/shop/${set.slug}`}>
        <motion.div
          whileHover={{ y: -6, scale: 1.03 }}
          className="group relative rounded-xl overflow-hidden cursor-pointer"
        >
          <div
            className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-md"
            style={{ backgroundColor: set.islandTheme.color }}
          />

          <div className="relative bg-[#0f1535] border border-amber-500/10 group-hover:border-amber-400/40 rounded-xl overflow-hidden transition-all duration-300">
            {/* Image area — fixed height, centered pack */}
            <div className="relative h-44 sm:h-52 overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${set.islandTheme.gradient} opacity-15`} />

              {/* Fixed-size pack image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-20 h-32 sm:w-24 sm:h-36">
                  <Image
                    src={set.image}
                    alt={set.name}
                    fill
                    sizes="96px"
                    className="object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
                  />
                </div>
              </div>

              {/* Code badge */}
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5 z-10">
                <span className="text-white text-[10px] font-bold">{set.code}</span>
              </div>

              {/* Stock badge */}
              {set.stock > 0 && (
                <div className={`absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${
                  set.stock <= 3 ? "bg-red-500" : set.stock <= 8 ? "bg-amber-500" : "bg-emerald-500"
                }`}>
                  {set.stock}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-3">
              <p className="text-amber-100 text-xs font-bold truncate group-hover:text-amber-400 transition-colors">
                {set.name}
              </p>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-amber-100/30 text-[10px] truncate mr-2">
                  {set.islandTheme.name}
                </span>
                <span className="text-amber-400 font-black text-sm whitespace-nowrap">
                  ฿{formatPrice(set.pricePerBox)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function IslandMap({ sets }: IslandMapProps) {
  const boosterSets = sets.filter((s) => s.code.startsWith("OP"));
  const specialSets = sets.filter((s) => !s.code.startsWith("OP"));

  return (
    <div className="relative">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <span className="text-amber-400/60 text-xs tracking-[0.3em] uppercase">
          Navigate the Grand Line
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-amber-100 mt-2">
          Island Map
        </h2>
        <p className="text-amber-100/40 text-sm mt-2">
          เลือกเกาะที่สนใจ ชี้เพื่อดูซอง กดเพื่อสั่งซื้อ
        </p>
        <div className="w-16 h-0.5 bg-amber-500/40 mx-auto mt-4" />
      </motion.div>

      {/* Map Area — full width, card pops from pins */}
      <div className="relative rounded-2xl overflow-hidden border border-amber-800/20" style={{ height: "500px" }}>
        <Image
          src="/images/sections/grand-line-map.jpg"
          alt="Grand Line Map"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        {/* subtle gradient only at bottom for legibility */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

        {/* Pins on map */}
        {boosterSets.slice(0, 9).map((set, i) => (
          <MapPin key={set.id} set={set} index={i} />
        ))}
      </div>

      {/* New World + Special — Fixed size cards */}
      {boosterSets.length > 9 && (
        <div className="mt-10">
          <p className="text-amber-400/60 text-sm tracking-[0.2em] uppercase text-center mb-6 font-bold">
            New World Islands
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {boosterSets.slice(9).map((set, i) => (
              <SetGridCard key={set.id} set={set} delay={i * 0.08} />
            ))}
          </div>
        </div>
      )}

      {specialSets.length > 0 && (
        <div className="mt-10">
          <p className="text-amber-400/60 text-sm tracking-[0.2em] uppercase text-center mb-6 font-bold">
            Special Islands
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {specialSets.map((set, i) => (
              <SetGridCard key={set.id} set={set} delay={i * 0.08} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
