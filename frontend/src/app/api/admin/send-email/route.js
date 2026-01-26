import { NextResponse } from "next/server";
import {
    sendPromotionEmail,
    sendMentorOnboardingEmail,
    sendCustomEmail
} from "@/lib/email";
import { logEmail } from "@/lib/email-logger";

export async function POST(req) {
    try {
        const body = await req.json();
        const { type, data } = body;

        if (!type || !data) {
            return NextResponse.json({ error: "Missing type or data" }, { status: 400 });
        }

        let result;
        let subject = "";

        switch (type) {
            case "promotion":
                result = await sendPromotionEmail(data);
                subject = data.subject || "Promotion";
                break;
            case "onboarding":
                result = await sendMentorOnboardingEmail(data);
                subject = `Welcome to Campus Connect, ${data.mentorName}!`;
                break;
            case "custom":
                result = await sendCustomEmail(data);
                subject = data.subject;
                break;
            default:
                return NextResponse.json({ error: "Invalid email type" }, { status: 400 });
        }

        if (result && result.error) {
            // Log failure if needed, or just return error
            console.error("Email send failed:", result.error);
            return NextResponse.json({ error: result.error.message || "Failed to send email" }, { status: 500 });
        }

        // Log success
        await logEmail({
            recipient: data.email,
            type,
            subject,
            status: "sent",
            metadata: data
        });

        return NextResponse.json({ success: true, message: "Email sent successfully" });

    } catch (error) {
        console.error("Admin Email API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
