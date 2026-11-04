import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const orderId =
      body.razorpay_order_id ||
      body.order_id ||
      body.razorpayOrderId ||
      body.orderCreationId;
    const paymentId =
      body.razorpay_payment_id ||
      body.payment_id ||
      body.razorpayPaymentId;
    const signature =
      body.razorpay_signature ||
      body.signature ||
      body.razorpaySignature;

    // Validate required fields
    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required",
        },
        { status: 400 }
      );
    }

    const keySecret =
      process.env.RAZORPAY_KEY_SECRET ||
      process.env.RAZORPAY_SECRET ||
      "NXHZL8G9YfxjY0AoUA0ZnElM";

    if (!keySecret) {
      return NextResponse.json(
        { success: false, error: "Razorpay secret key not configured" },
        { status: 401 }
      );
    }

    // Generate expected signature: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    // Timing-safe comparison to prevent timing attacks
    const signatureBuffer = Buffer.from(signature, "utf-8");
    const expectedBuffer = Buffer.from(expectedSignature, "utf-8");

    const isMatch =
      signatureBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(signatureBuffer, expectedBuffer);

    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment verification failed: Signature mismatch",
        },
        { status: 400 }
      );
    }

    // Signature matches! Payment is verified.
    let savedOrder: any = null;

    // If order customer & item details were provided, persist to Prisma database
    const customer = body.customer || body.orderDetails?.customer || {};
    const items = body.items || body.orderDetails?.items || [];
    const orderNumber = body.orderNumber || body.orderDetails?.orderNumber;
    const pricing = body.pricing || body.orderDetails?.pricing || {};
    const subtotal = body.subtotal ?? pricing.subtotal ?? 0;
    const discountTotal =
      body.discountTotal ?? body.discount ?? pricing.discount ?? 0;
    const shippingFee =
      body.shippingFee ?? body.shipping ?? pricing.shipping ?? 0;
    const taxTotal = body.taxTotal ?? pricing.taxTotal ?? 0;
    const grandTotal = body.grandTotal ?? pricing.grandTotal ?? 0;

    if (customer.fullName || customer.phone || items.length > 0) {
      try {
        savedOrder = await prisma.order.create({
          data: {
            orderNumber:
              orderNumber ||
              `ALN-${Math.floor(10000 + Math.random() * 90000)}`,
            customerName:
              customer.fullName ||
              (customer.firstName
                ? `${customer.firstName} ${customer.lastName || ""}`.trim()
                : "Customer"),
            customerEmail: customer.email || "customer@alnaya.in",
            customerPhone: customer.phone || "",
            shippingAddress: `${customer.address || ""}, ${customer.city || ""}, ${
              customer.state || ""
            } ${customer.postalCode || ""}, ${customer.country || "India"}`,
            itemsJson: JSON.stringify(items || []),
            subtotal: parseFloat(subtotal || 0),
            discountTotal: parseFloat(discountTotal || 0),
            shippingFee: parseFloat(shippingFee || 0),
            taxTotal: parseFloat(taxTotal || 0),
            grandTotal: parseFloat(grandTotal || 0),
            paymentMethod: "razorpay",
            paymentStatus: "paid",
            orderStatus: "processing",
            razorpayOrderId: orderId,
            razorpayPaymentId: paymentId,
          },
        });
      } catch (dbErr) {
        console.error("Prisma database error on order save:", dbErr);
        savedOrder = {
          orderNumber: orderNumber || `ALN-${Date.now().toString().slice(-5)}`,
          paymentStatus: "paid",
          grandTotal,
        };
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      order_id: orderId,
      payment_id: paymentId,
      order: savedOrder,
    });
  } catch (err: any) {
    console.error("Payment verification route error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
