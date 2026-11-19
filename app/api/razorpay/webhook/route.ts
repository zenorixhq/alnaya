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
      "fucsYkk2r0mCB8ZqkvF7bzKa";

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
            where: {
              OR: [
                { razorpayOrderId: orderId },
                ...(payment?.notes?.orderNumber ? [{ orderNumber: payment.notes.orderNumber }] : []),
              ],
            },
          });

          if (existingOrder) {
            await prisma.order.update({
              where: { id: existingOrder.id },
              data: {
                paymentStatus: "paid",
                razorpayPaymentId: paymentId || existingOrder.razorpayPaymentId,
                orderStatus: "processing",
                razorpayOrderId: orderId,
              },
            });
            console.log(`Order ${existingOrder.orderNumber} updated to paid via webhook`);
          } else {
            // Auto-create order from captured payment if pre-order was not reached
            const rawDesc = payment?.description || "";
            const orderNumMatch = rawDesc.match(/#?(ALN-\d+)/i) || (payment?.notes?.orderNumber ? [null, payment.notes.orderNumber] : null);
            const extractedOrderNum = orderNumMatch ? orderNumMatch[1] : `ALN-${Math.floor(10000 + Math.random() * 90000)}`;
            const amountInRupees = (payment?.amount || 0) / 100;

            await prisma.order.create({
              data: {
                orderNumber: extractedOrderNum,
                customerName:
                  payment?.notes?.customerName ||
                  (payment?.vpa ? `Customer (${payment.vpa})` : "Valued Customer"),
                customerEmail:
                  payment?.email && !payment.email.includes("void@")
                    ? payment.email
                    : "customer@alnaya.in",
                customerPhone: payment?.contact || payment?.notes?.customerPhone || "",
                shippingAddress: "Captured via Razorpay Webhook - Check customer on WhatsApp",
                itemsJson: JSON.stringify([
                  {
                    id: "rzp-webhook-item",
                    title: rawDesc || "Confirmed Razorpay Order",
                    price: amountInRupees,
                    quantity: 1,
                    image: "/images/about-model-necklace.jpg",
                  },
                ]),
                subtotal: amountInRupees,
                discountTotal: 0,
                shippingFee: 0,
                taxTotal: 0,
                grandTotal: amountInRupees,
                paymentMethod: "razorpay",
                paymentStatus: "paid",
                orderStatus: "processing",
                razorpayOrderId: orderId,
                razorpayPaymentId: paymentId,
              },
            });
            console.log(`Order ${extractedOrderNum} created and marked paid via webhook`);
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
