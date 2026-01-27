import { NextResponse } from "next/server";
import crypto from "crypto";
import { createServerClient } from "@/lib/supabase";
import { sendBookingConfirmationEmail, sendMentorNotificationEmail, sendPaymentReceiptEmail } from "@/lib/email";

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      slotId,
      mentorId,
      sessionType,
      userDetails,
      slotDate,
      slotTime,
      mentorName,
    } = body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
    }

    // 1. Verify Signature
    if (!RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const supabase = createServerClient();
    if (!supabase) return NextResponse.json({ error: "DB Error" }, { status: 500 });

    // 2. Fetch Razorpay Details (Live Data)
    const Razorpay = require("razorpay");
    const instance = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });

    let paymentDetails = null;
    let paymentMethod = "Online";
    let paymentMethodDetails = {};
    let paymentFee = 0;
    let paymentTax = 0;

    try {
      paymentDetails = await instance.payments.fetch(razorpay_payment_id);
      if (paymentDetails) {
        paymentMethod = paymentDetails.method; // card, netbanking, wallet, upi

        // Map details based on method
        if (paymentDetails.method === 'card') {
          paymentMethod = "Card";
          paymentMethodDetails = {
            Type: paymentDetails.card?.type || 'Credit/Debit',
            Network: paymentDetails.card?.network || 'Unknown',
            Last4: `xxxx ${paymentDetails.card?.last4}`,
            Issuer: paymentDetails.card?.issuer || '',
          };
        } else if (paymentDetails.method === 'upi') {
          paymentMethod = "UPI";
          paymentMethodDetails = {
            VPA: paymentDetails.vpa,
            TransactionId: paymentDetails.acquirer_data?.rrn || paymentDetails.acquirer_data?.upi_transaction_id
          };
        } else if (paymentDetails.method === 'netbanking') {
          paymentMethod = "Netbanking";
          paymentMethodDetails = {
            Bank: paymentDetails.bank,
          };
        } else if (paymentDetails.method === 'wallet') {
          paymentMethod = "Wallet";
          paymentMethodDetails = {
            Provider: paymentDetails.wallet,
          };
        }

        paymentFee = paymentDetails.fee ? paymentDetails.fee / 100 : 0;
        paymentTax = paymentDetails.tax ? paymentDetails.tax / 100 : 0;
      }
    } catch (rzpError) {
      console.error("Failed to fetch Razorpay payment details:", rzpError);
    }

    // 3. Generate Invoice ID (DB RPC)
    const { data: invoiceNumber, error: invoiceError } = await supabase.rpc('generate_invoice_id');
    if (invoiceError) console.error("RPC generate_invoice_id error:", invoiceError);
    const finalInvoiceId = invoiceNumber || `INV-${Date.now().toString().slice(-6)}`;

    // 4. Create Booking
    let fetchedMentorName = mentorName;
    let meetLink = null;
    let mentorEmail = null;

    if (mentorId) {
      const { data: mentor } = await supabase.from("mentors").select("name, email, meet_link").eq("id", mentorId).single();
      if (mentor) {
        fetchedMentorName = mentor.name;
        meetLink = mentor.meet_link;
        mentorEmail = mentor.email;
      }
    }

    const bookingData = {
      mentor_id: mentorId,
      user_name: userDetails?.name,
      user_email: userDetails?.email,
      user_phone: userDetails?.phone,
      session_type: sessionType?.title || sessionType,
      session_price: sessionType?.price || 1,
      date: slotDate,
      start_time: slotTime,
      status: "confirmed",
      meet_link: meetLink,
      razorpay_order_id: razorpay_order_id,
      confirmed_at: new Date().toISOString()
    };

    if (slotId && slotId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      bookingData.slot_id = slotId;
    }

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert(bookingData)
      .select()
      .single();

    if (bookingError) {
      // Check for duplicate (webhook race condition)
      if (bookingError.code === '23505') {
        const { data: retryBooking } = await supabase.from("bookings").select("*").eq("razorpay_order_id", razorpay_order_id).single();
        return NextResponse.json({ success: true, booking: retryBooking });
      }
      return NextResponse.json({ error: "Booking Failed" }, { status: 500 });
    }

    // 5. Upsert Payment Record (Store Invoice & Razorpay Meta)
    const paymentData = {
      booking_id: booking.id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount: sessionType?.price || 500,
      status: "captured",
      invoice_id: finalInvoiceId,
      payment_method: paymentMethod,
      payment_method_details: paymentMethodDetails,
      fee: paymentFee,
      tax: paymentTax,
      razorpay_data: paymentDetails,
      updated_at: new Date().toISOString()
    };

    // Check if payment row exists (created state) or create new
    const { error: paymentError } = await supabase.from("payments").upsert(paymentData, { onConflict: 'razorpay_order_id' });
    if (paymentError) console.error("Payment Record Error:", paymentError);

    // 6. Update Slot
    if (bookingData.slot_id) {
      await supabase.from("availability").update({ is_booked: true, is_reserved: false }).eq("id", bookingData.slot_id);
    }

    // 7. Update User Profile
    if (userDetails?.phone && userDetails?.email) {
      await supabase.from("profiles").update({ phone: userDetails.phone }).eq("email", userDetails.email);
    }

    // 8. Send Emails
    await sendBookingConfirmationEmail({
      userEmail: userDetails?.email,
      userName: userDetails?.name,
      sessionType: sessionType?.title || "Quick Chat",
      meetLink,
      slotDate,
      slotTime,
      mentorName: fetchedMentorName,
      duration: sessionType?.duration || "15 mins"
    });

    if (fetchedMentorEmail) {
      await sendMentorNotificationEmail({
        mentorEmail: fetchedMentorEmail,
        mentorName: fetchedMentorName,
        studentName: userDetails?.name,
        sessionType: sessionType?.title || sessionType,
        slotDate,
        slotTime,
        meetLink
      });
    }

    await sendPaymentReceiptEmail({
      userEmail: userDetails?.email,
      userName: userDetails?.name,
      mentorName: fetchedMentorName,
      sessionType: sessionType?.title || sessionType,
      amount: sessionType?.price ? `₹${sessionType.price}` : "₹500",
      date: slotDate,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      formattedPaymentMethod: paymentMethod,
      paymentMethodDetails: paymentMethodDetails,
      paymentFee: paymentFee.toFixed(2),
      paymentTax: paymentTax.toFixed(2),
      invoiceId: finalInvoiceId
    });

    return NextResponse.json({
      success: true,
      booking: { ...booking, meetLink },
      meetLink
    });

  } catch (error) {
    console.error("Verify Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
