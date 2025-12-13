"use client";

import { useState } from "react";
import React from "react";
import { BookingModal } from "@/components/booking";

// Re-export BookingModal as SessionBookingModal for backward compatibility
export { BookingModal as SessionBookingModal };

// Wrapper component for MentorCard with Book Session button
export function MentorCardWithBooking({ mentor, children }) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <>
      {React.cloneElement(children, {
        onBookSession: () => setIsBookingModalOpen(true)
      })}
      <BookingModal
        mentor={mentor}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </>
  );
}
