import Link from "next/link";
import { Twitter, Instagram, Linkedin, Github } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full border-t border-border/40 bg-muted/30 pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
                    <div className="col-span-2 lg:col-span-2">
                        <Link href="/" className="font-bold text-xl tracking-tight mb-4 block">
                            Campus Connect
                        </Link>
                        <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                            Talk to real students. Get real insights. Choose the right college with confidence.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h4 className="font-semibold text-sm">Platform</h4>
                        <Link href="#mentors" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Students</Link>
                        <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
                        <Link href="#reviews" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Reviews</Link>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h4 className="font-semibold text-sm">Company</h4>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Careers</Link>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h4 className="font-semibold text-sm">Legal</h4>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border/40 gap-4">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Campus Connect. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Twitter className="h-4 w-4" />
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Instagram className="h-4 w-4" />
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Linkedin className="h-4 w-4" />
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Github className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
