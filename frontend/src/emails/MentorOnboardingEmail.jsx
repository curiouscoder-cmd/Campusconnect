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
    Hr,
    Tailwind,
} from "@react-email/components";
import * as React from "react";

export default function MentorOnboardingEmail({
    mentorName = "Expert",
    loginLink = "https://campus-connect.co.in/login",
    resources = [
        { label: "Community Guidelines", link: "https://campus-connect.co.in/terms" },
        { label: "Complete Your Profile", link: "https://campus-connect.co.in/profile" },
        { label: "Add Availability Slots", link: "https://campus-connect.co.in/mentor-dashboard" },
    ]
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
                <Preview>Welcome to Campus Connect, {mentorName}!</Preview>
                <Body className="bg-white min-h-screen font-sans" style={{
                    backgroundImage: `radial-gradient(circle at 50% 0%, rgba(79, 70, 229, 0.04) 0%, #ffffff 80%), linear-gradient(#f0f0f0 1px, transparent 1px), linear-gradient(90deg, #f0f0f0 1px, transparent 1px)`,
                    backgroundSize: "100% 100%, 40px 40px, 40px 40px",
                    backgroundPosition: "0 0, center center, center center",
                }}>
                    <Container className="mx-auto py-12 px-0 max-w-[600px]">
                        <Section className="bg-white rounded-3xl overflow-hidden shadow-[0_30px_60px_-12px_rgba(79,70,229,0.1),0_0_0_1px_rgba(0,0,0,0.03)] border border-gray-100">
                            <div className="p-10 border-t-8 border-brand">
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

                                <Heading className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight m-0 mb-6 text-center">
                                    Welcome Aboard!
                                </Heading>

                                <Text className="text-base text-slate-600 leading-relaxed m-0 mb-4 px-2">
                                    Hi <strong>{mentorName}</strong>,
                                </Text>
                                <Text className="text-base text-slate-600 leading-relaxed m-0 mb-8 px-2">
                                    We are thrilled to have you join our community of industry experts. Your experience will be invaluable to students. Here is your quick start guide to getting your first booking:
                                </Text>

                                {/* ONBOARDING STEPS */}
                                <div className="bg-indigo-50/50 rounded-2xl p-6 mb-8 border border-indigo-100">
                                    <div className="mb-4 flex items-start">
                                        <div className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5 mr-3 shrink-0">1</div>
                                        <div>
                                            <div className="font-bold text-slate-900 text-sm">Complete Your Profile</div>
                                            <div className="text-slate-500 text-xs mt-1">Add your bio, expertise, and a professional photo.</div>
                                        </div>
                                    </div>
                                    <div className="mb-4 flex items-start">
                                        <div className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5 mr-3 shrink-0">2</div>
                                        <div>
                                            <div className="font-bold text-slate-900 text-sm">Set Your Availability</div>
                                            <div className="text-slate-500 text-xs mt-1">Open 15 or 30 mins slots for students to book.</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5 mr-3 shrink-0">3</div>
                                        <div>
                                            <div className="font-bold text-slate-900 text-sm">Connect Payments</div>
                                            <div className="text-slate-500 text-xs mt-1">Link your account to receive payouts instantly.</div>
                                        </div>
                                    </div>
                                </div>

                                <Hr className="border-gray-200 my-8" />

                                <Text className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
                                    Helpful Resources:
                                </Text>

                                {resources.map((resource, index) => (
                                    <Link
                                        key={index}
                                        href={resource.link}
                                        className="block p-4 bg-white rounded-xl border border-gray-100 text-indigo-600 font-semibold mb-3 no-underline text-sm hover:border-indigo-200 hover:bg-slate-50 transition-all shadow-sm group"
                                    >
                                        <span className="group-hover:translate-x-1 transition-transform inline-block">→</span> {resource.label}
                                    </Link>
                                ))}

                                <Button
                                    href={loginLink}
                                    className="bg-slate-900 text-white text-base font-semibold rounded-xl text-center block w-full py-4 mt-8 shadow-xl hover:bg-slate-800 transition-colors"
                                >
                                    Go to Dashboard <span className="ml-2">›</span>
                                </Button>
                            </div>

                            <div className="bg-slate-50 p-6 border-t border-dashed border-slate-200">
                                <Text className="text-center text-xs text-slate-400 m-0 leading-relaxed">
                                    Need help? Reply to this email.<br />
                                    © {new Date().getFullYear()} Campus Connect • Mentor Support
                                </Text>
                            </div>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
