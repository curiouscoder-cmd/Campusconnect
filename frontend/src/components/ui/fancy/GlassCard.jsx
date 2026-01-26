import React from "react";
import { cn } from "@/lib/utils";

export const GlassCard = ({ children, className }) => {
    return (
        <div
            className={cn(
                "relative backdrop-blur-md bg-white/70 border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-6 overflow-hidden",
                className
            )}
        >
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/40 to-transparent opacity-50" />
            <div className="relative z-10">{children}</div>
        </div>
    );
};
