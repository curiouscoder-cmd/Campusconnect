import { NextResponse } from "next/server";

// In-memory store for bookings (use database in production)
const bookings = new Map();

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      slotId,
      mentorId,
      sessionType,
      userDetails,
      paymentId,
      orderId,
      meetLink,
    } = body;

    if (!slotId || !mentorId || !paymentId) {
      return NextResponse.json(
        { error: "Slot ID, Mentor ID, and Payment ID are required" },
        { status: 400 }
      );
    }

    // Create booking record
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const booking = {
      id: bookingId,
      slotId,
      mentorId,
      sessionType,
      userDetails,
      paymentId,
      orderId,
      meetLink: meetLink || `https://meet.google.com/${generateMeetCode()}`,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      confirmedAt: new Date().toISOString(),
    };

    // Store booking
    bookings.set(bookingId, booking);

    // In production:
    // 1. Save to database
    // 2. Mark slot as booked
    // 3. Send confirmation email to user
    // 4. Send notification to mentor
    // 5. Create Google Calendar event

    return NextResponse.json({
      success: true,
      booking,
      message: "Booking confirmed successfully",
    });
  } catch (error) {
    console.error("Error confirming booking:", error);
    return NextResponse.json(
      { error: "Failed to confirm booking" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("id");
    const mentorId = searchParams.get("mentorId");
    const userId = searchParams.get("userId");

    if (bookingId) {
      const booking = bookings.get(bookingId);
      if (!booking) {
        return NextResponse.json(
          { error: "Booking not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, booking });
    }

    // Filter bookings by mentor or user
    let filteredBookings = Array.from(bookings.values());
    if (mentorId) {
      filteredBookings = filteredBookings.filter((b) => b.mentorId === mentorId);
    }
    if (userId) {
      filteredBookings = filteredBookings.filter(
        (b) => b.userDetails?.email === userId
      );
    }

    return NextResponse.json({
      success: true,
      bookings: filteredBookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

function generateMeetCode() {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const segments = [3, 4, 3];
  return segments
    .map((len) =>
      Array.from({ length: len }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join("")
    )
    .join("-");
}
