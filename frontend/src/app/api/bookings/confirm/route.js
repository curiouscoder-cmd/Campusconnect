import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { sendBookingConfirmationEmail, sendMentorNotificationEmail } from "@/lib/email";

// Handle booking confirmation (Manual/Free/Direct)
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      slotId,
      mentorId,
      sessionType,
      userDetails,
      paymentId, // Optional for free
      orderId, // Optional
      slotDate,
      slotTime
    } = body;

    const supabase = createServerClient();

    // 1. Fetch Mentor Details (CRITICAL: Get Meet Link)
    const { data: mentor, error: mentorError } = await supabase
      .from("mentors")
      .select("name, email, meet_link")
      .eq("id", mentorId)
      .single();

    if (mentorError || !mentor) {
      return NextResponse.json({ error: "Mentor not found" }, { status: 404 });
    }

    const { name: mentorName, email: mentorEmail, meet_link: mentorMeetLink } = mentor;

    // Use Mentor's Meet Link. Do NOT generate one.
    const meetLink = mentorMeetLink;

    // 2. Prepare Booking Data
    // Ensure we have date/time
    let finalSlotDate = slotDate;
    let finalSlotTime = slotTime;

    if (!finalSlotDate && slotId) {
      // Try fetch from availability if not provided
      const { data: slot } = await supabase.from("availability").select("date, start_time").eq("id", slotId).single();
      if (slot) {
        finalSlotDate = slot.date;
        finalSlotTime = slot.start_time;
      }
    }

    const bookingData = {
      mentor_id: mentorId,
      user_name: userDetails?.name,
      user_email: userDetails?.email,
      user_phone: userDetails?.phone,
      session_type: sessionType?.id || sessionType || "quick_chat",
      session_price: 0, // Assuming manual/free if this route is used directly
      date: finalSlotDate || new Date().toISOString().split('T')[0],
      start_time: finalSlotTime,
      status: "confirmed",
      meet_link: meetLink, // Can be null if mentor has no link
      razorpay_order_id: orderId || `manual_${Date.now()}`,
      razorpay_payment_id: paymentId,
      confirmed_at: new Date().toISOString(),
    };

    if (slotId && slotId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      bookingData.slot_id = slotId;
    }

    // 3. Insert Booking
    const { data: booking, error: insertError } = await supabase
      .from("bookings")
      .insert(bookingData)
      .select()
      .single();

    if (insertError) {
      console.error("Booking Insert Error:", insertError);
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
    }

    // 4. Update Availability
    if (slotId) {
      await supabase
        .from("availability")
        .update({ is_booked: true, is_reserved: false })
        .eq("id", slotId);
    }

    // 5. Update User Profile (Phone Number) if provided
    if (userDetails?.phone && userDetails?.email) {
      console.log("Updating phone for:", userDetails.email);
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ phone: userDetails.phone })
        .eq("email", userDetails.email);

      if (profileError) {
        console.warn("Failed to update profile phone:", profileError);
      }
    }

    // 6. Send Emails
    await sendBookingConfirmationEmail({
      userEmail: userDetails?.email,
      userName: userDetails?.name,
      sessionType: sessionType?.title || sessionType || "Mentorship Session",
      meetLink: meetLink,
      slotDate: finalSlotDate,
      slotTime: finalSlotTime,
      mentorName: mentorName,
      duration: "30 mins" // Default
    });

    await sendMentorNotificationEmail({
      mentorEmail: mentorEmail,
      mentorName: mentorName,
      studentName: userDetails?.name,
      sessionType: sessionType?.title || sessionType,
      slotDate: finalSlotDate,
      slotTime: finalSlotTime,
      meetLink: meetLink
    });

    return NextResponse.json({
      success: true,
      booking,
      message: "Booking confirmed successfully",
    });

  } catch (error) {
    console.error("Error confirming booking:", error);
    return NextResponse.json(
      { error: "Failed to confirm booking" },
      { status: 500 }
    );
  }
}

// Keep GET for compatibility if needed, but point to Supabase
export async function GET(request) {
  const supabase = createServerClient();
  const { searchParams } = new URL(request.url);
  const bookingId = searchParams.get("id");

  if (bookingId) {
    const { data } = await supabase.from("bookings").select("*").eq("id", bookingId).single();
    return NextResponse.json({ success: true, booking: data });
  }

  return NextResponse.json({ success: true, message: "Use Supabase query" });
}
