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
  const [isNsatModalOpen, setIsNsatModalOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const handleBookSession = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setIsBookingModalOpen(true);
  };

  const handleFreeSession = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setIsNsatModalOpen(true);
  };

  return (
    <>
      {React.cloneElement(children, {
        onBookSession: handleBookSession,
        onFreeSession: handleFreeSession,
      })}
      {/* Regular Booking Modal */}
      <BookingModal
        mentor={mentor}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        mode="paid"
      />
      {/* NSAT Free Session Modal */}
      <BookingModal
        mentor={mentor}
        isOpen={isNsatModalOpen}
        onClose={() => setIsNsatModalOpen(false)}
        mode="nsat"
      />
    </>
  );
}

