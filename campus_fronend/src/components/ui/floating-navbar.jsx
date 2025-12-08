"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const FloatingNav = ({
  navItems,
  className,
}) => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          y: 0,
          opacity: 1,
        }}
        animate={{
          y: 0,
          opacity: 1,
          width: isScrolled ? "fit-content" : "100%",
          maxWidth: isScrolled ? "fit-content" : "100%",
          borderRadius: isScrolled ? "9999px" : "0px",
          top: isScrolled ? "20px" : "0px",
          padding: isScrolled ? "0.75rem 2rem" : "1rem 4rem",
          backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.4)",
          border: isScrolled ? "1px solid rgba(0,0,0,0.1)" : "0px solid transparent",
          boxShadow: isScrolled ? "0px 10px 15px -3px rgba(0,0,0,0.1)" : "none",
        }}
        transition={{
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1], // Custom easing
        }}
        className={cn(
          "fixed inset-x-0 mx-auto z-[5000] flex items-center justify-between backdrop-blur-md",
          !isScrolled && "border-b border-white/20", // Subtle border when full width
          className
        )}>

        {/* Brand/Logo */}
        <Link href="/" className={cn("font-bold text-lg tracking-tight mr-4 transition-colors flex items-center gap-2", isScrolled ? "text-primary" : "text-primary")}>
          <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs">CC</div>
          <span className={cn("hidden sm:block", isScrolled && "sm:hidden md:block")}>Campus Connect</span>
        </Link>

        {/* Nav Items */}
        <div className="flex items-center gap-8">
          {navItems.map((navItem, idx) => (
            <Link
              key={`link=${idx}`}
              href={navItem.link}
              className={cn(
                "relative items-center flex space-x-1 text-sm font-medium transition-colors hover:text-black",
                isScrolled ? "text-muted-foreground" : "text-foreground/80"
              )}>
              <span className="block sm:hidden">{navItem.icon}</span>
              <span className="hidden sm:block">{navItem.name}</span>
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 ml-4">
          <Link href="/login">
            <Button size="sm" variant="ghost" className={cn("hidden sm:inline-flex h-9 px-4 text-sm font-medium rounded-full hover:bg-black/5", isScrolled ? "text-muted-foreground" : "text-foreground")}>
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <button
              className="group relative inline-flex h-9 items-center justify-center overflow-hidden rounded-full bg-black px-6 font-medium text-white transition-all hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
              <span className="relative">Join Now</span>
            </button>
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
