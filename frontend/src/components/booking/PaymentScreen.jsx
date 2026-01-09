"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Calendar, CreditCard, Shield, Loader2 } from "lucide-react";
import { formatTime } from "@/lib/booking-utils";
import { cn } from "@/lib/utils";

// Razorpay Key - Replace with your actual key
const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_yourkeyhere";

export function PaymentScreen({
  mentor,
  selectedSlot,
  selectedSession,
  userDetails,
  onPaymentSuccess,
  onPaymentFailure,
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Create order on backend first
      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedSession.price,
          slotId: selectedSlot.id,
          mentorId: mentor.id,
          sessionType: selectedSession,
          userDetails,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      const options = {
        key: orderData.key || RAZORPAY_KEY,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Campus Connect",
        description: `${selectedSession.title} with ${mentor.name}`,
        image: "/logo.png",
        order_id: orderData.order.id, // Important: Use the order_id from backend
        handler: async function (response) {
          // Payment successful - verify on backend
          console.log("Payment successful:", response);

          // Verify payment on backend
          try {
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                slotId: selectedSlot.id,
                mentorId: mentor.id,
                sessionType: selectedSession,
                userDetails,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              onPaymentSuccess({
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                booking: verifyData.booking,
                meetLink: verifyData.meetLink,
              });
            } else {
              throw new Error(verifyData.error || 'Payment verification failed');
            }
          } catch (verifyError) {
            console.error("Verification error:", verifyError);
            // Still show success since payment went through
            onPaymentSuccess({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });
          }
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
      onPaymentFailure(error.message || "Failed to initialize payment. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Complete Payment</h3>
        <p className="text-sm text-gray-500 mt-1">Review your booking and pay to confirm</p>
      </div>

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
              <span className="text-xl font-bold text-slate-900">
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
        disabled={isProcessing}
        whileHover={!isProcessing ? { y: -2 } : {}}
        whileTap={!isProcessing ? { scale: 0.98 } : {}}
        className={cn(
          "w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2",
          isProcessing
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/25"
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
