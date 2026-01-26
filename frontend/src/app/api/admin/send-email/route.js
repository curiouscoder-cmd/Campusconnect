import { NextResponse } from "next/server";
import {
    sendPromotionEmail,
    sendMentorOnboardingEmail,
    sendCustomEmail
} from "@/lib/email";

export async function POST(req) {
    try {
        const body = await req.json();
        const { type, data } = body;

        if (!type || !data) {
            return NextResponse.json({ error: "Missing type or data" }, { status: 400 });
        }

        let result;

        switch (type) {
            case "promotion":
                result = await sendPromotionEmail(data);
                break;
            case "onboarding":
                result = await sendMentorOnboardingEmail(data);
                break;
            case "custom":
                result = await sendCustomEmail(data);
                break;
            default:
                return NextResponse.json({ error: "Invalid email type" }, { status: 400 });
        }

        if (result && result.error) {
            return NextResponse.json({ error: result.error.message || "Failed to send email" }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Email sent successfully" });

    } catch (error) {
        console.error("Admin Email API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
