// Booking utility functions

// Session types configuration
export const SESSION_TYPES = [
  {
    id: "quick",
    title: "Quick Chat",
    duration: 15,
    price: 99,
    description: "Perfect for quick doubts about admissions or campus life",
    type: "1:1",
  },
  {
    id: "deep",
    title: "Deep Dive",
    duration: 30,
    price: 199,
    description: "Detailed discussion about placements, faculty, and more",
    type: "1:1",
  },
  {
    id: "group",
    title: "Group Session",
    duration: 45,
    price: 49,
    description: "Join with other applicants, ask questions together",
    type: "group",
    maxParticipants: 5,
  },
];

// Generate dates for the next N days
export function getNextDays(count) {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  
  return dates;
}

// Format date to display string
export function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// Format date to ISO string (YYYY-MM-DD)
export function formatDateISO(date) {
  return date.toISOString().split("T")[0];
}

// Format time from 24h to 12h format
export function formatTime(time) {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

// Check if a slot is available (not booked and not reserved by someone else)
export function isSlotAvailable(slot, currentUserId) {
  if (slot.isBooked) return false;
  
  if (slot.isReserved) {
    // Check if reservation has expired
    if (slot.reservedUntil) {
      const reservedUntil = new Date(slot.reservedUntil);
      if (reservedUntil < new Date()) {
        return true; // Reservation expired
      }
    }
    // Check if reserved by current user
    if (currentUserId && slot.reservedBy === currentUserId) {
      return true;
    }
    return false;
  }
  
  return true;
}

// Calculate remaining time for reservation
export function getReservationTimeRemaining(reservedUntil) {
  const endTime = new Date(reservedUntil).getTime();
  const now = Date.now();
  return Math.max(0, Math.floor((endTime - now) / 1000));
}

// Format seconds to MM:SS
export function formatTimeRemaining(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Generate mock availability slots for a mentor
export function generateMockSlots(mentorId, days = 7) {
  const slots = [];
  const dates = getNextDays(days);
  
  // Available time slots (9 AM to 6 PM, every 30 minutes)
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30"
  ];
  
  dates.forEach((date) => {
    // Skip some random slots to simulate real availability
    const availableSlots = timeSlots.filter(() => Math.random() > 0.3);
    
    availableSlots.forEach((startTime) => {
      const [hours, minutes] = startTime.split(":").map(Number);
      const endHours = minutes === 30 ? hours + 1 : hours;
      const endMinutes = minutes === 30 ? 0 : 30;
      const endTime = `${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`;
      
      slots.push({
        id: `${mentorId}-${formatDateISO(date)}-${startTime}`,
        mentorId,
        date: formatDateISO(date),
        startTime,
        endTime,
        isBooked: Math.random() < 0.15, // 15% chance of being booked
        isReserved: false,
      });
    });
  });
  
  return slots;
}

// Group slots by date
export function groupSlotsByDate(slots) {
  return slots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {});
}
