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
    PlusCircle,
    Menu,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ADMIN_EMAIL = "nityaprofessional6402@gmail.com";

export default function AdminLayout({ children }) {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login?redirect=/admin");
            } else if (user.email !== ADMIN_EMAIL) {
                // Simple email check for now. Ideally check role in DB.
                router.push("/");
            }
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-900">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user || user.email !== ADMIN_EMAIL) {
        return null; // Will redirect
    }

    const navItems = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/mentors", label: "Mentors", icon: Users },
        { href: "/admin/bookings", label: "Bookings", icon: Calendar },
        // { href: "/admin/settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex">
            {/* Mobile Sidebar Overlay */}
            {!isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(true)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col",
                    !isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <Link href="/" className="font-bold text-xl tracking-tight text-gray-900 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">C</span>
                        CampusConnect
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-primary/5 text-primary"
                                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 px-3 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                            {user.email[0].toUpperCase()}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium text-gray-900 truncate">Admin</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                        onClick={signOut}
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Top Header (Mobile only menu trigger) */}
                <header className="lg:hidden h-16 bg-white border-b border-gray-200 flex items-center px-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-gray-500"
                    >
                        {isSidebarOpen ? <Menu /> : <X />}
                    </Button>
                    <span className="ml-4 font-semibold text-gray-900">Admin Dashboard</span>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    );
}
