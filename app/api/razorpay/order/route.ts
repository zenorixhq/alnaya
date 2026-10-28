import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { amount, currency = "INR", receipt } = await req.json();

    const keyId =
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TmUYZteH5PfrHp";
    const keySecret =
      process.env.RAZORPAY_KEY_SECRET || "8wuzUACt6uNAoei0UDu35bFD";

    // Call Razorpay Orders API
    if (keyId && keySecret && !keyId.includes("YourKeyIdHere")) {
      const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

      const response = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${basicAuth}`,
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Razorpay accepts amounts in paise
          currency,
          receipt: receipt || `rcpt_${Date.now()}`,
          payment_capture: 1,
        }),
      });

      const orderData = await response.json();

      if (!response.ok) {
        console.error("Razorpay order creation failed from API:", orderData);
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

    return NextResponse.json(
      { error: "Razorpay credentials not configured" },
      { status: 500 }
    );
  } catch (err: any) {
    console.error("Razorpay order creation error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to initiate Razorpay order" },
      { status: 500 }
    );
  }
}
