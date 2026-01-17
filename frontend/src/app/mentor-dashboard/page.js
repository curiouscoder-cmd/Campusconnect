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
import { toast } from "sonner";
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
    Save,
    Check,
    Upload,
    User,
    FileText,
    Tags,
} from "lucide-react";

// Predefined time slots (30 min each, 9 AM to 10 PM)
const TIME_SLOTS = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
    "21:00", "21:30", "22:00"
];

export default function MentorDashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [mentor, setMentor] = useState(null);
    const [slots, setSlots] = useState([]);
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savingMeetLink, setSavingMeetLink] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
    const [meetLink, setMeetLink] = useState("");

    // Profile editing state
    const [bio, setBio] = useState("");
    const [expertise, setExpertise] = useState("");
    const [imagePreview, setImagePreview] = useState("");

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
            const { data: mentorData, error } = await supabase
                .from("mentors")
                .select("*")
                .eq("email", user.email)
                .single();

            if (error || !mentorData) {
                setMentor(null);
                setLoading(false);
                return;
            }

            setMentor(mentorData);
            setMeetLink(mentorData.meet_link || "");
            setBio(mentorData.bio || "");
            setExpertise(Array.isArray(mentorData.expertise) ? mentorData.expertise.join(", ") : mentorData.expertise || "");
            setImagePreview(mentorData.image || "");

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

    function toggleTimeSlot(time) {
        if (selectedTimeSlots.includes(time)) {
            setSelectedTimeSlots(selectedTimeSlots.filter((t) => t !== time));
        } else {
            setSelectedTimeSlots([...selectedTimeSlots, time]);
        }
    }

    function calculateEndTime(startTime) {
        const [hours, minutes] = startTime.split(":").map(Number);
        const totalMinutes = hours * 60 + minutes + 30;
        const endHours = Math.floor(totalMinutes / 60) % 24;
        const endMinutes = totalMinutes % 60;
        return `${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`;
    }

    async function handleAddSlots() {
        if (!mentor || !selectedDate || selectedTimeSlots.length === 0) {
            alert("Please select a date and at least one time slot");
            return;
        }

        setSaving(true);
        try {
            const slotsToInsert = selectedTimeSlots.map((time) => ({
                mentor_id: mentor.id,
                date: selectedDate,
                start_time: time,
                end_time: calculateEndTime(time),
                is_booked: false,
            }));

            const { error } = await supabase.from("availability").insert(slotsToInsert);

            if (error) throw error;

            await fetchSlots(mentor.id);
            setSelectedTimeSlots([]);
            alert(`${selectedTimeSlots.length} slots added successfully!`);
        } catch (error) {
            console.error("Error adding slots:", error);
            alert("Failed to add slots: " + error.message);
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

            await fetchSlots(mentor.id);
        } catch (error) {
            console.error("Error deleting slot:", error);
            alert("Failed to delete slot: " + error.message);
        }
    }

    async function handleSaveMeetLink() {
        if (!mentor) return;

        setSavingMeetLink(true);
        try {
            const { error } = await supabase
                .from("mentors")
                .update({ meet_link: meetLink })
                .eq("id", mentor.id);

            if (error) throw error;

            setMentor({ ...mentor, meet_link: meetLink });
            toast.success("Meet link saved successfully!");
        } catch (error) {
            console.error("Error saving meet link:", error);
            toast.error("Failed to save meet link: " + error.message);
        } finally {
            setSavingMeetLink(false);
        }
    }

    async function handleImageUpload(e) {
        const file = e.target.files?.[0];
        if (!file || !mentor) return;

        // Validate file
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be less than 5MB");
            return;
        }

        setUploadingImage(true);
        try {
            // Create unique filename
            const fileExt = file.name.split(".").pop();
            const fileName = `mentor-${mentor.id}-${Date.now()}.${fileExt}`;

            // Upload to Supabase storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from("mentor-images")
                .upload(fileName, file, { upsert: true });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from("mentor-images")
                .getPublicUrl(fileName);

            // Update mentor profile with new image URL
            const { error: updateError } = await supabase
                .from("mentors")
                .update({ image: publicUrl })
                .eq("id", mentor.id);

            if (updateError) throw updateError;

            setImagePreview(publicUrl);
            setMentor({ ...mentor, image: publicUrl });
            toast.success("Profile picture updated!");
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image: " + error.message);
        } finally {
            setUploadingImage(false);
        }
    }

    async function handleSaveProfile() {
        if (!mentor) return;

        setSavingProfile(true);
        try {
            // Parse expertise from comma-separated string to array
            const expertiseArray = expertise
                .split(",")
                .map((e) => e.trim())
                .filter((e) => e.length > 0);

            const { error } = await supabase
                .from("mentors")
                .update({
                    bio: bio,
                    expertise: expertiseArray,
                })
                .eq("id", mentor.id);

            if (error) throw error;

            setMentor({ ...mentor, bio, expertise: expertiseArray });
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error saving profile:", error);
            toast.error("Failed to save profile: " + error.message);
        } finally {
            setSavingProfile(false);
        }
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

    // Check if a slot is already added for the selected date
    function isSlotTaken(time) {
        return slots.some(
            (slot) => slot.date === selectedDate && slot.start_time === time
        );
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

                {/* Meet Link Card */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Video className="w-5 h-5" />
                            Your Google Meet Link
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-3">
                            <Input
                                type="url"
                                placeholder="https://meet.google.com/xxx-xxxx-xxx"
                                value={meetLink}
                                onChange={(e) => setMeetLink(e.target.value)}
                                className="flex-1"
                            />
                            <Button onClick={handleSaveMeetLink} disabled={savingMeetLink}>
                                {savingMeetLink ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4 mr-2" />
                                )}
                                Save
                            </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            This link will be shared with students who book sessions with you.
                        </p>
                    </CardContent>
                </Card>

                {/* Profile Settings Card */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Your Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Profile Picture */}
                        <div className="flex items-start gap-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-2 border-gray-200">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt={mentor.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User className="w-10 h-10 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                {uploadingImage && (
                                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <Label htmlFor="image-upload" className="text-sm font-medium">
                                    Profile Picture
                                </Label>
                                <p className="text-xs text-gray-500 mb-2">
                                    Upload a profile photo (max 5MB, JPG/PNG)
                                </p>
                                <label htmlFor="image-upload">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={uploadingImage}
                                        className="cursor-pointer"
                                        asChild
                                    >
                                        <span>
                                            <Upload className="w-4 h-4 mr-2" />
                                            {uploadingImage ? "Uploading..." : "Upload Photo"}
                                        </span>
                                    </Button>
                                </label>
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="space-y-2">
                            <Label htmlFor="bio" className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Bio
                            </Label>
                            <textarea
                                id="bio"
                                placeholder="Write a short bio about yourself, your interests, and what you can help students with..."
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                            />
                            <p className="text-xs text-gray-500">
                                This will be shown on your mentor profile card.
                            </p>
                        </div>

                        {/* Expertise */}
                        <div className="space-y-2">
                            <Label htmlFor="expertise" className="flex items-center gap-2">
                                <Tags className="w-4 h-4" />
                                Expertise Tags
                            </Label>
                            <Input
                                id="expertise"
                                placeholder="e.g., Placements, Campus Life, Coding, Academics"
                                value={expertise}
                                onChange={(e) => setExpertise(e.target.value)}
                            />
                            <p className="text-xs text-gray-500">
                                Enter your expertise areas separated by commas.
                            </p>
                            {expertise && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {expertise.split(",").map((tag, i) => (
                                        tag.trim() && (
                                            <span
                                                key={i}
                                                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                                            >
                                                {tag.trim()}
                                            </span>
                                        )
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Save Button */}
                        <Button onClick={handleSaveProfile} disabled={savingProfile} className="w-full sm:w-auto">
                            {savingProfile ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            Save Profile
                        </Button>
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Add Slots Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                Add Availability Slots
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Date Picker */}
                            <div className="space-y-2">
                                <Label htmlFor="date">Select Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={selectedDate}
                                    min={new Date().toISOString().split("T")[0]}
                                    onChange={(e) => {
                                        setSelectedDate(e.target.value);
                                        setSelectedTimeSlots([]);
                                    }}
                                />
                            </div>

                            {/* Time Slots Grid */}
                            {selectedDate && (
                                <div className="space-y-2">
                                    <Label>Select Time Slots (30 min each)</Label>
                                    <div className="grid grid-cols-4 gap-2 max-h-[250px] overflow-y-auto">
                                        {TIME_SLOTS.map((time) => {
                                            const isTaken = isSlotTaken(time);
                                            const isSelected = selectedTimeSlots.includes(time);

                                            return (
                                                <button
                                                    key={time}
                                                    type="button"
                                                    disabled={isTaken}
                                                    onClick={() => !isTaken && toggleTimeSlot(time)}
                                                    className={`
                                                        p-2 text-sm rounded-lg border transition-all
                                                        ${isTaken
                                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                                                            : isSelected
                                                                ? "bg-primary text-white border-primary"
                                                                : "bg-white text-gray-700 border-gray-200 hover:border-primary hover:bg-primary/5"
                                                        }
                                                    `}
                                                >
                                                    {formatTime(time)}
                                                    {isTaken && (
                                                        <span className="block text-[10px]">Added</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Selected: {selectedTimeSlots.length} slot(s)
                                    </p>
                                </div>
                            )}

                            <Button
                                onClick={handleAddSlots}
                                className="w-full"
                                disabled={saving || !selectedDate || selectedTimeSlots.length === 0}
                            >
                                {saving ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Plus className="w-4 h-4 mr-2" />
                                )}
                                Add {selectedTimeSlots.length} Slot(s)
                            </Button>
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
                                <div className="space-y-2 max-h-[350px] overflow-y-auto">
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
