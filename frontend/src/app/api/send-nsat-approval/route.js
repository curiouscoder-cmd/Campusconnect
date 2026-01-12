import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
    try {
        const { name, email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        const { data, error } = await resend.emails.send({
            from: "Campus Connect <noreply@campus-connect.co.in>",
            to: email,
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
                Congratulations, ${name || 'there'}!
            </h2>
            <p style="color: #64748b; text-align: center; margin: 0 0 32px 0; font-size: 16px;">
                Your NSAT referral has been verified and your free session is approved!
            </p>
            
            <div style="background: #f0fdf4; border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 1px solid #bbf7d0;">
                <h3 style="color: #166534; margin: 0 0 8px 0; font-size: 16px;">
                    ✅ What's Next?
                </h3>
                <p style="color: #166534; margin: 0; font-size: 14px; line-height: 1.6;">
                    We'll reach out to you shortly to schedule your free mentorship session. Keep an eye on your inbox!
                </p>
            </div>
            
            <div style="text-align: center;">
                <a href="https://campusconnect.vercel.app" style="display: inline-block; background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
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

        if (error) {
            console.error("Email error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Error sending approval email:", error);
        return NextResponse.json(
            { error: "Failed to send email" },
            { status: 500 }
        );
    }
}
