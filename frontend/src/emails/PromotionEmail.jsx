import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Button,
    Font,
    Img,
    Link,
    Tailwind,
} from "@react-email/components";
import * as React from "react";

export default function PromotionEmail({
    heading = "Unlock Your Potential with Campus Connect Pro",
    subheading = "Get exclusive access to top mentors, premium resources, and personalized career guidance. Start your journey today.",
    ctaText = "Get Started Now",
    ctaLink = "https://campus-connect.co.in/pricing",
    heroImage = "https://campus-connect.co.in/assets/promotion-hero.png",
}) {
    return (
        <Html>
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                brand: "#4f46e5",
                                brandDark: "#4338ca",
                                textMain: "#1e293b",
                                textMuted: "#475569",
                            },
                        },
                    },
                }}
            >
                <Head>
                    <Font fontFamily="Inter" fallbackFontFamily="Helvetica" fontWeight={400} />
                    <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.8s ease-out forwards;
          }
        `}</style>
                </Head>
                <Preview>{heading}</Preview>
                <Body className="bg-white min-h-screen font-sans" style={{
                    backgroundImage: `radial-gradient(circle at 50% 0%, rgba(79, 70, 229, 0.04) 0%, #ffffff 80%), linear-gradient(#f0f0f0 1px, transparent 1px), linear-gradient(90deg, #f0f0f0 1px, transparent 1px)`,
                    backgroundSize: "100% 100%, 40px 40px, 40px 40px",
                    backgroundPosition: "0 0, center center, center center",
                }}>
                    <Container className="mx-auto py-12 px-0 max-w-[600px]">
                        <Section className="bg-white rounded-3xl overflow-hidden shadow-[0_30px_60px_-12px_rgba(79,70,229,0.1),0_0_0_1px_rgba(0,0,0,0.03)]">
                            <div className="p-10 animate-fade-in border-t-8 border-brand">
                                {/* BRAND LOGO */}
                                <div className="text-center mb-10">
                                    <Img
                                        src="https://campus-connect.co.in/icon.png"
                                        width="40"
                                        height="40"
                                        alt="Logo"
                                        className="inline-block align-middle"
                                    />
                                    <span className="text-lg font-extrabold text-slate-900 tracking-tighter ml-2 inline-block align-middle">
                                        Campus Connect
                                    </span>
                                </div>

                                {heroImage && (
                                    <Img
                                        src={heroImage}
                                        width="100%"
                                        height="auto"
                                        alt="Promotion"
                                        className="rounded-2xl mb-8 border border-gray-100 shadow-sm"
                                    />
                                )}

                                <Heading className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight m-0 mb-6 text-center">
                                    {heading}
                                </Heading>
                                <Text className="text-base text-slate-600 leading-relaxed m-0 mb-8 text-center px-4">
                                    {subheading}
                                </Text>

                                <Button
                                    href={ctaLink}
                                    className="bg-slate-900 text-white text-base font-semibold rounded-xl text-center block w-full py-4 shadow-xl hover:bg-slate-800 transition-all transform hover:-translate-y-1"
                                >
                                    {ctaText} <span className="ml-2">→</span>
                                </Button>
                            </div>

                            <div className="bg-slate-50 p-8 border-t border-dashed border-slate-200">
                                <Text className="text-center text-xs text-slate-500 m-0 leading-normal font-medium uppercase tracking-wider mb-4">
                                    Trusted by 5000+ Students
                                </Text>
                                <Text className="text-center text-xs text-slate-400 m-0 leading-normal">
                                    You received this email because you signed up for Campus Connect.
                                    <br />
                                    <Link href="https://campus-connect.co.in/settings" className="text-brand underline">
                                        Unsubscribe
                                    </Link>
                                </Text>
                                <Text className="text-center text-xs text-slate-300 mt-4">
                                    © {new Date().getFullYear()} Campus Connect • Career Guidance
                                </Text>
                            </div>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
