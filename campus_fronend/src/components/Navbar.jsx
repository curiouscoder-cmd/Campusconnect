"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={cn(
            "fixed top-0 z-50 w-full border-b transition-all duration-300",
            scrolled ? "bg-white/80 backdrop-blur-md border-border/40 py-2" : "bg-transparent border-transparent py-4"
        )}>
            <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    Campus Connect
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                        Contact
                    </Link>
                    <Link href="/#mentors" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                        Mentors
                    </Link>
                    <Link href="/#pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                        Pricing
                    </Link>
                    <Link href="/#reviews" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                        Reviews
                    </Link>
                    <Link href="/#faq" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                        FAQ
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="ghost" size="sm" className="hidden sm:inline-flex font-medium">
                            Log in
                        </Button>
                    </Link>
                    <Link href="/signup">
                        <Button size="sm" className="rounded-full px-5 shadow-sm font-medium">
                            Get Started
                        </Button>
                    </Link>

                    {/* Mobile Menu */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px]">
                            <SheetTitle className="text-left font-bold text-xl mb-6">Menu</SheetTitle>
                            <div className="flex flex-col gap-6 mt-4">
                                <SheetClose asChild>
                                    <Link href="/contact" className="text-lg font-medium">Contact</Link>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Link href="/#mentors" className="text-lg font-medium">Mentors</Link>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Link href="/#pricing" className="text-lg font-medium">Pricing</Link>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Link href="/login" className="text-lg font-medium">Log in</Link>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Link href="/signup" className="text-lg font-medium">Sign up</Link>
                                </SheetClose>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
