"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useCartStore } from "@/store/useCartStore";
import { storeConfig } from "@/config/store.config";
import { formatPrice } from "@/lib/utils";
import {
  CreditCard,
  Truck,
  ArrowLeft,
  Tag,
  ShieldCheck,
  Sparkles,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Lock,
  PackageCheck,
  Video,
} from "lucide-react";
import { PolicyModal, PolicyTab } from "@/components/storefront/PolicyModal";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Delhi NCR", "Chandigarh", "Puducherry"
];

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [policyModalTab, setPolicyModalTab] = useState<PolicyTab | null>(null);
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const appliedCoupon = useCartStore((s) => s.appliedCoupon);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);

  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    altPhone: "",
    address: "",
    city: "",
    state: "Kerala",
    postalCode: "",
    notes: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = useCartStore((s) => s.getSubtotal)();
  const discount = useCartStore((s) => s.getDiscountAmount)();
  const shipping = useCartStore((s) => s.getShippingFee)();
  const grandTotal = Math.max(0, subtotal - discount + shipping);

  if (!mounted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <p className="text-xs text-muted-foreground animate-pulse">Loading order details...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-serif-luxury font-bold text-foreground">Your jewelry bag is empty</h2>
        <p className="text-xs text-muted-foreground">
          Discover our handcrafted jhumkas, minimal chains & anti-tarnish daily wear collection.
        </p>
        <Link
          href="/products"
          className="inline-block px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-md hover:bg-primary-hover transition-all"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    if (res.success) {
      setCouponMsg({ type: "success", text: res.message });
      setCouponCode("");
    } else {
      setCouponMsg({ type: "error", text: res.message });
    }
  };

  const handleRazorpayPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.city.trim() || !formData.postalCode.trim()) {
      alert("Please fill in your name, 10-digit mobile number, street address, and PIN code.");
      return;
    }

    if (formData.phone.replace(/\D/g, "").length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSubmitting(true);
    const orderNumber = `ALN-${Math.floor(10000 + Math.random() * 90000)}`;

    try {
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: grandTotal,
          currency: "INR",
          receipt: `rcpt_${Date.now()}`,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.id) {
        throw new Error(orderData.error || "Failed to initiate payment gateway");
      }

      if (typeof window === "undefined" || !(window as any).Razorpay) {
        alert("Payment gateway is initializing. Please wait 2 seconds and try again.");
        setIsSubmitting(false);
        return;
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: "INR",
        name: "Alnaya",
        description: `Order #${orderNumber} (${items.length} item${items.length > 1 ? "s" : ""})`,
        image: "/alnaya-logo.png",
        order_id: orderData.id,
        prefill: {
          name: formData.fullName,
          email: formData.email || undefined,
          contact: formData.phone.replace(/\D/g, "").slice(-10),
        },
        theme: {
          color: "#502146", // Royal Plum
        },
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderCreationId: orderData.id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                orderDetails: {
                  orderNumber,
                  items,
                  customer: formData,
                  pricing: { subtotal, discount, shipping, grandTotal },
                },
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              clearCart();
              router.push(
                `/checkout/success?orderNumber=${orderNumber}&paymentId=${response.razorpay_payment_id}&total=${grandTotal}&method=razorpay&phone=${encodeURIComponent(
                  formData.phone
                )}`
              );
            } else {
              alert(`Payment verification notice: ${verifyData.message}`);
              setIsSubmitting(false);
            }
          } catch (err: any) {
            console.error("Verification error:", err);
            clearCart();
            router.push(
              `/checkout/success?orderNumber=${orderNumber}&paymentId=${response.razorpay_payment_id}&total=${grandTotal}&method=razorpay`
            );
          }
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          },
        },
      };

      const rzpInstance = new (window as any).Razorpay(options);
      rzpInstance.on("payment.failed", function (resp: any) {
        alert(`Payment not completed: ${resp.error?.description || "Transaction failed"}`);
        setIsSubmitting(false);
      });
      rzpInstance.open();
    } catch (err: any) {
      console.error("Razorpay initiation error:", err);
      alert(`Could not start payment: ${err.message || "Please check your internet connection"}`);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Navigation Breadcrumb */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Bag</span>
            </Link>

            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <Lock className="w-3.5 h-3.5" /> 256-bit SSL Secure Checkout
              </span>
            </div>
          </div>

          {/* Brand Highlights & Trust Banner */}
          <div className="mb-8 p-4 bg-primary/5 rounded-2xl border border-primary/20 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Alnaya Luxury Handcrafted Jewellery</span>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground text-[11px]">
              <span className="flex items-center gap-1 font-medium">
                <PackageCheck className="w-3.5 h-3.5 text-primary" /> Pan-India Express Delivery
              </span>
              <span className="flex items-center gap-1 font-medium">
                <Video className="w-3.5 h-3.5 text-primary" /> 360° Opening Video Mandatory 📦
              </span>
              <span className="flex items-center gap-1 font-medium text-emerald-600">
                <ShieldCheck className="w-3.5 h-3.5" /> 1000+ Happy Customers
              </span>
            </div>
          </div>

          <form onSubmit={handleRazorpayPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Delivery Details & Payment */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Shipping Details */}
              <div className="bg-card p-6 sm:p-8 rounded-2xl border border-border shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider font-serif-luxury">
                      1. Delivery Address (India Only)
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    🇮🇳 Pan-India Shipping
                  </span>
                </div>

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Sharma"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                {/* Contact Information (Phone & Email) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-primary" />
                      <span>Mobile Number (10 Digits) *</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary outline-none font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Email Address (for receipt)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. ananya@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                </div>

                {/* Secondary Alternate Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Alternate Contact Number (Optional)</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground">For express courier delivery</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876500000"
                    maxLength={10}
                    value={formData.altPhone}
                    onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary outline-none font-medium"
                  />
                </div>

                {/* Street Address */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    House / Flat No., Building, Street Name *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="e.g. Flat 402, Lotus Heights, MG Road"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary outline-none resize-none"
                  />
                </div>

                {/* City, State, PIN */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">City / Town *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kochi"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">State *</label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2.5 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">PIN Code *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="e.g. 682001"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value.replace(/\D/g, "") })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary outline-none font-medium"
                    />
                  </div>
                </div>

                {/* Special Instructions / Notes */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Order / Delivery Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Leave package with security if unavailable"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              {/* Step 2: Payment Gateway Card */}
              <div className="bg-card p-6 sm:p-8 rounded-2xl border border-border shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider font-serif-luxury">
                      2. Payment Method
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Instant Confirmation
                  </span>
                </div>

                {/* Razorpay Gateway Pill */}
                <div className="p-4 rounded-xl border-2 border-primary bg-primary/5 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                      <span className="text-xs font-bold text-foreground">
                        Razorpay Secure Gateway (UPI / Cards / NetBanking / Wallets)
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      Official Partner
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground pl-6">
                    Pay securely using Google Pay, PhonePe, Paytm, BHIM UPI, Credit/Debit Cards (Visa, MasterCard, RuPay), or NetBanking.
                  </p>
                </div>

                {/* Submit Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm tracking-wide shadow-lg hover:bg-primary-hover active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <Lock className="w-4 h-4 text-accent" />
                    <span>
                      {isSubmitting
                        ? "Initiating Secure Gateway..."
                        : `Pay ${formatPrice(grandTotal)} via Razorpay`}
                    </span>
                  </button>
                  <p className="text-[11px] text-center text-muted-foreground mt-2">
                    🔒 100% Encrypted & Authenticated Transaction
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Coupon */}
            <div className="lg:col-span-5 space-y-6">
              {/* Items in Bag */}
              <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider font-serif-luxury">
                    Order Summary ({items.reduce((s, i) => s + i.quantity, 0)})
                  </h3>
                  <Link href="/cart" className="text-xs text-primary font-semibold hover:underline">
                    Edit
                  </Link>
                </div>

                {/* Item List */}
                <div className="divide-y divide-border/60 max-h-72 overflow-y-auto no-scrollbar pr-1 space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="pt-2 flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-border flex-shrink-0 bg-muted">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-bl-lg flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-foreground truncate">{item.title}</h4>
                        {item.selectedVariant && (
                          <p className="text-[10px] text-muted-foreground truncate">
                            {Object.entries(item.selectedVariant.options)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(", ")}
                          </p>
                        )}
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-foreground">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon Input */}
                <div className="pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Coupon (e.g. ALNAYA5, WELCOME5)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 text-xs rounded-xl bg-background border border-border uppercase tracking-wider font-semibold focus:ring-1 focus:ring-primary outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 text-xs font-bold rounded-xl bg-foreground text-background hover:bg-foreground/90 transition-colors"
                    >
                      Apply
                    </button>
                  </div>

                  {couponMsg && (
                    <p
                      className={`text-[11px] mt-1.5 flex items-center gap-1 font-medium ${
                        couponMsg.type === "success" ? "text-emerald-600" : "text-destructive"
                      }`}
                    >
                      {couponMsg.type === "success" ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5" />
                      )}
                      <span>{couponMsg.text}</span>
                    </p>
                  )}

                  {appliedCoupon && (
                    <div className="mt-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" /> {appliedCoupon.code} applied
                      </span>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-[10px] text-destructive hover:underline font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Pricing Summary */}
                <div className="pt-3 border-t border-border space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" /> Pan-India Delivery
                    </span>
                    <span className="font-medium text-foreground">
                      {shipping === 0 ? (
                        <span className="text-emerald-600 font-bold uppercase text-[11px]">Free</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-border flex justify-between items-baseline">
                    <div>
                      <span className="text-sm font-bold text-foreground">Grand Total</span>
                      <p className="text-[10px] text-muted-foreground">Inclusive of all taxes</p>
                    </div>
                    <span className="text-xl font-bold text-primary font-serif-luxury">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Policy & Trust Guarantee Note */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <Video className="w-4 h-4 text-primary" />
                  <span>Important Store Policies:</span>
                </div>
                <p className="leading-relaxed">
                  • <strong>360° Unboxing Video:</strong> Continuous opening video without pauses is mandatory for any transit damage claims.
                </p>
                <p className="leading-relaxed">
                  • <strong>No Return / No Exchange:</strong> All pieces are strictly inspected prior to dispatch.
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-[10px] text-primary font-semibold">
                  <button
                    type="button"
                    onClick={() => setPolicyModalTab("shipping")}
                    className="hover:underline"
                  >
                    Shipping Policy
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setPolicyModalTab("return-refund")}
                    className="hover:underline"
                  >
                    Unboxing Policy
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setPolicyModalTab("care-guide")}
                    className="hover:underline"
                  >
                    Jewelry Care
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {policyModalTab && (
        <PolicyModal
          initialTab={policyModalTab}
          isOpen={!!policyModalTab}
          onClose={() => setPolicyModalTab(null)}
        />
      )}
    </>
  );
}
