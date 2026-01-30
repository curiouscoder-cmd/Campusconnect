import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Generate referral code for a user
export async function POST(request) {
    try {
        const { userId, userEmail, userName } = await request.json();

        if (!userId || !userEmail) {
            return NextResponse.json(
                { error: "User ID and email are required" },
                { status: 400 }
            );
        }

        // Check if user already has a referral code
        const { data: existingCode } = await supabase
            .from("referral_codes")
            .select("code, discount_amount, reward_amount")
            .eq("user_id", userId)
            .single();

        if (existingCode) {
            return NextResponse.json({
                code: existingCode.code,
                discountAmount: existingCode.discount_amount,
                rewardAmount: existingCode.reward_amount
            });
        }

        // Generate unique referral code (e.g., CCNITYA1A2B)
        const firstName = userName?.split(' ')[0]?.toUpperCase() || 'REF';
        const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
        const code = `CC${firstName.substring(0, 5)}${randomStr}`;

        // Create referral code in database
        const { data, error } = await supabase
            .from("referral_codes")
            .insert({
                user_id: userId,
                user_email: userEmail,
                user_name: userName,
                code: code,
                discount_amount: 25, // ₹25 discount for referee
                reward_amount: 25, // ₹25 reward for referrer
                is_active: true
            })
            .select("code, discount_amount, reward_amount")
            .single();

        if (error) {
            console.error("Error creating referral code:", error);
            return NextResponse.json(
                { error: "Failed to create referral code" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            code: data.code,
            discountAmount: data.discount_amount,
            rewardAmount: data.reward_amount
        });
    } catch (error) {
        console.error("Referral API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// Validate and get referral code details
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get("code");
        const userId = searchParams.get("userId"); // To get user's own referral code

        // If userId is provided, get user's referral code
        if (userId) {
            const { data: userCode, error } = await supabase
                .from("referral_codes")
                .select("code, discount_amount, reward_amount, total_uses")
                .eq("user_id", userId)
                .single();

            if (error || !userCode) {
                return NextResponse.json({ hasCode: false });
            }

            // Get total rewards earned
            const { data: rewards } = await supabase
                .from("referral_rewards")
                .select("amount, status")
                .eq("user_id", userId);

            const totalEarned = rewards?.reduce((sum, r) => sum + r.amount, 0) || 0;
            const pendingRewards = rewards?.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0) || 0;

            return NextResponse.json({
                hasCode: true,
                code: userCode.code,
                discountAmount: userCode.discount_amount,
                rewardAmount: userCode.reward_amount,
                totalUses: userCode.total_uses,
                totalEarned,
                pendingRewards
            });
        }

        // Validate a referral code
        if (!code) {
            return NextResponse.json(
                { error: "Referral code is required" },
                { status: 400 }
            );
        }

        // Look up the referral code
        const { data: referralCode, error } = await supabase
            .from("referral_codes")
            .select("id, user_id, user_name, discount_amount, reward_amount")
            .eq("code", code.toUpperCase())
            .eq("is_active", true)
            .single();

        if (error || !referralCode) {
            return NextResponse.json(
                { valid: false, error: "Invalid or expired referral code" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            valid: true,
            discountAmount: referralCode.discount_amount,
            referrerId: referralCode.user_id,
            referrerName: referralCode.user_name?.split(' ')[0] || 'Someone',
            referralCodeId: referralCode.id
        });
    } catch (error) {
        console.error("Referral validation error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
