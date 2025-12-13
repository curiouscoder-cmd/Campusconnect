import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createServerClient();
    
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: "Supabase not configured",
        message: "Please add SUPABASE_SERVICE_ROLE_KEY to .env.local"
      }, { status: 500 });
    }

    // Test connection by fetching mentors
    const { data: mentors, error } = await supabase
      .from("mentors")
      .select("id, name, email, college")
      .limit(5);

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        hint: error.hint || "Make sure you ran the SQL to create tables"
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Database connected successfully!",
      mentors: mentors || [],
      mentorCount: mentors?.length || 0
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
