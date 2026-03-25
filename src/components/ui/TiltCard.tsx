"use client";

import { useRef, useState, type ReactNode, type MouseEvent } from "react";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
  className?: string;
  tiltStrength?: number; // degrees, default 8
  glare?: boolean;
  holographic?: boolean;
}

export default function TiltCard({
  children,
  className = "",
  tiltStrength = 8,
  glare = true,
  holographic = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMove = (e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Normalize to -1 to 1
    const normalX = mouseX / (rect.width / 2);
    const normalY = mouseY / (rect.height / 2);

    setTilt({
      x: -normalY * tiltStrength, // invert Y for natural feel
      y: normalX * tiltStrength,
    });

    // Glare position (0-100%)
    setGlarePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleLeave}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ perspective: 800, transformStyle: "preserve-3d" }}
      className={`relative ${className}`}
    >
      {children}

      {/* Light glare overlay */}
      {glare && isHovered && (
        <div
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] transition-opacity duration-200"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />
      )}

      {/* Holographic shimmer */}
      {holographic && isHovered && (
        <div
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] mix-blend-overlay transition-opacity duration-300"
          style={{
            background: `linear-gradient(
              ${105 + tilt.y * 3}deg,
              transparent 20%,
              rgba(255, 0, 128, 0.1) 30%,
              rgba(0, 255, 200, 0.15) 40%,
              rgba(255, 215, 0, 0.1) 50%,
              rgba(100, 100, 255, 0.15) 60%,
              transparent 70%
            )`,
            opacity: isHovered ? 1 : 0,
          }}
        />
      )}
    </motion.div>
  );
}
