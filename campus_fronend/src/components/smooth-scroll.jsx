"use client";
import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            smoothWheel: true,
        });

        // Handle anchor links for smooth scrolling
        const handleAnchorClick = (e) => {
            const target = e.target.closest('a[href^="/#"]');
            if (target) {
                e.preventDefault();
                const id = target.getAttribute('href').replace('/#', '');
                const element = document.getElementById(id);
                if (element) {
                    lenis.scrollTo(element, { offset: -80 });
                }
            }
        };

        document.addEventListener('click', handleAnchorClick);

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            document.removeEventListener('click', handleAnchorClick);
            lenis.destroy();
        };
    }, []);

    return null;
}
