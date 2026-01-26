import { createServerClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const supabase = createServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database configuration error" }, { status: 500 });
    }

    // Fetch payments
    const { data: payments, error } = await supabase
      .from("payments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    // Fallback if payments table fails/empty
    if (error || !payments || payments.length === 0) {
      const { data: bookingsProxy, error: bookingError } = await supabase
        .from("bookings")
        .select(`
            id,
            created_at,
            amount,
            status,
            mentor:mentors(
                profile:profiles(full_name)
            )
        `)
        .eq("student_id", userId)
        .eq("status", "confirmed")
        .order("created_at", { ascending: false });

      if (bookingError) {
        console.error("Error fetching bookings proxy:", bookingError);
        return NextResponse.json({ payments: [] });
      }

      const transformedPayments = bookingsProxy.map(b => ({
        id: b.id,
        date: new Date(b.created_at).toLocaleDateString(),
        amount: b.amount ? `₹${b.amount}` : "₹500",
        status: "Completed",
        mentor: b.mentor?.profile?.full_name || "Mentor"
      }));

      return NextResponse.json({ payments: transformedPayments });
    }

    return NextResponse.json({ payments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
