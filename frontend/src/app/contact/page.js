"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-16 max-w-2xl mt-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Contact Us</h1>
                    <p className="text-muted-foreground">
                        Questions about booking a session or becoming a student guide? We&apos;re here to help.
                    </p>
                </div>

                <div className="space-y-8">
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="Your name" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" placeholder="Your email" type="email" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" placeholder="How can we help?" className="min-h-[150px]" />
                        </div>
                        <Button className="w-full rounded-full">Send Message</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center border-t border-border/50 pt-8">
                        <div>
                            <h3 className="font-semibold mb-1">Email</h3>
                            <p className="text-sm text-muted-foreground">support@campusconnect.com</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-1">Office</h3>
                            <p className="text-sm text-muted-foreground">NST Campus, Delhi</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-1">Social</h3>
                            <p className="text-sm text-muted-foreground">@campusconnect</p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
