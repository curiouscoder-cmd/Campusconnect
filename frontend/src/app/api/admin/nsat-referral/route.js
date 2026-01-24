import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getResendClient, sendNSATReferralApprovalEmail } from "@/lib/email";

export async function POST(request) {
    try {
        const { referralId, action } = await request.json();

        const resend = getResendClient();
        if (!resend) console.warn("Resend client not available for NSAT referral");

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

                // Send Approval Email using shared service
                const { error: emailError } = await sendNSATReferralApprovalEmail({
                    name: referral.name,
                    email: referral.email,
                    referral // Pass referral object for date/time details
                });

                if (emailError) {
                    console.error("Email error:", emailError);
                    // Don't fail the request if email fails, but log it
                }
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
