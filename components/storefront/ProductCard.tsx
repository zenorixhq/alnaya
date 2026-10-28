"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/types/store";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice, calculateDiscountPercent, getProductPrices } from "@/lib/utils";
import { Heart, Eye, ShoppingBag, Star, Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const selectedCurrency = useCartStore((s) => s.selectedCurrency);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);
  const isInWishlist = useCartStore((s) => s.isInWishlist)(product.id);
  const openQuickView = useCartStore((s) => s.openQuickView);

  const { regularPrice, salePrice, effectivePrice, discountPercent } = getProductPrices(
    product,
    selectedCurrency
  );

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  const price = product.salePrice || product.price;
  const displayImage =
    Array.isArray(product.images) && product.images.length > 0 && product.images[0]
      ? product.images[0]
      : typeof product.images === "string" && (product.images as string).trim()
      ? (product.images as string).trim()
      : "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800";

  return (
    <div className="group relative flex flex-col bg-card rounded-xl border border-border/70 overflow-hidden hover:shadow-lg transition-all duration-500 ease-out hover:-translate-y-1 hover:border-primary/50">
      {/* Product Image - Clean Framed Aspect Ratio (Fits Entire Jewelry Piece) */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#FAF8F5] dark:bg-stone-900/40 p-2 sm:p-2.5 flex items-center justify-center">
        <Link href={`/products/${product.slug}`} className="block w-full h-full relative flex items-center justify-center">
          <img
            src={displayImage}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Floating Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
          {discountPercent > 0 && (
            <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
              NEW
            </span>
          )}
          {product.isBestSeller && !product.isNewArrival && (
            <span className="bg-accent text-accent-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Floating Actions (Wishlist & Quick View) */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
          <button
            onClick={handleWishlistToggle}
            aria-label="Save to Wishlist"
            className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md backdrop-blur-md transition-all ${
              isInWishlist
                ? "bg-destructive text-destructive-foreground"
                : "bg-white/90 text-foreground hover:bg-white hover:text-destructive"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isInWishlist ? "fill-current" : ""}`} />
          </button>

          <button
            onClick={handleQuickView}
            aria-label="Quick View"
            className="w-7 h-7 rounded-full bg-white/90 text-foreground hover:bg-white hover:text-primary flex items-center justify-center shadow-md backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 sm:translate-x-1 group-hover:translate-x-0"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Add To Cart Button (Desktop Hover) */}
        <div className="absolute inset-x-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 hidden sm:block">
          <button
            onClick={handleQuickAdd}
            className={`w-full py-1.5 px-2.5 text-[11px] font-bold rounded-lg shadow-md flex items-center justify-center gap-1.5 backdrop-blur-sm transition-all active:scale-95 ${
              isAdded
                ? "bg-emerald-600 text-white"
                : "bg-foreground/95 hover:bg-foreground text-background"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3 h-3" />
                <span>Added to Bag!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Compact Product Details */}
      <div className="p-2 sm:p-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-1 text-[9px] sm:text-[10px] text-muted-foreground mb-1">
            <span className="capitalize truncate max-w-[80px] sm:max-w-[100px]">{product.category}</span>
            {product.rating && (
              <span className="flex items-center gap-0.5 font-medium text-foreground text-[9px] sm:text-[10px]">
                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
              </span>
            )}
          </div>

          <Link href={`/products/${product.slug}`} className="block group-hover:text-primary transition-colors">
            <h3 className="text-[11px] xs:text-xs sm:text-sm font-semibold text-foreground line-clamp-1" title={product.title}>
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Price & Mobile Add Button */}
        <div className="pt-1.5 sm:pt-2 mt-1 sm:mt-1.5 border-t border-border/40 flex items-center justify-between gap-1">
          <div className="flex items-baseline gap-1 min-w-0 flex-wrap">
            <span className="text-[11px] xs:text-xs sm:text-sm font-bold text-foreground whitespace-nowrap">
              {formatPrice(effectivePrice, selectedCurrency)}
            </span>
            {salePrice && (
              <span className="text-[9px] sm:text-[10px] text-muted-foreground line-through whitespace-nowrap">
                {formatPrice(regularPrice, selectedCurrency)}
              </span>
            )}
          </div>

          {/* Mobile only add button with instant feedback */}
          <button
            onClick={handleQuickAdd}
            className={`sm:hidden min-w-[24px] min-h-[24px] p-1 rounded-md flex items-center justify-center transition-all active:scale-90 ${
              isAdded
                ? "bg-emerald-600 text-white"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
            aria-label="Add to cart"
            title="Add to shopping bag"
          >
            {isAdded ? <Check className="w-3 h-3" /> : <ShoppingBag className="w-3 h-3" />}
          </button>
        </div>
      </div>
    </div>
  );
}
