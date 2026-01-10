"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Users, Calendar, DollarSign, TrendingUp, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

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

                // Fetch Revenue from payments
                const { data: payments, error: paymentsError } = await supabase
                    .from("payments")
                    .select("amount")
                    .eq("status", "paid");

                // Fetch Users Count (Profiles)
                const { count: usersCount, error: usersError } = await supabase
                    .from("profiles")
                    .select("*", { count: "exact", head: true });

                const totalRevenue = payments?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;

                setStats({
                    mentors: mentorsCount || 0,
                    bookings: bookingsCount || 0,
                    revenue: totalRevenue,
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
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Dashboard Overview
                </h1>
                <p className="text-gray-500 mt-2">Welcome back, here&apos;s what&apos;s happening today.</p>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                <StatsCard
                    title="Total Mentors"
                    value={stats.mentors}
                    icon={Users}
                    trend="+12%"
                    color="blue"
                    variants={item}
                />
                <StatsCard
                    title="Total Bookings"
                    value={stats.bookings}
                    icon={Calendar}
                    trend="+5%"
                    color="purple"
                    variants={item}
                />
                <StatsCard
                    title="Total Revenue"
                    value={`₹${stats.revenue.toLocaleString()}`}
                    icon={DollarSign}
                    trend="+24%"
                    color="green"
                    variants={item}
                />
                <StatsCard
                    title="Registered Users"
                    value={stats.users}
                    icon={TrendingUp}
                    trend="+8%"
                    color="orange"
                    variants={item}
                />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity / Placeholder */}
                <Card className="bg-white border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-gray-900">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">New session booked</p>
                                        <p className="text-xs text-gray-500">Just now</p>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-gray-400" />
                                </div>
                            ))}
                            {stats.bookings === 0 && (
                                <p className="text-sm text-gray-500 text-center py-4">No bookings yet.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-white border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-gray-900">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                        <Link href="/admin/mentors" className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 cursor-pointer">
                            <span className="font-medium text-gray-900">Add New Mentor</span>
                            <ArrowUpRight className="w-4 h-4 text-gray-400" />
                        </Link>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 cursor-pointer">
                            <span className="font-medium text-gray-900">View Analytics Report</span>
                            <ArrowUpRight className="w-4 h-4 text-gray-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon: Icon, trend, color, variants }) {
    const colors = {
        blue: "text-blue-600 bg-blue-50",
        purple: "text-purple-600 bg-purple-50",
        green: "text-green-600 bg-green-50",
        orange: "text-orange-600 bg-orange-50",
    };

    return (
        <motion.div variants={variants}>
            <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-2 rounded-lg ${colors[color]}`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        {/* <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{trend}</span> */}
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">{title}</p>
                        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
