"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video } from "lucide-react";

export function BookingModal({ mentor }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full">
                    Book Session
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden gap-0 rounded-2xl">
                <div className="grid md:grid-cols-5 h-full">
                    {/* Left Panel: Mentor Info */}
                    <div className="md:col-span-2 bg-muted/30 p-6 flex flex-col gap-6 border-r border-border/40">
                        <div className="flex flex-col items-center text-center gap-3">
                            <Avatar className="h-24 w-24 border-2 border-background shadow-sm">
                                <AvatarImage src={mentor.image} />
                                <AvatarFallback>{mentor.name.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <DialogTitle className="text-xl font-bold">{mentor.name}</DialogTitle>
                                <DialogDescription className="text-sm">{mentor.role}</DialogDescription>
                                <p className="text-xs font-semibold mt-1 text-foreground/80">{mentor.college}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <div className="bg-background p-2 rounded-full border shadow-sm">
                                    <Clock className="w-4 h-4 text-foreground" />
                                </div>
                                <span>30 min session</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <div className="bg-background p-2 rounded-full border shadow-sm">
                                    <Video className="w-4 h-4 text-foreground" />
                                </div>
                                <span>Google Meet</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-foreground font-medium">
                                <div className="bg-background p-2 rounded-full border shadow-sm">
                                    <span className="text-xs">₹</span>
                                </div>
                                <span>{mentor.price}</span>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Expertise</h4>
                            <div className="flex flex-wrap gap-2">
                                {mentor.expertise?.map(t => (
                                    <Badge key={t} variant="secondary" className="text-[10px] px-2 bg-background border shadow-sm">{t}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Calendar/Scheduling */}
                    <div className="md:col-span-3 p-6 flex flex-col h-full min-h-[400px]">
                        <div className="mb-4">
                            <h3 className="font-semibold text-lg">Select a Time</h3>
                            <p className="text-sm text-muted-foreground">Available slots for next week</p>
                        </div>

                        {/* Placeholder for Calendly/Calendar */}
                        <div className="flex-1 border border-dashed border-border rounded-xl bg-muted/10 flex items-center justify-center relative overflow-hidden group hover:bg-muted/20 transition-colors cursor-pointer">
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                <Calendar className="w-8 h-8 text-muted-foreground/50" />
                                <span className="text-sm font-medium text-muted-foreground">Calendar Integration Placeholder</span>
                                <Button variant="outline" size="sm" className="mt-2">View Availability</Button>
                            </div>
                        </div>

                        <p className="text-[10px] text-muted-foreground text-center mt-4">
                            Powered by Establish Bookings
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
