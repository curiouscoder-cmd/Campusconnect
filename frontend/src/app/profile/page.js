"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User, Mail, Phone, Edit2, LogOut, Check, Calendar, CreditCard, TrendingUp, Clock, AlertCircle } from "lucide-react";
import { GridPattern } from "@/components/ui/fancy/GridPattern";
import { GlassCard } from "@/components/ui/fancy/GlassCard";
import { SpotlightButton } from "@/components/ui/fancy/SpotlightButton";
import { AnimatePresence, motion } from "framer-motion";

import { BookingDetailsModal } from "@/components/profile/BookingDetailsModal";
import { PaymentDetailsModal } from "@/components/profile/PaymentDetailsModal";

export default function ProfilePage() {
    const { user, signOut, loading: authLoading } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        phone: "",
    });

    const [recentActivity, setRecentActivity] = useState([]);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
            return;
        }

        async function fetchData() {
            try {
                // Profile
                const { data: profileData, error: profileError } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();

                if (profileData) {
                    setProfile(profileData);
                    setFormData({
                        full_name: profileData.full_name || "",
                        phone: profileData.phone || "",
                    });
                }

                // Activity
                const activityRes = await fetch(`/api/user/recent-activity?userId=${user.id}`);
                const activityData = await activityRes.json();
                if (activityData.activity) setRecentActivity(activityData.activity);

                // Payments
                const paymentsRes = await fetch(`/api/user/payments?userId=${user.id}`);
                const paymentsData = await paymentsRes.json();
                if (paymentsData.payments) setPaymentHistory(paymentsData.payments);

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
                setDataLoading(false);
            }
        }

        if (user) {
            fetchData();
        }
    }, [user, authLoading, router]);

    async function handleSave() {
        setSaving(true);
        try {
            const { data, error } = await supabase
                .from("profiles")
                .update({
                    full_name: formData.full_name,
                    phone: formData.phone,
                })
                .eq("id", user.id)
                .select();

            if (error) throw error;

            setProfile({ ...profile, ...formData });
            setEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile: " + error.message);
        } finally {
            setSaving(false);
        }
    }

    const handleSignOut = async () => {
        await signOut();
        router.push("/");
    };

    const getInitials = (name) => {
        if (!name) return user?.email?.charAt(0).toUpperCase() || "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-slate-900">
                <Navbar className="z-50 relative" />
                <main className="flex-1 flex items-center justify-center relative z-10">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                </main>
                <GridPattern width={40} height={40} className="opacity-50 text-indigo-100" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-slate-900 relative overflow-hidden">
            <Navbar className="z-50 relative" />
            <GridPattern width={60} height={60} className="absolute inset-0 opacity-[0.4] text-indigo-200" />

            <main className="flex-1 container mx-auto px-4 py-12 max-w-7xl relative z-10 mt-6">
                <div className="flex flex-col gap-6">
                    {/* Top Row: Profile Card & Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Profile Card (Left) */}
                        <div className="lg:col-span-1">
                            <GlassCard className="h-full flex flex-col items-center text-center p-6 bg-white/80 border-indigo-50">
                                <div className="relative group mb-4 w-fit mx-auto">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                                    <div className="relative w-32 h-32 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-lg text-4xl font-bold tracking-wider text-indigo-600">
                                        {getInitials(profile?.full_name)}
                                    </div>
                                </div>

                                <h1 className="text-2xl font-bold text-slate-900">
                                    {profile?.full_name || "Welcome User"}
                                </h1>
                                <p className="text-slate-500 text-sm mt-1 mb-6 flex items-center justify-center gap-2">
                                    <Mail className="w-3 h-3" /> {user.email}
                                </p>

                                <div className="w-full mt-auto space-y-3">
                                    {!editing && (
                                        <SpotlightButton
                                            onClick={() => setEditing(true)}
                                            className="w-full bg-white text-indigo-600 border border-indigo-100 shadow-sm hover:shadow-md hover:bg-indigo-50"
                                        >
                                            <div className="flex items-center justify-center gap-2 font-medium">
                                                <Edit2 className="w-4 h-4" /> Edit Profile
                                            </div>
                                        </SpotlightButton>
                                    )}
                                    <SpotlightButton
                                        onClick={handleSignOut}
                                        className="w-full bg-white text-rose-500 border border-rose-100 shadow-sm hover:shadow-md hover:bg-rose-50"
                                    >
                                        <div className="flex items-center justify-center gap-2 font-medium">
                                            <LogOut className="w-4 h-4" /> Sign Out
                                        </div>
                                    </SpotlightButton>
                                </div>
                            </GlassCard>
                        </div>

                        {/* Bento Grid (Right) */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Profile Details Edit / View */}
                            <GlassCard className="bg-white/90">
                                <div className="flex items-center gap-2 mb-6 text-slate-900 font-bold border-b border-gray-100 pb-3">
                                    <User className="w-5 h-5 text-indigo-500" /> Profile Details
                                </div>

                                <AnimatePresence mode="wait">
                                    {editing ? (
                                        <motion.div
                                            key="editing"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="grid md:grid-cols-2 gap-6"
                                        >
                                            <div className="space-y-2">
                                                <Label className="text-slate-700 font-medium">Full Name</Label>
                                                <Input
                                                    value={formData.full_name}
                                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                                    className="bg-white border-gray-200 text-slate-900 focus:ring-indigo-500"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-slate-700 font-medium">Phone Number</Label>
                                                <Input
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="bg-white border-gray-200 text-slate-900 focus:ring-indigo-500"
                                                />
                                            </div>
                                            <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-50">
                                                <SpotlightButton onClick={handleSave} className="bg-slate-900 text-white hover:bg-slate-800 px-8">
                                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                                                </SpotlightButton>
                                                <button onClick={() => setEditing(false)} className="px-4 py-2 text-slate-500 hover:text-slate-700 font-medium">Cancel</button>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="viewing"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="grid md:grid-cols-2 gap-4"
                                        >
                                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</span>
                                                <p className="font-semibold text-slate-900 text-lg mt-1">{profile?.full_name || "Not set"}</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</span>
                                                <p className="font-semibold text-slate-900 text-lg mt-1">{user.email}</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</span>
                                                <p className="font-semibold text-slate-900 text-lg mt-1">{profile?.phone || "Not set"}</p>
                                            </div>
                                            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-between">
                                                <div>
                                                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Account Status</span>
                                                    <p className="font-bold text-indigo-700 text-lg mt-1">Active</p>
                                                </div>
                                                <Check className="w-6 h-6 text-indigo-500" />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </GlassCard>

                            {/* Recent Activity */}
                            <GlassCard className="bg-white/90">
                                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-3">
                                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                                        <TrendingUp className="w-5 h-5 text-emerald-500" /> Recent Activity
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium">Last 7 Days</span>
                                </div>

                                <div className="space-y-4">
                                    {recentActivity.length > 0 ? (
                                        recentActivity.map((activity) => (
                                            <motion.div
                                                key={activity.id}
                                                whileHover={{ scale: 1.01, backgroundColor: "#f9fafb" }}
                                                onClick={() => {
                                                    if (activity.type === 'booking') {
                                                        setSelectedBooking(activity);
                                                    }
                                                }}
                                                className={`flex items-start gap-4 p-3 rounded-lg transition-colors border border-transparent hover:border-gray-100 cursor-pointer`}
                                            >
                                                <div className={`p-2 rounded-full ${activity.type === 'booking' ? 'bg-blue-50 text-blue-500' : 'bg-purple-50 text-purple-500'}`}>
                                                    {activity.type === 'booking' ? <Calendar className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-slate-900">{activity.message}</p>
                                                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> {activity.date}
                                                    </p>
                                                </div>
                                                {activity.type === 'booking' && (
                                                    <div className="self-center">
                                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${activity.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                            {activity.status}
                                                        </span>
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6 text-slate-400 text-sm">
                                            No recent activity found.
                                        </div>
                                    )}
                                </div>
                            </GlassCard>
                            {/* Booking Details Modal */}
                            <AnimatePresence>
                                {selectedBooking && (
                                    <BookingDetailsModal
                                        booking={selectedBooking}
                                        onClose={() => setSelectedBooking(null)}
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Bottom Row: Payment History */}
                    <GlassCard className="bg-white/90">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2 text-slate-900 font-bold">
                                <CreditCard className="w-5 h-5 text-purple-500" /> Payment History
                            </div>
                            <button className="text-xs font-bold text-indigo-600 hover:underline">View All</button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                                    <tr>
                                        <th className="px-4 py-3 rounded-l-lg">Transaction ID</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Mentor</th>
                                        <th className="px-4 py-3">Amount</th>
                                        <th className="px-4 py-3 rounded-r-lg">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paymentHistory.length > 0 ? (
                                        paymentHistory.map((payment) => (
                                            <tr
                                                key={payment.id}
                                                className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                                                onClick={() => setSelectedPayment(payment)}
                                            >
                                                <td className="px-4 py-4 font-mono text-xs text-slate-500">#{payment.id.toString().slice(-6)}</td>
                                                <td className="px-4 py-4 text-slate-900 font-medium">{payment.date}</td>
                                                <td className="px-4 py-4 text-slate-600">{payment.mentor}</td>
                                                <td className="px-4 py-4 font-bold text-slate-900">{payment.amount}</td>
                                                <td className="px-4 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${payment.status === "Completed" || payment.status === "captured" ? "bg-emerald-100 text-emerald-700" :
                                                        payment.status === "Refunded" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700"
                                                        }`}>
                                                        {payment.status === "captured" ? "Completed" : payment.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-6 text-center text-slate-400 text-sm">
                                                No payment history available.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </GlassCard>
                </div>
            </main>
            <Footer className="relative z-10 border-t border-gray-100 bg-white text-slate-600" />

            {/* Payment Details Modal */}
            <AnimatePresence>
                {selectedPayment && (
                    <PaymentDetailsModal
                        payment={selectedPayment}
                        onClose={() => setSelectedPayment(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
