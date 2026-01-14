"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 mt-16 py-16">
                <div className="container px-4 md:px-6 mx-auto max-w-4xl">
                    <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                    <p className="text-muted-foreground mb-8">Last updated: January 9, 2026</p>

                    <div className="prose prose-gray max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Campus Connect (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                            <h3 className="text-xl font-medium mb-3">Personal Information</h3>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                                <li>Name and email address (when you create an account)</li>
                                <li>Phone number (optional, for booking confirmations)</li>
                                <li>Payment information (processed securely via Razorpay)</li>
                                <li>College/educational interests (to match you with mentors)</li>
                            </ul>

                            <h3 className="text-xl font-medium mb-3">Automatically Collected Information</h3>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>Device information (browser type, operating system)</li>
                                <li>IP address and location data</li>
                                <li>Usage data (pages visited, time spent on platform)</li>
                                <li>Cookies and similar tracking technologies</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>To create and manage your account</li>
                                <li>To process bookings and payments</li>
                                <li>To connect you with appropriate mentors</li>
                                <li>To send booking confirmations and reminders</li>
                                <li>To improve our platform and user experience</li>
                                <li>To respond to your inquiries and support requests</li>
                                <li>To send promotional communications (with your consent)</li>
                                <li>To comply with legal obligations</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">4. Information Sharing</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                We do not sell your personal information. We may share your information with:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li><strong>Mentors:</strong> Basic information needed for sessions (name, email for meeting invites)</li>
                                <li><strong>Payment Processors:</strong> Razorpay for secure payment processing</li>
                                <li><strong>Service Providers:</strong> Third parties who help us operate our platform (hosting, analytics)</li>
                                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. These measures include encryption, secure servers, and access controls. However, no method of transmission over the Internet is 100% secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                You have the following rights regarding your personal data:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
                                <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                                <li><strong>Objection:</strong> Object to processing of your data for certain purposes</li>
                                <li><strong>Data Portability:</strong> Request transfer of your data to another service</li>
                                <li><strong>Withdraw Consent:</strong> Withdraw consent for marketing communications</li>
                            </ul>
                            <p className="text-muted-foreground mt-4">
                                To exercise these rights, contact us at nityaprofessional6402@gmail.com
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We use cookies and similar technologies to enhance your experience, analyze usage patterns, and personalize content. You can manage cookie preferences through your browser settings. Note that disabling cookies may affect some functionality of our platform.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">8. Third-Party Links</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Our platform may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to read the privacy policies of any third-party sites you visit.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">9. Children&apos;s Privacy</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Our services are not intended for users under 13 years of age. We do not knowingly collect personal information from children under 13. If we learn we have collected data from a child under 13, we will delete it promptly.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">10. Data Retention</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We retain your personal data only as long as necessary to provide our services and fulfill the purposes described in this policy. Account data is retained until you request deletion. Transaction records may be retained longer for legal and accounting purposes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">11. Changes to This Policy</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We may update this Privacy Policy periodically. We will notify you of significant changes via email or a prominent notice on our platform. We encourage you to review this policy regularly.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:
                            </p>
                            <p className="text-muted-foreground mt-2">
                                <strong>Email:</strong> contact@campus-connect.co.in<br />
                                <strong>Website:</strong> https://campus-connect.co.in
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
