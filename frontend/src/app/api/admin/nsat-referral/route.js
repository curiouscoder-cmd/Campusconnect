import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
    try {
        const { referralId, action } = await request.json();

        if (!referralId) {
            return NextResponse.json({ error: "Referral ID required" }, { status: 400 });
        }

        const supabase = createServerClient();
        if (!supabase) {
            return NextResponse.json({ error: "Database not configured" }, { status: 500 });
        }

        // Get the referral details
        const { data: referral, error: fetchError } = await supabase
            .from("nsat_referrals")
            .select("*")
            .eq("id", referralId)
            .single();

        if (fetchError || !referral) {
            return NextResponse.json({ error: "Referral not found" }, { status: 404 });
        }

        if (action === "approve") {
            // Mark the slot as booked in availability table
            if (referral.preferred_mentor_id && referral.preferred_date && referral.preferred_time) {
                const { error: slotError } = await supabase
                    .from("availability")
                    .update({ is_booked: true, is_reserved: false })
                    .eq("mentor_id", referral.preferred_mentor_id)
                    .eq("date", referral.preferred_date)
                    .eq("start_time", referral.preferred_time);

                if (slotError) {
                    console.error("Error marking slot as booked:", slotError);
                }

                // Get mentor details for the meet link
                const { data: mentor } = await supabase
                    .from("mentors")
                    .select("name, meet_link")
                    .eq("id", referral.preferred_mentor_id)
                    .single();

                const meetLink = mentor?.meet_link || `https://meet.google.com/${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;

                // Create a booking record for the free session
                const { data: booking, error: bookingError } = await supabase
                    .from("bookings")
                    .insert({
                        mentor_id: referral.preferred_mentor_id,
                        user_name: referral.name,
                        user_email: referral.email,
                        user_phone: referral.phone || null,
                        session_type: "nsat_free",
                        session_duration: 15,
                        session_price: 0,
                        date: referral.preferred_date,
                        start_time: referral.preferred_time,
                        meet_link: meetLink,
                        status: "confirmed",
                        confirmed_at: new Date().toISOString(),
                    })
                    .select()
                    .single();

                if (bookingError) {
                    console.error("Error creating booking:", bookingError);
                    return NextResponse.json({ error: "Failed to create booking: " + bookingError.message }, { status: 500 });
                }

                console.log("NSAT booking created:", booking);
            }

            // Update referral status to approved
            const { error: updateError } = await supabase
                .from("nsat_referrals")
                .update({
                    status: "approved",
                    approved_at: new Date().toISOString(),
                })
                .eq("id", referral.id);

            if (updateError) {
                return NextResponse.json({ error: "Failed to update referral status" }, { status: 500 });
            }

            // Send approval email
            if (process.env.RESEND_API_KEY) {
                await resend.emails.send({
                    from: "Campus Connect <noreply@campus-connect.co.in>",
                    to: referral.email,
                    subject: "🎉 Your Free Session is Approved!",
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
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10B981 0%, #059669 100%); border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 40px; color: white;">🎉</span>
                </div>
            </div>
            
            <h2 style="color: #0f172a; text-align: center; margin: 0 0 8px 0; font-size: 24px;">
                Congratulations, ${referral.name || 'there'}!
            </h2>
            <p style="color: #64748b; text-align: center; margin: 0 0 32px 0; font-size: 16px;">
                Your NSAT referral has been verified and your free session is approved!
            </p>
            
            <div style="background: #f0fdf4; border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 1px solid #bbf7d0;">
                <h3 style="color: #166534; margin: 0 0 8px 0; font-size: 16px;">
                    ✅ Your Session Details
                </h3>
                <p style="color: #166534; margin: 0; font-size: 14px; line-height: 1.6;">
                    <strong>Date:</strong> ${referral.preferred_date}<br>
                    <strong>Time:</strong> ${referral.preferred_time}
                </p>
            </div>
            
            <div style="text-align: center;">
                <a href="https://campus-connect.co.in" style="display: inline-block; background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                    Visit Campus Connect
                </a>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 32px; color: #94a3b8; font-size: 12px;">
            <p>Thank you for registering for NSAT through our link!</p>
            <p>© ${new Date().getFullYear()} Campus Connect. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
                    `,
                });
            }

            return NextResponse.json({ success: true, message: "Referral approved and booking created" });

        } else if (action === "reject") {
            const { error: updateError } = await supabase
                .from("nsat_referrals")
                .update({ status: "rejected" })
                .eq("id", referral.id);

            if (updateError) {
                return NextResponse.json({ error: "Failed to reject referral" }, { status: 500 });
            }

            return NextResponse.json({ success: true, message: "Referral rejected" });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    } catch (error) {
        console.error("Error processing NSAT referral:", error);
        return NextResponse.json({ error: "Failed to process referral" }, { status: 500 });
    }
}
