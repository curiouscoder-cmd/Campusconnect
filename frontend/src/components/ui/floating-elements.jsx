"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function FloatingElement({ children, className, delay = 0, duration = 3 }) {
  return (
    <motion.div
      className={cn("", className)}
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
    >
      {children}
    </motion.div>
  );
}

export function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary orb */}
      <motion.div
        className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-3xl"
        style={{ top: "10%", right: "10%" }}
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Secondary orb */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-pink-500/15 to-indigo-500/15 blur-3xl"
        style={{ bottom: "10%", left: "5%" }}
        animate={{
          x: [0, -20, 0],
          y: [0, 30, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      {/* Accent orb */}
      <motion.div
        className="absolute w-48 h-48 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-2xl"
        style={{ top: "40%", left: "30%" }}
        animate={{
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
}
