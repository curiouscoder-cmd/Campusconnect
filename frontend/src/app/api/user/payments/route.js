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

    // 1. Get user email from profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", userId)
      .single();

    if (!profile?.email) {
      return NextResponse.json({ payments: [] });
    }

    // 2. Fetch bookings as payments proxy (since payments table might not be linked to user directly)
    const { data: bookingsProxy, error: bookingError } = await supabase
      .from("bookings")
      .select("id, created_at, session_price, status, mentor_id, date, start_time, session_duration, session_type, meet_link")
      .eq("user_email", profile.email)
      .eq("status", "confirmed")
      .order("created_at", { ascending: false });

    if (bookingError) {
      console.error("Error fetching bookings proxy:", bookingError);
      return NextResponse.json({ payments: [] });
    }

    // Get mentor details directly from mentors table
    const mentorIds = [...new Set(bookingsProxy.map(b => b.mentor_id))];
    const { data: mentors } = await supabase
      .from("mentors")
      .select("id, name, college, image")
      .in("id", mentorIds);

    const mentorMap = {};
    const mentorCollegeMap = {};
    const mentorImageMap = {};

    mentors?.forEach(m => {
      mentorMap[m.id] = m.name || "Mentor";
      mentorCollegeMap[m.id] = m.college || "Unknown College";
      mentorImageMap[m.id] = m.image;
    });

    const transformedPayments = bookingsProxy.map(b => ({
      id: b.id,
      date: new Date(b.created_at).toLocaleDateString(),
      amount: b.session_price ? `₹${b.session_price}` : "₹500",
      status: "Completed",
      mentor: mentorMap[b.mentor_id] || "Mentor",
      // Detailed fields for modal
      mentor_id: b.mentor_id,
      mentor_name: mentorMap[b.mentor_id] || "Mentor",
      mentor_college: mentorCollegeMap[b.mentor_id],
      mentor_image: mentorImageMap[b.mentor_id],
      slot_date: b.date,
      slot_time: b.start_time,
      duration: b.session_duration,
      session_title: b.session_type,
      meet_link: b.meet_link,
      created_at: b.created_at
    }));

    return NextResponse.json({ payments: transformedPayments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
