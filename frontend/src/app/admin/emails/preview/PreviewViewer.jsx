"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Monitor, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PreviewViewer({ previews }) {
    const [viewMode, setViewMode] = useState("desktop"); // desktop | mobile
    const previewKeys = Object.keys(previews);

    if (previewKeys.length === 0) {
        return <div className="text-center py-10">No previews available</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-muted/50 p-2 rounded-lg">
                <div className="text-sm font-medium pl-2">Device View</div>
                <div className="flex space-x-2">
                    <Button
                        variant={viewMode === "desktop" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("desktop")}
                    >
                        <Monitor className="h-4 w-4 mr-2" /> Desktop
                    </Button>
                    <Button
                        variant={viewMode === "mobile" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("mobile")}
                    >
                        <Phone className="h-4 w-4 mr-2" /> Mobile
                    </Button>
                </div>
            </div>

            <Tabs defaultValue={previewKeys[0]} className="w-full">
                <TabsList className="w-full flex-wrap h-auto gap-2 justify-start bg-transparent p-0">
                    {previewKeys.map((key) => (
                        <TabsTrigger
                            key={key}
                            value={key}
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                        >
                            {key}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {Object.entries(previews).map(([key, html]) => (
                    <TabsContent key={key} value={key} className="mt-4">
                        <Card className="p-4 bg-slate-100 flex justify-center items-start min-h-[600px] overflow-auto">
                            <iframe
                                srcDoc={html}
                                className={`bg-white shadow-xl transition-all duration-300 border-0 ${viewMode === "mobile"
                                        ? "w-[375px] h-[667px] rounded-[30px] border-8 border-slate-900"
                                        : "w-full h-[800px] rounded-md max-w-[1000px]"
                                    }`}
                                title={`${key} preview`}
                            />
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
