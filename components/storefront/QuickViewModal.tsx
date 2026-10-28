"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice, getProductPrices } from "@/lib/utils";
import { X, Star, ShoppingBag, Plus, Minus, ArrowRight } from "lucide-react";

export function QuickViewModal() {
  const product = useCartStore((s) => s.quickViewProduct);
  const closeQuickView = useCartStore((s) => s.closeQuickView);
  const addItem = useCartStore((s) => s.addItem);
  const selectedCurrency = useCartStore((s) => s.selectedCurrency);

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});

  if (!product) return null;

  const { regularPrice, salePrice, effectivePrice } = getProductPrices(
    product,
    selectedCurrency
  );

  // Initialize default options
  const currentOptions = { ...selectedOptions };
  if (product.variantAttributes) {
    product.variantAttributes.forEach((attr) => {
      if (!currentOptions[attr.name] && attr.options.length > 0) {
        currentOptions[attr.name] = attr.options[0];
      }
    });
  }

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
    closeQuickView();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeQuickView}
      />

      <div className="relative w-full max-w-3xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in-0 zoom-in-95 my-auto max-h-[90vh] overflow-y-auto">
        <button
          onClick={closeQuickView}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 hover:bg-background border border-border text-foreground transition-colors z-20"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image - Clean Framing without cropping */}
          <div className="aspect-square bg-[#FAF8F5] dark:bg-stone-900/40 relative flex items-center justify-center p-4 sm:p-6">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-contain object-center drop-shadow-md"
            />
          </div>

          {/* Details & Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  {product.category}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mt-1">
                  {product.title}
                </h3>

                {product.rating && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(product.rating) ? "fill-current" : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-foreground">{product.rating}</span>
                    <span className="text-xs text-muted-foreground">({product.reviewCount} reviews)</span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-foreground">
                  {formatPrice(effectivePrice, selectedCurrency)}
                </span>
                {salePrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(regularPrice, selectedCurrency)}
                  </span>
                )}
              </div>

              <p className="text-xs text-muted-foreground line-clamp-3">
                {product.description}
              </p>

              {/* Variant Attribute Selectors */}
              {product.variantAttributes?.map((attr) => (
                <div key={attr.name} className="space-y-1.5">
                  <span className="text-xs font-semibold text-foreground">
                    {attr.name}: <span className="font-normal text-muted-foreground">{currentOptions[attr.name]}</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {attr.options.map((option) => (
                      <button
                        key={option}
                        onClick={() =>
                          setSelectedOptions({ ...currentOptions, [attr.name]: option })
                        }
                        className={`px-3 py-1 text-xs rounded-md font-medium border transition-all ${
                          currentOptions[attr.name] === option
                            ? "border-primary bg-primary text-primary-foreground font-semibold"
                            : "border-border bg-card text-foreground hover:bg-muted"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Quantity */}
              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-semibold text-foreground">Quantity</span>
                <div className="flex items-center w-28 border border-border rounded-lg bg-muted/20">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-muted text-foreground transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="flex-1 text-center text-xs font-bold text-foreground">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-muted text-foreground transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-6 mt-6 border-t border-border space-y-2.5">
              <button
                onClick={handleAddToCart}
                className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>

              <Link
                href={`/products/${product.slug}`}
                onClick={closeQuickView}
                className="w-full py-2.5 px-4 rounded-xl border border-border text-foreground hover:bg-muted font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Full Product Specifications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
