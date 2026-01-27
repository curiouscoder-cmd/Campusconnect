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

    // 1. Get user email from profile (Bookings are linked by email)
    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", userId)
      .single();

    if (!profile?.email) {
      return NextResponse.json({ activity: [] });
    }

    // 2. Fetch bookings using email
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("id, created_at, mentor_id, status, date, start_time, session_duration, session_price, meet_link, session_type")
      .eq("user_email", profile.email)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) throw error;

    // Get mentor names directly from mentors table
    const mentorIds = [...new Set(bookings.map(b => b.mentor_id))];
    const { data: mentors } = await supabase
      .from("mentors")
      .select("id, name, college, image")
      .in("id", mentorIds);

    // Map mentor details
    const mentorMap = {};
    const mentorCollegeMap = {};
    const mentorImageMap = {};

    mentors?.forEach(m => {
      mentorMap[m.id] = m.name || "Mentor";
      mentorCollegeMap[m.id] = m.college || "Unknown College";
      mentorImageMap[m.id] = m.image;
    });

    const activity = bookings.map((booking) => ({
      id: booking.id,
      type: "booking",
      message: `Booked a session with ${mentorMap[booking.mentor_id] || "Mentor"}`,
      date: new Date(booking.created_at).toLocaleDateString(),
      meta: booking.created_at,
      // Detailed fields for modal
      mentor_name: mentorMap[booking.mentor_id] || "Mentor",
      mentor_college: mentorCollegeMap[booking.mentor_id] || "Unknown College",
      mentor_image: mentorImageMap[booking.mentor_id],
      status: booking.status,
      slot_date: booking.date,
      slot_time: booking.start_time,
      duration: booking.session_duration,
      session_price: booking.session_price,
      meet_link: booking.meet_link,
      session_title: booking.session_type
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
