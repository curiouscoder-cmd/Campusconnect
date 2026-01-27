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
    Row,
    Column,
    Link,
    Hr,
    Img,
} from "@react-email/components";
import * as React from "react";

const main = {
    backgroundColor: "#ffffff",
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    // SPOTLIGHT GRID - BLUE TINT
    backgroundImage: `
    radial-gradient(circle at 50% 0%, rgba(79, 70, 229, 0.04) 0%, #ffffff 80%),
    linear-gradient(#f0f0f0 1px, transparent 1px), 
    linear-gradient(90deg, #f0f0f0 1px, transparent 1px)
  `,
    backgroundSize: "100% 100%, 40px 40px, 40px 40px",
    backgroundPosition: "0 0, center center, center center",
    minHeight: "100vh",
};

const container = { margin: "0 auto", padding: "60px 0 48px", maxWidth: "600px" };

const ticketWrapper = {
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    overflow: "hidden",
    // Premium Double Shadow
    boxShadow: "0 30px 60px -12px rgba(79, 70, 229, 0.1), 0 0 0 1px rgba(0,0,0,0.03)",
};

const topSection = {
    padding: "48px 40px",
    backgroundColor: "#ffffff",
    borderTop: "6px solid #4f46e5", // INDIGO BRAND STRIP
};

const bottomSection = {
    backgroundColor: "#f8fafc",
    padding: "32px 40px",
    borderTop: "1px dashed #cbd5e1",
};

const heading = {
    fontSize: "40px",
    fontWeight: "800",
    color: "#1e293b",
    letterSpacing: "-1.5px",
    lineHeight: "1.1",
    margin: "0 0 24px",
    textAlign: "center",
};

// HERO BOX
const heroBox = {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "40px",
    textAlign: "center",
};

const subText = {
    fontSize: "16px",
    color: "#475569",
    lineHeight: "1.6",
    margin: "0",
    fontWeight: "500",
};

// LOGO
const logoContainer = {
    textAlign: "center",
    marginBottom: "32px",
};

const logoText = {
    fontSize: "18px",
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: "-0.5px",
    marginLeft: "8px",
    display: "inline-block",
    verticalAlign: "middle",
};

// BADGE
const badgeContainer = {
    textAlign: "center",
    marginBottom: "20px",
};

const badge = {
    display: "inline-block",
    backgroundColor: "#eef2ff",
    border: "1px solid #c7d2fe",
    borderRadius: "100px",
    padding: "6px 16px",
};

const badgeText = {
    fontSize: "12px",
    fontWeight: "800",
    color: "#4338ca",
    textTransform: "uppercase",
    letterSpacing: "1px",
    margin: 0,
};

// FEATURE CARDS
const featureRow = { marginBottom: "16px" };

const featureCard = {
    backgroundColor: "#f8fafc",
    border: "1px solid #f1f5f9",
    borderRadius: "12px",
    padding: "16px",
    height: "100%",
};

const label = {
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: "#64748b",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
};

const value = {
    fontSize: "17px",
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: "-0.3px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
};

// ICONS (Inline SVGs for email compatibility)
const BrandLogo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle" }}>
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
);

const UserIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);
const ClockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);
const CalendarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
);
// const VerifiedCheck = () => (
//     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4338ca" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
// );
const ChevronRight = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: "4px", verticalAlign: "middle" }}><polyline points="9 18 15 12 9 6" /></svg>
);

const avatarCircle = {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#4f46e5",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #ffffff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginRight: "10px",
};

const tipItem = {
    fontSize: "13px",
    color: "#475569",
    marginBottom: "12px",
    paddingLeft: "16px",
    borderLeft: "2px solid #6366f1", // Indigo
    lineHeight: "1.5",
    fontWeight: "500",
};

const button = {
    backgroundColor: "#0f172a",
    borderRadius: "12px",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center",
    display: "block",
    width: "100%",
    padding: "18px 0",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
};

const contactLink = {
    color: "#4f46e5",
    textDecoration: "underline",
    fontWeight: "500",
};

export default function BookingConfirmation({
    userName = "Student",
    mentorName = "Nitya Jain",
    sessionType = "Quick Chat",
    slotDate = "2026-01-13",
    slotTime = "15:00",
    meetLink = "https://meet.google.com/abc",
    duration = "15 mins",
}) {
    const initials = mentorName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

    return (
        <Html>
            <Head>
                <Font fontFamily="Inter" fallbackFontFamily="Helvetica" fontWeight={400} />
            </Head>
            <Preview>Mentorship Confirmed: {sessionType}</Preview>
            <Body style={main}>
                <Container style={container}>

                    <Section style={ticketWrapper}>
                        {/* TOP SECTION */}
                        <div style={topSection}>

                            {/* BRAND LOGO */}
                            <div style={logoContainer}>
                                <Img
                                    src="https://campus-connect.co.in/icon.png"
                                    width="40"
                                    height="40"
                                    alt="Logo"
                                    style={{ display: "inline-block", verticalAlign: "middle" }}
                                />
                                <span style={logoText}>Campus Connect</span>
                            </div>

                            {/* VERIFIED BADGE */}
                            {/* <div style={badgeContainer}>
                                <div style={badge}>
                                    <Text style={badgeText}>
                                        <span style={{ verticalAlign: "middle", marginRight: "6px", display: "inline-block" }}><VerifiedCheck /></span>
                                        VERIFIED SESSION
                                    </Text>
                                </div>
                            </div> */}

                            <Heading style={heading}>Mentorship Confirmed!</Heading>

                            <div style={heroBox}>
                                <Text style={subText}>
                                    You&apos;re all set, {userName}.
                                    <br /><br />
                                    This session with <strong style={{ color: "#4f46e5" }}>{mentorName}</strong> is a massive advantage for your career. Make it count.
                                </Text>
                            </div>

                            {/* DATA SECTION: FEATURE CARDS */}
                            <Row style={featureRow}>
                                <Column style={{ width: "50%", paddingRight: "8px" }}>
                                    <div style={featureCard}>
                                        <div style={label}><UserIcon /> <span>MENTOR</span></div>
                                        <div style={value}>
                                            {/* Initials Avatar */}
                                            {/* <span style={avatarCircle}>{initials}</span> */}
                                            <span>{mentorName}</span>
                                        </div>
                                    </div>
                                </Column>
                                <Column style={{ width: "50%", paddingLeft: "8px" }}>
                                    <div style={featureCard}>
                                        <div style={label}><ClockIcon /> <span>DURATION</span></div>
                                        <div style={value}>{duration}</div>
                                    </div>
                                </Column>
                            </Row>

                            <Row>
                                <Column style={{ width: "50%", paddingRight: "8px" }}>
                                    <div style={featureCard}>
                                        <div style={label}><CalendarIcon /> <span>DATE</span></div>
                                        <div style={value}>{slotDate}</div>
                                    </div>
                                </Column>
                                <Column style={{ width: "50%", paddingLeft: "8px" }}>
                                    <div style={featureCard}>
                                        <div style={label}><ClockIcon /> <span>TIME</span></div>
                                        <div style={value}>{slotTime}</div>
                                    </div>
                                </Column>
                            </Row>
                        </div>

                        {/* BOTTOM SECTION */}
                        <div style={bottomSection}>
                            <Row>
                                <Column style={{ width: "55%", paddingRight: "24px" }}>
                                    <Text style={{ fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", marginBottom: "16px", letterSpacing: "1px" }}>
                                        Preparation Checklist
                                    </Text>
                                    <Text style={tipItem}>Join 2-3 minutes early</Text>
                                    <Text style={tipItem}>Prepare your questions</Text>
                                    <Text style={tipItem}>Check internet stability</Text>
                                    <Text style={tipItem}>Use headphones</Text>
                                </Column>
                                <Column style={{ width: "45%", verticalAlign: "bottom" }}>
                                    <Button href={meetLink} style={button}>
                                        Join Session <span style={{ fontSize: "18px", verticalAlign: "middle", marginLeft: "4px" }}>›</span>
                                    </Button>

                                    {/* Google Calendar Link Logic */}
                                    {(() => {
                                        try {
                                            const cleanTime = (slotTime || "12:00").substring(0, 5);
                                            const start = new Date(`${slotDate}T${cleanTime}:00`);
                                            // Handle duration text "15 mins" -> 15
                                            const durationMin = parseInt(duration) || 30;
                                            const end = new Date(start.getTime() + durationMin * 60000);

                                            const formatCalDate = (d) => d.toISOString().replace(/-|:|\\.\\d+/g, "");

                                            if (!isNaN(start.getTime())) {
                                                const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Mentorship: ${mentorName} - ${sessionType}`)}&dates=${formatCalDate(start)}/${formatCalDate(end)}&details=${encodeURIComponent(`Session with ${mentorName}. Link: ${meetLink}`)}&location=${encodeURIComponent(meetLink)}`;

                                                return (
                                                    <Button href={calUrl} style={{ ...button, backgroundColor: "#ffffff", color: "#0f172a", border: "1px solid #cbd5e1", marginTop: "12px", boxShadow: "none" }}>
                                                        Add to Google Calendar
                                                    </Button>
                                                );
                                            }
                                        } catch (e) {
                                            return null;
                                        }
                                    })()}
                                </Column>
                            </Row>
                        </div>
                    </Section>

                    <Text style={{ textAlign: "center", fontSize: "13px", color: "#64748b", marginTop: "40px", marginBottom: "12px", maxWidth: "420px", marginLeft: "auto", marginRight: "auto", lineHeight: "1.5" }}>
                        Questions? Reply to this email or contact us at <br />
                        <Link href="mailto:contact@campus-connect.co.in" style={contactLink}>contact@campus-connect.co.in</Link>
                    </Text>

                    <Text style={{ textAlign: "center", fontSize: "12px", color: "#cbd5e1" }}>
                        © {new Date().getFullYear()} Campus Connect • Career Guidance
                    </Text>
                </Container>
            </Body>
        </Html >
    );
}
