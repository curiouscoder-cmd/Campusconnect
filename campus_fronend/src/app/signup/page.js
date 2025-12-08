"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

import { motion } from "framer-motion";

export default function SignupPage() {
    const [role, setRole] = useState("student"); // student | mentor

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

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setRole("student")}
                            className={cn(
                                "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer",
                                role === "student" ? "border-black bg-black/5" : "border-border bg-muted/20 hover:bg-muted/50"
                            )}
                        >
                            <span className="font-semibold text-sm">Student</span>
                            {role === "student" && <Check className="w-3 h-3 mt-1" />}
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole("mentor")}
                            className={cn(
                                "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer",
                                role === "mentor" ? "border-black bg-black/5" : "border-border bg-muted/20 hover:bg-muted/50"
                            )}
                        >
                            <span className="font-semibold text-sm">Mentor</span>
                            {role === "mentor" && <Check className="w-3 h-3 mt-1" />}
                        </button>
                    </div>

                    <form className="grid gap-4" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="first-name">First name</Label>
                                <Input id="first-name" placeholder="Aditya" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="last-name">Last name</Label>
                                <Input id="last-name" placeholder="Kumar" required />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full rounded-2xl">
                            Create Account
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
                className="hidden bg-muted lg:block relative overflow-hidden"
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                <div className="absolute inset-0 bg-zinc-900 border-l border-white/10" />
                {/* Abstract Gradient Background or Image - Using same image for smooth transition or different if requested, assuming generic auth theme */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-50 grayscale mix-blend-overlay"></div>
                <div className="relative z-20 flex h-full flex-col justify-between p-10 text-white">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <div className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center font-bold">C</div>
                        Campus Connect
                    </div>
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;This platform completely changed how I connect with mentors. The guidance I received was invaluable for my career.&rdquo;
                        </p>
                        <footer className="text-sm border-t border-white/20 pt-4 mt-4">Shreya Gupta, Student @ IIT Delhi</footer>
                    </blockquote>
                </div>
            </motion.div>
        </div>
    );
}
