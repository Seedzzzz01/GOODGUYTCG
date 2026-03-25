"use client";

import { motion } from "framer-motion";

interface RankBadgeProps {
  rankName: string;
  color: string;
  size?: number;
  animate?: boolean;
}

/** One Piece themed SVG rank emblems */
export default function RankBadge({ rankName, color, size = 80, animate = false }: RankBadgeProps) {
  const badge = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {rankName === "East Blue" && <EastBlueBadge color={color} />}
      {rankName === "Paradise" && <ParadiseBadge color={color} />}
      {rankName === "New World" && <NewWorldBadge color={color} />}
      {rankName === "Yonko" && <YonkoBadge color={color} />}
    </svg>
  );

  if (animate) {
    return (
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {badge}
      </motion.div>
    );
  }

  return badge;
}

/* ─── East Blue: Wave & compass — beginner sailor ─── */
function EastBlueBadge({ color }: { color: string }) {
  return (
    <g>
      {/* Outer ring */}
      <circle cx="60" cy="60" r="54" stroke={color} strokeWidth="3" opacity="0.3" />
      <circle cx="60" cy="60" r="48" stroke={color} strokeWidth="1.5" opacity="0.5" />

      {/* Background fill */}
      <circle cx="60" cy="60" r="46" fill={color} opacity="0.08" />

      {/* Waves */}
      <path
        d="M20 68 Q30 58 40 68 Q50 78 60 68 Q70 58 80 68 Q90 78 100 68"
        stroke={color}
        strokeWidth="2.5"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M25 78 Q35 68 45 78 Q55 88 65 78 Q75 68 85 78 Q95 88 100 80"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.4"
      />

      {/* Compass rose */}
      <g transform="translate(60, 45)">
        <polygon points="0,-16 4,-4 0,-6 -4,-4" fill={color} opacity="0.9" />
        <polygon points="0,16 4,4 0,6 -4,4" fill={color} opacity="0.5" />
        <polygon points="-16,0 -4,-4 -6,0 -4,4" fill={color} opacity="0.5" />
        <polygon points="16,0 4,-4 6,0 4,4" fill={color} opacity="0.5" />
        <circle cx="0" cy="0" r="3" fill={color} />
      </g>

      {/* Label */}
      <text x="60" y="102" textAnchor="middle" fill={color} fontSize="9" fontWeight="800" fontFamily="sans-serif" letterSpacing="1">
        EAST BLUE
      </text>
    </g>
  );
}

/* ─── Paradise: Anchor & log pose — Grand Line first half ─── */
function ParadiseBadge({ color }: { color: string }) {
  return (
    <g>
      {/* Decorative outer ring with dots */}
      <circle cx="60" cy="60" r="54" stroke={color} strokeWidth="2" opacity="0.3" />
      <circle cx="60" cy="60" r="50" stroke={color} strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
      <circle cx="60" cy="60" r="46" fill={color} opacity="0.08" />

      {/* Corner stars */}
      {[0, 90, 180, 270].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 60 60)`}>
          <circle cx="60" cy="8" r="2.5" fill={color} opacity="0.6" />
        </g>
      ))}

      {/* Anchor */}
      <g transform="translate(60, 55)">
        {/* Ring at top */}
        <circle cx="0" cy="-18" r="5" stroke={color} strokeWidth="2.5" fill="none" />
        {/* Vertical shaft */}
        <line x1="0" y1="-13" x2="0" y2="18" stroke={color} strokeWidth="3" />
        {/* Crossbar */}
        <line x1="-14" y1="-2" x2="14" y2="-2" stroke={color} strokeWidth="2.5" />
        {/* Left fluke */}
        <path d="M0 18 Q-8 18 -14 10" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Right fluke */}
        <path d="M0 18 Q8 18 14 10" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>

      {/* Label */}
      <text x="60" y="102" textAnchor="middle" fill={color} fontSize="9" fontWeight="800" fontFamily="sans-serif" letterSpacing="1">
        PARADISE
      </text>
    </g>
  );
}

/* ─── New World: Skull crossbones & flame — dangerous waters ─── */
function NewWorldBadge({ color }: { color: string }) {
  return (
    <g>
      {/* Fiery outer ring */}
      <circle cx="60" cy="60" r="54" stroke={color} strokeWidth="2.5" opacity="0.4" />
      <circle cx="60" cy="60" r="48" stroke={color} strokeWidth="1" opacity="0.6" />
      <circle cx="60" cy="60" r="46" fill={color} opacity="0.1" />

      {/* Flame spikes around edge */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 60 60)`}>
          <path
            d="M60 6 L57 14 L60 11 L63 14 Z"
            fill={color}
            opacity="0.5"
          />
        </g>
      ))}

      {/* Skull */}
      <g transform="translate(60, 50)">
        {/* Skull head */}
        <ellipse cx="0" cy="-4" rx="14" ry="16" fill={color} opacity="0.15" stroke={color} strokeWidth="2" />
        {/* Eyes */}
        <ellipse cx="-5" cy="-6" rx="3.5" ry="4" fill={color} opacity="0.8" />
        <ellipse cx="5" cy="-6" rx="3.5" ry="4" fill={color} opacity="0.8" />
        {/* Nose */}
        <path d="M-1.5 2 L0 -1 L1.5 2" stroke={color} strokeWidth="1" fill="none" opacity="0.6" />
        {/* Teeth */}
        <line x1="-5" y1="7" x2="-5" y2="11" stroke={color} strokeWidth="1.5" opacity="0.7" />
        <line x1="-1.5" y1="7" x2="-1.5" y2="12" stroke={color} strokeWidth="1.5" opacity="0.7" />
        <line x1="1.5" y1="7" x2="1.5" y2="12" stroke={color} strokeWidth="1.5" opacity="0.7" />
        <line x1="5" y1="7" x2="5" y2="11" stroke={color} strokeWidth="1.5" opacity="0.7" />
        {/* Jaw line */}
        <path d="M-10 5 Q-8 10 0 12 Q8 10 10 5" stroke={color} strokeWidth="1.5" fill="none" opacity="0.4" />
      </g>

      {/* Crossbones */}
      <g transform="translate(60, 54)">
        <line x1="-22" y1="-18" x2="22" y2="18" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        <line x1="22" y1="-18" x2="-22" y2="18" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* Label */}
      <text x="60" y="102" textAnchor="middle" fill={color} fontSize="8" fontWeight="800" fontFamily="sans-serif" letterSpacing="1">
        NEW WORLD
      </text>
    </g>
  );
}

/* ─── Yonko: Crown & jolly roger — emperor of the sea ─── */
function YonkoBadge({ color }: { color: string }) {
  return (
    <g>
      {/* Double ring with golden glow */}
      <circle cx="60" cy="60" r="56" stroke={color} strokeWidth="1" opacity="0.3" />
      <circle cx="60" cy="60" r="54" stroke={color} strokeWidth="3" opacity="0.6" />
      <circle cx="60" cy="60" r="49" stroke={color} strokeWidth="1.5" opacity="0.4" />
      <circle cx="60" cy="60" r="46" fill={color} opacity="0.1" />

      {/* Radial lines (sun-like) */}
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={i}
          x1="60"
          y1="60"
          x2={60 + Math.cos((i * 30 * Math.PI) / 180) * 46}
          y2={60 + Math.sin((i * 30 * Math.PI) / 180) * 46}
          stroke={color}
          strokeWidth="0.5"
          opacity="0.15"
        />
      ))}

      {/* Crown */}
      <g transform="translate(60, 34)">
        <path
          d="M-18 8 L-18 -4 L-10 2 L-4 -10 L0 -4 L4 -10 L10 2 L18 -4 L18 8 Z"
          fill={color}
          opacity="0.85"
          stroke={color}
          strokeWidth="1"
        />
        {/* Jewels on crown */}
        <circle cx="-10" cy="-1" r="2" fill="#0a0e27" opacity="0.6" />
        <circle cx="0" cy="-5" r="2" fill="#0a0e27" opacity="0.6" />
        <circle cx="10" cy="-1" r="2" fill="#0a0e27" opacity="0.6" />
        {/* Crown base */}
        <rect x="-18" y="8" width="36" height="4" rx="1" fill={color} opacity="0.7" />
      </g>

      {/* Kanji-style mark (emperor) */}
      <g transform="translate(60, 62)">
        {/* Stylized 四皇 (Four Emperors) mark */}
        <line x1="-12" y1="-8" x2="12" y2="-8" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="-10" y1="-2" x2="10" y2="-2" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <line x1="0" y1="-10" x2="0" y2="10" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="-12" y1="4" x2="12" y2="4" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <line x1="-8" y1="10" x2="8" y2="10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Label */}
      <text x="60" y="102" textAnchor="middle" fill={color} fontSize="10" fontWeight="900" fontFamily="sans-serif" letterSpacing="2">
        YONKO
      </text>
    </g>
  );
}
