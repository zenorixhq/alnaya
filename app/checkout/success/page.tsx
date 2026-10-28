"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { storeConfig } from "@/config/store.config";
import {
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  PackageCheck,
  Video,
  ShieldCheck,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "ALN-28491";
  const paymentId = searchParams.get("paymentId") || "";
  const total = searchParams.get("total") || "799";
  const phone = searchParams.get("phone") || "";
  const method = searchParams.get("method") || (paymentId ? "razorpay" : "whatsapp");

  const [copied, setCopied] = useState(false);
  const isOnlinePayment = method === "razorpay" || !!paymentId;
  const whatsappPhone = storeConfig.brand.contact.whatsappNumber || "919633956222";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-8">
      {/* Success Badge */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto shadow-md animate-bounce-short">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <span className="text-xs uppercase tracking-widest font-bold text-primary">
          {isOnlinePayment ? "Payment Verified & Order Confirmed" : "Order Sent via WhatsApp"}
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-foreground">
          Thank you for choosing Alnaya!
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          {isOnlinePayment
            ? "Your payment was processed securely via Razorpay. We are getting your handcrafted jewelry packed and ready for dispatch."
            : "Your order details have been prepared for our WhatsApp team. We will confirm your items and tracking code."}
        </p>
      </div>

      {/* Order Summary Card */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-border">
          <div>
            <span className="text-xs text-muted-foreground block">Order Number</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-lg font-bold text-foreground font-mono">{orderNumber}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1 text-muted-foreground hover:text-foreground"
                title="Copy order number"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <span className="text-xs text-muted-foreground block">Total Amount</span>
            <p className="text-lg font-bold text-foreground mt-0.5">₹{total}</p>
          </div>

          <div>
            <span className="text-xs text-muted-foreground block">Payment Status</span>
            <p className="text-sm font-bold text-emerald-600 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>{isOnlinePayment ? "Paid via Razorpay" : "Pending UPI Confirmation"}</span>
            </p>
            {paymentId && (
              <span className="text-[10px] text-muted-foreground font-mono block mt-0.5">
                Ref: {paymentId}
              </span>
            )}
          </div>
        </div>

        {/* Mandatory Policy Box */}
        <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-xs uppercase tracking-wide">
            <Video className="w-4 h-4 text-amber-600" />
            <span>Important Customer Note: 360° Unboxing Video 📦</span>
          </div>
          <p className="text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed">
            Please make sure to record an uninterrupted 360-degree unboxing video from the time you open the outer package. This is mandatory as per store policy to claim any transit damage or replacement.
          </p>
        </div>

        {/* What Happens Next */}
        <div className="space-y-3 bg-muted/40 p-5 rounded-xl border border-border text-xs text-muted-foreground">
          <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-primary" />
            <span>What happens next?</span>
          </h4>
          <ol className="list-decimal pl-4 space-y-2">
            <li>Our team carefully inspects and gift-packs your jewelry in premium anti-tarnish pouches.</li>
            <li>Your parcel will be handed over to our express courier partner (BlueDart / DTDC / Speed Post).</li>
            <li>Tracking details and estimated arrival will be sent to your WhatsApp contact ({phone || "your mobile number"}).</li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/products"
            className="flex-1 py-3 px-5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
              `Hi Alnaya Team! ✨ I just completed my order #${orderNumber} for ₹${total}. Please share updates on dispatch! 💖`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-3 px-5 rounded-xl border border-[#25D366]/40 hover:bg-[#25D366]/10 text-[#075E54] dark:text-[#25D366] font-semibold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-current text-[#25D366]" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <p className="text-xs text-muted-foreground animate-pulse">Loading order confirmation...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
