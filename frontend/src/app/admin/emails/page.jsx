"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Send, Mail, Sparkles, UserPlus, Eye, CheckCircle2 } from "lucide-react";
import { render } from "@react-email/render";
import CustomEmail from "@/emails/CustomEmail";
import PromotionEmail from "@/emails/PromotionEmail";
import MentorOnboardingEmail from "@/emails/MentorOnboardingEmail";

const templates = [
    {
        id: "custom",
        name: "Custom Email",
        icon: Mail,
        description: "One-off message",
    },
    {
        id: "promotion",
        name: "Promotion",
        icon: Sparkles,
        description: "Marketing campaign",
    },
    {
        id: "onboarding",
        name: "Mentor Onboarding",
        icon: UserPlus,
        description: "Welcome new mentors",
    },
];

import { GridPattern } from "@/components/ui/fancy/GridPattern";

export default function EmailDashboard() {
    const [activeTemplate, setActiveTemplate] = useState("custom");
    const [loading, setLoading] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState(null);
    const [previewHtml, setPreviewHtml] = useState("");

    // Form states for live preview
    const [customForm, setCustomForm] = useState({
        email: "",
        recipientName: "John Doe",
        subject: "Important Update",
        bodyContent: "Hello! This is a test message.",
    });

    const [promoForm, setPromoForm] = useState({
        email: "",
        subject: "Exclusive Offer from Campus Connect",
        heading: "Unlock Your Potential",
        subheading: "Get exclusive access to top mentors and accelerate your career growth.",
        ctaText: "Get Started Now",
        ctaLink: "https://campus-connect.co.in/pricing",
        bannerUrl: "https://campus-connect.co.in/assets/promotion-hero.png",
    });

    const [onboardForm, setOnboardForm] = useState({
        email: "",
        mentorName: "Dr. Smith",
    });

    // Handle Async Preview Generation
    useEffect(() => {
        const generatePreview = async () => {
            try {
                let html = "";
                if (activeTemplate === "custom") {
                    html = await render(
                        <CustomEmail
                            recipientName={customForm.recipientName || "User"}
                            subject={customForm.subject}
                            bodyContent={customForm.bodyContent}
                        />
                    );
                } else if (activeTemplate === "promotion") {
                    html = await render(
                        <PromotionEmail
                            heading={promoForm.heading}
                            subheading={promoForm.subheading}
                            ctaText={promoForm.ctaText}
                            ctaUrl={promoForm.ctaLink}
                            bannerUrl={promoForm.bannerUrl}
                        />
                    );
                } else if (activeTemplate === "onboarding") {
                    html = await render(<MentorOnboardingEmail mentorName={onboardForm.mentorName} />);
                }
                setPreviewHtml(html);
            } catch (e) {
                console.error("Preview generation error:", e);
                setPreviewHtml("<p class='p-4 text-red-500'>Preview unavailable</p>");
            }
        };

        const timeoutId = setTimeout(generatePreview, 300); // 300ms debounce
        return () => clearTimeout(timeoutId);
    }, [activeTemplate, customForm, promoForm, onboardForm]);

    const handleSendClick = (type, data) => {
        setPendingData({ type, data });
        setConfirmDialog(true);
    };

    const handleConfirmSend = async () => {
        setConfirmDialog(false);
        setLoading(true);
        try {
            const res = await fetch("/api/admin/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pendingData),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error);

            toast.success("Email sent successfully!", {
                description: `Delivered to ${pendingData.data.email}`,
                icon: <CheckCircle2 className="h-4 w-4 text-green-600" />,
            });
        } catch (error) {
            toast.error("Failed to send email", {
                description: error.message,
            });
        } finally {
            setLoading(false);
            setPendingData(null);
        }
    };

    return (
        <div className="relative h-[calc(100vh-4rem)] overflow-hidden bg-gray-50/50 p-2 md:p-4">
            <GridPattern width={40} height={40} className="absolute inset-0 -z-10 opacity-50" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full w-full mx-auto">
                {/* 1. Editor Area - Bento Box (Now includes Tabs) */}
                <div className="lg:col-span-7 h-full flex flex-col bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
                    {/* Horizontal Tabs Header */}
                    <div className="px-4 pt-4 pb-0 border-b border-gray-100 bg-white/50 backdrop-blur-md sticky top-0 z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    Compose Email
                                </h1>
                                <p className="text-gray-500 text-xs mt-0.5">Select a template and customize content</p>
                            </div>
                            <div className="h-8 px-3 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium flex items-center border border-indigo-100">
                                <Mail className="w-3.5 h-3.5 mr-1.5" />
                                {templates.find((t) => t.id === activeTemplate)?.name}
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex space-x-1 overflow-x-auto no-scrollbar pb-0">
                            {templates.map((template) => {
                                const Icon = template.icon;
                                const isActive = activeTemplate === template.id;
                                return (
                                    <button
                                        key={template.id}
                                        onClick={() => setActiveTemplate(template.id)}
                                        className={`
                                            flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap
                                            ${isActive
                                                ? "border-indigo-600 text-indigo-600 bg-indigo-50/50 rounded-t-lg"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg"
                                            }
                                        `}
                                    >
                                        <Icon className={`w-4 h-4 ${isActive ? "text-indigo-600" : "text-gray-400"}`} />
                                        {template.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        {/* Custom Email Form */}
                        {activeTemplate === "custom" && (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendClick("custom", customForm);
                                }}
                                className="space-y-5"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recipient Email</Label>
                                        <Input
                                            type="email"
                                            value={customForm.email}
                                            onChange={(e) => setCustomForm({ ...customForm, email: e.target.value })}
                                            placeholder="user@example.com"
                                            required
                                            className="h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-lg"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Name</Label>
                                        <Input
                                            value={customForm.recipientName}
                                            onChange={(e) => setCustomForm({ ...customForm, recipientName: e.target.value })}
                                            placeholder="John Doe"
                                            className="h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Subject Line</Label>
                                    <Input
                                        value={customForm.subject}
                                        onChange={(e) => setCustomForm({ ...customForm, subject: e.target.value })}
                                        placeholder="Important Update"
                                        required
                                        className="h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-lg font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Content</Label>
                                    <Textarea
                                        value={customForm.bodyContent}
                                        onChange={(e) => setCustomForm({ ...customForm, bodyContent: e.target.value })}
                                        placeholder="Type your message here..."
                                        className="min-h-[300px] bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-lg resize-none p-4 leading-relaxed"
                                        required
                                    />
                                </div>
                                <div className="pt-4">
                                    <Button type="submit" disabled={loading} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                        {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                        Send Email <Send className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </form>
                        )}

                        {/* Promotion Email Form */}
                        {activeTemplate === "promotion" && (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendClick("promotion", promoForm);
                                }}
                                className="space-y-5"
                            >
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recipient Email</Label>
                                    <Input
                                        type="email"
                                        value={promoForm.email}
                                        onChange={(e) => setPromoForm({ ...promoForm, email: e.target.value })}
                                        placeholder="user@example.com"
                                        required
                                        className="h-11 bg-gray-50/50 rounded-lg"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Subject Line</Label>
                                    <Input
                                        value={promoForm.subject}
                                        onChange={(e) => setPromoForm({ ...promoForm, subject: e.target.value })}
                                        required
                                        className="h-11 bg-gray-50/50 rounded-lg font-medium"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex justify-between">
                                        Banner Image URL
                                        <span className="font-normal text-gray-400 lowercase text-[10px]">Optional</span>
                                    </Label>
                                    <Input
                                        value={promoForm.bannerUrl}
                                        onChange={(e) => setPromoForm({ ...promoForm, bannerUrl: e.target.value })}
                                        placeholder="https://example.com/banner.png"
                                        className="h-10 bg-gray-50/50 rounded-lg text-xs font-mono text-gray-600"
                                    />
                                </div>

                                <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-100 space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Healine</Label>
                                        <Input
                                            value={promoForm.heading}
                                            onChange={(e) => setPromoForm({ ...promoForm, heading: e.target.value })}
                                            className="bg-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sub-headline</Label>
                                        <Textarea
                                            value={promoForm.subheading}
                                            onChange={(e) => setPromoForm({ ...promoForm, subheading: e.target.value })}
                                            className="min-h-[100px] bg-white resize-none"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">CTA Text</Label>
                                        <Input
                                            value={promoForm.ctaText}
                                            onChange={(e) => setPromoForm({ ...promoForm, ctaText: e.target.value })}
                                            className="h-11 bg-gray-50/50 rounded-lg"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">CTA Link</Label>
                                        <Input
                                            value={promoForm.ctaLink}
                                            onChange={(e) => setPromoForm({ ...promoForm, ctaLink: e.target.value })}
                                            className="h-11 bg-gray-50/50 rounded-lg text-blue-600"
                                        />
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <Button type="submit" disabled={loading} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200">
                                        {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                        Send Campaign <Send className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </form>
                        )}

                        {/* Onboarding Email Form */}
                        {activeTemplate === "onboarding" && (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendClick("onboarding", onboardForm);
                                }}
                                className="space-y-5"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mentor Email</Label>
                                        <Input
                                            type="email"
                                            value={onboardForm.email}
                                            onChange={(e) => setOnboardForm({ ...onboardForm, email: e.target.value })}
                                            placeholder="mentor@example.com"
                                            required
                                            className="h-11 bg-gray-50/50 rounded-lg"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mentor Name</Label>
                                        <Input
                                            value={onboardForm.mentorName}
                                            onChange={(e) => setOnboardForm({ ...onboardForm, mentorName: e.target.value })}
                                            placeholder="Dr. Smith"
                                            required
                                            className="h-11 bg-gray-50/50 rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <Button type="submit" disabled={loading} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200">
                                        {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                        Send Welcome Email <Send className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* 3. Live Preview - Bento Box */}
                <div className="hidden lg:flex lg:col-span-5 h-full flex-col bg-gray-900 text-white rounded-2xl border border-gray-800 shadow-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 -z-10" />
                    <div className="p-5 border-b border-gray-800 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700">
                            <Eye className="w-3.5 h-3.5 text-indigo-400" />
                            <span className="text-xs font-medium text-gray-300">Live Preview</span>
                        </div>
                    </div>
                    <div className="flex-1 p-6 flex items-center justify-center bg-gray-50/5 backdrop-blur-sm">
                        <div className="w-full h-full max-w-[380px] bg-white rounded-xl shadow-2xl overflow-hidden ring-4 ring-gray-800">
                            <iframe
                                srcDoc={previewHtml}
                                className="w-full h-full border-0"
                                title="Email Preview"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
                <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Confirm Send</DialogTitle>
                        <DialogDescription>
                            Sending to <span className="font-semibold text-gray-900">{pendingData?.data?.email}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setConfirmDialog(false)} className="rounded-xl h-10">
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmSend} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-6">
                            <Send className="mr-2 h-4 w-4" />
                            Send Now
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
