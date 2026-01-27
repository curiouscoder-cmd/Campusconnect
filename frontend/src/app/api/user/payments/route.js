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

    // 3. Fetch related payment records for these bookings
    const bookingIds = bookingsProxy.map(b => b.id);
    const { data: paymentRecords } = await supabase
      .from("payments")
      .select("booking_id, invoice_id, amount, status, payment_method, payment_method_details, fee, tax, razorpay_payment_id")
      .in("booking_id", bookingIds);

    const mentorMap = {};
    const mentorCollegeMap = {};
    const mentorImageMap = {};

    mentors?.forEach(m => {
      mentorMap[m.id] = m.name || "Mentor";
      mentorCollegeMap[m.id] = m.college || "Unknown College";
      mentorImageMap[m.id] = m.image;
    });

    const paymentMap = {};
    paymentRecords?.forEach(p => {
      paymentMap[p.booking_id] = p;
    });

    const transformedPayments = bookingsProxy.map(b => {
      const p = paymentMap[b.id] || {};
      return {
        id: b.id, // Keeping booking ID as main ID for list, but we might want invoice ID for display
        date: new Date(b.created_at).toLocaleDateString(),
        amount: b.session_price ? `₹${b.session_price}` : "₹500",
        status: p.status === 'captured' ? "Completed" : (b.status === 'confirmed' ? 'Completed' : b.status),
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
        created_at: b.created_at,

        // Premium Invoice Fields
        invoice_id: p.invoice_id || `INV-${b.id.slice(-6).toUpperCase()}`, // Fallback
        payment_method: p.payment_method || 'Online',
        payment_method_details: p.payment_method_details || {},
        fee: p.fee || 0,
        tax: p.tax || 0,
        transaction_id: p.razorpay_payment_id || b.id
      };
    });

    return NextResponse.json({ payments: transformedPayments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
