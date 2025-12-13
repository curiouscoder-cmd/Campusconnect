import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import Razorpay from "razorpay";

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

export async function POST(request) {
  try {
    const body = await request.json();
    const { amount, slotId, mentorId, sessionType, userDetails } = body;

    if (!amount || !slotId || !mentorId) {
      return NextResponse.json(
        { error: "Amount, Slot ID, and Mentor ID are required" },
        { status: 400 }
      );
    }

    // Check if Razorpay is configured
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      // Return mock order for development
      console.warn("Razorpay not configured, using mock order");
      const mockOrderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return NextResponse.json({
        success: true,
        order: {
          id: mockOrderId,
          amount: amount * 100,
          currency: "INR",
          receipt: `booking_${slotId}_${Date.now()}`,
        },
        key: "rzp_test_placeholder",
        isMock: true,
      });
    }

    // Create Razorpay instance
    const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });

    // Create order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: `booking_${slotId}_${Date.now()}`,
      notes: {
        slotId,
        mentorId,
        sessionType: sessionType?.id || sessionType,
        userName: userDetails?.name,
        userEmail: userDetails?.email,
      },
    });

    // Save order to database
    const supabase = createServerClient();
    if (supabase) {
      await supabase.from("payments").insert({
        razorpay_order_id: order.id,
        amount: amount,
        currency: "INR",
        status: "created",
      });
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
      key: RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating payment order:", error);
    return NextResponse.json(
      { error: "Failed to create payment order", details: error.message },
      { status: 500 }
    );
  }
}
