"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { sampleOrders, products } from "@/data/mockData";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/utils";
import { ProductCard } from "@/components/storefront/ProductCard";
import {
  Package,
  Heart,
  MapPin,
  User,
  ShoppingBag,
  ExternalLink,
  CheckCircle2,
  Clock,
  Truck,
} from "lucide-react";

function AccountPageContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "orders";

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const wishlist = useCartStore((s) => s.wishlist);
  const selectedCurrency = useCartStore((s) => s.selectedCurrency);
  const addItem = useCartStore((s) => s.addItem);

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleMoveAllToCart = () => {
    wishlistProducts.forEach((p) => {
      addItem(p, 1);
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="w-3 h-3" />
            <span>Delivered</span>
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
            <Truck className="w-3 h-3" />
            <span>Shipped & In Transit</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
            <Clock className="w-3 h-3" />
            <span>Processing Order</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Account Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Customer Account
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Welcome back, Alexander Wright (alexander.wright@example.com)
          </p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex gap-2 border-b border-border overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === "orders"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Orders & Shipments ({sampleOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("wishlist")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === "wishlist"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Wishlist ({wishlist.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("addresses")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === "addresses"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses (2)</span>
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          {sampleOrders.map((order) => (
            <div
              key={order.id}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Order ID</span>
                  <p className="text-sm font-bold text-foreground">{order.orderNumber}</p>
                  <p className="text-[11px] text-muted-foreground">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(order.status)}
                  <span className="text-sm font-bold text-foreground">
                    {formatPrice(order.grandTotal, selectedCurrency)}
                  </span>
                </div>
              </div>

              {/* Items in order */}
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg border border-border shrink-0 aspect-square"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-foreground truncate">{item.title}</h4>
                      {item.selectedVariant && (
                        <p className="text-[11px] text-muted-foreground">
                          {Object.values(item.selectedVariant.options).join(" / ")}
                        </p>
                      )}
                      <p className="text-[11px] text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-foreground">
                      {formatPrice(item.price * item.quantity, selectedCurrency)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer status & tracking */}
              {order.trackingNumber && (
                <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span>Tracking Code: <strong className="text-foreground">{order.trackingNumber}</strong></span>
                  <span className="text-primary font-semibold hover:underline cursor-pointer">
                    Track with Carrier →
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Wishlist */}
      {activeTab === "wishlist" && (
        <div className="space-y-6">
          {wishlistProducts.length > 0 && (
            <div className="flex justify-end">
              <button
                onClick={handleMoveAllToCart}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Move All to Shopping Bag</span>
              </button>
            </div>
          )}

          {wishlistProducts.length === 0 ? (
            <div className="py-20 text-center rounded-2xl border border-dashed border-border p-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-muted mx-auto flex items-center justify-center text-muted-foreground">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">Your wishlist is empty</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Click the heart icon on any product in our catalog to save items for future consideration.
              </p>
              <Link
                href="/products"
                className="inline-block px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
              >
                Browse Catalog
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Saved Addresses */}
      {activeTab === "addresses" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-2">
            <span className="text-[11px] font-bold text-primary uppercase">Default Delivery Address</span>
            <h4 className="text-sm font-bold text-foreground">Alexander Wright</h4>
            <p className="text-xs text-muted-foreground">742 Evergreen Terrace</p>
            <p className="text-xs text-muted-foreground">Springfield, OR 97477, United States</p>
            <p className="text-xs text-muted-foreground">Phone: +1 (555) 234-5678</p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase">Work Address</span>
            <h4 className="text-sm font-bold text-foreground">Alexander Wright (Design Studio)</h4>
            <p className="text-xs text-muted-foreground">450 Lexington Ave, Suite 1200</p>
            <p className="text-xs text-muted-foreground">New York, NY 10017, United States</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto py-16 text-center">Loading account...</div>}>
      <AccountPageContent />
    </Suspense>
  );
}
