import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

export function MentorCard({ mentor }) {
    return (
        <Card className="group relative flex flex-col sm:flex-row items-start gap-4 p-5 transition-all duration-300 hover:-translate-y-[2px] hover:shadow-sm border-border/60">
            <div className="relative">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border border-border/50">
                    <AvatarImage src={mentor.image} alt={mentor.name} className="object-cover" />
                    <AvatarFallback className="text-lg bg-muted">{mentor.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 right-0 sm:right-2 bg-background border px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 fill-black text-black" />
                    <span className="text-[10px] font-semibold">{mentor.rating || "5.0"}</span>
                </div>
            </div>

            <div className="flex-1 space-y-2 w-full">
                <div className="flex justify-between items-start w-full">
                    <div>
                        <h3 className="font-semibold text-lg text-foreground leading-tight tracking-tight">{mentor.name}</h3>
                        <p className="text-sm text-muted-foreground">{mentor.role}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 font-medium text-foreground/80">{mentor.college}</p>
                    </div>
                    <div className="text-right">
                        <span className="block font-semibold text-sm">{mentor.price}</span>
                        <span className="text-[10px] text-muted-foreground">/ session</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                    {mentor.expertise.map((tag) => (
                        <Badge key={tag} variant="outline" className="font-normal text-xs px-2 py-0.5 text-muted-foreground border-border bg-transparent">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </div>
        </Card>
    );
}
