"use client";

import { useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { BookingModal } from "@/components/booking";
import { useAuth } from "@/context/AuthContext";

// Re-export BookingModal as SessionBookingModal for backward compatibility
export { BookingModal as SessionBookingModal };

// Wrapper component for MentorCard with Book Session button
export function MentorCardWithBooking({ mentor, children }) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const handleBookSession = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.push("/login");
      return;
    }
    setIsBookingModalOpen(true);
  };

  return (
    <>
      {React.cloneElement(children, {
        onBookSession: handleBookSession
      })}
      <BookingModal
        mentor={mentor}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </>
  );
}
