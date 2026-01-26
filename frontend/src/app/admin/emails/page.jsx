"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowUpRight, Loader2, Send } from "lucide-react";

export default function EmailDashboard() {
    const [loading, setLoading] = useState(false);

    const handleSend = async (type, data) => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type, data }),
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error);
            toast.success("Email sent successfully!");
        } catch (error) {
            toast.error(error.message || "Failed to send email");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-10 max-w-5xl space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Email Management</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage and send transactional and marketing emails.
                    </p>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/admin/emails/preview" target="_blank">
                        Live Previews <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>

            <Tabs defaultValue="custom" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="custom">Quick Send</TabsTrigger>
                    <TabsTrigger value="promotion">Campaigns</TabsTrigger>
                    <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
                </TabsList>

                {/* CUSTOM EMAIL TAB */}
                <TabsContent value="custom">
                    <Card>
                        <CardHeader>
                            <CardTitle>Send Custom Email</CardTitle>
                            <CardDescription>
                                Send a one-off email to a specific user with a custom message.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.target);
                                    handleSend("custom", {
                                        email: formData.get("email"),
                                        subject: formData.get("subject"),
                                        recipientName: formData.get("recipientName"),
                                        bodyContent: formData.get("bodyContent"),
                                    });
                                }}
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="custom-email">Recipient Email</Label>
                                        <Input id="custom-email" name="email" type="email" placeholder="user@example.com" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="custom-name">Recipient Name</Label>
                                        <Input id="custom-name" name="recipientName" placeholder="John Doe" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="custom-subject">Subject</Label>
                                    <Input id="custom-subject" name="subject" placeholder="Important Update regarding your account" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="custom-body">Message Body</Label>
                                    <Textarea id="custom-body" name="bodyContent" placeholder="Type your message here..." className="min-h-[150px]" required />
                                </div>
                                <Button type="submit" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Send Email <Send className="ml-2 h-4 w-4" />
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* PROMOTION EMAIL TAB */}
                <TabsContent value="promotion">
                    <Card>
                        <CardHeader>
                            <CardTitle>Promotional Campaign</CardTitle>
                            <CardDescription>
                                Send a marketing email with a call-to-action to a user.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.target);
                                    handleSend("promotion", {
                                        email: formData.get("email"),
                                        subject: formData.get("subject"),
                                        heading: formData.get("heading"),
                                        subheading: formData.get("subheading"),
                                        ctaText: formData.get("ctaText"),
                                        ctaLink: formData.get("ctaLink"),
                                        // heroImage is optional/placeholder for now
                                    });
                                }}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="promo-email">Recipient Email</Label>
                                    <Input id="promo-email" name="email" type="email" placeholder="user@example.com" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="promo-subject">Email Subject</Label>
                                    <Input id="promo-subject" name="subject" defaultValue="Exclusive Offer from Campus Connect" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="promo-heading">Heading</Label>
                                    <Input id="promo-heading" name="heading" defaultValue="Unlock Your Potential" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="promo-subheading">Subheading</Label>
                                    <Textarea id="promo-subheading" name="subheading" defaultValue="Get exclusive access to top mentors..." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="promo-ctaText">CTA Button Text</Label>
                                        <Input id="promo-ctaText" name="ctaText" defaultValue="Get Started Now" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="promo-ctaLink">CTA Link</Label>
                                        <Input id="promo-ctaLink" name="ctaLink" defaultValue="https://campus-connect.co.in/pricing" />
                                    </div>
                                </div>
                                <Button type="submit" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Send Campaign <Send className="ml-2 h-4 w-4" />
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ONBOARDING EMAIL TAB */}
                <TabsContent value="onboarding">
                    <Card>
                        <CardHeader>
                            <CardTitle>Mentor Onboarding</CardTitle>
                            <CardDescription>
                                Send a welcome email to a new mentor with resource links.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.target);
                                    handleSend("onboarding", {
                                        email: formData.get("email"),
                                        mentorName: formData.get("mentorName"),
                                    });
                                }}
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="onboard-email">Mentor Email</Label>
                                        <Input id="onboard-email" name="email" type="email" placeholder="mentor@example.com" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="onboard-name">Mentor Name</Label>
                                        <Input id="onboard-name" name="mentorName" placeholder="Dr. Smith" required />
                                    </div>
                                </div>
                                <Button type="submit" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Send Welcome Email <Send className="ml-2 h-4 w-4" />
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
