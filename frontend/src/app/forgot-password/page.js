"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2, ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (resetError) {
                setError(resetError.message);
                return;
            }

            setSuccess(true);
            toast.success("Email sent!", { description: "Check your inbox for the reset link." });
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
            {/* Image Side */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hidden bg-zinc-900 lg:block relative overflow-hidden"
            >
                <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                    alt="Students collaborating"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-20 flex h-full flex-col justify-between p-10 text-white">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <div className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center font-bold">C</div>
                        Campus Connect
                    </div>
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;Don&apos;t worry, we&apos;ve all been there. Reset your password and get back to exploring colleges.&rdquo;
                        </p>
                    </blockquote>
                </div>
            </motion.div>

            {/* Form Side */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background"
            >
                <div className="mx-auto grid w-full max-w-[400px] gap-6">
                    <Link href="/login" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Back to login
                    </Link>

                    {success ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-8"
                        >
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h1 className="text-2xl font-bold mb-2">Check your email</h1>
                            <p className="text-muted-foreground mb-6">
                                We&apos;ve sent a password reset link to<br />
                                <span className="font-medium text-foreground">{email}</span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Didn&apos;t receive the email? Check your spam folder or{" "}
                                <button
                                    onClick={() => setSuccess(false)}
                                    className="text-primary underline font-medium"
                                >
                                    try again
                                </button>
                            </p>
                        </motion.div>
                    ) : (
                        <>
                            <div className="grid gap-2 text-center">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                                    <Mail className="w-6 h-6 text-primary" />
                                </div>
                                <h1 className="text-3xl font-bold">Forgot password?</h1>
                                <p className="text-balance text-muted-foreground">
                                    No worries, we&apos;ll send you reset instructions.
                                </p>
                            </div>

                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            <form className="grid gap-4" onSubmit={handleSubmit}>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <Button type="submit" className="w-full rounded-2xl" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        "Send reset link"
                                    )}
                                </Button>
                            </form>
                        </>
                    )}

                    <div className="mt-4 text-center text-sm">
                        Remember your password?{" "}
                        <Link href="/login" className="underline font-medium">
                            Sign in
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
