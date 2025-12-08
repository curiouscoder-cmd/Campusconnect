"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose,
    SheetTitle,
} from "@/components/ui/sheet";

const navLinks = [
    { name: "Mentors", href: "#mentors" },
    { name: "Pricing", href: "#pricing" },
    { name: "Reviews", href: "#reviews" },
    { name: "FAQ", href: "#faq" },
];

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    Establish
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="font-medium text-muted-foreground hover:text-foreground">
                        Log in
                    </Button>
                    <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90 font-medium px-5 rounded-full">
                        Book a Session
                    </Button>
                </div>

                {/* Mobile Nav */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="shrink-0">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                            <div className="flex flex-col h-full py-6">
                                <SheetTitle className="text-left font-bold text-xl mb-6">Establish</SheetTitle>
                                <nav className="flex flex-col gap-6 flex-1">
                                    {navLinks.map((link) => (
                                        <SheetClose asChild key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="text-lg font-medium text-foreground/80 hover:text-foreground transition-colors"
                                            >
                                                {link.name}
                                            </Link>
                                        </SheetClose>
                                    ))}
                                </nav>
                                <div className="flex flex-col gap-3 mt-auto">
                                    <Button variant="outline" className="w-full rounded-full">
                                        Log in
                                    </Button>
                                    <Button className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full">
                                        Book a Session
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
