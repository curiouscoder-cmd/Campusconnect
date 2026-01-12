"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Search, Calendar, User, Clock, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
        booking.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (booking.date && booking.date.includes(searchTerm))
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
            case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Bookings
                </h1>
                <p className="text-gray-500 mt-1">View and manage session bookings</p>
            </div>

            <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search by mentor or date..."
                            className="pl-9 bg-gray-50 border-gray-200 text-gray-900 focus:border-primary/50 placeholder:text-gray-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-8 text-gray-500">Loading bookings...</div>
                        ) : filteredBookings.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                {searchTerm ? "No bookings found matching your search." : "No bookings yet."}
                            </div>
                        ) : (
                            <div className="rounded-lg border border-gray-200 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                        <tr>
                                            <th className="p-4">Mentor</th>
                                            <th className="p-4">User ID</th>
                                            <th className="p-4">Date & Time</th>
                                            <th className="p-4">Session Type</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 text-right">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredBookings.map((booking) => (
                                            <tr key={booking.id} className="bg-white hover:bg-gray-50 transition-colors">
                                                <td className="p-4 font-medium text-gray-900">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 bg-cover bg-center" style={{ backgroundImage: `url(${booking.mentors?.image})` }}></div>
                                                        {booking.mentors?.name || "Unknown Mentor"}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-gray-400 text-xs font-mono">
                                                    {booking.user_email || booking.user_id?.substring(0, 8) + "..."}
                                                </td>
                                                <td className="p-4 text-gray-600 text-sm">
                                                    <div className="flex flex-col">
                                                        <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {booking.date || "Not set"}</span>
                                                        <span className="flex items-center gap-1.5 text-gray-500"><Clock className="w-3 h-3" /> {booking.start_time || "Not set"}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-gray-600 text-sm">{booking.session_type}</td>
                                                <td className="p-4">
                                                    <Badge variant="outline" className={getStatusColor(booking.status)}>
                                                        {booking.status}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 text-right text-gray-900 font-medium">₹{booking.session_price || 0}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
