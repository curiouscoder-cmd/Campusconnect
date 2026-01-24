import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingConfirmationEmail({
    userEmail,
    userName,
    sessionType,
    meetLink,
    slotDate,
    slotTime,
    mentorName,
    amount
}) {
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
                  <span style="font-size: 40px;">✓</span>
                </div>
              </div>
              
              <h2 style="color: #0f172a; text-align: center; margin: 0 0 8px 0; font-size: 24px;">
                Booking Confirmed!
              </h2>
              <p style="color: #64748b; text-align: center; margin: 0 0 32px 0; font-size: 16px;">
                Your session with ${mentorName || 'your mentor'} is confirmed.
              </p>
              
              <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h3 style="color: #0f172a; margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">
                  Session Details
                </h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Session Type</td>
                    <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 500; text-align: right;">
                      ${sessionType?.title || sessionType || 'Quick Chat'}
                    </td>
                  </tr>
                  ${slotDate ? `
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Date & Time</td>
                    <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 500; text-align: right;">
                      ${slotDate} ${slotTime ? 'at ' + slotTime : ''}
                    </td>
                  </tr>
                  ` : ''}
                </table>
              </div>
              
              ${meetLink ? `
              <div style="background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                <p style="color: rgba(255,255,255,0.9); margin: 0 0 12px 0; font-size: 14px;">
                  Join the Google Meet:
                </p>
                <a href="${meetLink}" style="display: inline-block; background: white; color: #6366F1; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                  Join Meeting
                </a>
              </div>
              ` : ''}
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

export async function sendMentorNotificationEmail({
    mentorEmail,
    mentorName,
    studentName,
    sessionType,
    slotDate,
    slotTime,
    meetLink
}) {
    if (!process.env.RESEND_API_KEY || !mentorEmail) return;

    try {
        const { error } = await resend.emails.send({
            from: "Campus Connect <noreply@campus-connect.co.in>",
            to: [mentorEmail],
            subject: "🔔 New Session Booked! - Campus Connect",
            html: `
        <!DOCTYPE html>
        <html>
        <body style="margin: 0; padding: 0; font-family: sans-serif; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: white; border-radius: 16px; padding: 40px;">
              <h2 style="color: #0f172a;">New Session Booked!</h2>
              <p>Hi ${mentorName},</p>
              <p>${studentName || 'A student'} has booked a ${sessionType} session with you.</p>
              ${slotDate ? `<p><strong>Time:</strong> ${slotDate} at ${slotTime}</p>` : ''}
              <p><a href="${meetLink}">Join Meeting Link</a></p>
              <p>Check your dashboard for details.</p>
            </div>
          </div>
        </body>
        </html>
      `,
        });

        if (error) console.error("Failed to send mentor email:", error);
        else console.log("Mentor notification sent to:", mentorEmail);
    } catch (err) {
        console.error("Error sending mentor email:", err);
    }
}
