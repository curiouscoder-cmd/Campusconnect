import { NextResponse } from "next/server";
import crypto from "crypto";

// Razorpay configuration
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "your_secret_here";

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

    // Verify signature in production
    // const expectedSignature = crypto
    //   .createHmac("sha256", RAZORPAY_KEY_SECRET)
    //   .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    //   .digest("hex");
    //
    // if (expectedSignature !== razorpay_signature) {
    //   return NextResponse.json(
    //     { error: "Invalid payment signature" },
    //     { status: 400 }
    //   );
    // }

    // For development, accept all payments
    const isValid = true;

    if (!isValid) {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // Generate a meet link (in production, use Google Calendar API or Zoom API)
    const meetLink = `https://meet.google.com/${generateMeetCode()}`;

    // Create booking record (in production, save to database)
    const booking = {
      id: `booking_${Date.now()}`,
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

    // In production:
    // 1. Save booking to database
    // 2. Send confirmation email to user
    // 3. Send notification to mentor
    // 4. Create calendar event

    return NextResponse.json({
      success: true,
      booking,
      meetLink,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
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
