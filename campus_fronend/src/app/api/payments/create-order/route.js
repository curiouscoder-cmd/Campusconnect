import { NextResponse } from "next/server";

// Razorpay configuration
// In production, use environment variables
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_yourkeyhere";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "your_secret_here";

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

    // In production, create a Razorpay order using their API
    // const Razorpay = require('razorpay');
    // const instance = new Razorpay({
    //   key_id: RAZORPAY_KEY_ID,
    //   key_secret: RAZORPAY_KEY_SECRET,
    // });
    // 
    // const order = await instance.orders.create({
    //   amount: amount * 100, // Amount in paise
    //   currency: "INR",
    //   receipt: `booking_${slotId}_${Date.now()}`,
    //   notes: {
    //     slotId,
    //     mentorId,
    //     sessionType,
    //     userName: userDetails?.name,
    //     userEmail: userDetails?.email,
    //   },
    // });

    // Mock order for development
    const mockOrderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return NextResponse.json({
      success: true,
      order: {
        id: mockOrderId,
        amount: amount * 100,
        currency: "INR",
        receipt: `booking_${slotId}_${Date.now()}`,
      },
      key: RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating payment order:", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
