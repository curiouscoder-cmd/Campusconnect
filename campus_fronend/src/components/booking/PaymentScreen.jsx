"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Calendar, CreditCard, Shield, Loader2 } from "lucide-react";
import { formatTime, formatTimeRemaining } from "@/lib/booking-utils";
import { cn } from "@/lib/utils";

// Razorpay Key - Replace with your actual key
const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY || "rzp_test_yourkeyhere";

export function PaymentScreen({
  mentor,
  selectedSlot,
  selectedSession,
  userDetails,
  reservationEndTime,
  onPaymentSuccess,
  onPaymentFailure,
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds

  // Countdown timer for slot reservation
  useEffect(() => {
    if (!reservationEndTime) return;

    const updateTimer = () => {
      const endTime = new Date(reservationEndTime).getTime();
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      setTimeRemaining(remaining);

      if (remaining === 0) {
        onPaymentFailure("Slot reservation expired. Please select a new slot.");
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [reservationEndTime, onPaymentFailure]);

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // In production, create order on backend first
      // const orderResponse = await fetch('/api/payments/create-order', {
      //   method: 'POST',
      //   body: JSON.stringify({ amount: selectedSession.price, slotId: selectedSlot.id })
      // });
      // const { orderId } = await orderResponse.json();

      const options = {
        key: RAZORPAY_KEY,
        amount: selectedSession.price * 100, // Amount in paise
        currency: "INR",
        name: "Campus Connect",
        description: `${selectedSession.title} with ${mentor.name}`,
        image: "/logo.png",
        // order_id: orderId, // Use this in production
        handler: function (response) {
          // Payment successful
          console.log("Payment successful:", response);
          onPaymentSuccess({
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          });
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: `+91${userDetails.phone}`,
        },
        notes: {
          mentorId: mentor.id,
          slotId: selectedSlot.id,
          sessionType: selectedSession.id,
        },
        theme: {
          color: "#6366F1",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      if (typeof window !== "undefined" && window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) {
          console.error("Payment failed:", response.error);
          onPaymentFailure(response.error.description || "Payment failed. Please try again.");
          setIsProcessing(false);
        });
        rzp.open();
      } else {
        throw new Error("Razorpay SDK not loaded");
      }
    } catch (error) {
      console.error("Payment error:", error);
      onPaymentFailure("Failed to initialize payment. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Timer Warning */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "flex items-center justify-between p-4 rounded-xl",
          timeRemaining < 120
            ? "bg-red-50 border border-red-200"
            : "bg-amber-50 border border-amber-200"
        )}
      >
        <div className="flex items-center gap-3">
          <Clock
            className={cn(
              "w-5 h-5",
              timeRemaining < 120 ? "text-red-500" : "text-amber-500"
            )}
          />
          <div>
            <p
              className={cn(
                "text-sm font-medium",
                timeRemaining < 120 ? "text-red-700" : "text-amber-700"
              )}
            >
              Slot reserved for you
            </p>
            <p
              className={cn(
                "text-xs",
                timeRemaining < 120 ? "text-red-600" : "text-amber-600"
              )}
            >
              Complete payment to confirm
            </p>
          </div>
        </div>
        <div
          className={cn(
            "text-2xl font-bold tabular-nums",
            timeRemaining < 120 ? "text-red-600" : "text-amber-600"
          )}
        >
          {formatTimeRemaining(timeRemaining)}
        </div>
      </motion.div>

      {/* Booking Summary */}
      <div className="bg-gray-50 rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-gray-900">Booking Summary</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date & Time
            </span>
            <span className="font-medium text-gray-900">
              {new Date(selectedSlot.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}{" "}
              at {formatTime(selectedSlot.startTime)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Session Type
            </span>
            <span className="font-medium text-gray-900">
              {selectedSession.title} ({selectedSession.duration} min)
            </span>
          </div>

          <div className="border-t border-gray-200 pt-3 mt-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Total Amount</span>
              <span className="text-xl font-bold text-indigo-600">
                ₹{selectedSession.price}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Badge */}
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <Shield className="w-4 h-4 text-green-500" />
        <span>Secure payment powered by Razorpay</span>
      </div>

      {/* Pay Button */}
      <motion.button
        onClick={handlePayment}
        disabled={isProcessing || timeRemaining === 0}
        whileHover={!isProcessing ? { y: -2 } : {}}
        whileTap={!isProcessing ? { scale: 0.98 } : {}}
        className={cn(
          "w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2",
          isProcessing || timeRemaining === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/25"
        )}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Pay ₹{selectedSession.price}
          </>
        )}
      </motion.button>

      {/* Refund Policy */}
      <p className="text-xs text-center text-gray-400">
        100% refund if session is cancelled by mentor or not satisfied
      </p>
    </div>
  );
}
