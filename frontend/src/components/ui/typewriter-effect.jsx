"use client";
import { cn } from "@/lib/utils";

export const TypewriterEffect = ({
    words,
    className,
    cursorClassName,
}) => {
    const text = words.map(w => w.text).join(" ");
    
    return (
        <div className={cn("typewriter-animation text-center", className)}>
            <span className="border-r-2 border-indigo-500 pr-1">
                {text}
            </span>
        </div>
    );
};

export const TypewriterEffectSmooth = ({
    words,
    className,
    cursorClassName,
}) => {
    const text = words.map(w => w.text).join(" ");
    
    return (
        <div className={cn("typewriter-animation-smooth text-center", className)}>
            <span className="border-r-2 border-gradient pr-1 inline-block">
                {text}
            </span>
        </div>
    );
};

export function TextShimmer({ children, className }) {
    return (
        <span
            className={cn(
                "inline-flex animate-shimmer bg-[linear-gradient(110deg,#0F172A,45%,#6366F1,55%,#0F172A)] bg-[length:200%_100%] bg-clip-text text-transparent",
                className
            )}
        >
            {children}
        </span>
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
