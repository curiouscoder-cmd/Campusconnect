"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function TermsPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 mt-16 py-16">
                <div className="container px-4 md:px-6 mx-auto max-w-4xl">
                    <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
                    <p className="text-muted-foreground mb-8">Last updated: January 9, 2026</p>

                    <div className="prose prose-gray max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Welcome to Campus Connect. By accessing or using our platform, you agree to be bound by these Terms and Conditions. Please read them carefully before using our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Campus Connect is a platform that connects prospective students with current students from various colleges. Our service enables users to book video call sessions with mentors (current students) to get first-hand insights about college life, academics, placements, and more.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">3. User Eligibility</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                You must be at least 13 years of age to use our services. If you are under 18, you must have parental or guardian consent to use our platform. By using our services, you represent that you meet these eligibility requirements.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">4. User Accounts</h2>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                                <li>You agree to provide accurate and complete information during registration.</li>
                                <li>You are responsible for all activities that occur under your account.</li>
                                <li>You must notify us immediately of any unauthorized use of your account.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">5. Booking and Payments</h2>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>All session bookings are subject to mentor availability.</li>
                                <li>Payments are processed securely through Razorpay.</li>
                                <li>Prices are displayed in Indian Rupees (INR) and include all applicable taxes.</li>
                                <li>Refunds are processed according to our Cancellation and Refund Policy.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">6. Session Guidelines</h2>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>Sessions are conducted via video calls at the scheduled time.</li>
                                <li>Users should join sessions on time and maintain professional conduct.</li>
                                <li>Recording of sessions without mutual consent is prohibited.</li>
                                <li>Sharing of inappropriate content during sessions is strictly prohibited.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">7. Mentor Responsibilities</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Mentors on our platform are current students sharing their personal experiences. The advice and information provided is based on their individual experiences and should not be considered as professional career counseling or official college representation.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Campus Connect provides a platform for connecting users with mentors. We are not responsible for the accuracy of information shared by mentors, decisions made based on mentor advice, or any disputes between users and mentors. Our platform is provided &quot;as is&quot; without warranties of any kind.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">9. Intellectual Property</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                All content on the Campus Connect platform, including logos, text, graphics, and software, is our property or licensed to us. You may not copy, modify, or distribute any content without our written permission.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We reserve the right to suspend or terminate your account if you violate these terms or engage in fraudulent, abusive, or illegal activities on our platform.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We may update these Terms and Conditions from time to time. Continued use of our platform after changes constitutes acceptance of the new terms. We will notify users of significant changes via email or platform notifications.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                If you have any questions about these Terms and Conditions, please contact us at:
                            </p>
                            <p className="text-muted-foreground mt-2">
                                <strong>Email:</strong> nityaprofessional6402@gmail.com<br />
                                <strong>Website:</strong> campusconnect.vercel.app
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">13. Governing Law</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in India.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
