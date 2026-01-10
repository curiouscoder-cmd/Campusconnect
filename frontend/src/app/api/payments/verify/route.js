import { NextResponse } from "next/server";
import crypto from "crypto";
import { createServerClient } from "@/lib/supabase";
import { Resend } from "resend";

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const resend = new Resend(process.env.RESEND_API_KEY);

// Send booking confirmation email
async function sendBookingConfirmationEmail(userDetails, sessionType, meetLink, slotDate, slotTime, mentorName) {
  if (!process.env.RESEND_API_KEY || !userDetails?.email) {
    console.log("Skipping email: Resend not configured or no user email");
    return;
  }

  try {
    const { error } = await resend.emails.send({
      from: "Campus Connect <contact@campus-connect.co.in>",
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
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #6366F1; margin: 0; font-size: 28px;">Campus Connect</h1>
            </div>
            
            <!-- Main Card -->
            <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <!-- Success Icon -->
              <div style="text-align: center; margin-bottom: 24px;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                  <span style="font-size: 40px;">✓</span>
                </div>
              </div>
              
              <h2 style="color: #0f172a; text-align: center; margin: 0 0 8px 0; font-size: 24px;">
                Session Booked Successfully!
              </h2>
              <p style="color: #64748b; text-align: center; margin: 0 0 32px 0; font-size: 16px;">
                Hi ${userDetails.name || 'there'}, your mentoring session is confirmed.
              </p>
              
              <!-- Session Details -->
              <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h3 style="color: #0f172a; margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">
                  📅 Session Details
                </h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Session Type</td>
                    <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 500; text-align: right;">
                      ${sessionType?.title || 'Quick Chat'}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Duration</td>
                    <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 500; text-align: right;">
                      ${sessionType?.duration || 15} minutes
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Mentor</td>
                    <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 500; text-align: right;">
                      ${mentorName || 'Your Mentor'}
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
              
              <!-- Meet Link -->
              <div style="background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                <p style="color: rgba(255,255,255,0.9); margin: 0 0 12px 0; font-size: 14px;">
                  Join your session using this link:
                </p>
                <a href="${meetLink}" style="display: inline-block; background: white; color: #6366F1; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                  Join Google Meet
                </a>
              </div>
              
              <!-- Tips -->
              <div style="border-top: 1px solid #e2e8f0; padding-top: 24px;">
                <h4 style="color: #0f172a; margin: 0 0 12px 0; font-size: 14px;">💡 Tips for your session:</h4>
                <ul style="color: #64748b; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li>Join 2-3 minutes before the scheduled time</li>
                  <li>Prepare your questions in advance</li>
                  <li>Ensure you have a stable internet connection</li>
                  <li>Use headphones for better audio quality</li>
                </ul>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 32px;">
              <p style="color: #64748b; font-size: 14px; margin: 0 0 8px 0;">
                Questions? Reply to this email or contact us at
              </p>
              <a href="mailto:contact@campus-connect.co.in" style="color: #6366F1; text-decoration: none; font-weight: 500;">
                contact@campus-connect.co.in
              </a>
              <p style="color: #94a3b8; font-size: 12px; margin: 24px 0 0 0;">
                © ${new Date().getFullYear()} Campus Connect. All rights reserved.
              </p>
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

    const supabase = createServerClient();

    // Create booking in database
    let bookingId = `booking_${Date.now()}`;
    let fetchedMentorName = mentorName;
    let meetLink = null;

    if (supabase) {
      // Fetch mentor name and meet_link
      if (mentorId) {
        const { data: mentor } = await supabase
          .from("mentors")
          .select("name, meet_link")
          .eq("id", mentorId)
          .single();

        if (mentor) {
          fetchedMentorName = fetchedMentorName || mentor.name;
          meetLink = mentor.meet_link;
        }
      }
    }

    // Fallback to generated link if mentor doesn't have one
    if (!meetLink) {
      meetLink = `https://meet.google.com/${generateMeetCode()}`;
      console.log("Using generated meet link (mentor has no personal link)");
    }

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
        session_duration: sessionType?.duration,
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

    // Send confirmation email
    try {
      await sendBookingConfirmationEmail(
        userDetails,
        sessionType,
        meetLink,
        slotDate,
        slotTime,
        fetchedMentorName
      );
      console.log("Email function completed");
    } catch (emailErr) {
      console.error("Email send failed:", emailErr);
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
