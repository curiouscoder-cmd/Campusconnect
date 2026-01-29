"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { ChevronDown, Check, ChevronLeft, ChevronRight, Gift, ExternalLink } from "lucide-react";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { TextReveal } from "@/components/ui/text-reveal";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { FloatingOrbs } from "@/components/ui/floating-elements";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/ui/scroll-animation";
import { MentorCardWithBooking } from "@/components/SessionBookingModal";
import { MentorCard } from "@/components/MentorCard";
import { PricingCard } from "@/components/PricingCard";
import { Accordion as AccordionEldora, AccordionContent as AccordionContentEldora, AccordionItem as AccordionItemEldora, AccordionTrigger as AccordionTriggerEldora } from "@/components/ui/accordion-eldora";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Analytics } from "@vercel/analytics/next"
// Available colleges for filtering
const COLLEGES = [
  { id: "all", name: "All Colleges", short: "All" },
  { id: "nst", name: "Newton School of Technology", short: "NST" },
  { id: "sst", name: "Scaler School of Technology", short: "SST" },
  { id: "vst", name: "Vedam School of Technology", short: "Vedam" },
  { id: "niat", name: "NxtWave Institute of Advanced Technology", short: "NIAT" },
  { id: "pst", name: "Polaris School of Technology", short: "Polaris" }
];

// Mock Data - All mentors with college IDs for filtering
const allMentors = [
  // NST Students
  {
    id: "nitya-jain",
    name: "Nitya Jain",
    role: "2nd Year Student",
    college: "Newton School of Technology",
    collegeId: "nst",
    price: "₹99",
    image: "https://gxutjvplqghjphemydcn.supabase.co/storage/v1/object/sign/mentors%20pic/Screenshot%202025-10-07%20at%203.58.37%20PM.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MmZmNmVhZS1kMDk2LTQ0ZmQtOWFhMi1jNWNlNWFmNWE2NzAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZW50b3JzIHBpYy9TY3JlZW5zaG90IDIwMjUtMTAtMDcgYXQgMy41OC4zNyBQTS5wbmciLCJpYXQiOjE3NjU2Mzc5NzgsImV4cCI6MTc5NzE3Mzk3OH0.c_PfavptClBsGFgQu3ipTbA6Snq9lyMXERG4JuJXEOM",
    bio: "Passionate about helping students make informed college decisions. I'm a 2nd year student at NST with a strong interest in tech and community building. I love sharing my campus experience and helping applicants understand what NST really offers.",
    expertise: ["Campus Life", "Academics", "Placements", "Hostel Experience"]
  },
  {
    id: "harsh-hirawat",
    name: "Harsh Hirawat",
    role: "2nd Year Student",
    college: "Newton School of Technology",
    collegeId: "nst",
    price: "₹99",
    image: "https://gxutjvplqghjphemydcn.supabase.co/storage/v1/object/sign/mentors%20pic/Screenshot%202025-12-14%20at%2012.20.53%20AM.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MmZmNmVhZS1kMDk2LTQ0ZmQtOWFhMi1jNWNlNWFmNWE2NzAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZW50b3JzIHBpYy9TY3JlZW5zaG90IDIwMjUtMTItMTQgYXQgMTIuMjAuNTMgQU0ucG5nIiwiaWF0IjoxNzY1NjUxODk2LCJleHAiOjE3OTcxODc4OTZ9.MxJUFtYViaw9ioZtuj4I3aRABiVjECIL5aldczW6_4Q",
    bio: "A coding enthusiast and NST student who's passionate about sharing real insights about student life. I can help you understand the technical curriculum, coding culture, and what to expect in your first year.",
    expertise: ["Coding Culture", "Technical Curriculum", "First Year Experience", "Faculty"]
  },
  {
    id: "divya-pahuja",
    name: "Divya Pahuja",
    role: "2nd Year Student",
    college: "Newton School of Technology",
    collegeId: "nst",
    price: "₹99",
    image: "https://github.com/shadcn.png",
    bio: "Currently in my 2nd year at NST, focused on building a strong foundation in computer science. I'm here to give you honest feedback about placements, internships, and the overall learning environment at NST.",
    expertise: ["Placements", "Internships", "Learning Environment", "Career Guidance"]
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
// const mentors = allMentors.filter(m => m.collegeId === ACTIVE_COLLEGE);

const pricingPlans = [
  {
    title: "Quick Chat",
    price: "₹49",
    features: ["15 min video call", "Ask quick doubts", "Get honest answers"],
    popular: false
  },
  {
    title: "Deep Dive",
    price: "₹98",
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

// Testimonials data
const testimonials = [
  {
    quote: "Finally got the real picture.",
    text: "I was confused between NST and a traditional college. One session with Aditya gave me honest insights about hostel life, faculty, and placements that no brochure could. I made my decision with confidence.",
    name: "Sarthak Gupta",
    role: "Applicant who booked a session",
    initials: "SG"
  },
  {
    quote: "Cleared all my doubts instantly.",
    text: "The mentor was so helpful in explaining the actual campus culture and placement statistics. This 30-minute session saved me months of confusion. Highly recommend Campus Connect!",
    name: "Priya Sharma",
    role: "Admitted to NST 2024",
    initials: "PS"
  },
  {
    quote: "Honest feedback that matters.",
    text: "Unlike college websites and brochures, I got real insights about what student life is actually like. The mentor answered all my questions without sugarcoating anything. Worth every penny!",
    name: "Arjun Patel",
    role: "Applicant considering multiple colleges",
    initials: "AP"
  },
  {
    quote: "Best decision before joining college.",
    text: "I was skeptical about paying for a session, but talking to a current student gave me confidence in my choice. They explained everything from academics to social life to career prospects.",
    name: "Neha Verma",
    role: "Admitted to NST 2024",
    initials: "NV"
  }
];

// Testimonials Carousel Component
function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const current = testimonials[currentIndex];

  return (
    <section id="reviews" className="py-24 bg-slate-900 text-white">
      <div className="container px-4 md:px-6 mx-auto max-w-2xl">
        <FadeIn direction="up">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-white/60 uppercase tracking-wider">What Students Say</p>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.2}>
          <div className="overflow-hidden">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="text-center"
            >
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                &ldquo;{current.quote}&rdquo;
              </h3>
              <p className="text-white/70 text-lg leading-relaxed mb-8">
                {current.text}
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-sm">
                  {current.initials}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white text-sm">{current.name}</p>
                  <p className="text-xs text-white/60">{current.role}</p>
                </div>
              </div>

              {/* Dots Indicator */}
              <div className="flex gap-2 justify-center mt-8">
                {testimonials.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 rounded-full transition-all ${index === currentIndex ? "bg-white w-8" : "bg-white/30 w-2"
                      }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

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
  const { isAuthenticated } = useAuth();
  const [mentors, setMentors] = useState([]);
  const [loadingMentors, setLoadingMentors] = useState(true);
  const [selectedCollege, setSelectedCollege] = useState("all");

  useEffect(() => {
    let isMounted = true;

    async function fetchMentors() {
      try {
        const { data, error } = await supabase
          .from("mentors")
          .select("id, name, role, college, college_id, image, rating, price, bio, is_active, created_at")
          .order("created_at", { ascending: false });

        console.log("Mentors fetch result:", { data, error });

        if (isMounted) {
          if (error) {
            console.error("Error fetching mentors:", error);
          }
          if (data) {
            setMentors(data);
          }
          setLoadingMentors(false);
        }
      } catch (e) {
        console.error("Error fetching mentors:", e);
        if (isMounted) {
          setLoadingMentors(false);
        }
      }
    }

    fetchMentors();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 mt-16"> {/* Added mt-16 to clear fixed navbar */}
        {/* Hero Section - Full viewport with NSAT at bottom */}
        <section className="relative overflow-hidden min-h-[calc(100vh-64px)] md:h-[calc(100vh-64px)] flex flex-col">
          <FloatingOrbs />

          {/* Hero Content - Takes remaining space */}
          <div className="flex-1 flex items-center justify-center py-8 md:py-0">
            <HeroHighlight containerClassName="w-full h-full flex items-center justify-center">
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
                    <Link href={isAuthenticated ? "/#mentors" : "/login"}>
                      <Button size="lg" className="rounded-full px-8 h-12 text-base gradient-bg text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5 border-0">
                        Book Session <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={isAuthenticated ? "/contact" : "/login"}>
                      <Button variant="outline" size="lg" className="rounded-full h-12 text-base border-primary/20 text-primary hover:bg-primary/5 hover:text-primary">
                        Contact Us
                      </Button>
                    </Link>
                  </div>
                </TextReveal>
              </div>
            </HeroHighlight>
          </div>

          {/* NSAT Offer Banner - Fixed at bottom of hero */}
          <div className="w-full py-4 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 border-y border-primary/20">
            <div className="container px-4 md:px-6 mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center shrink-0">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">🎉 NSAT Offer: Get Your First Session FREE!</h3>
                    <p className="text-sm text-gray-600">Register for NSAT using our link & get ₹300 off + a free mentorship session</p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    document.getElementById('mentors')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="rounded-full px-6 bg-gradient-to-r from-primary to-purple-500 text-white hover:opacity-90 transition-opacity shrink-0"
                >
                  Claim Free Session
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - What We Help You With */}
        <section className="py-24 bg-gradient-to-b from-white via-primary/[0.02] to-slate-50">
          <div className="container px-4 md:px-6 mx-auto">
            <FadeIn direction="up">
              <div className="text-center mb-14">
                <Badge variant="outline" className="mb-4 text-primary border-primary/30 px-4 py-1">
                  Why Choose Us
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                  What We Help You With
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  Get real insights from students who are living the experience right now
                </p>
              </div>
            </FadeIn>

            <FadeInStagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Feature 1 - College Clarity - Indigo/Violet */}
              <FadeInStaggerItem>
                <div className="group relative p-7 rounded-2xl bg-white border border-border/60 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 text-foreground tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Get Real Clarity</h3>
                      <p className="text-muted-foreground text-[15px] leading-relaxed">
                        Get genuine, unfiltered insights about the college you&apos;re considering. No marketing fluff, just real experiences.
                      </p>
                    </div>
                  </div>
                </div>
              </FadeInStaggerItem>

              {/* Feature 2 - Compare Colleges - Emerald/Teal */}
              <FadeInStaggerItem>
                <div className="group relative p-7 rounded-2xl bg-white border border-border/60 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 text-foreground tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Compare New-Gen Colleges</h3>
                      <p className="text-muted-foreground text-[15px] leading-relaxed">
                        Confused between NST, Vedam, NIAT, or Polaris? Talk to students and make an informed comparison.
                      </p>
                    </div>
                  </div>
                </div>
              </FadeInStaggerItem>

              {/* Feature 3 - Admission Prep - Amber/Orange */}
              <FadeInStaggerItem>
                <div className="group relative p-7 rounded-2xl bg-white border border-border/60 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 text-foreground tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Prepare Before Admission</h3>
                      <p className="text-muted-foreground text-[15px] leading-relaxed">
                        From laptop requirements to coding prerequisites, get fully prepared for Day 1 at your new college.
                      </p>
                    </div>
                  </div>
                </div>
              </FadeInStaggerItem>

              {/* Feature 4 - Entrance Exam Tips - Rose/Pink */}
              <FadeInStaggerItem>
                <div className="group relative p-7 rounded-2xl bg-white border border-border/60 hover:border-rose-300 hover:shadow-lg hover:shadow-rose-100 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 text-foreground tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Entrance Exam & Prep Tips</h3>
                      <p className="text-muted-foreground text-[15px] leading-relaxed">
                        Get insider tips on NSAT, interviews, and admission processes. Learn what actually gets you selected.
                      </p>
                    </div>
                  </div>
                </div>
              </FadeInStaggerItem>

              {/* Feature 5 - Campus Life - Sky/Blue */}
              <FadeInStaggerItem>
                <div className="group relative p-7 rounded-2xl bg-white border border-border/60 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 text-foreground tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Real Campus Life Insights</h3>
                      <p className="text-muted-foreground text-[15px] leading-relaxed">
                        Hostel life, mess food, social scene, clubs, and daily routines. Know what your 4 years will look like.
                      </p>
                    </div>
                  </div>
                </div>
              </FadeInStaggerItem>

              {/* Feature 6 - Career Insights - Violet/Purple */}
              <FadeInStaggerItem>
                <div className="group relative p-7 rounded-2xl bg-white border border-border/60 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-100 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 text-foreground tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Placement & Career Reality</h3>
                      <p className="text-muted-foreground text-[15px] leading-relaxed">
                        Get honest placement statistics, internship opportunities, and career growth prospects from real students.
                      </p>
                    </div>
                  </div>
                </div>
              </FadeInStaggerItem>
            </FadeInStagger>

            {/* CTA Row */}
            <FadeIn direction="up" delay={0.4}>
              <div className="mt-16 text-center">
                <p className="text-muted-foreground mb-6">
                  Ready to get started? Book a session with our mentors today.
                </p>
                <Link href="#mentors">
                  <Button className="rounded-full px-8 gradient-bg text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
                    Explore Mentors <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Mentors Section */}
        <section id="mentors" className="py-24 bg-gradient-to-b from-primary/5 to-transparent border-t border-primary/10">
          <div className="container px-4 md:px-6 mx-auto">
            <FadeIn direction="up">
              <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-display)' }}>Meet top mentors</h2>
                  <p className="text-muted-foreground max-w-xl">
                    Connect with students who are living the college experience right now. Get honest answers about what it&apos;s really like.
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Campus Selector Tabs */}
            <div className="mb-10">
              <div className="flex flex-wrap gap-2 p-1.5 bg-muted/50 rounded-2xl w-fit">
                {COLLEGES.map((college) => (
                  <button
                    key={college.id}
                    onClick={() => setSelectedCollege(college.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${selectedCollege === college.id
                      ? 'bg-primary text-white shadow-md'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                  >
                    {college.short}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {selectedCollege === "all"
                  ? "Showing mentors from all colleges"
                  : `Showing mentors from ${COLLEGES.find(c => c.id === selectedCollege)?.name}`
                }
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors
                .filter(mentor => selectedCollege === "all" || mentor.college_id === selectedCollege)
                .map((mentor, i) => (
                  <div key={mentor.id || i}>
                    <MentorCardWithBooking mentor={mentor}>
                      <MentorCard mentor={mentor} />
                    </MentorCardWithBooking>
                  </div>
                ))
              }
              {mentors.filter(mentor => selectedCollege === "all" || mentor.college_id === selectedCollege).length === 0 && !loadingMentors && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <p className="mb-2">mentors from this college coming soon!</p>
                  <p className="text-sm">Check back soon or explore mentors from other colleges!</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <FadeIn direction="up">
              <div className="text-center mb-16 max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-display)' }}>Affordable & Transparent</h2>
                <p className="text-muted-foreground">
                  Get clarity on your college decision for less than a movie ticket.
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

        {/* Student Testimonials Carousel */}
        <TestimonialsCarousel />

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
