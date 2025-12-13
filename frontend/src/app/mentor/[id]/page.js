"use client";

import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, GraduationCap, Briefcase, ArrowLeft, Clock, Users, Video, X, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { BookingModal } from "@/components/booking";

// All mentors data
const allMentors = [
  {
    id: "nitya-jain",
    name: "Nitya Jain",
    role: "2nd Year Student",
    college: "Newton School of Technology",
    collegeId: "nst",
    price: "₹99",
    image: "https://gxutjvplqghjphemydcn.supabase.co/storage/v1/object/sign/mentors%20pic/Screenshot%202025-10-07%20at%203.58.37%20PM.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MmZmNmVhZS1kMDk2LTQ0ZmQtOWFhMi1jNWNlNWFmNWE2NzAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZW50b3JzIHBpYy9TY3JlZW5zaG90IDIwMjUtMTAtMDcgYXQgMy41OC4zNyBQTS5wbmciLCJpYXQiOjE3NjU2Mzc5NzgsImV4cCI6MTc5NzE3Mzk3OH0.c_PfavptClBsGFgQu3ipTbA6Snq9lyMXERG4JuJXEOM",
    bio: "Passionate about helping students make informed college decisions. I'm a 2nd year student at NST with a strong interest in tech and community building. I love sharing my campus experience and helping you understand about my college.",
    expertise: ["Campus Life", "Academics", "Placements", "Hostel Experience"],
    rating: "5.0"
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
    expertise: ["Coding Culture", "Technical Curriculum", "First Year Experience", "Faculty"],
    rating: "4.9"
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
    expertise: ["Placements", "Internships", "Learning Environment", "Career Guidance"],
    rating: "4.8"
  },
];

export default function MentorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const mentor = allMentors.find(m => m.id === params.id);

  if (!mentor) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 mt-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Mentor not found</h1>
            <Button onClick={() => router.push("/")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 mt-16">
        {/* Back Button */}
        <div className="container px-4 md:px-6 mx-auto pt-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to mentors</span>
          </button>
        </div>

        {/* Hero Section */}
        <section className="py-12">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-8 md:p-12 border border-primary/10">
              <div className="flex flex-col md:flex-row items-start gap-8">
                <Avatar className="h-32 w-32 border-4 border-white shadow-xl flex-shrink-0">
                  <AvatarImage src={mentor.image} alt={mentor.name} className="object-cover" />
                  <AvatarFallback className="text-3xl font-semibold bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                    {mentor.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{mentor.name}</h1>
                  <p className="text-xl text-primary font-medium mb-4">{mentor.role}</p>
                  
                  <div className="flex items-center gap-4 flex-wrap mb-6">
                    <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-amber-700">{mentor.rating}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-muted-foreground bg-white/50 px-4 py-2 rounded-full">
                      <GraduationCap className="w-5 h-5 text-primary/60" />
                      <span>{mentor.college}</span>
                    </div>

                    <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full">
                      <Briefcase className="w-5 h-5 text-primary/60" />
                      <span className="font-semibold text-foreground">{mentor.price} / session</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setIsBookingOpen(true)}
                    size="lg"
                    className="rounded-full px-8 bg-slate-900 text-white hover:bg-slate-800"
                  >
                    Book a Session
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="pb-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="md:col-span-2 space-y-8">
                {/* Bio Section */}
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                  <h2 className="text-xl font-semibold text-foreground mb-4">About</h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {mentor.bio}
                  </p>
                </div>

                {/* What to Expect */}
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                  <h2 className="text-xl font-semibold text-foreground mb-4">What to expect</h2>
                  <ul className="space-y-4 text-muted-foreground">
                    <li className="flex items-start gap-4">
                      <span className="text-primary font-bold text-lg">✓</span>
                      <span className="text-lg">Honest, first-hand insights about campus life and academics</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="text-primary font-bold text-lg">✓</span>
                      <span className="text-lg">Real answers about placements, faculty, and hostel experience</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="text-primary font-bold text-lg">✓</span>
                      <span className="text-lg">Personalized guidance based on your specific questions</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Expertise */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Areas of Expertise</h3>
                  <div className="space-y-3">
                    {mentor.expertise.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-sm font-medium text-foreground">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Card */}
                <div className="bg-slate-900 rounded-2xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">Ready to connect?</h3>
                  <p className="text-white/70 text-sm mb-4">
                    Book a session with {mentor.name.split(' ')[0]} and get all your questions answered.
                  </p>
                  <Button 
                    onClick={() => setIsBookingOpen(true)}
                    className="w-full bg-white text-slate-900 hover:bg-gray-100"
                  >
                    Book Session
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Premium Booking Modal */}
      <BookingModal
        mentor={mentor}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
