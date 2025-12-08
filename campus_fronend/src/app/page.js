"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MentorCard } from "@/components/MentorCard";
import { PricingCard } from "@/components/PricingCard";
import { BookingModal } from "@/components/BookingModal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion-eldora";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, CheckCircle2 } from "lucide-react";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { TextReveal } from "@/components/ui/text-reveal";

// Mock Data (Moved from separate files for simplicity in this artifact, but kept clean)
const mentors = [
  {
    name: "Aditya Kumar",
    role: "Software Engineer @ Google",
    college: "NST",
    price: "₹199",
    expertise: ["Resume Review", "Mock Interview", "System Design"],
    image: "https://github.com/shadcn.png"
  },
  {
    name: "Riya Singh",
    role: "Product Designer @ Microsoft",
    college: "NIAT",
    price: "₹299",
    expertise: ["Portfolio Review", "UX Research", "Career Guidance"],
    image: "https://github.com/shadcn.png"
  },
  {
    name: "Karan Mehta",
    role: "Founder @ Stealth",
    college: "Vedam",
    price: "₹499",
    expertise: ["Startup Advice", "Pitch Deck", "Networking"],
    image: "https://github.com/shadcn.png"
  }
];

const pricingPlans = [
  {
    title: "Quick Chat",
    price: "₹99",
    features: ["15 min video call", "Career questions", "Resume glance"],
    popular: false
  },
  {
    title: "Deep Dive",
    price: "₹199",
    features: ["30 min video call", "Detailed resume review", "Mock interview (Light)", "Actionable feedback"],
    popular: true
  },
  {
    title: "Group Session",
    price: "₹49",
    features: ["60 min group call", "Q&A with mentor", "Peer learning", "Recording available"],
    popular: false
  }
];

const faqs = [
  {
    question: "How do I book a session?",
    answer: "Simply browse our list of mentors, choose one that fits your goals, select a time slot, and securely pay via Razorpay."
  },
  {
    question: "Can I reschedule my session?",
    answer: "Yes, you can reschedule up to 24 hours before the session start time without any extra charges."
  },
  {
    question: "Is this only for tech roles?",
    answer: "No, we have mentors from various fields including Design, Product Management, Marketing, and more."
  }
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <main className="flex-1 mt-20"> {/* Added mt-20 to clear fixed navbar initially if needed, or rely on layout */}
        {/* Hero Section */}
        <section className="relative">
          <HeroHighlight containerClassName="h-[60vh]">
            <div className="text-center px-4 max-w-4xl mx-auto">
              <TextReveal delay={0.1}>
                <Badge variant="outline" className="mb-6 py-1.5 px-4 text-sm font-medium rounded-full border-black/10 bg-white/50 backdrop-blur-sm text-foreground/80">
                  For students of NST, Vedam, NIAT
                </Badge>
              </TextReveal>
              <TextReveal delay={0.2}>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
                  Master your career with <Highlight className="text-black dark:text-white">guidance from alumni.</Highlight>
                </h1>
              </TextReveal>
              <TextReveal delay={0.3}>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                  Book 1:1 sessions with seniors who have cracked the companies you dream of. No fluff, just actionable advice.
                </p>
              </TextReveal>

              <TextReveal delay={0.4}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-black/5 hover:shadow-xl transition-all hover:-translate-y-0.5">
                    Find a Mentor <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="lg" className="rounded-full h-12 text-base text-muted-foreground hover:text-foreground">
                    View Success Stories
                  </Button>
                </div>
              </TextReveal>
            </div>
          </HeroHighlight>
        </section>

        {/* Mentors Section */}
        <section id="mentors" className="py-24 bg-muted/30 border-t border-border/40">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-4">Top Mentors</h2>
                <p className="text-muted-foreground max-w-xl">
                  Learn from the best. Our mentors work at top tech companies and have walked the same path as you.
                </p>
              </div>
              <Button variant="outline" className="rounded-full">View All Mentors</Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((mentor, i) => (
                <div key={i} className="flex flex-col h-full">
                  <MentorCard mentor={mentor} />
                  <div className="mt-4 flex justify-end">
                    <BookingModal mentor={mentor} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Simple, Transparent Pricing</h2>
              <p className="text-muted-foreground">
                Invest in your future for the price of a coffee. 100% money-back guarantee if you're not satisfied.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pricingPlans.map((plan, i) => (
                <PricingCard key={i} plan={plan} />
              ))}
            </div>
          </div>
        </section>

        {/* Reviews / Trust Section */}
        <section id="reviews" className="py-24 bg-black text-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">"Changed my career trajectory."</h2>
                <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                  I was confused about which domain to pick. One session with Aditya cleared my doubts and helped me land an internship at Microsoft purely based on his roadmap.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-800" />
                  <div>
                    <p className="font-semibold">Sarthak Gupta</p>
                    <p className="text-sm text-zinc-500">Student, NST</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-900 p-6 rounded-2xl">
                  <h3 className="text-3xl font-bold mb-2">500+</h3>
                  <p className="text-zinc-500 text-sm">Sessions Booked</p>
                </div>
                <div className="bg-zinc-900 p-6 rounded-2xl">
                  <h3 className="text-3xl font-bold mb-2">4.9/5</h3>
                  <p className="text-zinc-500 text-sm">Average Rating</p>
                </div>
                <div className="bg-zinc-900 p-6 rounded-2xl">
                  <h3 className="text-3xl font-bold mb-2">50+</h3>
                  <p className="text-zinc-500 text-sm">Active Mentors</p>
                </div>
                <div className="bg-zinc-900 p-6 rounded-2xl">
                  <h3 className="text-3xl font-bold mb-2">10L+</h3>
                  <p className="text-zinc-500 text-sm">Avg Mentor Package</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24">
          <div className="container px-4 md:px-6 mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight mb-12 text-center">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-lg">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
