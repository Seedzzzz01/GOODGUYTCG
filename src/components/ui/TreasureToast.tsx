"use client";

import { motion, AnimatePresence } from "framer-motion";
import { type Toast } from "@/hooks/useToast";

const TYPE_CONFIG = {
  reward: { bg: "from-amber-900/95 to-amber-800/95", border: "border-amber-500/40", badge: "🏴‍☠️", badgeText: "REWARD" },
  success: { bg: "from-emerald-900/95 to-emerald-800/95", border: "border-emerald-500/40", badge: "✅", badgeText: "SUCCESS" },
  info: { bg: "from-blue-900/95 to-blue-800/95", border: "border-blue-500/40", badge: "📜", badgeText: "INFO" },
  warning: { bg: "from-red-900/95 to-red-800/95", border: "border-red-500/40", badge: "⚠️", badgeText: "WARNING" },
};

interface Props {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

export default function TreasureToast({ toasts, removeToast }: Props) {
  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => {
          const config = TYPE_CONFIG[toast.type || "reward"];
          const duration = toast.duration || 3000;
          return (
            <motion.div
              key={toast.id}
              initial={{ x: 320, opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 320, opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="pointer-events-auto"
            >
              <div
                className={`relative bg-gradient-to-r ${config.bg} ${config.border} border rounded-xl px-4 py-3 min-w-[260px] max-w-[340px] backdrop-blur-md shadow-2xl overflow-hidden cursor-pointer`}
                onClick={() => removeToast(toast.id)}
              >
                {/* Wanted poster texture lines */}
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 3px)",
                }} />

                <div className="relative flex items-start gap-3">
                  {/* Icon */}
                  <span className="text-2xl flex-shrink-0 mt-0.5">
                    {toast.icon || config.badge}
                  </span>

                  <div className="flex-1 min-w-0">
                    {/* Badge */}
                    <span className="text-[9px] font-black tracking-[0.15em] text-amber-400/60 uppercase">
                      {config.badgeText}
                    </span>
                    {/* Title */}
                    <p className="text-amber-100 font-bold text-sm truncate">
                      {toast.title}
                    </p>
                    {/* Message */}
                    {toast.message && (
                      <p className="text-amber-100/50 text-xs mt-0.5 line-clamp-2">
                        {toast.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <motion.div
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: duration / 1000, ease: "linear" }}
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500/50 origin-left"
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
