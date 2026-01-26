"use client";

import { cn } from "@/lib/utils";

export default function ShineBorder({
    borderRadius = 8,
    borderWidth = 1,
    duration = 14,
    color = "#000000",
    className,
    children,
}) {
    return (
        <div
            style={{
                "--border-radius": `${borderRadius}px`,
            }}
            className={cn(
                "relative min-h-[60px] w-full rounded-[--border-radius] bg-white text-black dark:bg-black dark:text-white p-px",
                className,
            )}
        >
            <div
                style={{
                    "--border-width": `${borderWidth}px`,
                    "--border-radius": `${borderRadius}px`,
                    "--duration": `${duration}s`,
                    "--mask-linear-gradient": `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
                    "--background-radial-gradient": `radial-gradient(transparent,transparent, ${Array.isArray(color) ? color.join(",") : color
                        }, transparent, transparent)`,
                }}
                className={`before:bg-shine-size pointer-events-none absolute inset-0 size-full rounded-[--border-radius] before:absolute before:inset-0 before:size-full before:p-[--border-width] before:will-change-[background-position] before:content-[""] before:![-webkit-mask-composite:xor] before:![mask-composite:exclude] before:[background-image:--background-radial-gradient] before:[background-size:300%_300%] before:[mask:--mask-linear-gradient] motion-safe:before:animate-shine`}
            ></div>
            <div className="size-full rounded-[--border-radius] bg-white p-4">
                {children}
            </div>
        </div>
    );
}
