export interface ProductSizeInfo {
  type: "ring" | "bangle";
  label: string;
  defaultSize: string;
  options: string[];
}

export const RING_SIZES = [
  "Size 10 (15.9 mm)",
  "Size 12 (16.5 mm)",
  "Size 14 (17.2 mm - Standard)",
  "Size 16 (17.9 mm)",
  "Size 18 (18.6 mm)",
  "Size 20 (19.2 mm)",
  "Adjustable / Free Size",
];

export const BANGLE_SIZES = [
  "Size 2-2 (2.125\" - Petite)",
  "Size 2-4 (2.25\" - Small)",
  "Size 2-6 (2.375\" - Standard)",
  "Size 2-8 (2.50\" - Medium-Large)",
  "Size 2-10 (2.625\" - Extra Large)",
  "Adjustable / Openable Cuff",
];

export function getProductSizeInfo(product?: {
  category?: string;
  subcategory?: string;
  title?: string;
  variantAttributes?: { name: string; options: string[] }[];
}): ProductSizeInfo | null {
  if (!product) return null;

  const explicitSizeAttr = product.variantAttributes?.find((attr) =>
    /size/i.test(attr.name)
  );

  const cat = (product.category || "").toLowerCase();
  const sub = (product.subcategory || "").toLowerCase();
  const title = (product.title || "").toLowerCase();

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
    return {
      type: "ring",
      label: explicitSizeAttr?.name || "Ring Size",
      defaultSize: explicitSizeAttr?.options[0] || "Size 14 (17.2 mm - Standard)",
      options: explicitSizeAttr?.options?.length ? explicitSizeAttr.options : RING_SIZES,
    };
  }

  if (isBangle) {
    return {
      type: "bangle",
      label: explicitSizeAttr?.name || "Bangle Size",
      defaultSize: explicitSizeAttr?.options[0] || "Size 2-6 (2.375\" - Standard)",
      options: explicitSizeAttr?.options?.length ? explicitSizeAttr.options : BANGLE_SIZES,
    };
  }

  if (explicitSizeAttr) {
    return {
      type: "ring",
      label: explicitSizeAttr.name,
      defaultSize: explicitSizeAttr.options[0] || "",
      options: explicitSizeAttr.options,
    };
  }

  return null;
}
