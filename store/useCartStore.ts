import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product, Coupon } from "@/types/store";
import { storeConfig } from "@/config/store.config";

interface CartStore {
  items: CartItem[];
  wishlist: string[]; // product IDs
  selectedCurrency: string;
  appliedCoupon: Coupon | null;
  isCartOpen: boolean;
  quickViewProduct: Product | null;

  // Cart actions
  addItem: (product: Product, quantity?: number, selectedVariant?: CartItem["selectedVariant"]) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Wishlist actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Currency & Coupon
  setCurrency: (code: string) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Quick View
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  // Computed helpers
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getShippingFee: () => number;
  getTaxAmount: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      wishlist: [],
      selectedCurrency: storeConfig.commerce.defaultCurrency,
      appliedCoupon: null,
      isCartOpen: false,
      quickViewProduct: null,

      addItem: (product, quantity = 1, selectedVariant) => {
        const currentItems = get().items;
        // Normalize variant: if variant has empty options or default key, keep it standard
        const hasOptions =
          selectedVariant &&
          selectedVariant.options &&
          Object.keys(selectedVariant.options).length > 0;
        const normalizedVariant = hasOptions ? selectedVariant : undefined;
        const variantKey = normalizedVariant?.id || "standard";
        const itemIdentifier = `${product.id}-${variantKey}`;

        const existingIndex = currentItems.findIndex(
          (item) => item.id === itemIdentifier
        );

        const indiaPrice = product.salePrice || product.price;

        if (existingIndex > -1) {
          const updated = [...currentItems];
          updated[existingIndex].quantity += quantity;
          set({ items: updated, isCartOpen: true });
        } else {
          const newItem: CartItem = {
            id: itemIdentifier,
            productId: product.id,
            title: product.title,
            slug: product.slug,
            price: indiaPrice,
            image: product.images[0],
            quantity,
            selectedVariant: normalizedVariant,
          };
          set({ items: [...currentItems, newItem], isCartOpen: true });
        }
      },

      removeItem: (itemId) => {
        set({ items: get().items.filter((item) => item.id !== itemId) });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [], appliedCoupon: null });
      },

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      toggleWishlist: (productId) => {
        const current = get().wishlist;
        if (current.includes(productId)) {
          set({ wishlist: current.filter((id) => id !== productId) });
        } else {
          set({ wishlist: [...current, productId] });
        }
      },

      isInWishlist: (productId) => {
        return get().wishlist.includes(productId);
      },

      setCurrency: (code) => {
        set({ selectedCurrency: code });
      },

      applyCoupon: (code) => {
        const cleanCode = code.trim().toUpperCase();
        const found = storeConfig.commerce.activeCoupons.find(
          (c) => c.code.toUpperCase() === cleanCode
        );

        if (!found) {
          return { success: false, message: "Invalid or expired promotional code." };
        }

        const subtotal = get().getSubtotal();
        if (found.minSpend && subtotal < found.minSpend) {
          return {
            success: false,
            message: `Requires minimum spend of ₹${found.minSpend}. Current subtotal is ₹${subtotal.toFixed(2)}.`,
          };
        }

        // Check if coupon is strictly restricted to first purchase
        if (found.firstPurchaseOnly && typeof window !== "undefined") {
          const hasPurchased = localStorage.getItem("gleamnest_has_purchased") === "true";
          const placedOrders = localStorage.getItem("gleamnest_placed_orders");
          if (hasPurchased || (placedOrders && JSON.parse(placedOrders || "[]").length > 0)) {
            return {
              success: false,
              message: `Promo code ${found.code} is valid only on your first purchase.`,
            };
          }
        }

        set({ appliedCoupon: found });
        return {
          success: true,
          message: found.firstPurchaseOnly
            ? `Promo code ${found.code} applied (5% first purchase discount)!`
            : `Promo code ${found.code} applied successfully!`,
        };
      },

      removeCoupon: () => set({ appliedCoupon: null }),

      openQuickView: (product) => set({ quickViewProduct: product }),
      closeQuickView: () => set({ quickViewProduct: null }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getDiscountAmount: () => {
        const coupon = get().appliedCoupon;
        const subtotal = get().getSubtotal();
        if (!coupon || subtotal === 0) return 0;

        if (coupon.discountType === "percentage") {
          return (subtotal * coupon.amount) / 100;
        }
        return Math.min(coupon.amount, subtotal);
      },

      getShippingFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const threshold = storeConfig.commerce.freeShippingThreshold;
        if (subtotal >= threshold) return 0;
        return storeConfig.commerce.flatShippingFee;
      },

      getTaxAmount: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const taxableAmount = Math.max(0, subtotal - discount);
        const rate = storeConfig.commerce.taxRatePercent / 100;
        return taxableAmount * rate;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const shipping = get().getShippingFee();
        const tax = get().getTaxAmount();
        return Math.max(0, subtotal - discount + shipping + tax);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "alnaya-cart-storage",
      partialize: (state) => ({
        items: state.items,
        wishlist: state.wishlist,
        selectedCurrency: "INR",
        appliedCoupon: state.appliedCoupon,
      }),
    }
  )
);
