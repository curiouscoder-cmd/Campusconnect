"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Calendar,
    Clock,
    Plus,
    Trash2,
    Loader2,
    Users,
    CalendarDays,
    Video,
    AlertCircle,
} from "lucide-react";

export default function MentorDashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [mentor, setMentor] = useState(null);
    const [slots, setSlots] = useState([]);
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [newSlot, setNewSlot] = useState({
        date: "",
        start_time: "",
        end_time: "",
    });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
            return;
        }

        if (user) {
            fetchMentorProfile();
        }
    }, [user, authLoading, router]);

    async function fetchMentorProfile() {
        try {
            // Check if user is a mentor by their email
            const { data: mentorData, error } = await supabase
                .from("mentors")
                .select("*")
                .eq("email", user.email)
                .single();

            if (error || !mentorData) {
                // Not a mentor
                setMentor(null);
                setLoading(false);
                return;
            }

            setMentor(mentorData);

            // Fetch their availability slots
            await fetchSlots(mentorData.id);
            await fetchUpcomingBookings(mentorData.id);
        } catch (error) {
            console.error("Error fetching mentor:", error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchSlots(mentorId) {
        const today = new Date().toISOString().split("T")[0];
        const { data, error } = await supabase
            .from("availability")
            .select("*")
            .eq("mentor_id", mentorId)
            .gte("date", today)
            .order("date", { ascending: true })
            .order("start_time", { ascending: true });

        if (data) {
            setSlots(data);
        }
    }

    async function fetchUpcomingBookings(mentorId) {
        const { data, error } = await supabase
            .from("bookings")
            .select("*")
            .eq("mentor_id", mentorId)
            .eq("status", "confirmed")
            .order("created_at", { ascending: false })
            .limit(10);

        if (data) {
            setUpcomingBookings(data);
        }
    }

    async function handleAddSlot(e) {
        e.preventDefault();
        if (!mentor || !newSlot.date || !newSlot.start_time) return;

        setSaving(true);
        try {
            // Calculate end time (default 1 hour after start)
            const endTime = newSlot.end_time || calculateEndTime(newSlot.start_time);

            const { error } = await supabase.from("availability").insert({
                mentor_id: mentor.id,
                date: newSlot.date,
                start_time: newSlot.start_time,
                end_time: endTime,
                is_booked: false,
                is_reserved: false,
            });

            if (error) throw error;

            // Refresh slots
            await fetchSlots(mentor.id);
            setNewSlot({ date: "", start_time: "", end_time: "" });
        } catch (error) {
            console.error("Error adding slot:", error);
            alert("Failed to add slot: " + error.message);
        } finally {
            setSaving(false);
        }
    }

    async function handleDeleteSlot(slotId) {
        if (!confirm("Are you sure you want to delete this slot?")) return;

        try {
            const { error } = await supabase
                .from("availability")
                .delete()
                .eq("id", slotId);

            if (error) throw error;

            // Refresh slots
            await fetchSlots(mentor.id);
        } catch (error) {
            console.error("Error deleting slot:", error);
            alert("Failed to delete slot: " + error.message);
        }
    }

    function calculateEndTime(startTime) {
        const [hours, minutes] = startTime.split(":").map(Number);
        const endHours = (hours + 1) % 24;
        return `${endHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    }

    function formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
        });
    }

    function formatTime(timeStr) {
        const [hours, minutes] = timeStr.split(":");
        const hour = parseInt(hours);
        const period = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${period}`;
    }

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex flex-col font-sans">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </main>
                <Footer />
            </div>
        );
    }

    if (!mentor) {
        return (
            <div className="min-h-screen flex flex-col font-sans">
                <Navbar />
                <main className="flex-1 container mx-auto px-4 py-16 max-w-2xl mt-16">
                    <Card>
                        <CardContent className="py-12 text-center">
                            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Not a Mentor
                            </h2>
                            <p className="text-gray-500 mb-6">
                                This page is only for registered mentors. If you believe this is
                                an error, please contact support.
                            </p>
                            <Button onClick={() => router.push("/")}>Go to Home</Button>
                        </CardContent>
                    </Card>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col font-sans bg-gray-50">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl mt-16">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome, {mentor.name}!
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage your availability and view upcoming sessions.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <CalendarDays className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {slots.filter((s) => !s.is_booked).length}
                                </p>
                                <p className="text-sm text-gray-500">Available Slots</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                <Users className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {upcomingBookings.length}
                                </p>
                                <p className="text-sm text-gray-500">Total Bookings</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                                <Video className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                                    {mentor.meet_link ? "Configured" : "Not Set"}
                                </p>
                                <p className="text-sm text-gray-500">Meet Link</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Add Slot Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                Add Availability Slot
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddSlot} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="date">Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={newSlot.date}
                                        min={new Date().toISOString().split("T")[0]}
                                        onChange={(e) =>
                                            setNewSlot({ ...newSlot, date: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="start_time">Start Time</Label>
                                        <Input
                                            id="start_time"
                                            type="time"
                                            value={newSlot.start_time}
                                            onChange={(e) =>
                                                setNewSlot({ ...newSlot, start_time: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="end_time">End Time (Optional)</Label>
                                        <Input
                                            id="end_time"
                                            type="time"
                                            value={newSlot.end_time}
                                            onChange={(e) =>
                                                setNewSlot({ ...newSlot, end_time: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full" disabled={saving}>
                                    {saving ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Plus className="w-4 h-4 mr-2" />
                                    )}
                                    Add Slot
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Upcoming Slots */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Your Availability
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {slots.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>No slots added yet</p>
                                    <p className="text-sm">Add your first availability slot!</p>
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                    {slots.map((slot) => (
                                        <div
                                            key={slot.id}
                                            className={`flex items-center justify-between p-3 rounded-lg border ${slot.is_booked
                                                    ? "bg-green-50 border-green-200"
                                                    : "bg-gray-50 border-gray-200"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="text-center">
                                                    <p className="text-xs text-gray-500">
                                                        {formatDate(slot.date)}
                                                    </p>
                                                    <p className="font-medium text-sm">
                                                        {formatTime(slot.start_time)}
                                                    </p>
                                                </div>
                                                {slot.is_booked && (
                                                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                                        Booked
                                                    </span>
                                                )}
                                            </div>
                                            {!slot.is_booked && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteSlot(slot.id)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Bookings */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Recent Bookings
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {upcomingBookings.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>No bookings yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {upcomingBookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {booking.user_name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {booking.user_email}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {booking.session_type} •{" "}
                                                {new Date(booking.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {booking.meet_link && (
                                            <a
                                                href={booking.meet_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
                                            >
                                                Join Meet
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    );
}
