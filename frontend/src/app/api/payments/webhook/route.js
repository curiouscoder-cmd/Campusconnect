import { NextResponse } from "next/server";
import crypto from "crypto";
import { createServerClient } from "@/lib/supabase";
import { sendBookingConfirmationEmail, sendMentorNotificationEmail } from "@/lib/email";

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

// Verify webhook signature
function verifyWebhookSignature(body, signature) {
  if (!RAZORPAY_WEBHOOK_SECRET) {
    console.warn("Webhook secret not configured");
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest("hex");

  return expectedSignature === signature;
}

// Generate fallback meet link
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

export async function POST(request) {
  try {
    const bodyText = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!verifyWebhookSignature(bodyText, signature)) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(bodyText);
    console.log("Webhook received:", event.event);

    const eventType = event.event;

    // Handle payment.captured event - THIS IS THE CRITICAL ONE
    if (eventType === "payment.captured" || eventType === "order.paid") {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;
      const amount = payment.amount / 100; // Convert to rupees
      const notes = payment.notes; // This contains your metadata!

      console.log("Processing successful payment:", { orderId, paymentId });

      const supabase = createServerClient();

      if (!supabase) {
        console.error("Supabase client not initialized");
        return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
      }

      // 1. Check if booking already exists (Idempotency)
      const { data: existingBooking } = await supabase
        .from("bookings")
        .select("id")
        .eq("razorpay_order_id", orderId)
        .single();

      if (existingBooking) {
        console.log("Booking already exists, skipping creation. ID:", existingBooking.id);

        // Ensure payment status is updated just in case
        await supabase
          .from("payments")
          .update({
            razorpay_payment_id: paymentId,
            status: "captured",
            updated_at: new Date().toISOString(),
          })
          .eq("razorpay_order_id", orderId);

        return NextResponse.json({ received: true, status: "already_processed" });
      }

      // 2. Booking doesn't exist - CREATE IT from Notes
      console.log("Booking missing - Creating from webhook notes:", notes);

      // Extract details from notes (ensure you send these in create-order!)
      const slotId = notes.slotId;
      const mentorId = notes.mentorId;
      const sessionTypeId = notes.sessionTypeId || notes.sessionType; // Handle both naming conventions
      const userEmail = notes.userEmail;
      const userName = notes.userName;

      // Need to fetch Mentor Details for Meet Link & Name
      let meetLink = null;
      let mentorName = "Mentor";
      let mentorEmail = null;
      let sessionTypeTitle = sessionTypeId; // Fallback

      // Fetch Mentor
      if (mentorId) {
        const { data: mentor } = await supabase
          .from("mentors")
          .select("name, email, meet_link")
          .eq("id", mentorId)
          .single();

        if (mentor) {
          mentorName = mentor.name;
          mentorEmail = mentor.email;
          meetLink = mentor.meet_link;
        }
      }

      // Fallback Meet Link
      if (!meetLink) {
        meetLink = `https://meet.google.com/${generateMeetCode()}`;
      }

      // Fetch Slot Date/Time if possible (or use current if notes don't have it)
      // Ideally, slotId lookup would give us this, but let's be safe
      let slotDate = new Date().toISOString().split('T')[0];
      let slotTime = null;

      if (slotId && slotId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        const { data: slot } = await supabase
          .from("availability")
          .select("start_time, date")
          .eq("id", slotId)
          .single();

        if (slot) {
          slotDate = slot.date;
          slotTime = slot.start_time;
        }
      }

      // Create Payment Record (if it doesn't exist either)
      // Ideally create-order made it, but let's upsert to be safe
      const { data: paymentRecord, error: payError } = await supabase
        .from("payments")
        .upsert({
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          amount: amount,
          currency: "INR",
          status: "captured",
          booking_id: null, // Update later
        }, { onConflict: 'razorpay_order_id' })
        .select()
        .single();

      if (payError) console.error("Error upserting payment:", payError);

      // Insert Booking
      const bookingData = {
        mentor_id: mentorId,
        user_name: userName,
        user_email: userEmail,
        session_type: sessionTypeId,
        session_price: amount,
        date: slotDate,
        start_time: slotTime,
        status: "confirmed",
        meet_link: meetLink,
        razorpay_order_id: orderId, // Link strictly
        confirmed_at: new Date().toISOString(),
      };

      if (slotId && slotId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        bookingData.slot_id = slotId;
      }

      const { data: newBooking, error: bookingError } = await supabase
        .from("bookings")
        .insert(bookingData)
        .select()
        .single();

      if (bookingError) {
        console.error("CRITICAL: Failed to create booking in webhook:", bookingError);
        // Even if booking fails, payment is captured. We must log this critical error.
        return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
      }

      console.log("Booking created successfully via Webhook:", newBooking.id);

      // Link Payment to Booking
      await supabase
        .from("payments")
        .update({ booking_id: newBooking.id })
        .eq("razorpay_order_id", orderId);

      // Mark Slot as Booked
      if (slotId) {
        await supabase
          .from("availability")
          .update({ is_booked: true, is_reserved: false })
          .eq("id", slotId);
      }

      // Send Email
      await sendBookingConfirmationEmail(
        { email: userEmail, name: userName },
        sessionTypeTitle,
        meetLink,
        slotDate,
        slotTime,
        mentorName
      );

      // Send Mentor Notification (CRITICAL: ensure mentor knows!)
      let mentorEmailToUse = mentorEmail;
      if (!mentorEmailToUse && mentorId) {
        // Should have been fetched above, but double check
        // reusing fetch logic if needed or relying on what we got
      }

      await sendMentorNotificationEmail({
        mentorEmail: mentorEmail, // Already fetched above
        mentorName: mentorName,
        studentName: userName,
        sessionType: sessionTypeTitle,
        slotDate: slotDate,
        slotTime: slotTime,
        meetLink: meetLink
      });

      return NextResponse.json({ received: true, status: "created_via_webhook", bookingId: newBooking.id });
    }

    // Handle payment.failed
    if (eventType === "payment.failed") {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;

      console.log("Payment failed webhook:", { orderId });

      const supabase = createServerClient();
      if (supabase) {
        await supabase
          .from("payments")
          .update({
            razorpay_payment_id: paymentId,
            status: "failed",
            updated_at: new Date().toISOString(),
          })
          .eq("razorpay_order_id", orderId);

        // Release the slot if it was reserved? 
        // Strategy: Let the reservation expire naturally (10 mins) or handle here.
        // Safer to let it expire to avoid race conditions with retries.
      }
      return NextResponse.json({ received: true, status: "failed_recorded" });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    // Return 200 to stop retries if it's a logic error? 
    // No, keep 500 for system errors so Razorpay retries if DB was down.
    return NextResponse.json(
      { error: "Webhook processing failed", details: error.message },
      { status: 500 }
    );
  }
}
