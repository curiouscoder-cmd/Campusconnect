"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Users, GraduationCap, MessageCircle, Target } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Navbar />
            <main className="flex-1 mt-16">
                {/* Hero Section */}
                <section className="py-20 bg-gradient-to-b from-primary/5 to-transparent">
                    <div className="container mx-auto px-4 max-w-4xl text-center">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                            About Campus Connect
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            We&apos;re bridging the gap between college applicants and real students
                            who&apos;ve been through the same journey you&apos;re on.
                        </p>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-16">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    Choosing the right college is one of the biggest decisions in a student&apos;s life.
                                    Yet, most applicants rely on brochures, college websites, and rumors to make this choice.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    We believe every applicant deserves honest, first-hand insights from students
                                    who are actually living the college experience. That&apos;s why we created
                                    Campus Connect — a platform where you can talk directly to current students
                                    and get the real picture.
                                </p>
                            </div>
                            <div className="bg-primary/5 rounded-2xl p-8">
                                <Target className="w-12 h-12 text-primary mb-4" />
                                <h3 className="text-xl font-semibold mb-2">Our Goal</h3>
                                <p className="text-muted-foreground">
                                    Help every student make an informed college decision by connecting them
                                    with authentic voices from campuses they&apos;re considering.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-16 bg-muted/30">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="font-semibold mb-2">Browse Mentors</h3>
                                <p className="text-sm text-muted-foreground">
                                    Explore profiles of current students from colleges you&apos;re interested in.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MessageCircle className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="font-semibold mb-2">Book a Session</h3>
                                <p className="text-sm text-muted-foreground">
                                    Schedule a 1:1 video call at a time that works for you.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <GraduationCap className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="font-semibold mb-2">Get Real Insights</h3>
                                <p className="text-sm text-muted-foreground">
                                    Ask about campus life, placements, faculty, and everything else.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-16">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="p-6 border border-border/50 rounded-xl">
                                <h3 className="font-semibold text-lg mb-2">🎯 Authenticity</h3>
                                <p className="text-muted-foreground">
                                    We only feature verified current students who share genuine, unfiltered experiences.
                                </p>
                            </div>
                            <div className="p-6 border border-border/50 rounded-xl">
                                <h3 className="font-semibold text-lg mb-2">💰 Affordability</h3>
                                <p className="text-muted-foreground">
                                    Quality guidance shouldn&apos;t break the bank. Our sessions are priced for students.
                                </p>
                            </div>
                            <div className="p-6 border border-border/50 rounded-xl">
                                <h3 className="font-semibold text-lg mb-2">🤝 Trust</h3>
                                <p className="text-muted-foreground">
                                    Secure payments, verified mentors, and a 100% refund policy if you&apos;re not satisfied.
                                </p>
                            </div>
                            <div className="p-6 border border-border/50 rounded-xl">
                                <h3 className="font-semibold text-lg mb-2">🚀 Accessibility</h3>
                                <p className="text-muted-foreground">
                                    Connect from anywhere. All you need is an internet connection to talk to any mentor.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-slate-900 text-white">
                    <div className="container mx-auto px-4 max-w-2xl text-center">
                        <h2 className="text-3xl font-bold mb-4">Ready to connect?</h2>
                        <p className="text-white/70 mb-8">
                            Talk to a real student today and make your college decision with confidence.
                        </p>
                        <a
                            href="/#mentors"
                            className="inline-block px-8 py-3 bg-white text-slate-900 font-semibold rounded-full hover:bg-white/90 transition-colors"
                        >
                            Browse Mentors
                        </a>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
