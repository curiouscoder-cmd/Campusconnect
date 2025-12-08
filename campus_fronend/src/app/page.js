"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MentorCard } from "@/components/MentorCard";
import { PricingCard } from "@/components/PricingCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion-eldora";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { TextReveal } from "@/components/ui/text-reveal";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { FloatingOrbs } from "@/components/ui/floating-elements";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/ui/scroll-animation";
import { MentorCardWithBooking } from "@/components/SessionBookingModal";
import Link from "next/link";

// Available colleges - easy to expand later
const COLLEGES = [
  { id: "nst", name: "Newton School of Technology", short: "NST" },
  // Future colleges - uncomment when ready
  // { id: "vedam", name: "Vedam School of Technology", short: "Vedam" },
  // { id: "niat", name: "NIAT", short: "NIAT" },
  // { id: "sst", name: "Scaler School of Technology", short: "SST" },
];

// Current active college for MVP (change this to show different colleges)
const ACTIVE_COLLEGE = "nst";

// Mock Data - All mentors with college IDs for filtering
const allMentors = [
  // NST Students
  {
    name: "Nitya Jain",
    role: "2nd Year Student",
    college: "Newton School of Technology",
    collegeId: "nst",
    price: "₹149",
   
    image: "https://github.com/shadcn.png"
  },
  {
    name: "Harsh Hirawat",
    role: "2nd Year Student",
    college: "Newton School of Technology",
    collegeId: "nst",
    price: "₹99",
    image: "https://github.com/shadcn.png"
  },
  {
    name: "Rahul Verma",
    role: "2nd Year Student",
    college: "Newton School of Technology",
    collegeId: "nst",
    price: "₹149",
    image: "https://github.com/shadcn.png"
  },
  // Future: Other college students
  // {
  //   name: "Riya Singh",
  //   role: "1st Year Student",
  //   college: "NIAT",
  //   collegeId: "niat",
  //   price: "₹99",
  //   expertise: ["Hostel Life", "Faculty Quality", "Course Difficulty"],
  //   image: "https://github.com/shadcn.png"
  // },
];

// Filter mentors by active college (for MVP, only NST)
const mentors = allMentors.filter(m => m.collegeId === ACTIVE_COLLEGE);

const pricingPlans = [
  {
    title: "Quick Chat",
    price: "₹99",
    features: ["15 min video call", "Ask quick doubts", "Get honest answers"],
    popular: false
  },
  {
    title: "Deep Dive",
    price: "₹199",
    features: ["30 min video call", "Detailed college insights", "Admission guidance", "All your questions answered"],
    popular: true
  },
  {
    title: "Group Session",
    price: "₹49",
    features: ["60 min group call", "Q&A with current students", "Learn from others' questions", "Recording available"],
    popular: false
  }
];

const faqs = [
  {
    question: "What is Campus Connect?",
    answer: "Campus Connect is a student-to-student guidance platform where applicants can talk directly to real students studying in new-gen colleges like NST, Vedam, and NIAT to get honest insights before making their admission decision."
  },
  {
    question: "How do I book a session?",
    answer: "Browse our list of current students, choose someone from your target college, select a time slot, and pay securely via Razorpay. You'll get a Google Meet link for your session."
  },
  {
    question: "What can I ask during a session?",
    answer: "Anything about the real college experience! Ask about faculty quality, hostel life, mess food, placements, course difficulty, coding culture, social life, admission process, or whether the college is worth joining."
  },
  {
    question: "Is this career counselling or job guidance?",
    answer: "No. This is NOT career mentoring, resume review, or job preparation. Our platform is specifically for getting first-hand college experience insights from current students to help you make informed admission decisions."
  },
  {
    question: "Can I reschedule my session?",
    answer: "Yes, you can reschedule up to 24 hours before the session start time without any extra charges."
  },
  {
    question: "Who are the mentors on this platform?",
    answer: "All our mentors are current students studying at new-gen colleges. They share their genuine, first-hand experiences — not career advice or professional counselling."
  }
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 mt-16"> {/* Added mt-16 to clear fixed navbar */}
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <FloatingOrbs />
          <HeroHighlight containerClassName="h-[70vh] min-h-[600px]">
            <div className="text-center px-4 max-w-4xl mx-auto relative z-10">
              <TextReveal delay={0.1}>
                <Badge variant="outline" className="mb-6 py-1.5 px-4 text-sm font-medium rounded-full border-primary/20 bg-primary/5 backdrop-blur-sm text-primary">
                  For applicants to NST, Vedam, NIAT & more
                </Badge>
              </TextReveal>
              <div className="mb-6">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
                  Talk to real students.
                </h1>
                <div className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mt-2">
                  <TypewriterEffectSmooth
                    words={[
                      { text: "Choose", className: "gradient-text" },
                      { text: "the", className: "gradient-text" },
                      { text: "right", className: "gradient-text" },
                      { text: "college.", className: "gradient-text" },
                    ]}
                    className="justify-center"
                  />
                </div>
              </div>
              <TextReveal delay={0.3}>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                  Get real, honest insights from students currently studying at new-gen colleges. Ask about campus life, placements, faculty, and everything that matters before you join.
                </p>
              </TextReveal>

              <TextReveal delay={0.4}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/#mentors">
                    <Button size="lg" className="rounded-full px-8 h-12 text-base gradient-bg text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5 border-0">
                      Talk to a Student mentor <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="rounded-full h-12 text-base border-primary/20 text-primary hover:bg-primary/5 hover:text-primary">
                    See How It Works
                  </Button>
                </div>
              </TextReveal>
            </div>
          </HeroHighlight>
          
        </section>

        {/* Mentors Section */}
        <section id="mentors" className="py-24 bg-gradient-to-b from-primary/5 to-transparent border-t border-primary/10">
          <div className="container px-4 md:px-6 mx-auto">
            <FadeIn direction="up">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-display)' }}>Meet top mentors</h2>
                  <p className="text-muted-foreground max-w-xl">
                    Connect with students who are living the college experience right now. Get honest answers about what it&apos;s really like.
                  </p>
                </div>
                <Button variant="outline" className="rounded-full border-primary/20 text-primary hover:bg-primary/5">View All Students</Button>
              </div>
            </FadeIn>

            <FadeInStagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((mentor, i) => (
                <FadeInStaggerItem key={i}>
                  <MentorCardWithBooking mentor={mentor}>
                    <MentorCard mentor={mentor} />
                  </MentorCardWithBooking>
                </FadeInStaggerItem>
              ))}
            </FadeInStagger>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <FadeIn direction="up">
              <div className="text-center mb-16 max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-display)' }}>Affordable & Transparent</h2>
                <p className="text-muted-foreground">
                  Get clarity on your college decision for less than a movie ticket. 100% money-back guarantee if you&apos;re not satisfied.
                </p>
              </div>
            </FadeIn>
            <FadeInStagger className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pricingPlans.map((plan, i) => (
                <FadeInStaggerItem key={i}>
                  <PricingCard plan={plan} />
                </FadeInStaggerItem>
              ))}
            </FadeInStagger>
          </div>
        </section>

        {/* Reviews / Trust Section */}
        <section id="reviews" className="py-24 bg-slate-900 text-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <FadeIn direction="left">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>&ldquo;Finally got the real picture.&rdquo;</h2>
                  <p className="text-white/80 text-lg leading-relaxed mb-8">
                    I was confused between NST and a traditional college. One session with Aditya gave me honest insights about hostel life, faculty, and placements that no brochure could. I made my decision with confidence.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm" />
                    <div>
                      <p className="font-semibold">Sarthak Gupta</p>
                      <p className="text-sm text-white/60">Admitted to NST, 2024</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
              <FadeInStagger className="grid grid-cols-2 gap-4" staggerDelay={0.15}>
                <FadeInStaggerItem>
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                    <h3 className="text-3xl font-bold mb-2">500+</h3>
                    <p className="text-white/60 text-sm">Sessions Completed</p>
                  </div>
                </FadeInStaggerItem>
                <FadeInStaggerItem>
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                    <h3 className="text-3xl font-bold mb-2">4.9/5</h3>
                    <p className="text-white/60 text-sm">Average Rating</p>
                  </div>
                </FadeInStaggerItem>
                <FadeInStaggerItem>
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                    <h3 className="text-3xl font-bold mb-2">50+</h3>
                    <p className="text-white/60 text-sm">Current Students</p>
                  </div>
                </FadeInStaggerItem>
                <FadeInStaggerItem>
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                    <h3 className="text-3xl font-bold mb-2">10+</h3>
                    <p className="text-white/60 text-sm">New-Gen Colleges</p>
                  </div>
                </FadeInStaggerItem>
              </FadeInStagger>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24">
          <div className="container px-4 md:px-6 mx-auto max-w-3xl">
            <FadeIn direction="up">
              <h2 className="text-3xl font-bold tracking-tight mb-12 text-center" style={{ fontFamily: 'var(--font-display)' }}>Frequently Asked Questions</h2>
            </FadeIn>
            <FadeIn direction="up" delay={0.2}>
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
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
