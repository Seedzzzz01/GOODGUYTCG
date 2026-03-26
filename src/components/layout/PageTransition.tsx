"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

/**
 * Anime-style page transition with wave wipe overlay.
 * A dark wave sweeps across, then reveals the new page.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={pathname}>
        {/* Wave overlay — sweeps in then out */}
        <motion.div
          className="fixed inset-0 z-[9999] pointer-events-none"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: [0, 1, 1, 0] }}
          transition={{ duration: 0.6, times: [0, 0.4, 0.6, 1], ease: "easeInOut" }}
          style={{ transformOrigin: "bottom", background: "linear-gradient(to top, #0a0e27, #1a1040)" }}
        />

        {/* Speed lines during transition */}
        <motion.div
          className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: [0, 0.6, 0.6, 0] }}
          transition={{ duration: 0.6, times: [0, 0.3, 0.6, 1] }}
        >
          {[0.6, -0.8, 1.2, -0.4, 0.9, -1.1, 0.3, -0.7].map((rot, i) => (
            <motion.div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"
              style={{
                top: `${10 + i * 12}%`,
                left: "-10%",
                right: "-10%",
                rotate: `${rot}deg`,
              }}
              exit={{
                x: ["-100%", "100%"],
              }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.02, ease: "easeOut" }}
            />
          ))}
        </motion.div>

        {/* Page content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
