import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    const webhookSecret =
      process.env.RAZORPAY_WEBHOOK_SECRET ||
      process.env.RAZORPAY_KEY_SECRET ||
      "8wuzUACt6uNAoei0UDu35bFD";

    // Validate webhook signature if secret and signature are provided
    if (signature && webhookSecret) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      if (signature !== expectedSignature) {
        console.warn("Razorpay Webhook signature mismatch");
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody);

    // Handle payment captured or order paid
    if (event.event === "payment.captured" || event.event === "order.paid") {
      const payment = event.payload?.payment?.entity;
      const orderId = payment?.order_id;
      const paymentId = payment?.id;

      if (orderId) {
        try {
          // Update order status if it already exists
          const existingOrder = await prisma.order.findFirst({
            where: { razorpayOrderId: orderId },
          });

          if (existingOrder && existingOrder.paymentStatus !== "paid") {
            await prisma.order.update({
              where: { id: existingOrder.id },
              data: {
                paymentStatus: "paid",
                razorpayPaymentId: paymentId || existingOrder.razorpayPaymentId,
                orderStatus: "processing",
              },
            });
            console.log(`Order ${existingOrder.orderNumber} updated to paid via webhook`);
          }
        } catch (dbErr) {
          console.error("Webhook DB update error:", dbErr);
        }
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (err: any) {
    console.error("Razorpay webhook error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
