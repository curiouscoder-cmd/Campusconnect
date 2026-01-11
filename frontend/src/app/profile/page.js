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
import { User, Mail, Phone, Calendar, Edit2, Save, Loader2, LogOut } from "lucide-react";

export default function ProfilePage() {
    const { user, signOut, loading: authLoading } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        phone: "",
    });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
            return;
        }

        if (user) {
            fetchProfile();
            fetchBookings();
        }
    }, [user, authLoading, router]);

    async function fetchProfile() {
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (data) {
                setProfile(data);
                setFormData({
                    full_name: data.full_name || "",
                    phone: data.phone || "",
                });
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchBookings() {
        try {
            const { data, error } = await supabase
                .from("bookings")
                .select("*, mentors(name, image)")
                .eq("user_email", user.email)
                .order("created_at", { ascending: false })
                .limit(5);

            if (data) {
                setBookings(data);
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    }

    async function handleSave() {
        setSaving(true);
        try {
            const { error } = await supabase
                .from("profiles")
                .upsert({
                    id: user.id,
                    email: user.email,
                    full_name: formData.full_name,
                    phone: formData.phone,
                    updated_at: new Date().toISOString(),
                });

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

    // Generate initials for avatar
    const getInitials = (name) => {
        if (!name) return user?.email?.charAt(0).toUpperCase() || "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    // Generate a consistent color based on user id
    const getAvatarColor = () => {
        const colors = [
            "from-purple-500 to-indigo-600",
            "from-pink-500 to-rose-600",
            "from-blue-500 to-cyan-600",
            "from-green-500 to-emerald-600",
            "from-orange-500 to-amber-600",
        ];
        const index = user?.id ? user.id.charCodeAt(0) % colors.length : 0;
        return colors[index];
    };

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

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl mt-16">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                    {/* Avatar */}
                    <div
                        className={`w-24 h-24 rounded-full bg-gradient-to-br ${getAvatarColor()} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}
                    >
                        {getInitials(profile?.full_name)}
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {profile?.full_name || "Welcome!"}
                        </h1>
                        <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2 mt-1">
                            <Mail className="w-4 h-4" />
                            {user.email}
                        </p>
                    </div>

                    <Button
                        onClick={handleSignOut}
                        variant="outline"
                        className="text-red-500 border-red-200 hover:bg-red-50"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Profile Info Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Profile Information</CardTitle>
                            {!editing && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditing(true)}
                                >
                                    <Edit2 className="w-4 h-4 mr-1" />
                                    Edit
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {editing ? (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="full_name">Full Name</Label>
                                        <Input
                                            id="full_name"
                                            value={formData.full_name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, full_name: e.target.value })
                                            }
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) =>
                                                setFormData({ ...formData, phone: e.target.value })
                                            }
                                            placeholder="+91 XXXXX XXXXX"
                                        />
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Button onClick={handleSave} disabled={saving}>
                                            {saving ? (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <Save className="w-4 h-4 mr-2" />
                                            )}
                                            Save
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setEditing(false);
                                                setFormData({
                                                    full_name: profile?.full_name || "",
                                                    phone: profile?.phone || "",
                                                });
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <User className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Full Name</p>
                                            <p className="font-medium">
                                                {profile?.full_name || "Not set"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Mail className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Email</p>
                                            <p className="font-medium">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Phone className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Phone</p>
                                            <p className="font-medium">
                                                {profile?.phone || "Not set"}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Bookings Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Recent Sessions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {bookings.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>No sessions booked yet</p>
                                    <Button
                                        variant="link"
                                        onClick={() => router.push("/")}
                                        className="mt-2"
                                    >
                                        Browse Mentors
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {bookings.map((booking) => (
                                        <div
                                            key={booking.id}
                                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                        >
                                            {booking.mentors?.image ? (
                                                <img
                                                    src={booking.mentors.image}
                                                    alt={booking.mentors.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                                                    {booking.mentors?.name?.charAt(0) || "M"}
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">
                                                    {booking.mentors?.name || "Mentor"}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {booking.session_type} •{" "}
                                                    {new Date(booking.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${booking.status === "confirmed"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-600"
                                                    }`}
                                            >
                                                {booking.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
