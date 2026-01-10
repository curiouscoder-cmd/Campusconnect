import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import Razorpay from "razorpay";

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

export async function POST(request) {
  try {
    const body = await request.json();
    const { amount, slotId, mentorId, sessionType, userDetails } = body;

    console.log("Creating order with:", { amount, slotId, mentorId, sessionType: sessionType?.id });

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
          receipt: `booking_${Date.now()}`,
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

    // Sanitize slotId for receipt (remove special characters, limit length)
    const sanitizedSlotId = String(slotId).replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
    const receipt = `bk_${sanitizedSlotId}_${Date.now()}`.substring(0, 40);

    // Create order - notes must be strings only
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Amount in paise, ensure it's an integer
      currency: "INR",
      receipt: receipt,
      notes: {
        slotId: String(slotId || ""),
        mentorId: String(mentorId || ""),
        sessionType: String(sessionType?.id || sessionType || ""),
        userName: String(userDetails?.name || ""),
        userEmail: String(userDetails?.email || ""),
      },
    });

    console.log("Order created successfully:", order.id);

    // Save order to database (don't let this fail the request)
    try {
      const supabase = createServerClient();
      if (supabase) {
        await supabase.from("payments").insert({
          razorpay_order_id: order.id,
          amount: amount,
          currency: "INR",
          status: "created",
        });
      }
    } catch (dbError) {
      console.error("Failed to save order to database:", dbError);
      // Don't fail the request if DB save fails
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
    console.error("Error details:", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to create payment order", details: error.message },
      { status: 500 }
    );
  }
}

