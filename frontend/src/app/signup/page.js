"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        full_name: `${formData.firstName} ${formData.lastName}`,
                    },
                },
            });

            if (signUpError) {
                // Handle specific error cases
                if (signUpError.message.toLowerCase().includes("user already registered")) {
                    setError("This email is already registered. Please login instead.");
                } else {
                    setError(signUpError.message);
                }
                return;
            }

            // Check if user already exists (Supabase returns user with identities = [] for existing users)
            if (data?.user && data.user.identities && data.user.identities.length === 0) {
                setError("This email is already registered. Please login instead.");
                return;
            }

            // Redirect to login with success toast
            toast.success("Account created!", { description: "Check your email to confirm your account." });
            router.push("/login");
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        try {
            setIsLoading(true);
            setError("");
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/`,
                },
            });
            if (error) throw error;
        } catch (err) {
            setError("Failed to sign up with Google. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
            {/* Form Side (Left for Signup) */}
            <motion.div
                layoutId="auth-form"
                className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background"
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                <div className="mx-auto grid w-full max-w-[400px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Create an account</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your information to get started
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <form className="grid gap-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="first-name">First name</Label>
                                <Input
                                    id="first-name"
                                    placeholder="Aditya"
                                    required
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="last-name">Last name</Label>
                                <Input
                                    id="last-name"
                                    placeholder="Kumar"
                                    required
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                minLength={6}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
                        </div>
                        <Button type="submit" className="w-full rounded-2xl" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    {/* Google Sign Up */}
                    <Button
                        variant="outline"
                        type="button"
                        className="w-full rounded-2xl"
                        onClick={handleGoogleSignUp}
                        disabled={isLoading}
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Continue with Google
                    </Button>

                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="underline font-medium">
                            Sign in
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* Image Side (Right for Signup) */}
            <motion.div
                layoutId="auth-image"
                className="hidden bg-zinc-900 lg:block relative overflow-hidden"
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                <img
                    src="https://images.unsplash.com/photo-1752650735501-633d9d5d2b3b?q=80&w=2531&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Students"
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
                            &ldquo;Talking to a real student gave me the honest truth about Vedam that no brochure could. Now I&apos;m confident about my choice.&rdquo;
                        </p>
                        <footer className="text-sm border-t border-white/20 pt-4 mt-4">Arjun Patel, Admitted to Vedam 2024</footer>
                    </blockquote>
                </div>
            </motion.div>
        </div>
    );
}
