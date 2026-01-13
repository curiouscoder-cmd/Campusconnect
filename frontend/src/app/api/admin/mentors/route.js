"use server";

import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(request) {
    try {
        const body = await request.json();

        console.log("Creating mentor via API:", body.name);
        console.time("mentor-api-insert");

        const supabase = createServerClient();

        if (!supabase) {
            return NextResponse.json(
                { error: "Database not configured" },
                { status: 500 }
            );
        }

        const { data, error } = await supabase
            .from("mentors")
            .insert([body])
            .select();

        console.timeEnd("mentor-api-insert");

        if (error) {
            console.error("Mentor insert error:", error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, data });
    } catch (err) {
        console.error("API error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
