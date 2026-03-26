"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

/**
 * Ocean wave page transition — One Piece themed.
 * Multiple SVG wave layers sweep up from bottom, then recede.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={pathname}>
        {/* Ocean wave overlay */}
        <motion.div
          className="fixed inset-0 z-[9999] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.8, times: [0, 0.1, 0.7, 1] }}
        >
          {/* Wave layers — staggered for depth */}
          {WAVE_LAYERS.map((layer, i) => (
            <motion.div
              key={i}
              className="absolute left-0 right-0 overflow-hidden"
              style={{ bottom: 0, height: "100%" }}
              exit={{
                y: ["100%", "0%", "0%", "-100%"],
              }}
              transition={{
                duration: 0.8,
                times: [0, 0.35, 0.55, 1],
                delay: i * 0.04,
                ease: "easeInOut",
              }}
            >
              <svg
                viewBox="0 0 1440 320"
                className="absolute bottom-0 w-full"
                style={{ height: "110%" }}
                preserveAspectRatio="none"
              >
                <path
                  d={layer.path}
                  fill={layer.color}
                />
              </svg>
            </motion.div>
          ))}

          {/* Foam / sparkle particles on wave crest */}
          <motion.div
            className="absolute inset-0"
            exit={{ opacity: [0, 0.8, 0.8, 0] }}
            transition={{ duration: 0.8, times: [0, 0.3, 0.6, 1] }}
          >
            {FOAM_PARTICLES.map((p, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white/60"
                style={{ left: p.x, top: p.y }}
                exit={{
                  y: [0, -20, -60],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.5, 0],
                }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.03, ease: "easeOut" }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Page content */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Wave paths (SVG) — each layer is a different wave shape ───

const WAVE_LAYERS = [
  {
    // Back wave — darkest
    color: "#050816",
    path: "M0,160 C240,100 480,220 720,160 C960,100 1200,220 1440,160 L1440,320 L0,320 Z",
  },
  {
    // Mid wave
    color: "#0a0e27",
    path: "M0,192 C180,140 360,240 540,180 C720,120 900,240 1080,180 C1260,120 1380,200 1440,180 L1440,320 L0,320 Z",
  },
  {
    // Front wave — with amber tint
    color: "#0d1230",
    path: "M0,224 C120,180 300,260 480,210 C660,160 840,270 1020,220 C1200,170 1350,240 1440,210 L1440,320 L0,320 Z",
  },
  {
    // Foam cap — lightest
    color: "#111a3a",
    path: "M0,256 C160,230 280,280 440,245 C600,210 760,280 920,250 C1080,220 1240,270 1440,240 L1440,320 L0,320 Z",
  },
];

// Foam particles positioned across the screen
const FOAM_PARTICLES = Array.from({ length: 12 }).map((_, i) => ({
  x: `${8 + i * 8}%`,
  y: `${45 + (i % 3) * 5}%`,
}));
