import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Record referral use after successful booking
export async function POST(request) {
    try {
        const {
            referralCodeId,
            refereeUserId,
            refereeEmail,
            bookingId,
            discountApplied
        } = await request.json();

        if (!referralCodeId || !refereeUserId || !refereeEmail) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Get the referral code details
        const { data: referralCode, error: codeError } = await supabase
            .from("referral_codes")
            .select("id, user_id, user_email, reward_amount")
            .eq("id", referralCodeId)
            .single();

        if (codeError || !referralCode) {
            return NextResponse.json(
                { error: "Referral code not found" },
                { status: 404 }
            );
        }

        // Check if this user already used this referral code
        const { data: existingUse } = await supabase
            .from("referral_uses")
            .select("id")
            .eq("referral_code_id", referralCodeId)
            .eq("referee_user_id", refereeUserId)
            .single();

        if (existingUse) {
            return NextResponse.json(
                { error: "You have already used this referral code" },
                { status: 400 }
            );
        }

        // Record the referral use
        const { data: referralUse, error: useError } = await supabase
            .from("referral_uses")
            .insert({
                referral_code_id: referralCodeId,
                referee_user_id: refereeUserId,
                referee_email: refereeEmail,
                booking_id: bookingId,
                discount_applied: discountApplied,
                reward_credited: false
            })
            .select("id")
            .single();

        if (useError) {
            console.error("Error recording referral use:", useError);
            return NextResponse.json(
                { error: "Failed to record referral use" },
                { status: 500 }
            );
        }

        // Create pending reward for the referrer
        const { error: rewardError } = await supabase
            .from("referral_rewards")
            .insert({
                user_id: referralCode.user_id,
                user_email: referralCode.user_email,
                amount: referralCode.reward_amount,
                referral_use_id: referralUse.id,
                status: 'pending'
            });

        if (rewardError) {
            console.error("Error creating reward:", rewardError);
            // Don't fail the request, just log it
        }

        return NextResponse.json({
            success: true,
            message: "Referral recorded successfully"
        });
    } catch (error) {
        console.error("Referral use API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
