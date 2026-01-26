"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    Users,
    Calendar,
    Settings,
    LogOut,
    Menu,
    X,
    Home,
    ExternalLink,
    Gift,
    ChevronRight,
    ChevronLeft,
    ChevronDown,
    MoreHorizontal,
    Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ADMIN_EMAIL = "nityaprofessional6402@gmail.com";

export default function AdminLayout({ children }) {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Mobile toggle
    const [isCollapsed, setIsCollapsed] = useState(false); // Desktop toggle

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login?redirect=/admin");
            } else if (user.email !== ADMIN_EMAIL) {
                router.push("/");
            }
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-900">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!user || user.email !== ADMIN_EMAIL) {
        return null;
    }

    const navItems = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/mentors", label: "Mentors", icon: Users },
        { href: "/admin/bookings", label: "Bookings", icon: Calendar },
        { href: "/admin/emails", label: "Emails", icon: Mail },
        { href: "/admin/nsat-referrals", label: "NSAT Referrals", icon: Gift },
        // { href: "/admin/settings", label: "Settings", icon: Settings },
    ];

    const sidebarClass = cn(
        "fixed inset-y-0 left-0 z-50 bg-white text-gray-500 font-sans border-r border-gray-200 shadow-xl transition-all duration-300 ease-in-out flex flex-col",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        isCollapsed ? "lg:w-20" : "lg:w-64",
        "w-64" // Mobile is always wide
    );

    return (
        <div className="min-h-screen bg-gray-50/50 flex font-sans">
            <TooltipProvider>
                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside className={sidebarClass}>
                    {/* Brand */}
                    <div className={cn("h-16 flex items-center border-b border-gray-100 px-4 transition-all", isCollapsed ? "justify-center" : "justify-between")}>
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 group-hover:scale-105 transition-transform">
                                <span className="font-bold text-sm">C</span>
                            </div>
                            {!isCollapsed && (
                                <span className="font-bold text-lg tracking-tight text-gray-900 leading-tight">CampusConnect</span>
                            )}
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto custom-scrollbar">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Tooltip key={item.href} delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative overflow-hidden",
                                                isActive
                                                    ? "bg-indigo-50 text-indigo-600"
                                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50",
                                                isCollapsed && "justify-center px-2"
                                            )}
                                        >
                                            <Icon className={cn("w-5 h-5 transition-colors shrink-0", isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600")} />

                                            {!isCollapsed && <span>{item.label}</span>}

                                            {/* Tooltip for collapsed mode is handled by Tooltip component naturally, but we conditionally render text */}

                                            {isActive && !isCollapsed && (
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-l-full" />
                                            )}
                                        </Link>
                                    </TooltipTrigger>
                                    {isCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
                                </Tooltip>
                            );
                        })}
                    </nav>

                    {/* Toggle Button (Desktop only) */}
                    <div className="hidden lg:flex items-center justify-center p-4 border-t border-gray-100">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                        >
                            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                        </Button>
                    </div>

                    {/* Bottom Section */}
                    <div className="p-3 border-t border-gray-100 space-y-2">
                        {!isCollapsed ? (
                            <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                                <Avatar className="w-9 h-9 border border-gray-200">
                                    <AvatarImage src={`https://ui-avatars.com/api/?name=${user.email}&background=random`} />
                                    <AvatarFallback>AD</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 overflow-hidden min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">Administrator</p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={signOut}
                                    className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 ml-auto"
                                >
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex justify-center">
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <Avatar className="w-9 h-9 border border-gray-200 cursor-pointer hover:border-indigo-300 transition-colors" onClick={signOut}>
                                            <AvatarImage src={`https://ui-avatars.com/api/?name=${user.email}&background=random`} />
                                            <AvatarFallback>AD</AvatarFallback>
                                        </Avatar>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">Sign Out ({user.email})</TooltipContent>
                                </Tooltip>
                            </div>
                        )}
                    </div>
                </aside>
            </TooltipProvider>

            {/* Main Content */}
            <div className={cn("flex-1 flex flex-col min-h-0 overflow-hidden relative transition-all duration-300", isCollapsed ? "lg:ml-20" : "lg:ml-64")}>
                {/* Mobile Header */}
                <header className="lg:hidden h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="-ml-2 text-gray-600 hover:bg-gray-100"
                        >
                            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </Button>
                        <span className="font-bold text-lg text-gray-900">CampusConnect</span>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto scroll-smooth">
                    {children}
                </main>
            </div>
        </div>
    );
}
