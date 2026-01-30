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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    Repeat,
    CalendarRange,
    Sun,
    Sunset,
    Moon,
    Share2,
    Copy,
    MessageCircle,
    ExternalLink,
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

    // Bulk schedule state
    const [selectedWeekdays, setSelectedWeekdays] = useState([]);
    const [bulkWeeks, setBulkWeeks] = useState(2);
    const [bulkTimeSlots, setBulkTimeSlots] = useState([]);
    const [savingBulk, setSavingBulk] = useState(false);
    const [useCustomRange, setUseCustomRange] = useState(false);
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");

    // Multi-select deletion state
    const [selectedSlotsToDelete, setSelectedSlotsToDelete] = useState([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);

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
        // Use local date instead of UTC
        const now = new Date();
        const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

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
            toast.error("Please select a date and at least one time slot");
            return;
        }

        setSaving(true);
        try {
            // Fetch fresh data from database to prevent duplicates (don't rely on stale state)
            const { data: freshSlots, error: fetchError } = await supabase
                .from("availability")
                .select("date, start_time")
                .eq("mentor_id", mentor.id)
                .eq("date", selectedDate);

            if (fetchError) throw fetchError;

            // Normalize time format - database might store "11:00:00" but we compare with "11:00"
            const normalizeTime = (time) => {
                if (!time) return '';
                // Extract just HH:MM (first 5 characters)
                return time.substring(0, 5);
            };

            const existingSlotKeys = new Set(
                (freshSlots || []).map(s => `${s.date}-${normalizeTime(s.start_time)}`)
            );

            console.log("Existing slots:", existingSlotKeys);
            console.log("Trying to add:", selectedTimeSlots.map(t => `${selectedDate}-${t}`));

            const slotsToInsert = selectedTimeSlots
                .filter(time => !existingSlotKeys.has(`${selectedDate}-${time}`))
                .map((time) => ({
                    mentor_id: mentor.id,
                    date: selectedDate,
                    start_time: time,
                    end_time: calculateEndTime(time),
                    is_booked: false,
                }));

            if (slotsToInsert.length === 0) {
                toast.info("All selected slots already exist!");
                setSaving(false);
                return;
            }

            const { error } = await supabase
                .from("availability")
                .upsert(slotsToInsert, {
                    onConflict: 'mentor_id,date,start_time',
                    ignoreDuplicates: true
                });

            if (error) throw error;

            await fetchSlots(mentor.id);
            setSelectedTimeSlots([]);

            const skipped = selectedTimeSlots.length - slotsToInsert.length;
            if (skipped > 0) {
                toast.success(`${slotsToInsert.length} slots added! (${skipped} duplicates skipped)`);
            } else {
                toast.success(`${slotsToInsert.length} slots added successfully!`);
            }
        } catch (error) {
            console.error("Error adding slots:", error);
            toast.error("Failed to add slots: " + error.message);
        } finally {
            setSaving(false);
        }
    }


    // Bulk schedule functions
    const WEEKDAYS = [
        { id: 0, name: "Sun", fullName: "Sunday" },
        { id: 1, name: "Mon", fullName: "Monday" },
        { id: 2, name: "Tue", fullName: "Tuesday" },
        { id: 3, name: "Wed", fullName: "Wednesday" },
        { id: 4, name: "Thu", fullName: "Thursday" },
        { id: 5, name: "Fri", fullName: "Friday" },
        { id: 6, name: "Sat", fullName: "Saturday" },
    ];

    const TIME_PRESETS = {
        morning: TIME_SLOTS.filter(t => {
            const hour = parseInt(t.split(":")[0]);
            return hour >= 9 && hour < 12;
        }),
        afternoon: TIME_SLOTS.filter(t => {
            const hour = parseInt(t.split(":")[0]);
            return hour >= 12 && hour < 17;
        }),
        evening: TIME_SLOTS.filter(t => {
            const hour = parseInt(t.split(":")[0]);
            return hour >= 17 && hour <= 22;
        }),
        all: TIME_SLOTS,
    };

    function toggleWeekday(dayId) {
        if (selectedWeekdays.includes(dayId)) {
            setSelectedWeekdays(selectedWeekdays.filter(d => d !== dayId));
        } else {
            setSelectedWeekdays([...selectedWeekdays, dayId]);
        }
    }

    function toggleBulkTimeSlot(time) {
        if (bulkTimeSlots.includes(time)) {
            setBulkTimeSlots(bulkTimeSlots.filter(t => t !== time));
        } else {
            setBulkTimeSlots([...bulkTimeSlots, time]);
        }
    }

    function applyTimePreset(preset) {
        const presetSlots = TIME_PRESETS[preset];
        // Toggle: if all preset slots are selected, deselect them; otherwise select all
        const allSelected = presetSlots.every(t => bulkTimeSlots.includes(t));
        if (allSelected) {
            setBulkTimeSlots(bulkTimeSlots.filter(t => !presetSlots.includes(t)));
        } else {
            const newSlots = [...new Set([...bulkTimeSlots, ...presetSlots])];
            setBulkTimeSlots(newSlots);
        }
    }

    function getDatesBetween(startDate, endDate, weekdays) {
        const dates = [];
        const current = new Date(startDate);
        const end = new Date(endDate);

        while (current <= end) {
            if (weekdays.includes(current.getDay())) {
                // Use local timezone date formatting instead of toISOString (which uses UTC)
                const year = current.getFullYear();
                const month = String(current.getMonth() + 1).padStart(2, '0');
                const day = String(current.getDate()).padStart(2, '0');
                dates.push(`${year}-${month}-${day}`);
            }
            current.setDate(current.getDate() + 1);
        }
        return dates;
    }

    function getBulkSlotsCount() {
        if (selectedWeekdays.length === 0 || bulkTimeSlots.length === 0) return 0;

        let startDate, endDate;
        if (useCustomRange) {
            if (!customStartDate || !customEndDate) return 0;
            startDate = new Date(customStartDate);
            endDate = new Date(customEndDate);
        } else {
            startDate = new Date();
            endDate = new Date();
            endDate.setDate(startDate.getDate() + (bulkWeeks * 7));
        }

        const dates = getDatesBetween(startDate, endDate, selectedWeekdays);
        return dates.length * bulkTimeSlots.length;
    }

    function getDateRangeText() {
        if (useCustomRange) {
            if (!customStartDate || !customEndDate) return "";
            const start = new Date(customStartDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
            const end = new Date(customEndDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
            return `${start} - ${end}`;
        }
        const today = new Date();
        const endDate = new Date();
        endDate.setDate(today.getDate() + (bulkWeeks * 7));
        return `${bulkWeeks} week(s)`;
    }

    async function handleBulkAddSlots() {
        if (!mentor || selectedWeekdays.length === 0 || bulkTimeSlots.length === 0) {
            toast.error("Please select at least one day and time slot");
            return;
        }

        if (useCustomRange && (!customStartDate || !customEndDate)) {
            toast.error("Please select start and end dates");
            return;
        }

        setSavingBulk(true);
        try {
            let startDate, endDate;
            if (useCustomRange) {
                startDate = new Date(customStartDate);
                endDate = new Date(customEndDate);
            } else {
                startDate = new Date();
                endDate = new Date();
                endDate.setDate(startDate.getDate() + (bulkWeeks * 7));
            }

            const dates = getDatesBetween(startDate, endDate, selectedWeekdays);

            // Fetch fresh data from database to prevent duplicates (don't rely on stale state)
            const { data: freshSlots, error: fetchError } = await supabase
                .from("availability")
                .select("date, start_time")
                .eq("mentor_id", mentor.id)
                .gte("date", dates[0])
                .lte("date", dates[dates.length - 1]);

            if (fetchError) throw fetchError;

            // Normalize time format - database might store "11:00:00" but we compare with "11:00"
            const normalizeTime = (time) => {
                if (!time) return '';
                // Extract just HH:MM (first 5 characters)
                return time.substring(0, 5);
            };

            const existingSlotKeys = new Set(
                (freshSlots || []).map(s => `${s.date}-${normalizeTime(s.start_time)}`)
            );

            const slotsToInsert = [];
            for (const date of dates) {
                for (const time of bulkTimeSlots) {
                    const key = `${date}-${time}`;
                    if (!existingSlotKeys.has(key)) {
                        slotsToInsert.push({
                            mentor_id: mentor.id,
                            date: date,
                            start_time: time,
                            end_time: calculateEndTime(time),
                            is_booked: false,
                        });
                    }
                }
            }


            if (slotsToInsert.length === 0) {
                toast.info("All selected slots already exist!");
                setSavingBulk(false);
                return;
            }

            const { error } = await supabase
                .from("availability")
                .upsert(slotsToInsert, {
                    onConflict: 'mentor_id,date,start_time',
                    ignoreDuplicates: true
                });

            if (error) throw error;

            await fetchSlots(mentor.id);
            setSelectedWeekdays([]);
            setBulkTimeSlots([]);
            setCustomStartDate("");
            setCustomEndDate("");

            const totalPossible = dates.length * bulkTimeSlots.length;
            const skipped = totalPossible - slotsToInsert.length;
            if (skipped > 0) {
                toast.success(`${slotsToInsert.length} slots added! (${skipped} duplicates skipped)`);
            } else {
                toast.success(`${slotsToInsert.length} slots added successfully!`);
            }
        } catch (error) {
            console.error("Error adding bulk slots:", error);
            toast.error("Failed to add slots: " + error.message);
        } finally {
            setSavingBulk(false);
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
            toast.success("Slot deleted");
        } catch (error) {
            console.error("Error deleting slot:", error);
            toast.error("Failed to delete slot: " + error.message);
        }
    }

    function toggleSlotSelection(slotId) {
        setSelectedSlotsToDelete(prev =>
            prev.includes(slotId)
                ? prev.filter(id => id !== slotId)
                : [...prev, slotId]
        );
    }

    function toggleSelectAll() {
        if (selectedSlotsToDelete.length === slots.length) {
            setSelectedSlotsToDelete([]);
        } else {
            setSelectedSlotsToDelete(slots.map(s => s.id));
        }
    }

    async function handleDeleteSelectedSlots() {
        if (selectedSlotsToDelete.length === 0) return;
        if (!confirm(`Are you sure you want to delete ${selectedSlotsToDelete.length} slot(s)?`)) return;

        try {
            const { error } = await supabase
                .from("availability")
                .delete()
                .in("id", selectedSlotsToDelete);

            if (error) throw error;

            await fetchSlots(mentor.id);
            setSelectedSlotsToDelete([]);
            setIsSelectionMode(false);
            toast.success(`${selectedSlotsToDelete.length} slot(s) deleted!`);
        } catch (error) {
            console.error("Error deleting slots:", error);
            toast.error("Failed to delete slots: " + error.message);
        }
    }

    function cancelSelection() {
        setSelectedSlotsToDelete([]);
        setIsSelectionMode(false);
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
            // Use API route to upload image (bypasses storage permissions)
            const formData = new FormData();
            formData.append("file", file);
            formData.append("mentorId", mentor.id);

            const response = await fetch("/api/mentor/upload-image", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Upload failed");
            }

            setImagePreview(result.imageUrl);
            setMentor({ ...mentor, image: result.imageUrl });
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

    // Check if a time slot has already passed (for today)
    function isSlotPast(time) {
        const today = new Date().toISOString().split("T")[0];
        if (selectedDate !== today) return false;

        const now = new Date();
        const [hours, minutes] = time.split(":").map(Number);
        const slotTime = new Date();
        slotTime.setHours(hours, minutes, 0, 0);

        return slotTime <= now;
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
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Welcome, {mentor.name}!
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Manage your availability and view upcoming sessions.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => {
                                const collegeName = mentor.college || 'Newton School of Technology';
                                const firstName = mentor.name?.split(' ')[0] || 'a student';
                                const profileUrl = `https://campus-connect.co.in/mentor/${mentor.id}`;
                                const message = `\u{1F914} Thinking about ${collegeName}?

\u{1F393} Before you decide, talk to someone who's actually studying here.
I'm ${firstName}, a current student, and I share honest insights about academics, campus life, hostels, faculty, and placements.

\u{1F4DE} You can book a short 1:1 call with me here:
\u{1F449} ${profileUrl}`;
                                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
                            }}
                        >
                            <Share2 className="w-4 h-4 mr-1.5" />
                            Share Profile
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                navigator.clipboard.writeText(`https://campus-connect.co.in/mentor/${mentor.id}`);
                                toast.success("Link copied!");
                            }}
                        >
                            <Copy className="w-4 h-4" />
                        </Button>
                    </div>
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
                    {/* Add Slots Form with Tabs */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                Add Availability Slots
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Tabs defaultValue="single" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-4">
                                    <TabsTrigger value="single" className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        Single Day
                                    </TabsTrigger>
                                    <TabsTrigger value="bulk" className="flex items-center gap-1.5">
                                        <Repeat className="w-4 h-4" />
                                        Bulk Schedule
                                    </TabsTrigger>
                                </TabsList>

                                {/* Single Day Tab */}
                                <TabsContent value="single" className="space-y-4">
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
                                            <div className="grid grid-cols-4 gap-2 max-h-[200px] overflow-y-auto">
                                                {TIME_SLOTS.map((time) => {
                                                    const isTaken = isSlotTaken(time);
                                                    const isPast = isSlotPast(time);
                                                    const isDisabled = isTaken || isPast;
                                                    const isSelected = selectedTimeSlots.includes(time);

                                                    return (
                                                        <button
                                                            key={time}
                                                            type="button"
                                                            disabled={isDisabled}
                                                            onClick={() => !isDisabled && toggleTimeSlot(time)}
                                                            className={`
                                                                p-2 text-sm rounded-lg border transition-all
                                                                ${isDisabled
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
                                                            {isPast && !isTaken && (
                                                                <span className="block text-[10px]">Past</span>
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
                                </TabsContent>

                                {/* Bulk Schedule Tab */}
                                <TabsContent value="bulk" className="space-y-4">
                                    {/* Weekday Selection */}
                                    <div className="space-y-2">
                                        <Label>Select Days of Week</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {WEEKDAYS.map((day) => (
                                                <button
                                                    key={day.id}
                                                    type="button"
                                                    onClick={() => toggleWeekday(day.id)}
                                                    className={`
                                                        px-3 py-2 text-sm font-medium rounded-lg border transition-all
                                                        ${selectedWeekdays.includes(day.id)
                                                            ? "bg-primary text-white border-primary"
                                                            : "bg-white text-gray-700 border-gray-200 hover:border-primary hover:bg-primary/5"
                                                        }
                                                    `}
                                                >
                                                    {day.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Duration Selection */}
                                    <div className="space-y-2">
                                        <Label>Duration</Label>
                                        <div className="flex gap-2 flex-wrap">
                                            {[1, 2, 3, 4].map((weeks) => (
                                                <button
                                                    key={weeks}
                                                    type="button"
                                                    onClick={() => {
                                                        setBulkWeeks(weeks);
                                                        setUseCustomRange(false);
                                                    }}
                                                    className={`
                                                        px-3 py-2 text-sm font-medium rounded-lg border transition-all
                                                        ${!useCustomRange && bulkWeeks === weeks
                                                            ? "bg-blue-600 text-white border-blue-600"
                                                            : "bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50"
                                                        }
                                                    `}
                                                >
                                                    {weeks}w
                                                </button>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => setUseCustomRange(!useCustomRange)}
                                                className={`
                                                    px-3 py-2 text-sm font-medium rounded-lg border transition-all flex items-center gap-1.5
                                                    ${useCustomRange
                                                        ? "bg-purple-600 text-white border-purple-600"
                                                        : "bg-white text-gray-700 border-gray-200 hover:border-purple-400 hover:bg-purple-50"
                                                    }
                                                `}
                                            >
                                                <CalendarRange className="w-4 h-4" />
                                                Custom
                                            </button>
                                        </div>

                                        {/* Custom Date Range Pickers */}
                                        {useCustomRange && (
                                            <div className="flex gap-2 mt-2">
                                                <div className="flex-1">
                                                    <Label className="text-xs text-gray-500">Start Date</Label>
                                                    <Input
                                                        type="date"
                                                        value={customStartDate}
                                                        min={new Date().toISOString().split("T")[0]}
                                                        onChange={(e) => setCustomStartDate(e.target.value)}
                                                        className="mt-1"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <Label className="text-xs text-gray-500">End Date</Label>
                                                    <Input
                                                        type="date"
                                                        value={customEndDate}
                                                        min={customStartDate || new Date().toISOString().split("T")[0]}
                                                        onChange={(e) => setCustomEndDate(e.target.value)}
                                                        className="mt-1"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Quick Time Presets */}
                                    <div className="space-y-2">
                                        <Label>Quick Select</Label>
                                        <div className="flex gap-2 flex-wrap">
                                            <button
                                                type="button"
                                                onClick={() => applyTimePreset("morning")}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${TIME_PRESETS.morning.every(t => bulkTimeSlots.includes(t))
                                                    ? "bg-amber-100 text-amber-800 border-amber-300"
                                                    : "bg-white text-gray-600 border-gray-200 hover:bg-amber-50"
                                                    }`}
                                            >
                                                <Sun className="w-3 h-3" />
                                                Morning
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => applyTimePreset("afternoon")}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${TIME_PRESETS.afternoon.every(t => bulkTimeSlots.includes(t))
                                                    ? "bg-orange-100 text-orange-800 border-orange-300"
                                                    : "bg-white text-gray-600 border-gray-200 hover:bg-orange-50"
                                                    }`}
                                            >
                                                <Sunset className="w-3 h-3" />
                                                Afternoon
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => applyTimePreset("evening")}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${TIME_PRESETS.evening.every(t => bulkTimeSlots.includes(t))
                                                    ? "bg-indigo-100 text-indigo-800 border-indigo-300"
                                                    : "bg-white text-gray-600 border-gray-200 hover:bg-indigo-50"
                                                    }`}
                                            >
                                                <Moon className="w-3 h-3" />
                                                Evening
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => applyTimePreset("all")}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${TIME_PRESETS.all.every(t => bulkTimeSlots.includes(t))
                                                    ? "bg-green-100 text-green-800 border-green-300"
                                                    : "bg-white text-gray-600 border-gray-200 hover:bg-green-50"
                                                    }`}
                                            >
                                                <CalendarRange className="w-3 h-3" />
                                                All Day
                                            </button>
                                        </div>
                                    </div>

                                    {/* Time Slots Grid for Bulk */}
                                    <div className="space-y-2">
                                        <Label>Or select individual slots</Label>
                                        <div className="grid grid-cols-4 gap-1.5 max-h-[150px] overflow-y-auto">
                                            {TIME_SLOTS.map((time) => {
                                                const isSelected = bulkTimeSlots.includes(time);
                                                return (
                                                    <button
                                                        key={time}
                                                        type="button"
                                                        onClick={() => toggleBulkTimeSlot(time)}
                                                        className={`
                                                            p-1.5 text-xs rounded-md border transition-all
                                                            ${isSelected
                                                                ? "bg-primary text-white border-primary"
                                                                : "bg-white text-gray-700 border-gray-200 hover:border-primary hover:bg-primary/5"
                                                            }
                                                        `}
                                                    >
                                                        {formatTime(time)}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Preview */}
                                    {(selectedWeekdays.length > 0 || bulkTimeSlots.length > 0) && (
                                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                            <p className="text-sm text-blue-800">
                                                <span className="font-semibold">{getBulkSlotsCount()}</span> slots will be created
                                                {selectedWeekdays.length > 0 && bulkTimeSlots.length > 0 && (
                                                    <span className="block text-xs text-blue-600 mt-1">
                                                        {selectedWeekdays.map(d => WEEKDAYS.find(w => w.id === d)?.name).join(", ")}
                                                        {" × "}{bulkTimeSlots.length} time slots × {getDateRangeText()}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    )}

                                    <Button
                                        onClick={handleBulkAddSlots}
                                        className="w-full"
                                        disabled={savingBulk || selectedWeekdays.length === 0 || bulkTimeSlots.length === 0}
                                    >
                                        {savingBulk ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <Repeat className="w-4 h-4 mr-2" />
                                        )}
                                        Add {getBulkSlotsCount()} Bulk Slots
                                    </Button>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    {/* Upcoming Slots */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Your Availability
                                <span className="text-sm font-normal text-gray-500">({slots.length} slots)</span>
                            </CardTitle>
                            {slots.length > 0 && (
                                <div className="flex gap-2">
                                    {!isSelectionMode ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setIsSelectionMode(true)}
                                            className="text-blue-600 border-blue-300 hover:bg-blue-50"
                                        >
                                            <Check className="w-3 h-3 mr-1" />
                                            Select
                                        </Button>
                                    ) : (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={toggleSelectAll}
                                                className="text-gray-600"
                                            >
                                                {selectedSlotsToDelete.length === slots.length ? "Deselect All" : "Select All"}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={cancelSelection}
                                                className="text-gray-600"
                                            >
                                                Cancel
                                            </Button>
                                            {selectedSlotsToDelete.length > 0 && (
                                                <Button
                                                    size="sm"
                                                    onClick={handleDeleteSelectedSlots}
                                                    className="bg-red-600 hover:bg-red-700 text-white"
                                                >
                                                    <Trash2 className="w-3 h-3 mr-1" />
                                                    Delete ({selectedSlotsToDelete.length})
                                                </Button>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                            {slots.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>No slots added yet</p>
                                    <p className="text-sm">Add your first availability slot!</p>
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                                    {slots.map((slot) => (
                                        <div
                                            key={slot.id}
                                            onClick={() => isSelectionMode && !slot.is_booked && toggleSlotSelection(slot.id)}
                                            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${slot.is_booked
                                                ? "bg-green-50 border-green-200"
                                                : selectedSlotsToDelete.includes(slot.id)
                                                    ? "bg-blue-50 border-blue-400 ring-2 ring-blue-200"
                                                    : "bg-gray-50 border-gray-200"
                                                } ${isSelectionMode && !slot.is_booked ? "cursor-pointer hover:border-blue-300" : ""}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {isSelectionMode && !slot.is_booked && (
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedSlotsToDelete.includes(slot.id)}
                                                        onChange={() => toggleSlotSelection(slot.id)}
                                                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                )}
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
                                            {!slot.is_booked && !isSelectionMode && (
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
        </div >
    );
}
