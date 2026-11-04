import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    let { amount, currency = "INR", receipt } = body;

    // Minimum amount: 100 paise (₹1.00)
    if (!amount || typeof amount !== "number" || amount < 100) {
      return NextResponse.json(
        { error: "Invalid amount. Minimum amount is 100 paise (₹1.00)" },
        { status: 400 }
      );
    }

    const keyId =
      process.env.RAZORPAY_KEY_ID ||
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      "rzp_test_TvxxmU5buYyrif";
    const keySecret =
      process.env.RAZORPAY_KEY_SECRET ||
      process.env.RAZORPAY_SECRET ||
      "fGBx5JzFE7T3EitUdMdb1aCH";

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay credentials not configured" },
        { status: 401 }
      );
    }

    const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${basicAuth}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount),
        currency: currency || "INR",
        receipt: receipt || `rcpt_${Date.now()}`,
        payment_capture: 1,
      }),
    });

    const orderData = await response.json();

    if (!response.ok) {
      console.error("Razorpay order creation failed from API:", orderData);
      const statusCode = response.status === 401 ? 401 : 500;
      return NextResponse.json(
        {
          error:
            orderData.error?.description ||
            orderData.message ||
            "Razorpay API error",
        },
        { status: statusCode }
      );
    }

    return NextResponse.json({
      order_id: orderData.id,
      id: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
      key: keyId,
    });
  } catch (err: any) {
    console.error("Create order route error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
