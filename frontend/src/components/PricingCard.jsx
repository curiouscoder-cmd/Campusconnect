import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export function PricingCard({ plan }) {
    return (
        <Card className={`relative flex flex-col border-border/60 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 ${plan.popular ? 'border-primary/30 shadow-md shadow-primary/5 ring-1 ring-primary/20' : ''} ${plan.comingSoon ? 'opacity-75' : ''}`}>
            {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-bg text-white text-[10px] px-3 py-1 rounded-full font-medium">
                    Most Popular
                </span>
            )}
            {plan.comingSoon && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] px-3 py-1 rounded-full font-medium">
                    Coming Soon
                </span>
            )}
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium">{plan.title}</CardTitle>
                <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-bold tracking-tight">{plan.price}</span>
                </div>
            </CardHeader>
            <CardContent className="flex-1">
                <ul className="space-y-3 text-sm text-muted-foreground">
                    {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-foreground/70 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter className="pt-4">
                <Button
                    className="w-full rounded-2xl"
                    variant={plan.popular ? "default" : "outline"}
                    disabled={plan.comingSoon}
                >
                    {plan.comingSoon ? "Coming Soon" : `Choose ${plan.title}`}
                </Button>
            </CardFooter>
        </Card>
    );
}
