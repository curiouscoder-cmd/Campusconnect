"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
    return (
        <header className="fixed top-0 z-50 w-full border-b bg-white border-gray-200">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold">
                        CC
                    </div>
                    <span className="font-semibold text-primary text-lg">Campus Connect</span>
                </Link>

                {/* Desktop Nav - Centered */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                        Home
                    </Link>
                    <Link href="/#mentors" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                        Students
                    </Link>
                    <Link href="/contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                        Contact
                    </Link>
                </nav>

                {/* Right side buttons */}
                <div className="flex items-center gap-3">
                    <Link href="/login">
                        <Button variant="ghost" size="sm" className="hidden sm:inline-flex font-medium text-foreground hover:text-slate-900 hover:bg-slate-100">
                            Log in
                        </Button>
                    </Link>
                    <Link href="/signup">
                        <Button size="sm" className="rounded-full px-5 font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors">
                            Join Now
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
                                    <Link href="/#mentors" className="text-lg font-medium">Students</Link>
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
