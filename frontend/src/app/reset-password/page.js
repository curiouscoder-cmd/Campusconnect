"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, Suspense } from "react";
import { Loader2, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { toast } from "sonner";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isValidSession, setIsValidSession] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);

    useEffect(() => {
        // Check if we have a valid session from the reset link
        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setIsValidSession(!!session);
            } catch (err) {
                console.error("Session check error:", err);
            } finally {
                setCheckingSession(false);
            }
        };

        // Listen for auth changes (Supabase handles the token from URL)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'PASSWORD_RECOVERY') {
                    setIsValidSession(true);
                    setCheckingSession(false);
                }
            }
        );

        checkSession();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            });

            if (updateError) {
                setError(updateError.message);
                return;
            }

            setSuccess(true);
            toast.success("Password updated!", { description: "Redirecting to login..." });

            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (checkingSession) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isValidSession && !checkingSession) {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Invalid or expired link</h1>
                <p className="text-muted-foreground mb-6">
                    This password reset link is invalid or has expired.
                </p>
                <Link href="/forgot-password">
                    <Button className="rounded-2xl">Request new link</Button>
                </Link>
            </div>
        );
    }

    return (
        <>
            {success ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                >
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Password updated!</h1>
                    <p className="text-muted-foreground">
                        Your password has been changed successfully.<br />
                        Redirecting to login...
                    </p>
                </motion.div>
            ) : (
                <>
                    <div className="grid gap-2 text-center">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                            <Lock className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold">Set new password</h1>
                        <p className="text-balance text-muted-foreground">
                            Your new password must be at least 6 characters.
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <form className="grid gap-4" onSubmit={handleSubmit}>
                        <div className="grid gap-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full rounded-2xl" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Reset password"
                            )}
                        </Button>
                    </form>
                </>
            )}
        </>
    );
}

export default function ResetPasswordPage() {
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
                            &ldquo;Almost there! Set a new password and you&apos;re all set.&rdquo;
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
                    <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin mx-auto" />}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </motion.div>
        </div>
    );
}
