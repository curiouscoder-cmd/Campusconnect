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
    boxShadow: "0 30px 60px -12px rgba(79, 70, 229, 0.1), 0 0 0 1px rgba(0,0,0,0.03)",
};

const topSection = {
    padding: "48px 40px",
    backgroundColor: "#ffffff",
    borderTop: "6px solid #4f46e5",
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

const badgeContainer = {
    textAlign: "center",
    marginBottom: "20px",
};

const badge = {
    display: "inline-block",
    backgroundColor: "#f3e8ff", // Purple-50 for Referral
    border: "1px solid #d8b4fe",
    borderRadius: "100px",
    padding: "6px 16px",
};

const badgeText = {
    fontSize: "12px",
    fontWeight: "800",
    color: "#7e22ce", // Purple-700
    textTransform: "uppercase",
    letterSpacing: "1px",
    margin: 0,
};

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

// ICONS
const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7e22ce" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);
const ClockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);
const CalendarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
);

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
    marginTop: "24px",
};

const contactLink = {
    color: "#4f46e5",
    textDecoration: "underline",
    fontWeight: "500",
};

export default function NSATReferral({
    name = "Student",
    referral = { preferred_date: "TBD", preferred_time: "TBD" }
}) {
    return (
        <Html>
            <Head>
                <Font fontFamily="Inter" fallbackFontFamily="Helvetica" fontWeight={400} />
            </Head>
            <Preview>Referral Verified: Free Session Unlocked</Preview>
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

                            {/* BADGE */}
                            <div style={badgeContainer}>
                                <div style={badge}>
                                    <Text style={badgeText}>
                                        <span style={{ verticalAlign: "middle", marginRight: "6px", display: "inline-block" }}><CheckIcon /></span>
                                        REFERRAL VERIFIED
                                    </Text>
                                </div>
                            </div>

                            <Heading style={heading}>Referral Verified.</Heading>

                            <div style={heroBox}>
                                <Text style={subText}>
                                    Great news {name}!
                                    <br /><br />
                                    Your referral worked and we've unlocked your free session.
                                </Text>
                            </div>

                            {/* DATA SECTION: FEATURE CARDS */}
                            <Row style={featureRow}>
                                <Column style={{ width: "50%", paddingRight: "8px" }}>
                                    <div style={featureCard}>
                                        <div style={label}><CalendarIcon /> <span>DATE</span></div>
                                        <div style={value}>
                                            {referral.preferred_date}
                                        </div>
                                    </div>
                                </Column>
                                <Column style={{ width: "50%", paddingLeft: "8px" }}>
                                    <div style={featureCard}>
                                        <div style={label}><ClockIcon /> <span>TIME</span></div>
                                        <div style={value}>{referral.preferred_time}</div>
                                    </div>
                                </Column>
                            </Row>

                            <Button href="https://campus-connect.co.in" style={button}>
                                Visit Campus Connect <span style={{ fontSize: "18px", verticalAlign: "middle", marginLeft: "4px" }}>›</span>
                            </Button>

                        </div>
                    </Section>

                    <Text style={{ textAlign: "center", fontSize: "13px", color: "#64748b", marginTop: "40px", marginBottom: "12px", maxWidth: "420px", marginLeft: "auto", marginRight: "auto", lineHeight: "1.5" }}>
                        Questions? Reply to this email or contact us at <br />
                        <Link href="mailto:contact@campus-connect.co.in" style={contactLink}>contact@campus-connect.co.in</Link>
                    </Text>

                    <Text style={{ textAlign: "center", fontSize: "12px", color: "#cbd5e1" }}>
                        © {new Date().getFullYear()} Campus Connect • Referral Program
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}
