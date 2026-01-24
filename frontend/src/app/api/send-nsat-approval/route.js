import { NextResponse } from "next/server";
import { sendNSATApprovalEmail } from "@/lib/email";

export async function POST(request) {
    try {
        const { name, email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        const { data, error } = await sendNSATApprovalEmail({ name, email });

        if (error) {
            return NextResponse.json({ error }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to send email" },
            { status: 500 }
        );
    }
}
