export interface StoreConfig {
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
      primary: string;         // HSL
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
      whatsappNumber: string; // WhatsApp ordering phone without + or spaces
      address: string;
      hours: string;
    };
    socials: {
      instagram?: string;
      whatsapp?: string;
      facebook?: string;
    };
  };
  commerce: {
    defaultCurrency: "INR";
    supportedCurrencies: { code: string; symbol: string; name?: string; flag?: string; rate: number }[];
    freeShippingThreshold: number;
    flatShippingFee: number;
    taxRatePercent: number;
    taxInclusive: boolean;
    checkoutMode: "gateway" | "whatsapp"; // 'gateway' online checkout with Razorpay + WhatsApp assisted
    activeCoupons: {
      code: string;
      discountType: "percentage" | "fixed";
      amount: number;
      minSpend?: number;
      description: string;
      firstPurchaseOnly?: boolean;
    }[];
  };
  features: {
    enableWishlist: boolean;
    enableReviews: boolean;
    enableQuickView: boolean;
    enableStockBadges: boolean;
    enableAnnouncementBar: boolean;
    announcementText: string;
    enableWhatsAppFloat: boolean;
    enableCurrencySwitcher: boolean;
  };
}

export const storeConfig: StoreConfig = {
  meta: {
    name: "Alnaya",
    tagline: "Everyday & Ethnic Luxury Jewellery",
    description: "Exquisite Handcrafted Jhumkas, Dainty Pendants & Anti-Tarnish Daily Wear Jewellery. 1000+ Happy Customers with Worldwide Shipping.",
    url: "https://alnaya.in",
    favicon: "/alnaya-logo.png",
  },
  brand: {
    logo: {
      text: "Alnaya",
      subtext: "Everyday & Ethnic Luxury Jewellery",
      imageUrl: "/alnaya-logo.png",
    },
    theme: {
      // Royal Plum / Wine Velvet & Radiant Champagne Gold Palette inspired by Alnaya's brand logo
      primary: "315 42% 22%",       // Deep Plum Wine #502146
      primaryHover: "315 45% 17%",  // Rich Aubergine
      primaryForeground: "0 0% 100%",
      accent: "42 80% 50%",         // Radiant Gold #E5AD1B
      accentForeground: "0 0% 100%",
      borderRadius: "0.75rem",
      fontHeading: "var(--font-heading)",
      fontSans: "var(--font-sans)",
    },
    contact: {
      email: "orders@alnaya.in",
      phone: "+91 96339 56222",
      whatsappNumber: "919633956222",
      address: "India • Worldwide Express Shipping",
      hours: "Mon – Sat: 9:30 AM – 8:00 PM IST",
    },
    socials: {
      instagram: "https://www.instagram.com/alnaya.in/",
      whatsapp: "https://wa.me/919633956222",
    },
  },
  commerce: {
    defaultCurrency: "INR",
    supportedCurrencies: [
      { code: "INR", symbol: "₹", name: "India (₹)", flag: "🇮🇳", rate: 1.0 },
    ],
    freeShippingThreshold: 799,
    flatShippingFee: 40,
    taxRatePercent: 0,
    taxInclusive: true,
    checkoutMode: "gateway",
    activeCoupons: [
      {
        code: "ALNAYA5",
        discountType: "percentage",
        amount: 5,
        firstPurchaseOnly: true,
        description: "5% off your first jewelry order",
      },
      {
        code: "WELCOME5",
        discountType: "percentage",
        amount: 5,
        firstPurchaseOnly: true,
        description: "5% off your first jewelry order",
      },
      {
        code: "FREESHIP",
        discountType: "fixed",
        amount: 40,
        minSpend: 799,
        description: "Complimentary express delivery on orders ₹799+",
      },
    ],
  },
  features: {
    enableWishlist: true,
    enableReviews: true,
    enableQuickView: true,
    enableStockBadges: true,
    enableAnnouncementBar: true,
    announcementText: "✨ Handcrafted Jhumkas & Anti-Tarnish Jewellery • 1000+ Happy Customers • Pan-India Express Delivery • Free Shipping above ₹799 • Pay Securely via UPI / Cards",
    enableWhatsAppFloat: true,
    enableCurrencySwitcher: false,
  },
};
