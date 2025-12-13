// Razorpay configuration
export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_yourkeyhere";

// Initialize Razorpay checkout
export function initializeRazorpay() {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Create Razorpay order options
export function createRazorpayOptions({
  orderId,
  amount,
  currency = "INR",
  name = "Campus Connect",
  description,
  prefill = {},
  onSuccess,
  onFailure,
}) {
  return {
    key: RAZORPAY_KEY_ID,
    amount: amount, // Amount in paise
    currency,
    name,
    description,
    order_id: orderId,
    prefill: {
      name: prefill.name || "",
      email: prefill.email || "",
      contact: prefill.phone || "",
    },
    theme: {
      color: "#0f172a", // Slate-900 to match theme
    },
    handler: function (response) {
      // Payment successful
      if (onSuccess) {
        onSuccess({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        });
      }
    },
    modal: {
      ondismiss: function () {
        if (onFailure) {
          onFailure("Payment cancelled by user");
        }
      },
    },
  };
}

// Open Razorpay checkout
export async function openRazorpayCheckout(options) {
  const isLoaded = await initializeRazorpay();
  
  if (!isLoaded) {
    throw new Error("Razorpay SDK failed to load");
  }
  
  if (!window.Razorpay) {
    throw new Error("Razorpay not available");
  }
  
  const rzp = new window.Razorpay(options);
  rzp.open();
  
  return rzp;
}
