"use client";

import { useState } from "react";
import { ExternalLink, Gift, CheckCircle, Loader2, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/booking-utils";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const NSAT_LINK = "https://www.newtonschool.co/newton-school-of-technology-nst/apply-referral/?utm_source=referral&utm_medium=curiouscoder_cmd&utm_campaign=btech-computer-science-referral-dashboard-v2--portal-referral";
const GOOGLE_FORM_LINK = "https://docs.google.com/forms/d/e/1FAIpQLSddkem_Iz-VisAGT9Q2Ow0rhS17S9r8q6HE0fzxZklHQo-HMA/viewform?usp=publish-editor";

export function NsatVerificationScreen({ mentor, slot, onSuccess, onBack }) {
    const { user } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const { error } = await supabase
                .from("nsat_referrals")
                .insert({
                    name: user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Unknown",
                    email: user?.email || "",
                    preferred_mentor_id: mentor?.id,
                    preferred_date: slot?.date,
                    preferred_time: slot?.startTime,
                    status: "pending",
                });

            if (error) throw error;

            setSubmitted(true);
            onSuccess?.();
        } catch (error) {
            console.error("Error submitting NSAT referral:", error);
            alert("Failed to submit. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Request Submitted!
                </h3>
                <p className="text-gray-500 mb-2">
                    We'll verify your NSAT registration and confirm your session.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-4 inline-block">
                    <p className="text-sm text-gray-600">
                        <strong>Requested Slot:</strong> {slot?.date} at {formatTime(slot?.startTime)}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Mentor:</strong> {mentor?.name}
                    </p>
                </div>
                <p className="text-sm text-gray-500">
                    You'll receive an email once your free session is approved.
                </p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center mx-auto mb-3">
                    <Gift className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    NSAT Offer - Free Session
                </h3>
                <p className="text-sm text-gray-500">
                    Complete these steps to claim your free session
                </p>
            </div>

            {/* Selected Slot Summary */}
            <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <p className="font-medium text-gray-900">Session with {mentor?.name}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                        <span>{slot?.date}</span>
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(slot?.startTime)}</span>
                    </p>
                </div>
            </div>

            {/* Step Cards */}
            <div className="space-y-4">
                {/* Step 1: Register on NSAT */}
                <div className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">
                            1
                        </div>
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-900">Register for NSAT Exam</h4>
                            <p className="text-sm text-gray-500 mb-3">
                                Use our referral link to register and get ₹300 off on registration fee!
                            </p>
                            <a
                                href={NSAT_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                            >
                                Register on NSAT
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Step 2: Fill Google Form */}
                <div className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold shrink-0">
                            2
                        </div>
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-900">Fill Verification Form</h4>
                            <p className="text-sm text-gray-500 mb-3">
                                Submit your details and NSAT registration screenshot for verification
                            </p>
                            <a
                                href={GOOGLE_FORM_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                            >
                                Fill Google Form
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t">
                <p className="text-sm text-gray-500 text-center mb-4">
                    After completing both steps, click below to submit your slot request
                </p>
                <Button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-primary to-purple-500 text-white"
                >
                    {submitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        "Submit for Verification"
                    )}
                </Button>
            </div>
        </div>
    );
}
