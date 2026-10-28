import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { amount, currency = "INR", receipt } = await req.json();

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // If live credentials are provided and not default placeholder, call Razorpay Orders API
    if (keyId && keySecret && !keyId.includes("YourKeyIdHere")) {
      const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

      const response = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${basicAuth}`,
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Razorpay accepts amounts in currency subunits (paise for INR, cents for USD)
          currency,
          receipt: receipt || `receipt_${Date.now()}`,
          payment_capture: 1,
        }),
      });

      const orderData = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          { error: orderData.error?.description || "Razorpay API error" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        id: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
        key: keyId,
      });
    }

    // Elegant fallback simulation for testing without active live keys
    const mockOrderId = `order_rzp_${Math.random().toString(36).substring(2, 11)}`;
    return NextResponse.json({
      id: mockOrderId,
      amount: Math.round(amount * 100),
      currency,
      key: keyId || "rzp_test_demo",
      isDemo: true,
    });
  } catch (err: any) {
    console.error("Razorpay order creation error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to initiate Razorpay order" },
      { status: 500 }
    );
  }
}
