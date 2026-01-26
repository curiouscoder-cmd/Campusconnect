"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const BackgroundBeams = ({ className }) => {
    return (
        <div
            className={cn(
                "absolute top-0 left-0 w-full h-full bg-white overflow-hidden z-0",
                className
            )}
        >
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.02)_0%,rgba(255,255,255,1)_100%)] z-10 pointer-events-none" />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="absolute top-0 left-0 w-full h-full"
            >
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-[200vw] h-[200vh] border border-indigo-100/50 rounded-[100%]"
                        style={{
                            transform: `translate(-50%, -50%) rotate(${i * 15}deg)`,
                        }}
                        animate={{
                            rotate: [`${i * 15}deg`, `${i * 15 + 360}deg`],
                        }}
                        transition={{
                            duration: 20 + i * 5,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                ))}
            </motion.div>
        </div>
    );
};
