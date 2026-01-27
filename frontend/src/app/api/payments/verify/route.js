import { NextResponse } from "next/server";
import crypto from "crypto";
import { createServerClient } from "@/lib/supabase";
import { sendBookingConfirmationEmail, sendMentorNotificationEmail } from "@/lib/email";

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      slotId,
      mentorId,
      sessionType,
      userDetails,
      slotDate,
      slotTime,
      mentorName,
    } = body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
    }

    // 1. Verify Signature
    if (!RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const supabase = createServerClient();
    if (!supabase) return NextResponse.json({ error: "DB Error" }, { status: 500 });

    // 2. CHECK IF BOOKING ALREADY CREATED (by Webhook)
    const { data: existingBooking } = await supabase
      .from("bookings")
      .select("id, meet_link")
      .eq("razorpay_order_id", razorpay_order_id)
      .single();

    if (existingBooking) {
      console.log("Booking already exists (likely via webhook). Returning it.");
      return NextResponse.json({
        success: true,
        booking: existingBooking,
        meetLink: existingBooking.meet_link,
        message: "Booking already confirmed"
      });
    }

    // 3. Create Booking (Race condition handling: insert if not exists)
    // Gather details - reusing logic from Webhook for consistency
    let fetchedMentorName = mentorName;
    let meetLink = null;
    let mentorEmail = null;

    if (mentorId) {
      const { data: mentor } = await supabase.from("mentors").select("name, email, meet_link").eq("id", mentorId).single();
      if (mentor) {
        fetchedMentorName = mentor.name;
        meetLink = mentor.meet_link;
        mentorEmail = mentor.email;
      }
    }

    // Removed generateMeetCode fallback per user request

    // Update Payment 
    await supabase.from("payments").update({
      razorpay_payment_id,
      razorpay_signature,
      status: "paid",
      updated_at: new Date().toISOString()
    }).eq("razorpay_order_id", razorpay_order_id);

    // Insert Booking
    const bookingData = {
      mentor_id: mentorId,
      user_name: userDetails?.name,
      user_email: userDetails?.email,
      user_phone: userDetails?.phone,
      session_type: sessionType?.id || sessionType,
      session_price: sessionType?.price || 1,
      date: slotDate, // Already formatted by client/booking-utils
      start_time: slotTime,
      status: "confirmed",
      meet_link: meetLink,
      razorpay_order_id: razorpay_order_id,
      confirmed_at: new Date().toISOString()
    };

    if (slotId && slotId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      bookingData.slot_id = slotId;
    }

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert(bookingData)
      .select()
      .single();

    if (bookingError) {
      // If unique constraint violation, it means webhook beat us to it.
      if (bookingError.code === '23505') {
        const { data: retryBooking } = await supabase.from("bookings").select("*").eq("razorpay_order_id", razorpay_order_id).single();
        return NextResponse.json({ success: true, booking: retryBooking, meetLink: retryBooking.meet_link });
      }
      console.error("Booking Creation Error:", bookingError);
      return NextResponse.json({ error: "Booking Failed" }, { status: 500 });
    }

    // Link & Update Slot
    await supabase.from("payments").update({ booking_id: booking.id }).eq("razorpay_order_id", razorpay_order_id);
    if (bookingData.slot_id) {
      await supabase.from("availability").update({ is_booked: true, is_reserved: false }).eq("id", bookingData.slot_id);
    }

    // Update User Profile (Phone Number)
    if (userDetails?.phone && userDetails?.email) {
      await supabase
        .from("profiles")
        .update({ phone: userDetails.phone })
        .eq("email", userDetails.email);
    }

    // Send Emails 
    await sendBookingConfirmationEmail({
      userEmail: userDetails?.email,
      userName: userDetails?.name,
      sessionType: sessionType?.title || "Quick Chat",
      meetLink,
      slotDate,
      slotTime,
      mentorName: fetchedMentorName,
      duration: sessionType?.duration || "15 mins"
    });

    await sendMentorNotificationEmail({
      mentorEmail,
      mentorName: fetchedMentorName,
      studentName: userDetails?.name,
      sessionType: sessionType?.title || sessionType,
      slotDate,
      slotTime,
      meetLink
    });

    return NextResponse.json({
      success: true,
      booking: { ...booking, meetLink }, // Return merged data
      meetLink
    });

  } catch (error) {
    console.error("Verify Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
