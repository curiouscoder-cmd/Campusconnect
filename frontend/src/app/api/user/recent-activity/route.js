import { createServerClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const supabase = createServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database configuration error" }, { status: 500 });
    }

    // Fetch bookings
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("id, created_at, mentor_id, status")
      .eq("student_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) throw error;

    // Get mentor names separately to avoid relationship issues
    const mentorIds = [...new Set(bookings.map(b => b.mentor_id))];
    const { data: mentors } = await supabase
      .from("mentors")
      .select("id, user_id")
      .in("id", mentorIds);

    const userIds = mentors?.map(m => m.user_id) || [];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", userIds);

    // Map mentor names
    const mentorMap = {};
    mentors?.forEach(m => {
      const profile = profiles?.find(p => p.id === m.user_id);
      mentorMap[m.id] = profile?.full_name || "Mentor";
    });

    const activity = bookings.map((booking) => ({
      id: booking.id,
      type: "booking",
      message: `Booked a session with ${mentorMap[booking.mentor_id] || "Mentor"}`,
      date: new Date(booking.created_at).toLocaleDateString(),
      meta: booking.created_at
    }));

    return NextResponse.json({ activity });
  } catch (error) {
    console.error("Error fetching activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}
