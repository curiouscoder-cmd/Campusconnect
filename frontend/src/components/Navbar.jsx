"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut, Settings, LayoutDashboard, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";


const ADMIN_EMAIL = "nityaprofessional6402@gmail.com";

export function Navbar() {
    const router = useRouter();
    const { user, isAuthenticated, signOut, loading } = useAuth();

    const handleSignOut = async () => {
        await signOut();
        router.push("/");
        router.refresh();
    };

    // Get user's name from metadata or email
    const userName = user?.user_metadata?.full_name ||
        user?.user_metadata?.first_name ||
        user?.email?.split("@")[0] ||
        "User";

    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <header className="fixed top-0 z-50 w-full border-b bg-white border-gray-200">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <img
                        src="/favicon_light.ico"
                        alt="Campus Connect"
                        className="w-10 h-10 border-0 outline-none"
                    />
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
                    {!loading && (
                        <>
                            {isAuthenticated ? (
                                /* User is logged in - show profile dropdown */
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-slate-100 transition-colors">
                                            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-sm font-medium">
                                                {userInitial}
                                            </div>
                                            <span className="hidden sm:block text-sm font-medium text-slate-700">
                                                {userName}
                                            </span>
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <div className="px-2 py-1.5">
                                            <p className="text-sm font-medium">{userName}</p>
                                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                        </div>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile" className="w-full cursor-pointer">
                                                <User className="w-4 h-4 mr-2" />
                                                My Profile
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/mentor-dashboard" className="w-full cursor-pointer">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                Mentor Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                        {user?.email === ADMIN_EMAIL && (
                                            <>
                                                <DropdownMenuItem asChild>
                                                    <Link href="/admin" className="w-full cursor-pointer">
                                                        <LayoutDashboard className="w-4 h-4 mr-2" />
                                                        Admin Dashboard
                                                    </Link>
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Log out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                /* User is not logged in - show login/signup buttons */
                                <>
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
                                </>
                            )}
                        </>
                    )}

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
                                {isAuthenticated ? (
                                    <>
                                        <SheetClose asChild>
                                            <Link href="/profile" className="text-lg font-medium">My Profile</Link>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <button
                                                onClick={handleSignOut}
                                                className="text-lg font-medium text-red-600 text-left"
                                            >
                                                Log out
                                            </button>
                                        </SheetClose>
                                    </>
                                ) : (
                                    <>
                                        <SheetClose asChild>
                                            <Link href="/login" className="text-lg font-medium">Log in</Link>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <Link href="/signup" className="text-lg font-medium">Sign up</Link>
                                        </SheetClose>
                                    </>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
