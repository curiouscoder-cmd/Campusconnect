"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Upload, CheckCircle, Loader2, Gift, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

const NSAT_LINK = "https://www.newtonschool.co/newton-school-of-technology-nst/apply-referral/?utm_source=referral&utm_medium=curiouscoder_cmd&utm_campaign=btech-computer-science-referral-dashboard-v2--portal-referral";

export function NsatOfferModal({ isOpen, onClose }) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        nsat_registration_id: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from("nsat_referrals")
                .insert({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    nsat_registration_id: formData.nsat_registration_id,
                    status: "pending",
                });

            if (error) throw error;

            setSubmitted(true);
            setStep(4);
        } catch (error) {
            console.error("Error submitting NSAT referral:", error);
            alert("Failed to submit. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setStep(1);
        setSubmitted(false);
        setFormData({ name: "", email: "", phone: "", nsat_registration_id: "" });
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
                    className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
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
                                <h2 className="text-xl font-bold text-gray-900">NSAT Offer</h2>
                                <p className="text-sm text-gray-500">Get your first session FREE!</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Step Indicator */}
                        {!submitted && (
                            <div className="flex items-center justify-center gap-2 mb-6">
                                {[1, 2, 3].map((s) => (
                                    <div
                                        key={s}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${step === s
                                                ? "bg-primary text-white"
                                                : step > s
                                                    ? "bg-green-500 text-white"
                                                    : "bg-gray-100 text-gray-400"
                                            }`}
                                    >
                                        {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Step 1: Register on NSAT */}
                        {step === 1 && (
                            <div className="space-y-4">
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Step 1: Register for NSAT
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Click the button below to register for NSAT exam. You'll also get ₹300 off on the registration fee!
                                    </p>
                                </div>

                                <a
                                    href={NSAT_LINK}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-primary to-purple-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                                >
                                    Register on NSAT
                                    <ExternalLink className="w-4 h-4" />
                                </a>

                                <div className="text-center pt-4">
                                    <p className="text-xs text-gray-400 mb-3">Already registered using this link?</p>
                                    <Button
                                        onClick={() => setStep(2)}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        Continue to Step 2
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Fill Form */}
                        {step === 2 && (
                            <div className="space-y-4">
                                <div className="text-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                        Step 2: Fill Your Details
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Enter the details you used for NSAT registration
                                    </p>
                                </div>

                                <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="Enter your email"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="+91 XXXXX XXXXX"
                                        />
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                                            Back
                                        </Button>
                                        <Button type="submit" className="flex-1">
                                            Next
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Step 3: NSAT Registration ID */}
                        {step === 3 && (
                            <div className="space-y-4">
                                <div className="text-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                        Step 3: Verification Details
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Enter your NSAT registration ID for verification
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nsat_id">NSAT Registration ID / Email *</Label>
                                        <Input
                                            id="nsat_id"
                                            required
                                            value={formData.nsat_registration_id}
                                            onChange={(e) => setFormData({ ...formData, nsat_registration_id: e.target.value })}
                                            placeholder="Enter your NSAT registration ID or email"
                                        />
                                        <p className="text-xs text-gray-400">
                                            This is the email/ID you used during NSAT registration
                                        </p>
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
                                            Back
                                        </Button>
                                        <Button type="submit" disabled={loading} className="flex-1">
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                "Submit"
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Step 4: Success */}
                        {step === 4 && submitted && (
                            <div className="text-center py-6">
                                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Application Submitted!
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    We'll verify your NSAT registration and send you an email once your free session is scheduled.
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
