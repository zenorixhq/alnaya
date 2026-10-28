import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { storeConfig } from "@/config/store.config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currencyCode: string = "INR"): string {
  if (currencyCode === "QAR") {
    return Number.isInteger(amount) ? `QAR ${amount}` : `QAR ${amount.toFixed(2)}`;
  }
  if (currencyCode === "INR") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  const currency = storeConfig.commerce.supportedCurrencies.find(
    (c) => c.code === currencyCode
  ) || storeConfig.commerce.supportedCurrencies[0];

  const converted = amount * (currency.rate || 1);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.code,
    minimumFractionDigits: 2,
  }).format(converted);
}

export function getProductPrices(
  product: {
    price: number;
    salePrice?: number | null;
    priceQatar?: number | null;
    salePriceQatar?: number | null;
  },
  currencyCode: string = "INR"
) {
  const isQatar = currencyCode === "QAR";
  const regularPrice = isQatar
    ? (product.priceQatar !== undefined && product.priceQatar !== null
        ? product.priceQatar
        : Math.max(10, Math.round(product.price / 20)))
    : product.price;

  const salePrice = isQatar
    ? (product.salePriceQatar !== undefined && product.salePriceQatar !== null ? product.salePriceQatar : undefined)
    : (product.salePrice !== undefined && product.salePrice !== null ? product.salePrice : undefined);

  const effectivePrice = salePrice || regularPrice;
  const discountPercent = salePrice ? calculateDiscountPercent(regularPrice, salePrice) : 0;

  return {
    regularPrice,
    salePrice,
    effectivePrice,
    discountPercent,
    isQatar,
  };
}

export function calculateDiscountPercent(original: number, sale: number): number {
  if (!original || original <= sale) return 0;
  return Math.round(((original - sale) / original) * 100);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
