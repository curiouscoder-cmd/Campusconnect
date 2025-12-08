"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function TextShimmer({ children, className }) {
  return (
    <motion.span
      className={cn(
        "inline-flex animate-shimmer bg-[linear-gradient(110deg,#0F172A,45%,#6366F1,55%,#0F172A)] bg-[length:200%_100%] bg-clip-text text-transparent",
        className
      )}
      initial={{ backgroundPosition: "200% 0" }}
      animate={{ backgroundPosition: "-200% 0" }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {children}
    </motion.span>
  );
}

export function GradientText({ children, className }) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </span>
  );
}
