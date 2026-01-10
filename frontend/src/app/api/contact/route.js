import { NextResponse } from "next/server";
import { Resend } from "resend";

// Initialize Resend with API key (you'll need to add RESEND_API_KEY to env)
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, message } = body;

        // Validate inputs
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Name, email, and message are required" },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email address" },
                { status: 400 }
            );
        }

        // Check if Resend is configured
        if (!process.env.RESEND_API_KEY) {
            console.log("Contact form submission (Resend not configured):", { name, email, message });
            // Return success even without Resend for development
            return NextResponse.json({
                success: true,
                message: "Message received (email service not configured)",
            });
        }

        // Send email using Resend
        const { data, error } = await resend.emails.send({
            from: "Campus Connect <noreply@campus-connect.co.in>",
            to: ["contact@campus-connect.co.in"],
            replyTo: email,
            subject: `New Contact Form Message from ${name}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366F1;">New Contact Form Submission</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #64748b; font-size: 12px;">
            This message was sent from the Campus Connect contact form.
          </p>
        </div>
      `,
        });

        if (error) {
            console.error("Failed to send email:", error);
            return NextResponse.json(
                { error: "Failed to send message. Please try again." },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Message sent successfully!",
        });
    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
