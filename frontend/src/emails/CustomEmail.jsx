import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Font,
    Img,
    Hr,
    Tailwind,
} from "@react-email/components";
import * as React from "react";

export default function CustomEmail({
    subject = "Important Update",
    bodyContent = "This is a message from the Campus Connect team.",
    recipientName = "User",
    ctaText,
    ctaLink,
}) {
    return (
        <Html>
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                brand: "#4f46e5",
                                textMain: "#1e293b",
                                textMuted: "#475569",
                            },
                        },
                    },
                }}
            >
                <Head>
                    <Font fontFamily="Inter" fallbackFontFamily="Helvetica" fontWeight={400} />
                </Head>
                <Preview>{subject}</Preview>
                <Body className="bg-white min-h-screen font-sans" style={{
                    backgroundImage: `radial-gradient(circle at 50% 0%, rgba(79, 70, 229, 0.04) 0%, #ffffff 80%), linear-gradient(#f0f0f0 1px, transparent 1px), linear-gradient(90deg, #f0f0f0 1px, transparent 1px)`,
                    backgroundSize: "100% 100%, 40px 40px, 40px 40px",
                    backgroundPosition: "0 0, center center, center center",
                }}>
                    <Container className="mx-auto py-12 px-0 max-w-[580px]">
                        <Section className="bg-white rounded-3xl overflow-hidden shadow-[0_30px_60px_-12px_rgba(79,70,229,0.1),0_0_0_1px_rgba(0,0,0,0.03)] border border-gray-100">
                            <div className="p-10 border-t-8 border-brand">
                                {/* BRAND LOGO */}
                                <div className="mb-8">
                                    <Img
                                        src="https://campus-connect.co.in/icon.png"
                                        width="32"
                                        height="32"
                                        alt="Logo"
                                        className="inline-block align-middle"
                                    />
                                    <span className="text-lg font-extrabold text-slate-900 tracking-tight ml-2 inline-block align-middle">
                                        Campus Connect
                                    </span>
                                </div>

                                <Heading className="text-2xl font-bold text-slate-900 tracking-tight m-0 mb-6">
                                    {subject}
                                </Heading>

                                {recipientName && (
                                    <Text className="text-base text-slate-600 leading-relaxed m-0 mb-4 px-1">
                                        Dear {recipientName},
                                    </Text>
                                )}

                                <Text className="text-base text-slate-600 leading-relaxed whitespace-pre-wrap px-1">
                                    {bodyContent}
                                </Text>

                                {ctaText && ctaLink && (
                                    <Button
                                        href={ctaLink}
                                        className="bg-slate-900 text-white text-base font-semibold rounded-xl text-center block w-full py-4 mt-8 shadow-md hover:bg-slate-800 transition-colors"
                                    >
                                        {ctaText}
                                    </Button>
                                )}

                                <Hr className="border-gray-200 my-8" />

                                <Text className="text-sm text-slate-400 font-medium">
                                    Best regards,<br />
                                    The Campus Connect Team
                                </Text>
                            </div>

                            <div className="bg-slate-50 p-6 border-t border-dashed border-slate-200">
                                <Text className="text-center text-xs text-slate-300 m-0">
                                    © {new Date().getFullYear()} Campus Connect
                                </Text>
                            </div>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
