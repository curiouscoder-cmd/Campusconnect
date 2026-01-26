"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Users, Calendar, TrendingUp, ArrowUpRight, Mail, Clock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { GridPattern } from "@/components/ui/fancy/GridPattern";
import NumberTicker from "@/components/ui/fancy/NumberTicker";
import BlurFade from "@/components/ui/fancy/BlurFade";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        mentors: 0,
        bookings: 0,
        revenue: 0,
        users: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                // Fetch Mentors Count
                const { count: mentorsCount, error: mentorsError } = await supabase
                    .from("mentors")
                    .select("*", { count: "exact", head: true });

                // Fetch Bookings Count
                const { count: bookingsCount, error: bookingsError } = await supabase
                    .from("bookings")
                    .select("*", { count: "exact", head: true });

                // Fetch Users Count (Profiles)
                const { count: usersCount, error: usersError } = await supabase
                    .from("profiles")
                    .select("*", { count: "exact", head: true });

                setStats({
                    mentors: mentorsCount || 0,
                    bookings: bookingsCount || 0,
                    users: usersCount || 0
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="relative min-h-[calc(100vh-4rem)] p-4 md:p-8 space-y-8 overflow-hidden">
            <GridPattern width={40} height={40} className="absolute inset-0 -z-10 opacity-50" />

            <BlurFade delay={0.1} inView>
                <div className="flex flex-col gap-2 mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        Dashboard Overview
                    </h1>
                    <p className="text-gray-500">Welcome back, here&apos;s what&apos;s happening today.</p>
                </div>
            </BlurFade>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                <StatsCard
                    title="Total Mentors"
                    value={stats.mentors}
                    icon={Users}
                    trend="Active"
                    color="blue"
                    variants={item}
                    delay={0.2}
                />
                <StatsCard
                    title="Total Bookings"
                    value={stats.bookings}
                    icon={Calendar}
                    trend="This Month"
                    color="purple"
                    variants={item}
                    delay={0.3}

                />
                <StatsCard
                    title="Registered Users"
                    value={stats.users}
                    icon={TrendingUp}
                    trend="Growing"
                    color="green"
                    variants={item}
                    delay={0.4}
                />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <BlurFade delay={0.5} inView className="h-full">
                    <Card className="bg-white/80 backdrop-blur-md border-gray-200/50 shadow-xl overflow-hidden h-full">
                        <CardHeader className="border-b border-gray-100 bg-gray-50/30">
                            <CardTitle className="text-gray-900 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-indigo-500" /> Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-gray-100">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors cursor-pointer group">
                                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-gray-900">New session booked</p>
                                            <p className="text-xs text-gray-500 mt-0.5">A user scheduled a meeting with Dr. Smith</p>
                                        </div>
                                        <span className="text-xs font-mono text-gray-400">2m ago</span>
                                    </div>
                                ))}
                                {stats.bookings === 0 && (
                                    <p className="text-sm text-gray-500 text-center py-8">No recent activity.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </BlurFade>

                {/* Quick Actions */}
                <BlurFade delay={0.6} inView className="h-full">
                    <Card className="bg-white/80 backdrop-blur-md border-gray-200/50 shadow-xl overflow-hidden h-full">
                        <CardHeader className="border-b border-gray-100 bg-gray-50/30">
                            <CardTitle className="text-gray-900 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-amber-500" /> Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 grid gap-4">
                            <Link href="/admin/mentors" className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <span className="font-semibold text-gray-900">Add New Mentor</span>
                                </div>
                                <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                            </Link>

                            <Link href="/admin/emails" className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <span className="font-semibold text-gray-900">Email Marketing</span>
                                </div>
                                <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                            </Link>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200 opacity-75 cursor-not-allowed">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gray-200 text-gray-500">
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                    <span className="font-semibold text-gray-500">Analytics (Coming Soon)</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </BlurFade>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon: Icon, trend, color, variants, delay }) {
    const colors = {
        blue: "text-blue-600 bg-blue-50",
        purple: "text-purple-600 bg-purple-50",
        green: "text-green-600 bg-green-50",
        orange: "text-orange-600 bg-orange-50",
    };

    return (
        <BlurFade delay={delay} inView>
            <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-2 rounded-lg ${colors[color]} group-hover:scale-110 transition-transform`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        {/* <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{trend}</span> */}
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">{title}</p>
                        <h3 className="text-2xl font-bold text-gray-900">
                            <NumberTicker value={value} />
                        </h3>
                    </div>
                </CardContent>
            </Card>
        </BlurFade>
    );
}
