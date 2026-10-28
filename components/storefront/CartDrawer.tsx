"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { storeConfig } from "@/config/store.config";
import { formatPrice } from "@/lib/utils";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Tag,
  Truck,
  Sparkles,
  Lock,
} from "lucide-react";

export function CartDrawer() {
  const isCartOpen = useCartStore((s) => s.isCartOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const selectedCurrency = useCartStore((s) => s.selectedCurrency);
  const appliedCoupon = useCartStore((s) => s.appliedCoupon);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);

  const subtotal = useCartStore((s) => s.getSubtotal)();
  const discount = useCartStore((s) => s.getDiscountAmount)();
  const shipping = useCartStore((s) => s.getShippingFee)();
  const total = useCartStore((s) => s.getTotal)();

  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  if (!isCartOpen) return null;

  const isQatar = selectedCurrency === "QAR";
  const freeShippingThreshold = storeConfig.commerce.freeShippingThreshold;
  const progressPercent = isQatar ? 100 : Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeeded = isQatar ? 0 : Math.max(0, freeShippingThreshold - subtotal);

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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-full sm:w-[420px] bg-card shadow-2xl flex flex-col border-l border-border animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="text-base font-bold text-foreground">Shopping Bag</h2>
              <span className="text-xs font-semibold bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                {items.reduce((sum, i) => sum + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-muted/60 px-4 sm:px-6 py-3 border-b border-border">
            <div className="flex items-center justify-between text-xs font-medium mb-1.5">
              <span className="flex items-center gap-1.5 text-foreground">
                <Truck className="w-4 h-4 text-primary flex-shrink-0" />
                {isQatar ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Free Delivery Across Qatar (Within 14 Days)!
                  </span>
                ) : amountNeeded === 0 ? (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Complimentary Shipping Unlocked!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-primary">{formatPrice(amountNeeded, selectedCurrency)}</strong> for Free Delivery
                  </span>
                )}
              </span>
              <span className="text-muted-foreground">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 divide-y divide-border/60">
            {items.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Your bag is empty</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                    Explore our collection of 304 & 306 grade waterproof anti-tarnish jewelry.
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="mt-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="pt-3.5 sm:pt-4 first:pt-0 flex gap-3 sm:gap-4 items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 aspect-square rounded-xl border border-border/80 bg-[#FAF8F5] dark:bg-stone-900/40 p-1 flex items-center justify-center overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain rounded-lg max-w-full max-h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={closeCart}
                          className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                        >
                          {item.title}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.selectedVariant && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {Object.entries(item.selectedVariant.options)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(" / ")}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-border rounded-md bg-muted/30">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-muted text-foreground transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-muted text-foreground transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-foreground">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Breakdown */}
          {items.length > 0 && (
            <div className="px-6 py-5 border-t border-border bg-card space-y-4">
              {/* Promo Code Input */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-primary/10 border border-primary/20 px-3 py-2 rounded-lg text-xs">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{appliedCoupon.code} ({appliedCoupon.amount}{appliedCoupon.discountType === "percentage" ? "% OFF" : " OFF"}{appliedCoupon.firstPurchaseOnly ? " - First Order" : ""})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-primary hover:underline font-bold text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon (e.g. ALNAYA5, WELCOME5)"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponMsg(null);
                      }}
                      className="flex-1 px-3 py-1.5 text-xs rounded-md bg-muted/40 border border-border focus:outline-none focus:ring-1 focus:ring-primary uppercase"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-xs font-semibold rounded-md bg-foreground text-background hover:bg-foreground/80 transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponMsg && (
                  <p
                    className={`text-[11px] mt-1.5 ${
                      couponMsg.type === "success" ? "text-emerald-600 font-medium" : "text-destructive"
                    }`}
                  >
                    {couponMsg.text}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Coupon Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Pan-India Delivery</span>
                  <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-foreground pt-2 border-t border-border">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary-hover transition-all shadow-md active:scale-[0.99]"
              >
                <Lock className="w-4 h-4 text-accent" />
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
