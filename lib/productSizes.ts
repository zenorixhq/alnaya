export interface ProductSizeInfo {
  type: "ring" | "bangle";
  label: string;
  defaultSize: string;
  options: string[];
  sizeStock?: Record<string, number>;
  isAdjustableOnly: boolean;
}

export const RING_SPECIFIC_SIZES = [
  "Size 10 (15.9 mm)",
  "Size 12 (16.5 mm)",
  "Size 14 (17.2 mm - Standard)",
  "Size 16 (17.9 mm)",
  "Size 18 (18.6 mm)",
  "Size 20 (19.2 mm)",
];

export const RING_ADJUSTABLE_OPTION = "Adjustable / Free Size";

// Backwards compatibility export
export const RING_SIZES = RING_SPECIFIC_SIZES;

export const BANGLE_SPECIFIC_SIZES = [
  "Size 2-2 (2.125\" - Petite)",
  "Size 2-4 (2.25\" - Small)",
  "Size 2-6 (2.375\" - Standard)",
  "Size 2-8 (2.50\" - Medium-Large)",
  "Size 2-10 (2.625\" - Extra Large)",
];

export const BANGLE_ADJUSTABLE_OPTION = "Adjustable / Openable Cuff";

// Backwards compatibility export
export const BANGLE_SIZES = BANGLE_SPECIFIC_SIZES;

export function getProductSizeInfo(product?: {
  category?: string;
  subcategory?: string;
  title?: string;
  description?: string;
  tags?: string[];
  variantAttributes?: { name: string; options: string[]; sizeStock?: Record<string, number> }[];
}): ProductSizeInfo | null {
  if (!product) return null;

  const explicitSizeAttr = product.variantAttributes?.find((attr) =>
    /size/i.test(attr.name)
  );

  const cat = (product.category || "").toLowerCase();
  const sub = (product.subcategory || "").toLowerCase();
  const title = (product.title || "").toLowerCase();
  const desc = (product.description || "").toLowerCase();
  const tagsStr = (product.tags || []).join(" ").toLowerCase();

  const isRing =
    cat === "rings" ||
    cat === "ring" ||
    sub.includes("ring") ||
    /\b(ring|rings|band|bands|solitaire)\b/i.test(title);

  const isBangle =
    cat === "bangles-kada" ||
    cat === "bangle" ||
    cat === "bangles" ||
    cat === "kada" ||
    cat === "kadas" ||
    sub.includes("bangle") ||
    sub.includes("kada") ||
    /\b(bangle|bangles|kada|kadas|cuff|cuffs)\b/i.test(title);

  if (isRing) {
    if (explicitSizeAttr && explicitSizeAttr.options?.length > 0) {
      const isAdjustable =
        explicitSizeAttr.options.length === 1 &&
        /adjustable|free size/i.test(explicitSizeAttr.options[0]);

      if (isAdjustable) {
        return {
          type: "ring",
          label: explicitSizeAttr.name || "Ring Size",
          defaultSize: explicitSizeAttr.options[0] || RING_ADJUSTABLE_OPTION,
          options: [explicitSizeAttr.options[0] || RING_ADJUSTABLE_OPTION],
          sizeStock: explicitSizeAttr.sizeStock,
          isAdjustableOnly: true,
        };
      } else {
        // Admin chose Specific Sizes -> Omit any adjustable option
        const cleanedSizes = explicitSizeAttr.options.filter(
          (o) => !/adjustable|free size/i.test(o)
        );
        const sizesToUse = cleanedSizes.length > 0 ? cleanedSizes : RING_SPECIFIC_SIZES;
        const sizeStock = explicitSizeAttr.sizeStock;

        // Choose first in-stock size as default, or standard size
        let defaultSize = sizesToUse.includes("Size 14 (17.2 mm - Standard)")
          ? "Size 14 (17.2 mm - Standard)"
          : sizesToUse[0];

        if (sizeStock) {
          const firstInStock = sizesToUse.find((s) => (sizeStock[s] ?? 0) > 0);
          if (firstInStock) {
            defaultSize = firstInStock;
          }
        }

        return {
          type: "ring",
          label: explicitSizeAttr.name || "Ring Size",
          defaultSize,
          options: sizesToUse,
          sizeStock,
          isAdjustableOnly: false,
        };
      }
    }

    // Heuristic if no explicit attribute: check if title, desc, or tags say adjustable
    const isAdjustableByText =
      /\b(adjustable|free size)\b/i.test(title) ||
      /\b(adjustable|free size)\b/i.test(desc) ||
      /\b(adjustable|free size)\b/i.test(tagsStr);

    if (isAdjustableByText) {
      return {
        type: "ring",
        label: "Ring Size",
        defaultSize: RING_ADJUSTABLE_OPTION,
        options: [RING_ADJUSTABLE_OPTION],
        isAdjustableOnly: true,
      };
    }

    return {
      type: "ring",
      label: "Ring Size",
      defaultSize: "Size 14 (17.2 mm - Standard)",
      options: RING_SPECIFIC_SIZES,
      isAdjustableOnly: false,
    };
  }

  if (isBangle) {
    if (explicitSizeAttr && explicitSizeAttr.options?.length > 0) {
      const isAdjustable =
        explicitSizeAttr.options.length === 1 &&
        /adjustable|openable|cuff|free size/i.test(explicitSizeAttr.options[0]);

      if (isAdjustable) {
        return {
          type: "bangle",
          label: explicitSizeAttr.name || "Bangle Size",
          defaultSize: explicitSizeAttr.options[0] || BANGLE_ADJUSTABLE_OPTION,
          options: [explicitSizeAttr.options[0] || BANGLE_ADJUSTABLE_OPTION],
          sizeStock: explicitSizeAttr.sizeStock,
          isAdjustableOnly: true,
        };
      } else {
        // Admin chose Specific Sizes -> Omit any adjustable option
        const cleanedSizes = explicitSizeAttr.options.filter(
          (o) => !/adjustable|openable|cuff|free size/i.test(o)
        );
        const sizesToUse = cleanedSizes.length > 0 ? cleanedSizes : BANGLE_SPECIFIC_SIZES;
        const sizeStock = explicitSizeAttr.sizeStock;

        // Choose first in-stock size as default, or standard size
        let defaultSize = sizesToUse.includes("Size 2-6 (2.375\" - Standard)")
          ? "Size 2-6 (2.375\" - Standard)"
          : sizesToUse[0];

        if (sizeStock) {
          const firstInStock = sizesToUse.find((s) => (sizeStock[s] ?? 0) > 0);
          if (firstInStock) {
            defaultSize = firstInStock;
          }
        }

        return {
          type: "bangle",
          label: explicitSizeAttr.name || "Bangle Size",
          defaultSize,
          options: sizesToUse,
          sizeStock,
          isAdjustableOnly: false,
        };
      }
    }

    // Heuristic if no explicit attribute
    const isAdjustableByText =
      /\b(adjustable|openable|cuff|free size)\b/i.test(title) ||
      /\b(adjustable|openable|cuff|free size)\b/i.test(desc) ||
      /\b(adjustable|openable|cuff|free size)\b/i.test(tagsStr);

    if (isAdjustableByText) {
      return {
        type: "bangle",
        label: "Bangle Size",
        defaultSize: BANGLE_ADJUSTABLE_OPTION,
        options: [BANGLE_ADJUSTABLE_OPTION],
        isAdjustableOnly: true,
      };
    }

    return {
      type: "bangle",
      label: "Bangle Size",
      defaultSize: "Size 2-6 (2.375\" - Standard)",
      options: BANGLE_SPECIFIC_SIZES,
      isAdjustableOnly: false,
    };
  }

  if (explicitSizeAttr) {
    const isAdjustable =
      explicitSizeAttr.options.length === 1 &&
      /adjustable|free size/i.test(explicitSizeAttr.options[0]);
    return {
      type: "ring",
      label: explicitSizeAttr.name,
      defaultSize: explicitSizeAttr.options[0] || "",
      options: explicitSizeAttr.options,
      sizeStock: explicitSizeAttr.sizeStock,
      isAdjustableOnly: isAdjustable,
    };
  }

  return null;
}
