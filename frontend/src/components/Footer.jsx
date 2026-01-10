import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full border-t border-border/40 bg-muted/30 pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-2">
                        <Link href="/" className="font-bold text-xl tracking-tight mb-4 block">
                            Campus Connect
                        </Link>
                        <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                            Talk to real students. Get real insights. Choose the right college with confidence.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h4 className="font-semibold text-sm">Platform</h4>
                        <Link href="/#mentors" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Students</Link>
                        <Link href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
                        <Link href="/#reviews" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Reviews</Link>
                        <Link href="/#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h4 className="font-semibold text-sm">Company</h4>
                        <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
                        <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
                        <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border/40 gap-4">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Campus Connect. All rights reserved.
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Made with ❤️ for students, by students
                    </p>
                </div>
            </div>
        </footer>
    );
}
