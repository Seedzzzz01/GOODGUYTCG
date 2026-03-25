"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface CloudTransitionProps {
  children?: React.ReactNode;
}

function CloudShape({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`absolute ${className}`} style={style}>
      <div className="relative">
        <div className="absolute rounded-full bg-white/90 blur-md" style={{ width: "200px", height: "80px", top: "20px", left: "40px" }} />
        <div className="absolute rounded-full bg-white/95 blur-sm" style={{ width: "120px", height: "100px", top: "0px", left: "80px" }} />
        <div className="absolute rounded-full bg-white/85 blur-md" style={{ width: "160px", height: "70px", top: "10px", left: "0px" }} />
        <div className="absolute rounded-full bg-white blur-sm" style={{ width: "100px", height: "90px", top: "-10px", left: "120px" }} />
        <div className="absolute rounded-full bg-white/80 blur-lg" style={{ width: "180px", height: "60px", top: "30px", left: "20px" }} />
      </div>
    </div>
  );
}

export default function CloudTransition({ children }: CloudTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start -0.3"],
  });

  // Clouds: off-screen → sweep in → hold → sweep out
  // 0.0 = section bottom enters viewport
  // 0.3 = clouds fully covering
  // 0.45 = clouds start leaving
  // 0.7 = clouds fully gone
  // 0.8+ = content fully visible
  const cloudLeftX = useTransform(scrollYProgress, [0, 0.25, 0.45, 0.7], ["-130%", "0%", "0%", "-150%"]);
  const cloudRightX = useTransform(scrollYProgress, [0, 0.25, 0.45, 0.7], ["130%", "0%", "0%", "150%"]);
  const fogOpacity = useTransform(scrollYProgress, [0, 0.2, 0.35, 0.55, 0.75], [0, 0.5, 0.4, 0.1, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0.5, 0.75], [0, 1]);

  return (
    <div ref={ref} className="relative overflow-hidden">
      {/* Fog overlay */}
      <motion.div
        style={{ opacity: fogOpacity }}
        className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-white/40 via-white/20 to-transparent"
      />

      {/* Cloud layer - LEFT */}
      <motion.div
        style={{ x: cloudLeftX }}
        className="absolute inset-0 z-20 pointer-events-none"
      >
        <CloudShape className="top-[5%] -left-[5%]" style={{ transform: "scale(2.5)" }} />
        <CloudShape className="top-[35%] -left-[8%]" style={{ transform: "scale(3)" }} />
        <CloudShape className="top-[65%] -left-[3%]" style={{ transform: "scale(2.2)" }} />
      </motion.div>

      {/* Cloud layer - RIGHT */}
      <motion.div
        style={{ x: cloudRightX }}
        className="absolute inset-0 z-20 pointer-events-none"
      >
        <CloudShape className="top-[10%] right-[0%]" style={{ transform: "scale(2.8) scaleX(-1)" }} />
        <CloudShape className="top-[40%] right-[-5%]" style={{ transform: "scale(2.5) scaleX(-1)" }} />
        <CloudShape className="top-[70%] right-[2%]" style={{ transform: "scale(3) scaleX(-1)" }} />
      </motion.div>

      {/* Content — visible after clouds part */}
      <motion.div style={{ opacity: contentOpacity }} className="relative z-10">
        {children}
      </motion.div>
    </div>
  );
}
