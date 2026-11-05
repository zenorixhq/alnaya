import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");
    const checkFirst = searchParams.get("checkFirstPurchase") || searchParams.get("firstPurchaseOnly");

    // 1. Coupon validation: Check if customer is making their first purchase
    if (checkFirst === "true" && phone) {
      const cleanPhone = phone.replace(/[^0-9]/g, "");
      if (cleanPhone.length >= 7) {
        const existingOrder = await prisma.order.findFirst({
          where: {
            customerPhone: {
              contains: cleanPhone.slice(-8),
            },
          },
        });
        return NextResponse.json({ isFirstPurchase: !existingOrder });
      }
      return NextResponse.json({ isFirstPurchase: true });
    }

    // 2. Query filter for customer account or admin lookup
    const whereClause: any = {};

    if (phone) {
      const cleanPhone = phone.replace(/[^0-9]/g, "");
      if (cleanPhone.length >= 6) {
        whereClause.customerPhone = {
          contains: cleanPhone.slice(-8),
        };
      }
    }

    const orderNumber = searchParams.get("orderNumber");
    if (orderNumber) {
      whereClause.orderNumber = {
        contains: orderNumber.trim(),
        mode: "insensitive",
      };
    }

    const email = searchParams.get("email");
    if (email && email.includes("@")) {
      whereClause.customerEmail = {
        contains: email.trim(),
        mode: "insensitive",
      };
    }

    const dbOrders = await prisma.order.findMany({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      orderBy: { createdAt: "desc" },
    });

    const formatted = dbOrders.map((o) => {
      let parsedItems: any[] = [];
      try {
        if (o.itemsJson) {
          parsedItems = typeof o.itemsJson === "string" ? JSON.parse(o.itemsJson) : o.itemsJson;
        }
      } catch (e) {
        parsedItems = [];
      }

      return {
        id: o.id,
        orderNumber: o.orderNumber,
        createdAt: o.createdAt.toISOString(),
        status: o.orderStatus || "processing",
        paymentStatus: o.paymentStatus || "paid",
        paymentMethod: o.paymentMethod || "razorpay",
        razorpayPaymentId: o.razorpayPaymentId || null,
        razorpayOrderId: o.razorpayOrderId || null,
        customer: {
          id: `cust-${o.id}`,
          name: o.customerName || "Valued Collector",
          fullName: o.customerName || "Valued Collector",
          email: o.customerEmail || "",
          phone: o.customerPhone || "",
          shippingAddress: {
            line1: o.shippingAddress || "Direct Delivery",
            city: "",
            state: "",
            postalCode: "",
            country: "India",
          },
          address: {
            street: o.shippingAddress || "Direct Delivery",
            city: "",
            state: "",
            postalCode: "",
            country: "India",
          },
        },
        items: Array.isArray(parsedItems) ? parsedItems : [],
        subtotal: o.subtotal || 0,
        discount: o.discountTotal || 0,
        shipping: o.shippingFee || 0,
        tax: o.taxTotal || 0,
        grandTotal: o.grandTotal || 0,
        trackingNumber: `DTDC-KL-${(parseInt(o.orderNumber.replace(/\D/g, "") || "100000", 10) * 7).toString().slice(0, 6)}`,
        currency: "INR",
      };
    });

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("GET /api/orders error:", err);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const createdOrder = await prisma.order.create({
      data: {
        orderNumber: body.orderNumber || `ALN-${Math.floor(10000 + Math.random() * 90000)}`,
        customerName: body.customerName || "Customer",
        customerEmail: body.customerEmail || `${body.customerPhone || "guest"}@alnaya.in`,
        customerPhone: body.customerPhone || "",
        shippingAddress: body.shippingAddress || "India",
        itemsJson: JSON.stringify(body.items || []),
        subtotal: parseFloat(body.subtotal || 0),
        discountTotal: parseFloat(body.discountTotal || body.discount || 0),
        shippingFee: parseFloat(body.shippingFee || body.shipping || 0),
        taxTotal: parseFloat(body.taxTotal || 0),
        grandTotal: parseFloat(body.grandTotal || 0),
        paymentMethod: body.paymentMethod || "razorpay",
        paymentStatus: body.paymentStatus || "paid",
        orderStatus: body.orderStatus || "processing",
        razorpayOrderId: body.razorpayOrderId || null,
        razorpayPaymentId: body.razorpayPaymentId || null,
      },
    });

    return NextResponse.json({ success: true, order: createdOrder });
  } catch (err: any) {
    console.error("POST /api/orders error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, orderStatus, paymentStatus } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        ...(orderStatus && { orderStatus }),
        ...(paymentStatus && { paymentStatus }),
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    console.error("PATCH /api/orders error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
