import { Resend } from "resend";
import { render } from "@react-email/render";
import BookingConfirmation from "../emails/BookingConfirmation";
import MentorNotification from "../emails/MentorNotification";
import NSATApproval from "../emails/NSATApproval";
import NSATReferral from "../emails/NSATReferral";
import ContactMessage from "../emails/ContactMessage";


export function getResendClient() {
    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is not configured");
        return null;
    }
    return new Resend(process.env.RESEND_API_KEY);
}

// ---------------- HTML GENERATORS (Using React Email) ----------------

export const generateBookingEmailHtml = async (props) => {
    return await render(<BookingConfirmation {...props} />);
};

export const generateMentorNotificationHtml = async (props) => {
    return await render(<MentorNotification {...props} />);
};

export const generateNSATApprovalHtml = async (props) => {
    return await render(<NSATApproval {...props} />);
};

export const generateNSATReferralHtml = async (props) => {
    return await render(<NSATReferral {...props} />);
};

export const generateContactHtml = async (props) => {
    return await render(<ContactMessage {...props} />);
};


// ---------------- SEND FUNCTIONS ----------------

export async function sendBookingConfirmationEmail(params) {
    const { userEmail } = params;
    if (!process.env.RESEND_API_KEY || !userEmail) return;
    const resend = getResendClient();
    if (!resend) return;

    try {
        const html = await generateBookingEmailHtml(params);
        await resend.emails.send({
            from: "Campus Connect <noreply@campus-connect.co.in>",
            to: [userEmail],
            subject: "Booking Confirmed - Campus Connect",
            html
        });
        console.log("Booking confirmation email sent to:", userEmail);
    } catch (error) {
        console.error("Error sending booking confirmation email:", error);
    }
}

export async function sendMentorNotificationEmail(params) {
    const { mentorEmail } = params;
    if (!process.env.RESEND_API_KEY || !mentorEmail) return;
    const resend = getResendClient();
    if (!resend) return;

    try {
        const html = await generateMentorNotificationHtml(params);
        await resend.emails.send({
            from: "Campus Connect <noreply@campus-connect.co.in>",
            to: [mentorEmail],
            subject: "🔔 New Session Booked!",
            html
        });
        console.log("Mentor notification sent to:", mentorEmail);
    } catch (err) {
        console.error("Error sending mentor email:", err);
    }
}

export async function sendNSATApprovalEmail(params) {
    const { email } = params;
    if (!process.env.RESEND_API_KEY || !email) return { error: "Missing config" };
    const resend = getResendClient();
    if (!resend) return { error: "Client unavailable" };

    try {
        const html = await generateNSATApprovalHtml(params);
        return await resend.emails.send({
            from: "Campus Connect <noreply@campus-connect.co.in>",
            to: email,
            subject: "🎉 Your Free Session is Approved!",
            html
        });
    } catch (error) {
        console.error("NSAT Email Error:", error);
        return { error };
    }
}

export async function sendNSATReferralApprovalEmail(params) {
    const { email } = params;
    if (!process.env.RESEND_API_KEY || !email) return { error: "Missing config" };
    const resend = getResendClient();
    if (!resend) return { error: "Client unavailable" };

    try {
        const html = await generateNSATReferralHtml(params);
        return await resend.emails.send({
            from: "Campus Connect <noreply@campus-connect.co.in>",
            to: email,
            subject: "🎉 Your Free Session is Approved!",
            html
        });
    } catch (error) {
        console.error("NSAT Referral Email Error:", error);
        return { error };
    }
}

export async function sendContactFormEmail(params) {
    const { email, name } = params;
    if (!process.env.RESEND_API_KEY) return { success: true };
    const resend = getResendClient();
    if (!resend) return { error: "Client unavailable" };

    try {
        const html = await generateContactHtml(params);
        return await resend.emails.send({
            from: "Campus Connect <noreply@campus-connect.co.in>",
            to: ["contact@campus-connect.co.in"],
            replyTo: email,
            subject: `New Contact Form Message from ${name}`,
            html
        });
    } catch (error) {
        console.error("Contact Email Error:", error);
        return { error };
    }
}
