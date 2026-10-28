/**
 * Automated Client Onboarding Script
 * Use this script to rapidly switch brands or configure a brand new client.
 *
 * Usage:
 *   node scripts/setup-client.mjs --preset fashion
 *   node scripts/setup-client.mjs --preset tech
 *   node scripts/setup-client.mjs --preset artisan
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const presets = {
  fashion: {
    name: "AURA Studios",
    tagline: "Minimalist High-Fashion & Elevated Silhouettes",
    description: "Contemporary tailoring, organic linens, and monochrome aesthetics.",
    logoText: "AURA",
    logoSubtext: "PARIS • NEW YORK",
    primaryHsl: "346 77% 49%", // Elegant Rose/Ruby
    primaryHoverHsl: "346 77% 40%",
    accentHsl: "24 94% 53%",
    currency: "USD",
  },
  tech: {
    name: "NEXUS Hardware",
    tagline: "High-Performance Developer Essentials & Audio",
    description: "Precision CNC aluminum peripherals, acoustic monitors, and workspace gear.",
    logoText: "NEXUS",
    logoSubtext: "ENGINEERED AUDIO",
    primaryHsl: "199 89% 48%", // Cyan / Tech Blue
    primaryHoverHsl: "199 89% 38%",
    accentHsl: "142 71% 45%",
    currency: "USD",
  },
  artisan: {
    name: "ROAST & ROOTS",
    tagline: "Micro-Lot Single Origin Coffees & Brew Gear",
    description: "Sustainably shade-grown specialty coffee beans roasted fresh to order.",
    logoText: "ROAST & ROOTS",
    logoSubtext: "EST. 2024",
    primaryHsl: "28 73% 26%", // Warm Espresso Brown
    primaryHoverHsl: "28 73% 20%",
    accentHsl: "38 92% 50%", // Amber
    currency: "USD",
  },
};

const argPreset = process.argv[2]?.replace("--preset=", "") || "fashion";
const selected = presets[argPreset] || presets.fashion;

console.log(`\n========================================`);
console.log(`🚀 REBRANDING CLIENT TEMPLATE: ${selected.name}`);
console.log(`========================================\n`);

const configContent = `export interface StoreConfig {
  meta: {
    name: string;
    tagline: string;
    description: string;
    url: string;
    favicon: string;
  };
  brand: {
    logo: {
      text: string;
      subtext?: string;
      imageUrl?: string;
    };
    theme: {
      primary: string;
      primaryHover: string;
      primaryForeground: string;
      accent: string;
      accentForeground: string;
      borderRadius: string;
      fontHeading: string;
      fontSans: string;
    };
    contact: {
      email: string;
      phone: string;
      address: string;
      hours: string;
    };
    socials: {
      instagram?: string;
      twitter?: string;
      facebook?: string;
    };
  };
  commerce: {
    defaultCurrency: "USD" | "EUR" | "GBP" | "INR";
    supportedCurrencies: { code: string; symbol: string; rate: number }[];
    freeShippingThreshold: number;
    flatShippingFee: number;
    taxRatePercent: number;
    taxInclusive: boolean;
    availablePaymentMethods: ("card" | "cod" | "paypal" | "razorpay")[];
    activeCoupons: {
      code: string;
      discountType: "percentage" | "fixed";
      amount: number;
      minSpend?: number;
      description: string;
    }[];
  };
  features: {
    enableWishlist: boolean;
    enableReviews: boolean;
    enableQuickView: boolean;
    enableCurrencySwitcher: boolean;
    enableStockBadges: boolean;
    enableAnnouncementBar: boolean;
    announcementText: string;
  };
}

export const storeConfig: StoreConfig = {
  meta: {
    name: "${selected.name}",
    tagline: "${selected.tagline}",
    description: "${selected.description}",
    url: "https://${selected.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com",
    favicon: "/favicon.ico",
  },
  brand: {
    logo: {
      text: "${selected.logoText}",
      subtext: "${selected.logoSubtext}",
      imageUrl: "",
    },
    theme: {
      primary: "${selected.primaryHsl}",
      primaryHover: "${selected.primaryHoverHsl}",
      primaryForeground: "0 0% 100%",
      accent: "${selected.accentHsl}",
      accentForeground: "0 0% 100%",
      borderRadius: "0.625rem",
      fontHeading: "var(--font-heading)",
      fontSans: "var(--font-sans)",
    },
    contact: {
      email: "hello@${selected.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com",
      phone: "+1 (800) 555-0199",
      address: "100 Broadway, New York, NY 10005",
      hours: "Mon – Fri: 9:00 AM – 6:00 PM EST",
    },
    socials: {
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
      facebook: "https://facebook.com",
    },
  },
  commerce: {
    defaultCurrency: "USD",
    supportedCurrencies: [
      { code: "USD", symbol: "$", rate: 1.0 },
      { code: "EUR", symbol: "€", rate: 0.92 },
      { code: "GBP", symbol: "£", rate: 0.79 },
      { code: "INR", symbol: "₹", rate: 83.5 },
    ],
    freeShippingThreshold: 75,
    flatShippingFee: 9.99,
    taxRatePercent: 8.5,
    taxInclusive: false,
    availablePaymentMethods: ["card", "paypal", "cod"],
    activeCoupons: [
      {
        code: "WELCOME10",
        discountType: "percentage",
        amount: 10,
        description: "10% off your entire first order",
      },
      {
        code: "FREESHIP",
        discountType: "fixed",
        amount: 9.99,
        minSpend: 50,
        description: "Free shipping on orders over $50",
      },
    ],
  },
  features: {
    enableWishlist: true,
    enableReviews: true,
    enableQuickView: true,
    enableCurrencySwitcher: true,
    enableStockBadges: true,
    enableAnnouncementBar: true,
    announcementText: "✨ Welcome to ${selected.name}! Enjoy 10% off your initial order with promo code WELCOME10",
  },
};
`;

const configPath = path.join(projectRoot, "config", "store.config.ts");
fs.writeFileSync(configPath, configContent, "utf-8");

console.log(`✅ Successfully updated config/store.config.ts for ${selected.name}!`);
console.log(`🎨 Primary Color Palette: HSL(${selected.primaryHsl})`);
console.log(`🌐 Ready to build or start dev server: npm run dev\n`);
