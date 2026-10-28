"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { storeConfig } from "@/config/store.config";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  ShieldCheck,
  Tag,
  Sparkles,
  Lock,
} from "lucide-react";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const selectedCurrency = useCartStore((s) => s.selectedCurrency);
  const appliedCoupon = useCartStore((s) => s.appliedCoupon);

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = useCartStore((s) => s.getSubtotal)();
  const discount = useCartStore((s) => s.getDiscountAmount)();
  const shipping = useCartStore((s) => s.getShippingFee)();
  const tax = useCartStore((s) => s.getTaxAmount)();
  const total = useCartStore((s) => s.getTotal)();

  const isQatar = selectedCurrency === "QAR";
  const freeShippingThreshold = storeConfig.commerce.freeShippingThreshold;
  const progressPercent = isQatar ? 100 : Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeeded = isQatar ? 0 : Math.max(0, freeShippingThreshold - subtotal);

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <p className="text-xs text-muted-foreground animate-pulse">Loading your shopping bag...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center text-muted-foreground">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground">Your shopping bag is empty</h1>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Explore our collection of 304 & 306 grade waterproof anti-tarnish jewelry.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-colors"
        >
          <span>Discover Jewelry</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground">Shopping Bag</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Review your items before proceeding to secure checkout.
        </p>
      </div>

      {/* Free Shipping Meter */}
      <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="flex items-center gap-2 text-foreground">
            <Truck className="w-4 h-4 text-primary" />
            {isQatar ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Congratulations! Free Delivery across Qatar is included on all orders.
              </span>
            ) : amountNeeded === 0 ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Congratulations! You qualified for Complimentary Shipping.
              </span>
            ) : (
              <span>
                Add <strong className="text-primary">{formatPrice(amountNeeded, selectedCurrency)}</strong> more to receive Free Shipping
              </span>
            )}
          </span>
          <span className="text-muted-foreground">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Items Table */}
        <div className="lg:col-span-8 bg-card border border-border rounded-2xl p-6 shadow-sm divide-y divide-border/60">
          <div className="flex items-center justify-between pb-4">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Item Details
            </span>
            <button
              onClick={clearCart}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors font-medium"
            >
              Clear Entire Bag
            </button>
          </div>

          {items.map((item) => (
            <div key={item.id} className="py-4 sm:py-6 first:pt-4 flex flex-row items-center gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-[#FAF8F5] dark:bg-stone-900/40 rounded-xl border border-border p-1 flex items-center justify-center shrink-0 aspect-square overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain rounded-lg max-w-full max-h-full"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-sm font-bold text-foreground hover:text-primary transition-colors"
                    >
                      {item.title}
                    </Link>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {item.selectedVariant && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {Object.entries(item.selectedVariant.options)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(" / ")}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 mt-2">
                  <div className="flex items-center border border-border rounded-lg bg-muted/20">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-muted text-foreground transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-foreground">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-muted text-foreground transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-sm font-black text-foreground">
                    {formatPrice(
                      (isQatar
                        ? item.priceQatar !== undefined && item.priceQatar !== null
                          ? item.priceQatar
                          : Math.max(10, Math.round(item.price / 20))
                        : item.price) * item.quantity,
                      selectedCurrency
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
            Summary
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal, selectedCurrency)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount ({appliedCoupon?.code})</span>
                <span>-{formatPrice(discount, selectedCurrency)}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>Pan-India Shipping</span>
              <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-foreground pt-3 border-t border-border">
              <span>Estimated Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full py-4 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary-hover flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99]"
          >
            <Lock className="w-4 h-4 text-accent" />
            <span>Proceed to Secure Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Secure Checkout via Razorpay (UPI, Cards, NetBanking)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
