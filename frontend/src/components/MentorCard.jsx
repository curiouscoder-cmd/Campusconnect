import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, GraduationCap, ArrowRight, Gift } from "lucide-react";
import Link from "next/link";

export function MentorCard({ mentor, onBookSession, onFreeSession }) {
    // Generate ID from name for URL
    const mentorId = mentor.id || mentor.name.toLowerCase().replace(/\s+/g, '-');

    return (
        <div
            className="group w-full bg-white rounded-2xl border border-gray-100 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden flex flex-col h-full"
        >
            <div className="p-6 flex-1 flex flex-col">
                {/* Header with avatar and info */}
                <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                        <Avatar className="h-14 w-14 border-2 border-white shadow-md">
                            <AvatarImage src={mentor.image} alt={mentor.name} className="object-cover" />
                            <AvatarFallback className="text-base font-semibold bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                                {mentor.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base text-foreground truncate">{mentor.name}</h3>
                        <p className="text-sm text-muted-foreground">{mentor.role}</p>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-semibold text-amber-700">{mentor.rating || "5.0"}</span>
                    </div>
                </div>

                {/* College info */}
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <GraduationCap className="w-4 h-4 text-primary/60" />
                    <span className="truncate">{mentor.college}</span>
                </div>

                {/* Price */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <span className="text-xs text-muted-foreground">Starting from</span>
                        <p className="font-semibold text-lg text-foreground">{mentor.price} <span className="text-sm font-normal text-muted-foreground">/ session</span></p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 space-y-2">
                    <Link
                        href={`/mentor/${mentorId}`}
                        className="w-full py-2.5 px-4 rounded-lg border border-primary/30 text-primary text-sm font-medium hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 group/btn"
                    >
                        View Details
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>

                    <button
                        onClick={onBookSession}
                        className="w-full py-2.5 px-4 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                    >
                        Book Session
                    </button>

                    {/* NSAT Offer - Free Session */}
                    <button
                        onClick={onFreeSession}
                        className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 text-sm font-medium text-primary hover:from-primary/20 hover:to-purple-500/20 transition-all flex items-center justify-center gap-2"
                    >
                        <Gift className="w-4 h-4" />
                        NSAT Offer - Free Session
                    </button>
                </div>
            </div>
        </div>
    );
}
