"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Search, Calendar, User, Clock, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GridPattern } from "@/components/ui/fancy/GridPattern";
import BlurFade from "@/components/ui/fancy/BlurFade";

export default function BookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const { data, error } = await supabase
                .from("bookings")
                .select(`
          *,
          mentors ( name, image, college )
        `)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setBookings(data || []);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredBookings = bookings.filter(booking =>
        booking.mentors?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.date.includes(searchTerm)
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'completed': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'cancelled': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-amber-50 text-amber-700 border-amber-100';
        }
    };

    return (
        <div className="relative min-h-[calc(100vh-4rem)] p-4 md:p-8 space-y-6">
            <GridPattern width={40} height={40} className="absolute inset-0 -z-10 opacity-50" />

            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Bookings
                </h1>
                <p className="text-gray-500">View and manage all session bookings in one place.</p>
            </div>

            <Card className="bg-white/80 backdrop-blur-xl border-gray-200/50 shadow-sm overflow-hidden ring-1 ring-gray-900/5">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search by mentor or date..."
                            className="pl-9 h-9 bg-white/50 border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500/10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                        {filteredBookings.length} Enteries
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 text-gray-500 text-[11px] uppercase font-semibold tracking-wider">
                            <tr>
                                <th className="px-5 py-3 border-b border-gray-100">Mentor</th>
                                <th className="px-5 py-3 border-b border-gray-100">User</th>
                                <th className="px-5 py-3 border-b border-gray-100">Schedule</th>
                                <th className="px-5 py-3 border-b border-gray-100">Type</th>
                                <th className="px-5 py-3 border-b border-gray-100">Status</th>
                                <th className="px-5 py-3 border-b border-gray-100 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex justify-center items-center gap-2 text-sm">
                                            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                            Loading...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 text-sm">
                                        {searchTerm ? "No bookings found matching your search." : "No bookings yet."}
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking, index) => (
                                    <tr key={booking.id} className="group hover:bg-gray-50/80 transition-all duration-200">
                                        <td className="px-5 py-3">
                                            <BlurFade delay={0.03 * index} inView>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 bg-cover bg-center border border-gray-100" style={{ backgroundImage: `url(${booking.mentors?.image})` }}></div>
                                                    <div>
                                                        <div className="font-medium text-gray-900 text-sm">{booking.mentors?.name}</div>
                                                        <div className="text-[10px] text-gray-500 uppercase tracking-wide">{booking.mentors?.college?.substring(0, 20)}...</div>
                                                    </div>
                                                </div>
                                            </BlurFade>
                                        </td>
                                        <td className="px-5 py-3">
                                            <BlurFade delay={0.03 * index + 0.05} inView>
                                                <div className="flex flex-col justify-center h-full">
                                                    <span className="text-sm text-gray-700 truncate max-w-[160px]" title={booking.user_email}>
                                                        {booking.user_email || "Anonymous"}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 font-mono mt-0.5">
                                                        ID: {booking.user_id?.substring(0, 6)}
                                                    </span>
                                                </div>
                                            </BlurFade>
                                        </td>
                                        <td className="px-5 py-3">
                                            <BlurFade delay={0.03 * index + 0.1} inView>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-sm text-gray-700 font-medium">{booking.date}</span>
                                                    <span className="text-xs text-gray-500">{booking.start_time}</span>
                                                </div>
                                            </BlurFade>
                                        </td>
                                        <td className="px-5 py-3">
                                            <BlurFade delay={0.03 * index + 0.15} inView>
                                                <Badge variant="outline" className="font-normal text-xs bg-gray-50/50">
                                                    {booking.session_type}
                                                </Badge>
                                            </BlurFade>
                                        </td>
                                        <td className="px-5 py-3">
                                            <BlurFade delay={0.03 * index + 0.2} inView>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${getStatusColor(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                            </BlurFade>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <BlurFade delay={0.03 * index + 0.25} inView>
                                                <span className="font-mono font-medium text-gray-900 text-sm">₹{booking.session_price}</span>
                                            </BlurFade>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
