"use client";

import { use, useState } from "react";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "lucide-react";

// Mock Data (would typically come from API/Context)
const MENTORS = {
    "1": { name: "Aditya Kumar", role: "Software Engineer @ Google", image: "https://github.com/shadcn.png" },
    "2": { name: "Riya Singh", role: "Product Designer @ Microsoft", image: "https://github.com/shadcn.png" },
    "3": { name: "Karan Mehta", role: "Founder @ Stealth", image: "https://github.com/shadcn.png" }
};

export default function BookingPage(props) {
    const params = use(props.params); // Use React.use to unwrap params in Next.js 16/React 19
    const { mentorId } = params;
    const mentor = MENTORS[mentorId] || MENTORS["1"]; // Fallback to 1 if not found
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    const dates = ["Mon, 12 Oct", "Tue, 13 Oct", "Wed, 14 Oct"];
    const times = ["10:00 AM", "02:00 PM", "04:00 PM", "07:00 PM"];

    return (
        <div className="min-h-screen flex flex-col font-sans bg-muted/30 pt-24">

            <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Mentor Summary Sidebar */}
                    <Card className="p-6 h-fit md:col-span-1 border-border/60">
                        <div className="flex flex-col items-center text-center">
                            <Avatar className="h-24 w-24 mb-4 border-2 border-border">
                                <AvatarImage src={mentor.image} />
                                <AvatarFallback>{mentor.name[0]}</AvatarFallback>
                            </Avatar>
                            <h2 className="font-bold text-lg">{mentor.name}</h2>
                            <p className="text-sm text-muted-foreground">{mentor.role}</p>
                            <div className="mt-6 w-full pt-6 border-t border-border/50">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-muted-foreground">Session</span>
                                    <span className="font-medium">30 Min Call</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Price</span>
                                    <span className="font-medium">₹199</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Calendar/Time Selection */}
                    <Card className="p-6 md:col-span-2 border-border/60">
                        <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                            <Calendar className="w-5 h-5" /> Select a time
                        </h3>

                        <div className="mb-8">
                            <h4 className="text-sm text-muted-foreground mb-3 font-medium uppercase tracking-wide">Date</h4>
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {dates.map(date => (
                                    <button
                                        key={date}
                                        onClick={() => setSelectedDate(date)}
                                        className={`px-4 py-3 rounded-xl border text-sm font-medium whitespace-nowrap transition-all ${selectedDate === date ? 'border-black bg-black text-white shadow-md' : 'border-border bg-white hover:border-black/50'}`}
                                    >
                                        {date}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedDate && (
                            <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                                <h4 className="text-sm text-muted-foreground mb-3 font-medium uppercase tracking-wide">Time</h4>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                    {times.map(time => (
                                        <button
                                            key={time}
                                            onClick={() => setSelectedTime(time)}
                                            className={`px-3 py-2 rounded-lg border text-sm transition-all ${selectedTime === time ? 'border-black bg-black text-white shadow-md' : 'border-border bg-white hover:border-black/50'}`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Button
                            className="w-full rounded-full"
                            size="lg"
                            disabled={!selectedDate || !selectedTime}
                        >
                            Confirm Booking
                        </Button>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
}
