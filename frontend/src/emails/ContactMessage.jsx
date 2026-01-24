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
    fontSize: "36px",
    fontWeight: "800",
    color: "#1e293b",
    letterSpacing: "-1.5px",
    lineHeight: "1.1",
    margin: "0 0 24px",
    textAlign: "center",
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
    fontSize: "15px", // Slightly smaller for emails
    fontWeight: "600",
    color: "#0f172a",
    wordBreak: "break-all",
};

// ICONS
const UserIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);
const MailIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
);
const MessageIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4338ca" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
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
};

const messageBox = {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "24px",
    marginTop: "24px",
};

export default function ContactMessage({
    name = "John Doe",
    email = "john@example.com",
    message = "I am interested in mentorship but I have questions about the payment process.",
}) {
    return (
        <Html>
            <Head>
                <Font fontFamily="Inter" fallbackFontFamily="Helvetica" fontWeight={400} />
            </Head>
            <Preview>New Contact: {name}</Preview>
            <Body style={main}>
                <Container style={container}>

                    <Section style={ticketWrapper}>
                        {/* TOP SECTION */}
                        <div style={topSection}>

                            {/* BRAND LOGO */}
                            <div style={logoContainer}>
                                <Img
                                    src="https://campus-connect.co.in/icon.png"
                                    width="32"
                                    height="32"
                                    alt="Logo"
                                    style={{ display: "inline-block", verticalAlign: "middle" }}
                                />
                                <span style={logoText}>Campus Connect</span>
                            </div>

                            {/* BADGE */}
                            <div style={badgeContainer}>
                                <div style={badge}>
                                    <Text style={badgeText}>
                                        <span style={{ verticalAlign: "middle", marginRight: "6px", display: "inline-block" }}><MessageIcon /></span>
                                        NEW INQUIRY
                                    </Text>
                                </div>
                            </div>

                            <Heading style={heading}>New Message Received.</Heading>

                            {/* DATA SECTION */}
                            <Row style={featureRow}>
                                <Column style={{ width: "50%", paddingRight: "8px" }}>
                                    <div style={featureCard}>
                                        <div style={label}><UserIcon /> <span>SENDER</span></div>
                                        <div style={value}>{name}</div>
                                    </div>
                                </Column>
                                <Column style={{ width: "50%", paddingLeft: "8px" }}>
                                    <div style={featureCard}>
                                        <div style={label}><MailIcon /> <span>EMAIL</span></div>
                                        <div style={value}>
                                            <Link href={`mailto:${email}`} style={{ color: "#0f172a", textDecoration: "none" }}>{email}</Link>
                                        </div>
                                    </div>
                                </Column>
                            </Row>

                            {/* MESSAGE CONTENT */}
                            <div style={messageBox}>
                                <Text style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", marginBottom: "12px", letterSpacing: "1px" }}>
                                    Message Content
                                </Text>
                                <Text style={{ fontSize: "16px", color: "#334155", lineHeight: "1.6" }}>
                                    &quot;{message}&quot;
                                </Text>
                            </div>

                            <div style={{ marginTop: "32px" }}>
                                <Button href={`mailto:${email}`} style={button}>
                                    Reply via Email <span style={{ fontSize: "18px", verticalAlign: "middle", marginLeft: "4px" }}>›</span>
                                </Button>
                            </div>

                        </div>
                    </Section>

                    <Text style={{ textAlign: "center", fontSize: "12px", color: "#cbd5e1", marginTop: "40px" }}>
                        © {new Date().getFullYear()} Campus Connect • Admin System
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}
