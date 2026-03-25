"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SPIN_REWARDS } from "@/lib/constants";

interface SpinWheelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SpinWheel({ isOpen, onClose }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  const segmentAngle = 360 / SPIN_REWARDS.length;

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult(null);

    // Weighted random selection
    const random = Math.random();
    let cumulative = 0;
    let selectedIndex = 0;
    for (let i = 0; i < SPIN_REWARDS.length; i++) {
      cumulative += SPIN_REWARDS[i].probability;
      if (random <= cumulative) {
        selectedIndex = i;
        break;
      }
    }

    const targetAngle =
      360 * 5 + (360 - selectedIndex * segmentAngle - segmentAngle / 2);
    const newRotation = rotation + targetAngle;
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setResult(SPIN_REWARDS[selectedIndex].label);
    }, 4000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={!isSpinning ? onClose : undefined}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#0f1535] border border-amber-500/20 rounded-3xl p-8 max-w-md w-full"
          >
            <h2 className="text-amber-400 font-black text-2xl text-center mb-2">
              SPIN THE WHEEL!
            </h2>
            <p className="text-amber-100/40 text-center text-sm mb-6">
              Thank you for your order! Spin to win a bonus reward!
            </p>

            {/* Wheel */}
            <div className="relative w-64 h-64 mx-auto mb-6">
              {/* Pointer */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 text-3xl">
                ▼
              </div>

              {/* Spinning wheel */}
              <motion.div
                className="w-full h-full rounded-full border-4 border-amber-500/30 overflow-hidden relative"
                animate={{ rotate: rotation }}
                transition={{
                  duration: 4,
                  ease: [0.2, 0.8, 0.3, 1],
                }}
              >
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {SPIN_REWARDS.map((reward, i) => {
                    const startAngle = i * segmentAngle;
                    const endAngle = startAngle + segmentAngle;
                    const startRad = ((startAngle - 90) * Math.PI) / 180;
                    const endRad = ((endAngle - 90) * Math.PI) / 180;

                    const x1 = 100 + 100 * Math.cos(startRad);
                    const y1 = 100 + 100 * Math.sin(startRad);
                    const x2 = 100 + 100 * Math.cos(endRad);
                    const y2 = 100 + 100 * Math.sin(endRad);

                    const largeArc = segmentAngle > 180 ? 1 : 0;

                    const midRad =
                      (((startAngle + endAngle) / 2 - 90) * Math.PI) / 180;
                    const textX = 100 + 60 * Math.cos(midRad);
                    const textY = 100 + 60 * Math.sin(midRad);
                    const textRotation = (startAngle + endAngle) / 2;

                    return (
                      <g key={i}>
                        <path
                          d={`M100,100 L${x1},${y1} A100,100 0 ${largeArc},1 ${x2},${y2} Z`}
                          fill={reward.color}
                          stroke="#0a0e27"
                          strokeWidth="1"
                        />
                        <text
                          x={textX}
                          y={textY}
                          fill="white"
                          fontSize="6"
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                        >
                          {reward.label.length > 12
                            ? reward.label.slice(0, 12) + "…"
                            : reward.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </motion.div>

              {/* Center button */}
              <button
                onClick={spin}
                disabled={isSpinning}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-[#0a0e27] font-black text-sm transition-colors z-10"
              >
                {isSpinning ? "..." : "SPIN"}
              </button>
            </div>

            {/* Result */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <p className="text-amber-100/60 text-sm">You won:</p>
                  <p className="text-amber-400 font-black text-xl mt-1">
                    🎉 {result} 🎉
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-4 px-6 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-full text-sm font-medium transition-colors"
                  >
                    Awesome! Close
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
