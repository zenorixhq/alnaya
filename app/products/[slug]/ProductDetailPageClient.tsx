"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useProductStore } from "@/store/useProductStore";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice, calculateDiscountPercent, getProductPrices } from "@/lib/utils";
import { ProductCard } from "@/components/storefront/ProductCard";
import {
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  Heart,
  Plus,
  Minus,
  ShoppingBag,
  Share2,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  Lock,
  MessageCircle,
  Sparkles,
  Ruler,
  AlertCircle,
  Video,
} from "lucide-react";
import { storeConfig } from "@/config/store.config";
import { PolicyModal, PolicyTab } from "@/components/storefront/PolicyModal";
import { getProductSizeInfo } from "@/lib/productSizes";

export default function ProductDetailPageClient({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const [policyModalTab, setPolicyModalTab] = useState<PolicyTab | null>(null);
  const products = useProductStore((s) => s.products);
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  useEffect(() => {
    fetchProducts().finally(() => {
      setHasAttemptedFetch(true);
    });
  }, [fetchProducts]);

  const product = products.find((p) => p.slug === params.slug);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [copiedLink, setCopiedLink] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handlePrevImage = () => {
    if (!product || !product.images || product.images.length <= 1) return;
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : product.images.length - 1));
  };

  const handleNextImage = () => {
    if (!product || !product.images || product.images.length <= 1) return;
    setActiveImageIndex((prev) => (prev < product.images.length - 1 ? prev + 1 : 0));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNextImage();
      } else {
        handlePrevImage();
      }
    }
    setTouchStartX(null);
  };

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);
  const isInWishlist = useCartStore((s) => product ? s.wishlist.includes(product.id) : false);
  const selectedCurrency = useCartStore((s) => s.selectedCurrency);

  useEffect(() => {
    if (product) {
      const info = getProductSizeInfo(product);
      if (info) {
        setSelectedSize(info.defaultSize);
      }
    }
  }, [product?.id]);

  if (!product && hasAttemptedFetch) {
    notFound();
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-block p-4 rounded-full bg-[#FAF5EB] text-[#C5A059] mb-4">
          <Sparkles className="w-8 h-8 animate-pulse" />
        </div>
        <p className="font-editorial text-xl text-[#1C1917]">Loading piece details...</p>
      </div>
    );
  }

  const sizeInfo = getProductSizeInfo(product);

  // Initialize variant defaults if needed
  const currentOptions = { ...selectedOptions };
  if (product.variantAttributes) {
    product.variantAttributes.forEach((attr) => {
      if (!currentOptions[attr.name] && attr.options.length > 0) {
        currentOptions[attr.name] = attr.options[0];
      }
    });
  }

  const { regularPrice, salePrice, effectivePrice, discountPercent, isQatar } = getProductPrices(
    product,
    selectedCurrency
  );

  const effectiveSize = selectedSize || sizeInfo?.defaultSize || "";

  // Check if size inventory is explicitly defined
  const hasSpecificSizeStock = Boolean(
    sizeInfo &&
    !sizeInfo.isAdjustableOnly &&
    sizeInfo.sizeStock &&
    effectiveSize &&
    effectiveSize in sizeInfo.sizeStock
  );

  const selectedSizeInventory = hasSpecificSizeStock
    ? Math.max(0, sizeInfo!.sizeStock![effectiveSize])
    : undefined;

  const isCurrentSizeOutOfStock = selectedSizeInventory !== undefined && selectedSizeInventory <= 0;

  const overallStock = product.inStock !== false ? (product.stockCount !== undefined ? product.stockCount : 10) : 0;
  const isOverallOutOfStock = overallStock <= 0;

  const isOutOfStock = isOverallOutOfStock || isCurrentSizeOutOfStock;

  const effectiveMaxStock = isOutOfStock
    ? 0
    : selectedSizeInventory !== undefined
    ? selectedSizeInventory
    : overallStock;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    // Combine standard variant options with selected size
    const combinedOptions: { [key: string]: string } = { ...currentOptions };
    if (sizeInfo && effectiveSize) {
      combinedOptions[sizeInfo.label] = effectiveSize;
    }

    const hasVariants = Object.keys(combinedOptions).length > 0;
    const variantId = hasVariants
      ? Object.entries(combinedOptions)
          .map(([k, v]) => `${k}-${v.replace(/\s+/g, "_")}`)
          .join("_")
      : undefined;
    const variantName = hasVariants
      ? Object.entries(combinedOptions)
          .map(([k, v]) => `${k}: ${v}`)
          .join(" / ")
      : undefined;

    addItem(
      product,
      quantity,
      hasVariants
        ? {
            id: variantId || "standard",
            name: variantName || "Standard",
            options: combinedOptions,
          }
        : undefined
    );

    openCart();
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    handleAddToCart();
    router.push("/checkout");
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // 8 pieces total: same category first, followed by catalog favorites (prioritizing Best Sellers)
  const sortByBestSeller = (a: any, b: any) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
  const categoryProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .sort(sortByBestSeller);
  const otherProducts = products
    .filter((p) => p.id !== product.id && p.category !== product.category)
    .sort(sortByBestSeller);
  const relatedProducts = [...categoryProducts, ...otherProducts].slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-12 sm:space-y-16 pb-24 sm:pb-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-muted-foreground overflow-x-auto pb-1">
        <Link href="/" className="hover:text-foreground whitespace-nowrap">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        <Link href={`/products?category=${product.category}`} className="capitalize hover:text-foreground whitespace-nowrap">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="text-foreground font-semibold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Gallery Reel & Main Image */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-[#FAF8F5] dark:bg-stone-900/40 p-1 flex items-center justify-center ${
                    activeImageIndex === idx ? "border-primary shadow-sm" : "border-border/60 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Main Large Display with Left/Right Navigation & Touch Swipe */}
          <div
            className="flex-1 aspect-square rounded-2xl overflow-hidden bg-[#FAF8F5] dark:bg-stone-900/40 border border-border relative flex items-center justify-center p-4 sm:p-8 select-none group"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.title}
              className={`w-full h-full object-contain object-center drop-shadow-md transition-opacity duration-200 ${
                isOutOfStock ? "opacity-75 grayscale-[20%]" : ""
              }`}
            />

            {/* Left & Right Arrow Navigation Controls */}
            {product.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-background/90 hover:bg-background text-foreground border border-border shadow-md backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-20"
                  aria-label="Previous photo"
                  title="Previous photo (or swipe left)"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-background/90 hover:bg-background text-foreground border border-border shadow-md backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-20"
                  aria-label="Next photo"
                  title="Next photo (or swipe right)"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Bottom Dots & Counter Indicator */}
                <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/85 backdrop-blur-sm border border-border/80 shadow-sm z-20">
                  {product.images.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        activeImageIndex === idx ? "w-4 bg-primary" : "w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground"
                      }`}
                      aria-label={`Go to photo ${idx + 1}`}
                    />
                  ))}
                  <span className="text-[10px] font-bold text-muted-foreground ml-1 font-mono">
                    {activeImageIndex + 1}/{product.images.length}
                  </span>
                </div>
              </>
            )}

            {isOutOfStock ? (
              <span className="absolute top-4 left-4 bg-stone-900/90 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg tracking-wider uppercase border border-stone-700/60 backdrop-blur-sm z-10">
                OUT OF STOCK
              </span>
            ) : discountPercent > 0 ? (
              <span className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-md z-10">
                Save {discountPercent}%
              </span>
            ) : null}
          </div>
        </div>

        {/* Right: Product Purchase Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                {product.category}
              </span>
              <button
                onClick={handleShare}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? "Link Copied!" : "Share"}</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-foreground">
              {product.title}
            </h1>

            {/* Rating Stars */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? "fill-current" : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-foreground">{product.rating}</span>
              <span className="text-xs text-muted-foreground">({product.reviewCount} verified reviews)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 p-4 rounded-xl bg-muted/40 border border-border">
            <span className="text-2xl sm:text-3xl font-black text-foreground">
              {formatPrice(effectivePrice, selectedCurrency)}
            </span>
            {salePrice && (
              <span className="text-base text-muted-foreground line-through">
                {formatPrice(regularPrice, selectedCurrency)}
              </span>
            )}
            <span className="text-xs text-muted-foreground ml-auto">
              {isQatar ? "Free Delivery in Qatar Included" : "Tax included at checkout"}
            </span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Ring / Bangle Dedicated Sizing (Adjustable vs Specific Sizes) */}
          {sizeInfo && (
            <div className="space-y-2 p-3 sm:p-3.5 rounded-xl bg-card border border-border/80 shadow-sm">
              <div className="flex justify-between items-center text-xs">
                <div className="font-bold text-foreground flex items-center gap-1.5">
                  <span>{sizeInfo.label}:</span>
                  <span className="font-semibold text-primary">{selectedSize || sizeInfo.defaultSize}</span>
                </div>
              </div>

              {sizeInfo.isAdjustableOnly ? (
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-foreground">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span>{sizeInfo.defaultSize}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {sizeInfo.type === "ring"
                      ? "Crafted with an adjustable flex-band. Effortlessly expands or tightens to fit any finger size comfortably."
                      : "Crafted with an adjustable open-cuff design. Fits seamlessly across all wrist sizes."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Size chips */}
                  <div className="flex flex-wrap gap-2">
                    {sizeInfo.options.map((opt) => {
                      const optStock = sizeInfo.sizeStock?.[opt];
                      const isOptOut = optStock !== undefined && optStock <= 0;
                      const isSelected = effectiveSize === opt;

                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setSelectedSize(opt);
                            setQuantity(1);
                          }}
                          className={`relative px-3 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? isOptOut
                                ? "border-amber-500 bg-amber-500/10 text-amber-900 ring-2 ring-amber-500/30"
                                : "border-primary bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/20"
                              : isOptOut
                              ? "border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted/60 opacity-60 line-through decoration-muted-foreground/60"
                              : "border-border bg-background text-foreground hover:border-primary/60"
                          }`}
                        >
                          <span>{opt}</span>
                          {isOptOut && (
                            <span className="no-underline text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-700">
                              Out of Stock
                            </span>
                          )}
                          {!isOptOut && optStock !== undefined && optStock <= 3 && (
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                isSelected ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                              }`}
                            >
                              {optStock} left
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Size Alert Message */}
                  {isCurrentSizeOutOfStock ? (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span>⚠️ {effectiveSize} is Currently Out of Stock</span>
                      </div>
                      <p className="text-[11px] text-amber-800 leading-snug">
                        We don't have units of this size in stock right now. Please select an available size above.
                      </p>
                    </div>
                  ) : (
                    selectedSizeInventory !== undefined && selectedSizeInventory <= 3 && (
                      <p className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 pt-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                        <span>Only {selectedSizeInventory} {selectedSizeInventory === 1 ? "unit" : "units"} remaining in {effectiveSize}!</span>
                      </p>
                    )
                  )}

                  <p className="text-[11px] text-muted-foreground flex items-center gap-1 pt-0.5">
                    <Sparkles className="w-3 h-3 text-primary flex-shrink-0" />
                    <span>
                      {sizeInfo.type === "ring"
                        ? "Alnaya standard ring sizing (Sizes 5 to 10)."
                        : "Standard Indian Bangle sizing (Sizes 2-2 to 2-10)."}
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Other Variant Selectors (Color, Finish, etc.) */}
          {product.variantAttributes
            ?.filter((attr) => !/size/i.test(attr.name))
            .map((attr) => (
              <div key={attr.name} className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-foreground">
                    Select {attr.name}: <span className="font-normal text-muted-foreground">{currentOptions[attr.name]}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {attr.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() =>
                        setSelectedOptions({ ...currentOptions, [attr.name]: opt })
                      }
                      className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
                        currentOptions[attr.name] === opt
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-border bg-card text-foreground hover:bg-muted"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

          {/* Quantity & Stock Indicator */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-foreground">Quantity</span>
              {isCurrentSizeOutOfStock ? (
                <span className="text-amber-600 font-semibold">Size Out of Stock</span>
              ) : isOverallOutOfStock ? (
                <span className="text-destructive font-semibold">Out of Stock</span>
              ) : effectiveMaxStock <= 3 ? (
                <span className="text-amber-600 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Very few left! ({effectiveMaxStock} units remaining)
                </span>
              ) : (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  In Stock ({effectiveMaxStock} units ready)
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border rounded-xl bg-card">
                <button
                  type="button"
                  disabled={isOutOfStock || quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 hover:bg-muted text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-foreground">
                  {isOutOfStock ? 0 : quantity}
                </span>
                <button
                  type="button"
                  disabled={isOutOfStock || quantity >= effectiveMaxStock}
                  onClick={() => setQuantity((q) => Math.min(effectiveMaxStock, q + 1))}
                  className="p-3 hover:bg-muted text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Wishlist toggle */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-xl border transition-all ${
                  isInWishlist
                    ? "border-rose-500 bg-rose-50 text-rose-600 dark:bg-rose-950/30"
                    : "border-border bg-card text-foreground hover:bg-muted"
                }`}
                aria-label="Add to wishlist"
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? "fill-current text-rose-600" : ""}`} />
              </button>
            </div>

            {!isOutOfStock && quantity >= effectiveMaxStock && (
              <p className="text-[11px] text-amber-600 font-medium">
                Maximum available stock reached for this piece ({effectiveMaxStock} units).
              </p>
            )}

            {/* CTA Buttons */}
            <div className="space-y-3 pt-4">
              {/* Buy Now (Direct Express Checkout) */}
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className="w-full py-4 px-6 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Lock className="w-4 h-4 text-accent" />
                <span>
                  {isCurrentSizeOutOfStock
                    ? `${effectiveSize} Out of Stock`
                    : isOverallOutOfStock
                    ? "Currently Out of Stock"
                    : "Buy Now • Instant Checkout"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Add to Bag */}
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed border-2 ${
                  isAdded
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                    : "bg-card border-primary text-primary hover:bg-primary/5"
                }`}
              >
                {isAdded ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Added to Shopping Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Shopping Bag</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Jewelry Trust Value Badges with Direct Guide Triggers */}
          <div className="space-y-3 pt-6 border-t border-border">
            <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center text-[11px] text-muted-foreground">
              <button
                type="button"
                onClick={() => setPolicyModalTab("care-guide")}
                className="p-2.5 rounded-xl bg-card border border-border/80 hover:border-primary/50 transition-all text-center space-y-1 group"
              >
                <ShieldCheck className="w-4 h-4 mx-auto text-primary group-hover:scale-110 transition-transform" />
                <p className="font-bold text-foreground">Hallmark Quality</p>
                <p className="text-[10px]">Premium Craft</p>
              </button>
              <button
                type="button"
                onClick={() => setPolicyModalTab("care-guide")}
                className="p-2.5 rounded-xl bg-card border border-border/80 hover:border-primary/50 transition-all text-center space-y-1 group"
              >
                <Sparkles className="w-4 h-4 mx-auto text-primary group-hover:scale-110 transition-transform" />
                <p className="font-bold text-foreground">100% Waterproof</p>
                <p className="text-[10px]">Shower & Gym Safe</p>
              </button>
              <button
                type="button"
                onClick={() => setPolicyModalTab("shipping")}
                className="p-2.5 rounded-xl bg-card border border-border/80 hover:border-primary/50 transition-all text-center space-y-1 group"
              >
                <Truck className="w-4 h-4 mx-auto text-primary group-hover:scale-110 transition-transform" />
                <p className="font-bold text-foreground">DTDC & India Post</p>
                <p className="text-[10px]">{isQatar ? "Qatar Free Delivery (Within 14 Days)" : "Pan-India ₹40 / Free ₹799+"}</p>
              </button>
            </div>

            {/* Quick Policies Navigation Links */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
              <button
                type="button"
                onClick={() => setPolicyModalTab("return-refund")}
                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5 text-primary" />
                <span>360° Unboxing Policy</span>
              </button>
              <button
                type="button"
                onClick={() => setPolicyModalTab("ordering-instructions")}
                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5 text-primary" />
                <span>Order Instructions</span>
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Specifications & Accordion Tabs */}
      {product.specifications && (
        <section className="border-t border-border pt-12">
          <h2 className="text-xl font-bold text-foreground mb-6">Technical Specifications & Provenance</h2>
          <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
            {Object.entries(product.specifications).map(([key, val]) => (
              <div key={key} className="grid grid-cols-1 sm:grid-cols-3 p-4 text-xs">
                <span className="font-bold text-foreground">{key}</span>
                <span className="sm:col-span-2 text-muted-foreground mt-0.5 sm:mt-0">{val}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Customer Reviews Section */}
      <section className="border-t border-border pt-12 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Customer Reviews ({product.reviews?.length || 0})</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Verified purchaser testimonials</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {product.reviews?.map((rev) => (
            <div key={rev.id} className="p-6 rounded-2xl bg-card border border-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < rev.rating ? "fill-current" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-muted-foreground">{rev.date}</span>
              </div>

              <h4 className="text-sm font-bold text-foreground">{rev.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{rev.comment}</p>

              <div className="pt-2 text-[11px] flex items-center justify-between">
                <span className="font-semibold text-foreground">{rev.author}</span>
                {rev.verifiedPurchase && (
                  <span className="text-emerald-600 font-medium">Verified Purchase</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related Products: 2 rows x 4 columns on desktop (2*4 = 8), 2 rows x 2 columns on mobile (2*2 = 4) */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-border pt-10 sm:pt-14 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-foreground">You May Also Appreciate</h2>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Matching waterproof everyday luxury jewelry pieces.
              </p>
            </div>
            <Link
              href="/products"
              className="text-xs sm:text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 group transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Grid: 2*2 on Mobile (first 4 items), 2*4 on Desktop (8 items) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {relatedProducts.map((p, idx) => (
              <div key={p.id} className={idx >= 4 ? "hidden md:block" : "block"}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>

          <div className="pt-2 sm:pt-4 text-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-98"
            >
              <span>View More Jewelry ({products.length} Pieces)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Mobile Sticky Floating Purchase Bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 sm:hidden bg-background/95 backdrop-blur-md border-t border-border p-3 flex items-center gap-2 shadow-2xl">
        <div className="flex-1 min-w-0 pr-1">
          <p className="text-xs font-bold text-foreground truncate">{product.title}</p>
          <p className="text-sm font-black text-primary">
            {formatPrice(product.salePrice || product.price, selectedCurrency)}
          </p>
        </div>
        {(() => {
          const maxStock = product.inStock !== false ? Math.max(0, product.stockCount !== undefined ? product.stockCount : 10) : 0;
          const isOutOfStock = maxStock <= 0;
          return (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed border-2 ${
                  isAdded
                    ? "bg-emerald-600 text-white shadow-sm border-emerald-600"
                    : "bg-card border-primary text-primary"
                }`}
              >
                {isAdded ? <CheckCircle2 className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                <span>{isAdded ? "Added!" : "Bag"}</span>
              </button>
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className="py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{isOutOfStock ? "Out of Stock" : "Buy Now"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })()}
      </div>

      {/* Interactive Policy Modal */}
      <PolicyModal
        isOpen={!!policyModalTab}
        onClose={() => setPolicyModalTab(null)}
        initialTab={policyModalTab || "care-guide"}
      />
    </div>
  );
}
