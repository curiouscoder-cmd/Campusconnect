"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Gift, Loader2, X, Copy, Users, Wallet } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Component to enter referral code during booking (for 30-min sessions)
export function ReferralCodeInput({ onApply, onRemove, appliedDiscount, originalPrice }) {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleApply = async () => {
        if (!code.trim()) {
            setError("Please enter a referral code");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch(`/api/referral?code=${code.trim()}`);
            const data = await response.json();

            if (data.valid) {
                onApply({
                    code: code.trim().toUpperCase(),
                    discountAmount: data.discountAmount,
                    referrerId: data.referrerId,
                    referrerName: data.referrerName,
                    referralCodeId: data.referralCodeId
                });
                setCode("");
            } else {
                setError(data.error || "Invalid referral code");
            }
        } catch (err) {
            setError("Failed to validate code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (appliedDiscount) {
        const discountedPrice = Math.max(0, originalPrice - appliedDiscount.discountAmount);
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                            Code <strong>{appliedDiscount.code}</strong> applied!
                        </span>
                    </div>
                    <button
                        onClick={onRemove}
                        className="text-green-600 hover:text-green-800 p-1"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-green-700">
                        Referred by {appliedDiscount.referrerName}
                    </span>
                    <span className="font-semibold text-green-800">
                        -₹{appliedDiscount.discountAmount} off
                    </span>
                </div>
                <div className="mt-2 pt-2 border-t border-green-200 flex justify-between">
                    <span className="text-green-700">You pay:</span>
                    <span className="font-bold text-green-900 text-lg">₹{discountedPrice}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
            <Label className="flex items-center gap-2 text-sm text-purple-800 font-medium mb-3">
                <Gift className="w-4 h-4" />
                Have a referral code? Get ₹25 off!
            </Label>
            <div className="flex gap-2">
                <Input
                    placeholder="Enter code (e.g., CCNITYA1A2B)"
                    value={code}
                    onChange={(e) => {
                        setCode(e.target.value.toUpperCase());
                        setError("");
                    }}
                    className="flex-1 bg-white"
                    disabled={loading}
                />
                <Button
                    variant="outline"
                    onClick={handleApply}
                    disabled={loading || !code.trim()}
                    className="border-purple-300 text-purple-700 hover:bg-purple-100"
                >
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        "Apply"
                    )}
                </Button>
            </div>
            {error && (
                <p className="text-xs text-red-500 mt-2">{error}</p>
            )}
        </div>
    );
}

// Component to show user's referral code and share it
export function ReferralShareCard({ className = "" }) {
    const { user } = useAuth();
    const [referralData, setReferralData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        if (user?.id) {
            fetchReferralCode();
        }
    }, [user?.id]);

    const fetchReferralCode = async () => {
        try {
            const response = await fetch(`/api/referral?userId=${user.id}`);
            const data = await response.json();

            if (data.hasCode) {
                setReferralData(data);
            }
        } catch (error) {
            console.error("Error fetching referral code:", error);
        } finally {
            setLoading(false);
        }
    };

    const generateCode = async () => {
        setGenerating(true);
        try {
            const response = await fetch('/api/referral', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    userEmail: user.email,
                    userName: user.user_metadata?.full_name || user.email?.split('@')[0]
                })
            });
            const data = await response.json();

            if (data.code) {
                setReferralData({
                    hasCode: true,
                    code: data.code,
                    discountAmount: data.discountAmount,
                    rewardAmount: data.rewardAmount,
                    totalUses: 0,
                    totalEarned: 0,
                    pendingRewards: 0
                });
            }
        } catch (error) {
            console.error("Error generating referral code:", error);
        } finally {
            setGenerating(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(referralData.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = () => {
        const message = `Hey! Use my referral code ${referralData.code} to get ₹25 off on your Campus Connect session! 🎓

Talk to real students from NST, Vedam, NIAT and make informed decisions about your college.

Book now: https://campus-connect.co.in`;

        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
    };

    if (loading) {
        return (
            <div className={`bg-gray-50 rounded-xl p-6 animate-pulse ${className}`}>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
            </div>
        );
    }

    if (!referralData?.hasCode) {
        return (
            <div className={`bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100 ${className}`}>
                <div className="flex items-center gap-2 mb-3">
                    <Gift className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Refer & Earn ₹25</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                    Get your unique referral code. Share with friends and earn ₹25 when they book their first session!
                </p>
                <Button
                    onClick={generateCode}
                    disabled={generating}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                >
                    {generating ? (
                        <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Generating...</>
                    ) : (
                        "Get My Referral Code"
                    )}
                </Button>
            </div>
        );
    }

    return (
        <div className={`bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100 ${className}`}>
            <div className="flex items-center gap-2 mb-1">
                <Gift className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Refer & Earn ₹25</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
                Share your code. Friends get ₹25 off, you earn ₹25!
            </p>

            {/* Referral Code Display */}
            <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 bg-white rounded-lg border-2 border-dashed border-purple-300 px-4 py-3 text-center">
                    <span className="font-mono font-bold text-lg text-purple-700 tracking-wider">
                        {referralData.code}
                    </span>
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopy}
                    className="border-purple-300 hover:bg-purple-100"
                >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-purple-600" />}
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                        <Users className="w-4 h-4" />
                    </div>
                    <p className="text-xl font-bold text-gray-900">{referralData.totalUses}</p>
                    <p className="text-xs text-gray-500">Referrals</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                        <Wallet className="w-4 h-4" />
                    </div>
                    <p className="text-xl font-bold text-gray-900">₹{referralData.totalEarned}</p>
                    <p className="text-xs text-gray-500">Earned</p>
                </div>
            </div>

            {/* Share Button */}
            <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleShare}
            >
                <Gift className="w-4 h-4 mr-2" />
                Share on WhatsApp
            </Button>
        </div>
    );
}

// Mini version for navbar/header
export function ReferralBadge({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 hover:bg-purple-200 rounded-full text-purple-700 text-sm font-medium transition-colors"
        >
            <Gift className="w-3.5 h-3.5" />
            Refer & Earn ₹25
        </button>
    );
}
