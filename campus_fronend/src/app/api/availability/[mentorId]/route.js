import { NextResponse } from "next/server";

// Mock availability data - In production, this would come from a database
function generateMockSlots(mentorId, days = 14) {
  const slots = [];
  const today = new Date();
  
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30"
  ];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];
    
    // Skip some random slots to simulate real availability
    const availableSlots = timeSlots.filter(() => Math.random() > 0.3);
    
    availableSlots.forEach((startTime) => {
      const [hours, minutes] = startTime.split(":").map(Number);
      const endHours = minutes === 30 ? hours + 1 : hours;
      const endMinutes = minutes === 30 ? 0 : 30;
      const endTime = `${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`;
      
      slots.push({
        id: `${mentorId}-${dateStr}-${startTime}`,
        mentorId,
        date: dateStr,
        startTime,
        endTime,
        isBooked: Math.random() < 0.1,
        isReserved: false,
      });
    });
  }
  
  return slots;
}

export async function GET(request, { params }) {
  try {
    const { mentorId } = params;
    
    if (!mentorId) {
      return NextResponse.json(
        { error: "Mentor ID is required" },
        { status: 400 }
      );
    }
    
    // In production, fetch from database
    const slots = generateMockSlots(mentorId);
    
    return NextResponse.json({
      success: true,
      mentorId,
      slots,
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}
