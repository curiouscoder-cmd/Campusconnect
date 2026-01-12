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
async function sendBookingConfirmationEmail(userEmail, userName, sessionType, meetLink, mentorName, amount) {
  if (!process.env.RESEND_API_KEY || !userEmail) {
    console.log("Skipping email: Resend not configured or no user email");
    return;
  }

  try {
    const { error } = await resend.emails.send({
      from: "Campus Connect <noreply@campus-connect.co.in>",
      to: [userEmail],
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
                  <span style="font-size: 40px; color: white;">✓</span>
                </div>
              </div>
              
              <h2 style="color: #0f172a; text-align: center; margin: 0 0 8px 0; font-size: 24px;">
                Payment Successful!
              </h2>
              <p style="color: #64748b; text-align: center; margin: 0 0 32px 0; font-size: 16px;">
                Hi ${userName || 'there'}, your session is confirmed.
              </p>
              
              <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h3 style="color: #0f172a; margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">
                  📅 Session Details
                </h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Session Type</td>
                    <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 500; text-align: right;">
                      ${sessionType || 'Quick Chat'}
                    </td>
                  </tr>
                  ${mentorName ? `
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Mentor</td>
                    <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 500; text-align: right;">
                      ${mentorName}
                    </td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Amount Paid</td>
                    <td style="padding: 8px 0; color: #10b981; font-size: 14px; font-weight: 600; text-align: right;">
                      ₹${amount || 99}
                    </td>
                  </tr>
                </table>
              </div>
              
              ${meetLink ? `
              <div style="background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                <p style="color: rgba(255,255,255,0.9); margin: 0 0 12px 0; font-size: 14px;">
                  Join your session using this link:
                </p>
                <a href="${meetLink}" style="display: inline-block; background: white; color: #6366F1; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                  Join Google Meet
                </a>
              </div>
              ` : ''}
              
              <div style="border-top: 1px solid #e2e8f0; padding-top: 24px;">
                <h4 style="color: #0f172a; margin: 0 0 12px 0; font-size: 14px;">💡 Tips for your session:</h4>
                <ul style="color: #64748b; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li>Join 2-3 minutes before the scheduled time</li>
                  <li>Prepare your questions in advance</li>
                  <li>Ensure you have a stable internet connection</li>
                </ul>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 32px;">
              <p style="color: #64748b; font-size: 14px; margin: 0 0 8px 0;">
                Questions? Contact us at
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
      console.log("Booking confirmation email sent to:", userEmail);
    }
  } catch (emailError) {
    console.error("Error sending booking confirmation email:", emailError);
  }
}

export async function POST(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    console.log("Webhook received:", body.substring(0, 200));

    // Verify signature in production
    if (RAZORPAY_WEBHOOK_SECRET && signature) {
      const isValid = verifyWebhookSignature(body, signature);
      if (!isValid) {
        console.error("Invalid webhook signature");
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    const event = JSON.parse(body);
    const eventType = event.event;

    console.log("Webhook event type:", eventType);

    // Handle payment.captured event
    if (eventType === "payment.captured") {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;
      const amount = payment.amount / 100; // Convert from paise
      const email = payment.email;
      const contact = payment.contact;
      const notes = payment.notes || {};

      console.log("Payment captured:", { orderId, paymentId, amount, email });

      const supabase = createServerClient();

      if (supabase) {
        // Update payment status
        const { error: paymentError } = await supabase
          .from("payments")
          .update({
            razorpay_payment_id: paymentId,
            status: "captured",
            updated_at: new Date().toISOString(),
          })
          .eq("razorpay_order_id", orderId);

        if (paymentError) {
          console.error("Error updating payment:", paymentError);
        }

        // Get booking details for email
        const { data: booking } = await supabase
          .from("bookings")
          .select("*, mentors(name)")
          .eq("razorpay_order_id", orderId)
          .single();

        if (booking) {
          // Send confirmation email
          await sendBookingConfirmationEmail(
            booking.user_email || email,
            booking.user_name || notes.userName,
            booking.session_type,
            booking.meet_link,
            booking.mentors?.name,
            amount
          );
        } else {
          // If no booking found, still try to send email with available info
          await sendBookingConfirmationEmail(
            email,
            notes.userName,
            notes.sessionType,
            null,
            null,
            amount
          );
        }
      }

      return NextResponse.json({ received: true, status: "processed" });
    }

    // Handle payment.failed event
    if (eventType === "payment.failed") {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;

      console.log("Payment failed:", { orderId, paymentId });

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
      }

      return NextResponse.json({ received: true, status: "processed" });
    }

    // Handle order.paid event (backup for payment.captured)
    if (eventType === "order.paid") {
      const order = event.payload.order.entity;
      const payment = event.payload.payment.entity;

      console.log("Order paid:", { orderId: order.id, paymentId: payment.id });

      // Similar processing as payment.captured
      return NextResponse.json({ received: true, status: "processed" });
    }

    // Acknowledge other events
    return NextResponse.json({ received: true, event: eventType });

  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed", details: error.message },
      { status: 500 }
    );
  }
}
