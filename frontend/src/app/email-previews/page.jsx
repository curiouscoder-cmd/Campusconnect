import {
    generateBookingEmailHtml,
    generateMentorNotificationHtml,
    generateNSATApprovalHtml,
    generateNSATReferralHtml,
    generateContactHtml,
    generatePromotionHtml,
    generateMentorOnboardingHtml,
    generateCustomHtml
} from "@/lib/email";
import PreviewViewer from "../admin/emails/preview/PreviewViewer";

export default async function PublicEmailPreviewPage() {
    // Generate dummy data for all templates
    const bookingHtml = await generateBookingEmailHtml({
        userName: "John Student",
        mentorName: "Expert Mentor",
        date: "2026-02-15",
        time: "10:00 AM",
        link: "https://meet.google.com/abc-123",
    });

    const mentorNotificationHtml = await generateMentorNotificationHtml({
        mentorName: "Expert Mentor",
        studentName: "John Student",
        date: "2026-02-15",
        time: "10:00 AM",
    });

    const nsatApprovalHtml = await generateNSATApprovalHtml({
        name: "Aspiring Student",
    });

    const nsatReferralHtml = await generateNSATReferralHtml({
        name: "Referred Friend",
    });

    const contactHtml = await generateContactHtml({
        name: "Visitor Name",
        email: "visitor@example.com",
        message: "This is a test message from the contact form.",
    });

    const promotionHtml = await generatePromotionHtml({
        heading: "Unlock Your Potential",
        subheading: "This is a preview of the promotion email template.",
        ctaText: "Preview Button",
        ctaLink: "#",
    });

    const onboardingHtml = await generateMentorOnboardingHtml({
        mentorName: "Dr. Preview",
        loginLink: "#",
    });

    const customHtml = await generateCustomHtml({
        subject: "Preview Subject",
        bodyContent: "This is a preview of the custom email content.\n\nIt supports multi-line text.",
        recipientName: "Preview User",
    });

    return (
        <div className="container mx-auto py-10 max-w-6xl">
            <h1 className="text-3xl font-bold mb-2">Public Email Previews</h1>
            <p className="text-slate-500 mb-8">
                Viewing all 8 email templates with dummy data.
            </p>

            <PreviewViewer
                previews={{
                    "Booking Confirmation": bookingHtml,
                    "Mentor Notification": mentorNotificationHtml,
                    "NSAT Approval": nsatApprovalHtml,
                    "NSAT Referral": nsatReferralHtml,
                    "Contact Form": contactHtml,
                    "Promotion": promotionHtml,
                    "Mentor Onboarding": onboardingHtml,
                    "Custom Email": customHtml
                }}
            />
        </div>
    );
}
