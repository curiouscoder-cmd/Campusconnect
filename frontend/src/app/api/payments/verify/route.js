import { NextResponse } from "next/server";
import crypto from "crypto";
import { createServerClient } from "@/lib/supabase";

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
    } = body;

    if (!razorpay_payment_id) {
      return NextResponse.json(
        { error: "Payment ID is required" },
        { status: 400 }
      );
    }

    let isValid = false;

    // Verify signature if Razorpay is configured
    if (RAZORPAY_KEY_SECRET && razorpay_order_id && razorpay_signature) {
      const expectedSignature = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      isValid = expectedSignature === razorpay_signature;
    } else {
      // For development without Razorpay configured
      console.warn("Razorpay not configured, skipping signature verification");
      isValid = true;
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Generate a meet link
    const meetLink = `https://meet.google.com/${generateMeetCode()}`;

    const supabase = createServerClient();

    // Create booking in database
    let bookingId = `booking_${Date.now()}`;
    
    if (supabase) {
      // Update payment status
      await supabase
        .from("payments")
        .update({
          razorpay_payment_id,
          razorpay_signature,
          status: "paid",
          updated_at: new Date().toISOString(),
        })
        .eq("razorpay_order_id", razorpay_order_id);

      // Create booking record
      const { data: booking, error } = await supabase
        .from("bookings")
        .insert({
          mentor_id: mentorId,
          slot_id: slotId,
          user_name: userDetails?.name,
          user_email: userDetails?.email,
          user_phone: userDetails?.phone,
          questions: userDetails?.questions,
          session_type: sessionType?.id || sessionType,
          session_duration: sessionType?.durationMinutes,
          session_price: sessionType?.price,
          status: "confirmed",
          meet_link: meetLink,
          confirmed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (booking) {
        bookingId = booking.id;

        // Update payment with booking ID
        await supabase
          .from("payments")
          .update({ booking_id: bookingId })
          .eq("razorpay_order_id", razorpay_order_id);

        // Mark slot as booked
        await supabase
          .from("availability")
          .update({ is_booked: true, is_reserved: false })
          .eq("id", slotId);
      }
    }

    const bookingData = {
      id: bookingId,
      slotId,
      mentorId,
      sessionType,
      userDetails,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: "confirmed",
      meetLink,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      booking: bookingData,
      meetLink,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment", details: error.message },
      { status: 500 }
    );
  }
}

function generateMeetCode() {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const segments = [3, 4, 3];
  return segments
    .map((len) =>
      Array.from({ length: len }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join("")
    )
    .join("-");
}
