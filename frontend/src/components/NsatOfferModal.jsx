"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, CheckCircle, Gift, ArrowRight, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { SESSION_TYPES, formatTime } from "@/lib/booking-utils";
import { SlotPicker } from "@/components/booking/SlotPicker";

const NSAT_LINK = "https://www.newtonschool.co/newton-school-of-technology-nst/apply-referral/?utm_source=referral&utm_medium=curiouscoder_cmd&utm_campaign=btech-computer-science-referral-dashboard-v2--portal-referral";
const GOOGLE_FORM_LINK = "https://docs.google.com/forms/d/e/1FAIpQLSddkem_Iz-VisAGT9Q2Ow0rhS17S9r8q6HE0fzxZklHQo-HMA/viewform?usp=publish-editor";

export function NsatOfferModal({ isOpen, onClose, mentor }) {
    const { user } = useAuth();
    const [step, setStep] = useState(1); // 1: Choose slot, 2: NSAT steps, 3: Success
    const [selectedSession, setSelectedSession] = useState(SESSION_TYPES[0]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
    };

    const handleContinue = () => {
        if (selectedSlot) {
            setStep(2);
        }
    };

    const handleSubmit = async () => {
        try {
            // Save to nsat_referrals table with slot info
            const { error } = await supabase
                .from("nsat_referrals")
                .insert({
                    name: user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Unknown",
                    email: user?.email || "",
                    preferred_mentor_id: mentor?.id,
                    preferred_date: selectedSlot?.date,
                    preferred_time: selectedSlot?.startTime,
                    status: "pending",
                });

            if (error) throw error;

            setSubmitted(true);
            setStep(3);
        } catch (error) {
            console.error("Error submitting NSAT referral:", error);
            alert("Failed to submit. Please try again.");
        }
    };

    const handleClose = () => {
        setStep(1);
        setSubmitted(false);
        setSelectedSlot(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative p-6 pb-4 border-b bg-gradient-to-r from-primary/10 to-purple-500/10">
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center">
                                <Gift className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">NSAT Offer - Free Session</h2>
                                <p className="text-sm text-gray-500">
                                    {mentor ? `with ${mentor.name}` : "Get your first session FREE!"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Step 1: Choose Slot */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="text-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                        Step 1: Choose Your Preferred Slot
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Select a date and time for your free session
                                    </p>
                                </div>

                                {/* Session Type Selection */}
                                <div className="flex gap-3 justify-center">
                                    {SESSION_TYPES.map((session) => (
                                        <button
                                            key={session.id}
                                            onClick={() => setSelectedSession(session)}
                                            className={`px-4 py-2 rounded-lg border-2 transition-all ${selectedSession.id === session.id
                                                    ? "border-primary bg-primary/5 text-primary"
                                                    : "border-gray-200 hover:border-gray-300"
                                                }`}
                                        >
                                            <span className="font-medium">{session.title}</span>
                                            <span className="text-sm text-gray-500 ml-2">({session.duration} min)</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Slot Picker */}
                                <SlotPicker
                                    mentorId={mentor?.id}
                                    sessionDuration={selectedSession.duration}
                                    selectedSlot={selectedSlot}
                                    onSelectSlot={handleSlotSelect}
                                    currentUserId={user?.id}
                                />

                                {/* Selected Slot Display */}
                                {selectedSlot && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                            <div>
                                                <p className="font-medium text-green-800">Slot Selected</p>
                                                <p className="text-sm text-green-600">
                                                    {selectedSlot.date} at {formatTime(selectedSlot.startTime)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <Button
                                    onClick={handleContinue}
                                    disabled={!selectedSlot}
                                    className="w-full bg-gradient-to-r from-primary to-purple-500 text-white"
                                >
                                    Continue
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        )}

                        {/* Step 2: NSAT Verification Steps */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="text-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                        Step 2: Complete NSAT Registration
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Follow these steps to claim your free session
                                    </p>
                                </div>

                                {/* Selected Slot Summary */}
                                <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{selectedSession.title} with {mentor?.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {selectedSlot?.date} at {formatTime(selectedSlot?.startTime)}
                                        </p>
                                    </div>
                                </div>

                                {/* Step Cards */}
                                <div className="space-y-4">
                                    {/* Step A: Register on NSAT */}
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

                                    {/* Step B: Fill Google Form */}
                                    <div className="border rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">
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

                                <div className="pt-4 border-t">
                                    <p className="text-sm text-gray-500 text-center mb-4">
                                        After completing both steps, click below to submit your slot request
                                    </p>
                                    <div className="flex gap-3">
                                        <Button
                                            variant="outline"
                                            onClick={() => setStep(1)}
                                            className="flex-1"
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            onClick={handleSubmit}
                                            className="flex-1 bg-gradient-to-r from-primary to-purple-500 text-white"
                                        >
                                            Submit for Verification
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Success */}
                        {step === 3 && submitted && (
                            <div className="text-center py-6">
                                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Request Submitted!
                                </h3>
                                <p className="text-gray-500 mb-2">
                                    We'll verify your NSAT registration and confirm your session.
                                </p>
                                <div className="bg-gray-50 rounded-lg p-4 mb-6 inline-block">
                                    <p className="text-sm text-gray-600">
                                        <strong>Requested Slot:</strong> {selectedSlot?.date} at {formatTime(selectedSlot?.startTime)}
                                    </p>
                                </div>
                                <p className="text-sm text-gray-500 mb-6">
                                    You'll receive an email once your free session is approved.
                                </p>
                                <Button onClick={handleClose} className="w-full">
                                    Done
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
