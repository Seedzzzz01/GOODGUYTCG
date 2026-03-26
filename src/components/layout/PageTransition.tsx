"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

/**
 * One Piece manga-style ocean wave page transition.
 * Layered SVG waves with ink stroke outlines, spiral foam curls,
 * crosshatch shading, and foam spray — ukiyo-e woodblock inspired.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={pathname}>
        {/* Wave overlay */}
        <motion.div
          className="fixed inset-0 z-[9999] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.9, times: [0, 0.1, 0.65, 1] }}
        >
          {/* Layer 1: Deep ocean background */}
          <motion.div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, #020510 30%, #0a1628 60%, #0d1a35 100%)" }}
            exit={{ y: ["100%", "0%", "0%", "-100%"] }}
            transition={{ duration: 0.9, times: [0, 0.3, 0.55, 1], ease: "easeInOut" }}
          />

          {/* Layer 2: Crosshatch texture overlay */}
          <motion.div
            className="absolute inset-0 opacity-20"
            exit={{ y: ["100%", "0%", "0%", "-100%"] }}
            transition={{ duration: 0.9, times: [0, 0.3, 0.55, 1], ease: "easeInOut" }}
          >
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="crosshatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="8" stroke="#4a90d9" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#crosshatch)" />
            </svg>
          </motion.div>

          {/* Layer 3: Main wave with ink strokes */}
          {WAVE_LAYERS.map((layer, i) => (
            <motion.div
              key={`wave-${i}`}
              className="absolute left-0 right-0"
              style={{ bottom: 0, height: "100%" }}
              exit={{ y: ["100%", "0%", "0%", "-100%"] }}
              transition={{
                duration: 0.9,
                times: [0, 0.32, 0.55, 1],
                delay: i * 0.035,
                ease: "easeInOut",
              }}
            >
              <svg
                viewBox="0 0 1440 400"
                className="absolute bottom-0 w-full"
                style={{ height: "115%" }}
                preserveAspectRatio="none"
              >
                {/* Filled wave body */}
                <path d={layer.fillPath} fill={layer.fill} />

                {/* Ink outline strokes — manga line art */}
                <path
                  d={layer.strokePath}
                  fill="none"
                  stroke={layer.stroke}
                  strokeWidth={layer.strokeWidth}
                  strokeLinecap="round"
                />

                {/* Secondary thin stroke for depth */}
                {layer.thinStroke && (
                  <path
                    d={layer.thinStroke}
                    fill="none"
                    stroke={layer.stroke}
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    strokeDasharray="4 6"
                  />
                )}
              </svg>
            </motion.div>
          ))}

          {/* Layer 4: Spiral foam curls (Hokusai style) */}
          <motion.div
            className="absolute inset-0"
            exit={{ y: ["100%", "5%", "5%", "-100%"] }}
            transition={{ duration: 0.9, times: [0, 0.33, 0.55, 1], ease: "easeInOut" }}
          >
            <svg viewBox="0 0 1440 400" className="absolute bottom-0 w-full" style={{ height: "115%" }} preserveAspectRatio="none">
              {FOAM_SPIRALS.map((s, i) => (
                <g key={`spiral-${i}`}>
                  {/* Spiral curl */}
                  <motion.path
                    d={s.path}
                    fill="none"
                    stroke="#c8ddf0"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    exit={{ pathLength: [0, 1] }}
                    transition={{ duration: 0.4, delay: 0.25 + i * 0.04 }}
                  />
                  {/* Foam dot at spiral tip */}
                  <motion.circle
                    cx={s.tipX}
                    cy={s.tipY}
                    r="3"
                    fill="#e8f0ff"
                    opacity="0.6"
                    exit={{ scale: [0, 1.5, 0], opacity: [0, 0.8, 0] }}
                    transition={{ duration: 0.5, delay: 0.35 + i * 0.04 }}
                  />
                </g>
              ))}

              {/* Foam spray droplets */}
              {SPRAY_DROPS.map((d, i) => (
                <motion.circle
                  key={`drop-${i}`}
                  cx={d.x}
                  cy={d.y}
                  r={d.r}
                  fill="#d0e4f5"
                  opacity="0"
                  exit={{
                    cy: [d.y, d.y - 30 - i * 5],
                    opacity: [0, 0.7, 0],
                    r: [d.r, d.r * 0.3],
                  }}
                  transition={{ duration: 0.4, delay: 0.28 + i * 0.025, ease: "easeOut" }}
                />
              ))}
            </svg>
          </motion.div>

          {/* Layer 5: Jolly Roger silhouette watermark */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            exit={{ opacity: [0, 0.15, 0.15, 0], scale: [0.8, 1, 1, 1.1] }}
            transition={{ duration: 0.9, times: [0, 0.3, 0.6, 1] }}
          >
            <svg viewBox="0 0 100 100" className="w-24 h-24 opacity-0" fill="#ffd700">
              <circle cx="50" cy="38" r="22" fill="none" stroke="#ffd700" strokeWidth="2" />
              <circle cx="42" cy="34" r="4" />
              <circle cx="58" cy="34" r="4" />
              <path d="M44 46 Q50 52 56 46" fill="none" stroke="#ffd700" strokeWidth="1.5" />
              <line x1="20" y1="30" x2="80" y2="70" stroke="#ffd700" strokeWidth="3" strokeLinecap="round" />
              <line x1="80" y1="30" x2="20" y2="70" stroke="#ffd700" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Page content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Wave layers: fill + ink stroke outlines ───

const WAVE_LAYERS = [
  {
    // Deepest wave
    fill: "#040810",
    stroke: "#1a3a5c",
    strokeWidth: "2",
    fillPath: "M0,180 C200,120 400,240 600,170 C800,100 1000,230 1200,170 C1300,140 1400,180 1440,160 L1440,400 L0,400 Z",
    strokePath: "M0,180 C200,120 400,240 600,170 C800,100 1000,230 1200,170 C1300,140 1400,180 1440,160",
    thinStroke: "M0,195 C220,145 420,250 620,185 C820,115 1020,240 1220,180",
  },
  {
    // Mid wave with stronger stroke
    fill: "#081020",
    stroke: "#2a5a8a",
    strokeWidth: "2.5",
    fillPath: "M0,210 C150,170 350,270 500,200 C650,130 850,260 1000,200 C1150,140 1300,230 1440,195 L1440,400 L0,400 Z",
    strokePath: "M0,210 C150,170 350,270 500,200 C650,130 850,260 1000,200 C1150,140 1300,230 1440,195",
    thinStroke: "M0,225 C170,190 370,280 520,215 C670,150 870,270 1020,215",
  },
  {
    // Front crest — most visible, thickest stroke
    fill: "#0c1830",
    stroke: "#4a90d9",
    strokeWidth: "3",
    fillPath: "M0,240 C120,200 280,290 440,230 C600,170 760,290 920,235 C1080,180 1250,270 1440,225 L1440,400 L0,400 Z",
    strokePath: "M0,240 C120,200 280,290 440,230 C600,170 760,290 920,235 C1080,180 1250,270 1440,225",
    thinStroke: null,
  },
  {
    // Foam edge — white-ish stroke on dark fill
    fill: "#101e3d",
    stroke: "#7ab8e8",
    strokeWidth: "1.5",
    fillPath: "M0,270 C100,255 240,290 380,260 C520,230 660,290 800,265 C940,240 1100,285 1260,260 C1360,245 1420,265 1440,258 L1440,400 L0,400 Z",
    strokePath: "M0,270 C100,255 240,290 380,260 C520,230 660,290 800,265 C940,240 1100,285 1260,260 C1360,245 1420,265 1440,258",
    thinStroke: null,
  },
];

// ─── Hokusai-style spiral foam curls at wave crests ───

const FOAM_SPIRALS = [
  { path: "M430,225 C425,215 415,218 418,228 C421,238 435,235 432,222", tipX: 430, tipY: 220 },
  { path: "M920,230 C915,220 905,223 908,233 C911,243 925,240 922,227", tipX: 920, tipY: 225 },
  { path: "M170,205 C165,195 155,198 158,208 C161,218 175,215 172,202", tipX: 170, tipY: 200 },
  { path: "M680,165 C675,155 665,158 668,168 C671,178 685,175 682,162", tipX: 680, tipY: 160 },
  { path: "M1200,170 C1195,160 1185,163 1188,173 C1191,183 1205,180 1202,167", tipX: 1200, tipY: 165 },
  { path: "M310,250 C305,240 295,243 298,253 C301,263 315,260 312,247", tipX: 310, tipY: 245 },
  { path: "M1050,195 C1045,185 1035,188 1038,198 C1041,208 1055,205 1052,192", tipX: 1050, tipY: 190 },
  { path: "M570,195 C565,185 555,188 558,198 C561,208 575,205 572,192", tipX: 570, tipY: 190 },
];

// ─── Foam spray droplets ───

const SPRAY_DROPS = [
  { x: 440, y: 210, r: 2.5 },
  { x: 455, y: 215, r: 1.5 },
  { x: 925, y: 215, r: 2 },
  { x: 935, y: 220, r: 1.5 },
  { x: 175, y: 195, r: 2 },
  { x: 185, y: 200, r: 1 },
  { x: 690, y: 155, r: 2.5 },
  { x: 700, y: 160, r: 1.5 },
  { x: 1210, y: 160, r: 2 },
  { x: 575, y: 185, r: 1.5 },
  { x: 315, y: 240, r: 2 },
  { x: 1055, y: 185, r: 1.5 },
  { x: 480, y: 220, r: 1 },
  { x: 750, y: 260, r: 2 },
  { x: 1100, y: 250, r: 1.5 },
];
