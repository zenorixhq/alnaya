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
  CheckCircle2,
  MessageCircle,
  Sparkles,
  Ruler,
  AlertCircle,
  Video,
} from "lucide-react";
import { storeConfig } from "@/config/store.config";
import { PolicyModal, PolicyTab } from "@/components/storefront/PolicyModal";

export default function ProductDetailPage({
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

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [copiedLink, setCopiedLink] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);
  const isInWishlist = useCartStore((s) => s.isInWishlist)(product.id);
  const selectedCurrency = useCartStore((s) => s.selectedCurrency);

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

  const handleAddToCart = () => {
    const hasVariants =
      product.variantAttributes && product.variantAttributes.length > 0;
    const variantId = hasVariants
      ? Object.entries(currentOptions)
          .map(([k, v]) => `${k}-${v}`)
          .join("_")
      : undefined;
    const variantName = hasVariants
      ? Object.values(currentOptions).join(" / ")
      : undefined;

    addItem(
      product,
      quantity,
      hasVariants
        ? {
            id: variantId || "standard",
            name: variantName || "Standard",
            options: currentOptions,
          }
        : undefined
    );

    openCart();
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const handleDirectWhatsAppOrder = () => {
    const selectedVariantSummary = Object.entries(currentOptions)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");

    const phone = storeConfig.brand.contact.whatsappNumber;
    const itemTotalFormatted = formatPrice(effectivePrice * quantity, selectedCurrency);

    const greetingMessage = isQatar
      ? "I want to order this piece from your website! Please confirm availability and share payment/delivery details for Qatar (Free Delivery). Thank you! 💖"
      : "I want to order this piece from your website! Please confirm availability and share your *UPI QR code* so I can pay and confirm my delivery. Thank you! 💖";

    const message = `━━━━━━━━━━━━━━━━━━━━━
✨ *G L E A M N E S T* ✨
_Instant Order Inquiry_
━━━━━━━━━━━━━━━━━━━━━

💍 *SELECTED PIECE*
• *Title:* *${product.title}*
${selectedVariantSummary ? `• *Selection:* ${selectedVariantSummary}\n` : ""}• *Quantity:* ${quantity}
• *Item Total:* *${itemTotalFormatted}*
• *Destination:* *${isQatar ? "Qatar (Complimentary Delivery)" : "India"}*

💬 *Hello GleamNest Team!*
${greetingMessage}
━━━━━━━━━━━━━━━━━━━━━`;

    const encodedMessage = encodeURIComponent(message);
    const isMobile = typeof window !== "undefined" && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    const waUrl = isMobile
      ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`;

    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank");
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

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

          {/* Main Large Display - Framed to fit jewelry completely without cutoffs */}
          <div className="flex-1 aspect-square rounded-2xl overflow-hidden bg-[#FAF8F5] dark:bg-stone-900/40 border border-border relative flex items-center justify-center p-4 sm:p-8">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-contain object-center drop-shadow-md"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                Save {discountPercent}%
              </span>
            )}
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

          {/* Variant Selectors */}
          {product.variantAttributes?.map((attr) => (
            <div key={attr.name} className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-foreground">
                  Select {attr.name}: <span className="font-normal text-muted-foreground">{currentOptions[attr.name]}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setPolicyModalTab("size-guide")}
                  className="text-primary hover:underline font-semibold flex items-center gap-1"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Guide</span>
                </button>
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
              {product.inStock ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  In Stock ({product.stockCount} units ready)
                </span>
              ) : (
                <span className="text-destructive font-semibold">Out of Stock</span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border rounded-xl bg-card">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-muted text-foreground transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-foreground">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-muted text-foreground transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Wishlist toggle */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-xl border transition-all ${
                  isInWishlist
                    ? "border-destructive bg-destructive/10 text-destructive"
                    : "border-border bg-card text-foreground hover:bg-muted"
                }`}
                aria-label="Add to wishlist"
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`} />
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3 pt-4">
            <button
              onClick={handleDirectWhatsAppOrder}
              className="w-full py-4 px-6 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.99]"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Instant Order on WhatsApp</span>
            </button>

            <button
              onClick={handleAddToCart}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] ${
                isAdded
                  ? "bg-emerald-600 text-white border-2 border-emerald-600 shadow-md"
                  : "bg-card border-2 border-primary text-primary hover:bg-primary/5"
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

          {/* Jewelry Trust Value Badges with Direct Guide Triggers */}
          <div className="space-y-3 pt-6 border-t border-border">
            <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center text-[11px] text-muted-foreground">
              <button
                type="button"
                onClick={() => setPolicyModalTab("care-guide")}
                className="p-2.5 rounded-xl bg-card border border-border/80 hover:border-primary/50 transition-all text-center space-y-1 group"
              >
                <ShieldCheck className="w-4 h-4 mx-auto text-primary group-hover:scale-110 transition-transform" />
                <p className="font-bold text-foreground">Anti-Tarnish</p>
                <p className="text-[10px]">304 & 306 Steel</p>
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
                onClick={() => setPolicyModalTab("size-guide")}
                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 font-medium"
              >
                <Ruler className="w-3.5 h-3.5 text-primary" />
                <span>Size Guide</span>
              </button>
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

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-border pt-12 space-y-6">
          <h2 className="text-xl font-bold text-foreground">You May Also Appreciate</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
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
        <button
          onClick={handleAddToCart}
          className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
            isAdded
              ? "bg-emerald-600 text-white shadow-sm"
              : "bg-card border-2 border-primary text-primary"
          }`}
        >
          {isAdded ? <CheckCircle2 className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          <span>{isAdded ? "Added!" : "Bag"}</span>
        </button>
        <button
          onClick={handleDirectWhatsAppOrder}
          className="py-2.5 px-3.5 rounded-xl bg-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>WhatsApp</span>
        </button>
      </div>

      {/* Interactive Policy & Size Guide Modal */}
      <PolicyModal
        isOpen={!!policyModalTab}
        onClose={() => setPolicyModalTab(null)}
        initialTab={policyModalTab || "size-guide"}
      />
    </div>
  );
}
