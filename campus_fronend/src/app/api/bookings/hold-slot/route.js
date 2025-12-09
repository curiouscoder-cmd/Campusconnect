import { NextResponse } from "next/server";

// In-memory store for slot reservations (use Redis/database in production)
const reservations = new Map();

// Reservation duration in milliseconds (10 minutes)
const RESERVATION_DURATION = 10 * 60 * 1000;

export async function POST(request) {
  try {
    const body = await request.json();
    const { slotId, userId, mentorId } = body;

    if (!slotId || !userId) {
      return NextResponse.json(
        { error: "Slot ID and User ID are required" },
        { status: 400 }
      );
    }

    // Check if slot is already reserved by someone else
    const existingReservation = reservations.get(slotId);
    if (existingReservation) {
      const now = Date.now();
      if (existingReservation.expiresAt > now && existingReservation.userId !== userId) {
        return NextResponse.json(
          { error: "Slot is already reserved by another user" },
          { status: 409 }
        );
      }
    }

    // Create or update reservation
    const expiresAt = Date.now() + RESERVATION_DURATION;
    reservations.set(slotId, {
      slotId,
      userId,
      mentorId,
      expiresAt,
      createdAt: Date.now(),
    });

    // Clean up expired reservations
    for (const [key, value] of reservations.entries()) {
      if (value.expiresAt < Date.now()) {
        reservations.delete(key);
      }
    }

    return NextResponse.json({
      success: true,
      reservation: {
        slotId,
        userId,
        expiresAt: new Date(expiresAt).toISOString(),
        remainingSeconds: Math.floor(RESERVATION_DURATION / 1000),
      },
    });
  } catch (error) {
    console.error("Error holding slot:", error);
    return NextResponse.json(
      { error: "Failed to hold slot" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slotId = searchParams.get("slotId");
    const userId = searchParams.get("userId");

    if (!slotId) {
      return NextResponse.json(
        { error: "Slot ID is required" },
        { status: 400 }
      );
    }

    const reservation = reservations.get(slotId);
    if (reservation && reservation.userId === userId) {
      reservations.delete(slotId);
    }

    return NextResponse.json({
      success: true,
      message: "Reservation released",
    });
  } catch (error) {
    console.error("Error releasing slot:", error);
    return NextResponse.json(
      { error: "Failed to release slot" },
      { status: 500 }
    );
  }
}
