import { NextResponse } from "next/server";
import crypto from "crypto";
import { createServerClient } from "@/lib/supabase";
import { Resend } from "resend";

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;
const resend = new Resend(process.env.RESEND_API_KEY);

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

// Send booking confirmation email
async function sendBookingConfirmationEmail(userDetails, sessionType, meetLink, slotDate, slotTime, mentorName) {
  if (!process.env.RESEND_API_KEY || !userDetails?.email) {
    console.log("Skipping email: Resend not configured or no user email");
    return;
  }

  try {
    const { error } = await resend.emails.send({
      from: "Campus Connect <noreply@campus-connect.co.in>",
      to: [userDetails.email],
      subject: "🎉 Your Session is Booked! - Campus Connect",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #6366F1; margin: 0; font-size: 28px;">Campus Connect</h1>
            </div>
            
            <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <div style="text-align: center; margin-bottom: 24px;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                  <span style="font-size: 40px;">✓</span>
                </div>
              </div>
              
              <h2 style="color: #0f172a; text-align: center; margin: 0 0 8px 0; font-size: 24px;">
                Booking Confirmed!
              </h2>
              <p style="color: #64748b; text-align: center; margin: 0 0 32px 0; font-size: 16px;">
                Your session with ${mentorName || 'your mentor'} has been successfully booked.
              </p>
              
              <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h3 style="color: #0f172a; margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">
                  Session Details
                </h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Session Type</td>
                    <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 500; text-align: right;">
                      ${sessionType?.title || sessionType || 'Quick Chat'}
                    </td>
                  </tr>
                  ${slotDate ? `
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Date & Time</td>
                    <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 500; text-align: right;">
                      ${slotDate} ${slotTime ? 'at ' + slotTime : ''}
                    </td>
                  </tr>
                  ` : ''}
                </table>
              </div>
              
              ${meetLink ? `
              <div style="background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                <p style="color: rgba(255,255,255,0.9); margin: 0 0 12px 0; font-size: 14px;">
                  Join the Google Meet link below at the scheduled time:
                </p>
                <a href="${meetLink}" style="display: inline-block; background: white; color: #6366F1; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                  Join Meeting
                </a>
              </div>
              ` : ''}
              
              <div style="text-align: center; margin-top: 32px;">
                <p style="color: #64748b; font-size: 14px; margin: 0 0 8px 0;">
                  Questions? Reply to this email or contact us at
                </p>
                <a href="mailto:contact@campus-connect.co.in" style="color: #6366F1; text-decoration: none; font-weight: 500;">
                  contact@campus-connect.co.in
                </a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Failed to send booking confirmation email:", error);
    } else {
      console.log("Booking confirmation email sent to:", userDetails.email);
    }
  } catch (emailError) {
    console.error("Error sending booking confirmation email:", emailError);
  }
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
