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
                setError(signUpError.message);
                return;
            }

            // Redirect to login or show success message
            router.push("/login?message=Check your email to confirm your account");
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
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
