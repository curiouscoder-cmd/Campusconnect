import {
    generatePromotionHtml,
    generateMentorOnboardingHtml,
    generateCustomHtml
} from "@/lib/email";
import PreviewViewer from "./PreviewViewer";

export default async function EmailPreviewPage() {
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
            <h1 className="text-3xl font-bold mb-6">Email Template Previews</h1>
            <PreviewViewer
                previews={{
                    promotion: promotionHtml,
                    onboarding: onboardingHtml,
                    custom: customHtml
                }}
            />
        </div>
    );
}
