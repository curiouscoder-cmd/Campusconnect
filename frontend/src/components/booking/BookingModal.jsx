"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, ChevronRight, Clock } from "lucide-react";
import { SlotPicker } from "./SlotPicker";
import { SessionTypeSelector } from "./SessionTypeSelector";
import { UserDetailsForm } from "./UserDetailsForm";
import { PaymentScreen } from "./PaymentScreen";
import { ConfirmationScreen } from "./ConfirmationScreen";
import { NsatVerificationScreen } from "./NsatVerificationScreen";
import { generateMockSlots, formatDateISO } from "@/lib/booking-utils";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import Script from "next/script";

const STEPS = {
  SLOT_SELECTION: "slot-selection",
  SESSION_TYPE: "session-type",
  USER_DETAILS: "user-details",
  PAYMENT: "payment",
  NSAT_VERIFICATION: "nsat-verification",
  CONFIRMATION: "confirmation",
};

const STEP_TITLES = {
  [STEPS.SLOT_SELECTION]: "Select a Time",
  [STEPS.SESSION_TYPE]: "Choose Session Type",
  [STEPS.USER_DETAILS]: "Your Details",
  [STEPS.PAYMENT]: "Complete Payment",
  [STEPS.NSAT_VERIFICATION]: "NSAT Verification",
  [STEPS.CONFIRMATION]: "Booking Confirmed",
};

export function BookingModal({ mentor, isOpen, onClose, mode = "paid" }) {
  const [currentStep, setCurrentStep] = useState(STEPS.SLOT_SELECTION);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    questions: "",
  });
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [nsatSubmitting, setNsatSubmitting] = useState(false);

  const isNsatMode = mode === "nsat";

  // Fetch real slots from database
  const mentorId = mentor?.id;

  useEffect(() => {
    async function fetchSlots() {
      if (!mentorId || !isOpen) return;

      setSlotsLoading(true);
      try {
        // Fetch available slots from availability table
        const today = formatDateISO(new Date());
        const { data, error } = await supabase
          .from("availability")
          .select("*")
          .eq("mentor_id", mentorId)
          .eq("is_booked", false)
          .gte("date", today)
          .order("date", { ascending: true })
          .order("start_time", { ascending: true });

        if (data && data.length > 0) {
          // Transform DB slots to the format expected by SlotPicker
          const transformedSlots = data.map(slot => {
            // Normalize date to YYYY-MM-DD format (handle timezone issues)
            let normalizedDate = slot.date;
            if (slot.date && slot.date.includes('T')) {
              // If date includes time component, extract just the date part
              normalizedDate = slot.date.split('T')[0];
            }

            return {
              id: slot.id,
              mentorId: slot.mentor_id,
              date: normalizedDate,
              startTime: slot.start_time,
              endTime: slot.end_time,
              isBooked: slot.is_booked,
              isReserved: slot.is_reserved,
              reservedBy: slot.reserved_by,
              reservedUntil: slot.reserved_until,
            };
          });
          setSlots(transformedSlots);
        } else {
          // Fallback to mock slots if no real data
          const mockSlots = generateMockSlots(mentorId, 14);
          setSlots(mockSlots);
        }
      } catch (err) {
        console.error("Error fetching slots:", err);
        // Fallback to mock slots on error
        const mockSlots = generateMockSlots(mentorId, 14);
        setSlots(mockSlots);
      } finally {
        setSlotsLoading(false);
      }
    }

    fetchSlots();
  }, [mentorId, isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setCurrentStep(STEPS.SLOT_SELECTION);
        setSelectedSlot(null);
        setSelectedSession(null);
        setUserDetails({ name: "", email: "", phone: "", questions: "" });
        setPaymentData(null);
        setError(null);
      }, 300);
    }
  }, [isOpen]);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setError(null);
  };

  const handleSessionSelect = (session) => {
    setSelectedSession(session);
  };

  const handleContinueFromSlot = () => {
    if (!selectedSlot) {
      setError("Please select a time slot");
      return;
    }
    // In NSAT mode, go directly to NSAT verification
    if (isNsatMode) {
      setCurrentStep(STEPS.NSAT_VERIFICATION);
    } else {
      setCurrentStep(STEPS.SESSION_TYPE);
    }
  };

  const handleContinueFromSession = () => {
    if (!selectedSession) {
      setError("Please select a session type");
      return;
    }
    setCurrentStep(STEPS.USER_DETAILS);
  };

  const handleContinueFromDetails = () => {
    setCurrentStep(STEPS.PAYMENT);
  };

  const handlePaymentSuccess = (data) => {
    setPaymentData(data);
    setCurrentStep(STEPS.CONFIRMATION);
  };

  const handlePaymentFailure = (errorMessage) => {
    setError(errorMessage);
    setCurrentStep(STEPS.SLOT_SELECTION);
  };

  const handleBack = () => {
    setError(null);
    switch (currentStep) {
      case STEPS.SESSION_TYPE:
        setCurrentStep(STEPS.SLOT_SELECTION);
        break;
      case STEPS.USER_DETAILS:
        setCurrentStep(STEPS.SESSION_TYPE);
        break;
      case STEPS.PAYMENT:
        setCurrentStep(STEPS.USER_DETAILS);
        break;
      case STEPS.NSAT_VERIFICATION:
        setCurrentStep(STEPS.SLOT_SELECTION);
        break;
      default:
        break;
    }
  };

  const canGoBack = [STEPS.SESSION_TYPE, STEPS.USER_DETAILS, STEPS.PAYMENT, STEPS.NSAT_VERIFICATION].includes(currentStep);

  const getStepNumber = () => {
    if (isNsatMode) {
      const stepOrder = [STEPS.SLOT_SELECTION, STEPS.NSAT_VERIFICATION];
      return stepOrder.indexOf(currentStep) + 1;
    }
    const stepOrder = [STEPS.SLOT_SELECTION, STEPS.SESSION_TYPE, STEPS.USER_DETAILS, STEPS.PAYMENT];
    return stepOrder.indexOf(currentStep) + 1;
  };

  if (!isOpen) return null;

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[101] w-auto md:w-full md:max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row h-full"
          style={{
            border: "1px solid #e5e7eb",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }}
        >
          {/* Left Panel - Mentor Info (Calendly Style) */}
          <div className="hidden md:flex flex-col w-72 p-8 border-r border-gray-200">
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {/* Mentor Avatar */}
            <div className="mb-6">
              {mentor?.image ? (
                <img
                  src={mentor.image}
                  alt={mentor.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xl font-semibold">
                  {mentor?.name?.charAt(0) || "M"}
                </div>
              )}
            </div>

            {/* Mentor Name */}
            <p className="text-sm text-gray-500 mb-1">{mentor?.name}</p>

            {/* Session Title */}
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {selectedSession ? `${selectedSession.duration} Minute Meeting` : "Book a Session"}
            </h2>

            {/* Duration */}
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                {selectedSession ? `${selectedSession.duration} min` : "15-45 min"}
              </span>
            </div>

            {/* Price if selected */}
            {selectedSession && (
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <span className="text-sm font-medium">₹{selectedSession.price}</span>
              </div>
            )}

            {/* College info */}
            <div className="mt-auto pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-1">College</p>
              <p className="text-sm text-gray-700">{mentor?.college}</p>
            </div>
          </div>

          {/* Right Panel - Booking Flow */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            {/* Back button */}
            {canGoBack && (
              <button
                onClick={handleBack}
                className="absolute top-4 left-4 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </button>
            )}

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 md:px-6 pt-4"
                >
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 pt-14">
              <AnimatePresence mode="wait">
                {currentStep === STEPS.SLOT_SELECTION && (
                  <motion.div
                    key="slot"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SlotPicker
                      slots={slots}
                      selectedSlot={selectedSlot}
                      onSelectSlot={handleSlotSelect}
                      mentor={mentor}
                      sessionType={selectedSession}
                    />
                  </motion.div>
                )}

                {currentStep === STEPS.SESSION_TYPE && (
                  <motion.div
                    key="session"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SessionTypeSelector
                      selectedType={selectedSession}
                      onSelectType={handleSessionSelect}
                    />
                  </motion.div>
                )}

                {currentStep === STEPS.USER_DETAILS && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <UserDetailsForm
                      userDetails={userDetails}
                      onUpdateDetails={setUserDetails}
                      onSubmit={handleContinueFromDetails}
                    />
                  </motion.div>
                )}

                {currentStep === STEPS.PAYMENT && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PaymentScreen
                      mentor={mentor}
                      selectedSlot={selectedSlot}
                      selectedSession={selectedSession}
                      userDetails={userDetails}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentFailure={handlePaymentFailure}
                    />
                  </motion.div>
                )}

                {currentStep === STEPS.NSAT_VERIFICATION && (
                  <motion.div
                    key="nsat"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <NsatVerificationScreen
                      mentor={mentor}
                      slot={selectedSlot}
                      onSuccess={() => setCurrentStep(STEPS.CONFIRMATION)}
                      onBack={handleBack}
                    />
                  </motion.div>
                )}

                {currentStep === STEPS.CONFIRMATION && (
                  <motion.div
                    key="confirmation"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ConfirmationScreen
                      mentor={mentor}
                      selectedSlot={selectedSlot}
                      selectedSession={selectedSession}
                      userDetails={userDetails}
                      meetLink={isNsatMode ? null : (mentor?.meetLink || "https://meet.google.com/abc-defg-hij")}
                      onClose={onClose}
                      isNsatMode={isNsatMode}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer with Continue Button */}
            {currentStep !== STEPS.CONFIRMATION && currentStep !== STEPS.PAYMENT && currentStep !== STEPS.NSAT_VERIFICATION && (
              <div className="p-6 md:p-8 pt-4 bg-white">
                <motion.button
                  onClick={() => {
                    if (currentStep === STEPS.SLOT_SELECTION) handleContinueFromSlot();
                    else if (currentStep === STEPS.SESSION_TYPE) handleContinueFromSession();
                    else if (currentStep === STEPS.USER_DETAILS) handleContinueFromDetails();
                  }}
                  whileHover={
                    !((currentStep === STEPS.SLOT_SELECTION && !selectedSlot) ||
                      (currentStep === STEPS.SESSION_TYPE && !selectedSession))
                      ? { scale: 1.01 }
                      : {}
                  }
                  whileTap={
                    !((currentStep === STEPS.SLOT_SELECTION && !selectedSlot) ||
                      (currentStep === STEPS.SESSION_TYPE && !selectedSession))
                      ? { scale: 0.99 }
                      : {}
                  }
                  disabled={
                    (currentStep === STEPS.SLOT_SELECTION && !selectedSlot) ||
                    (currentStep === STEPS.SESSION_TYPE && !selectedSession)
                  }
                  className={cn(
                    "w-full py-3.5 rounded-full font-semibold text-sm transition-all duration-200",
                    (currentStep === STEPS.SLOT_SELECTION && !selectedSlot) ||
                      (currentStep === STEPS.SESSION_TYPE && !selectedSession)
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  )}
                >
                  {currentStep === STEPS.SLOT_SELECTION && "Next"}
                  {currentStep === STEPS.SESSION_TYPE && "Continue"}
                  {currentStep === STEPS.USER_DETAILS && "Schedule Event"}
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
