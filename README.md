# 🛍️ Universal White-Label E-Commerce Website Template

A production-ready, highly reusable e-commerce website template engineered to spin up branded, high-converting online stores for different clients in **minutes instead of weeks**.

Built with **Next.js 14 App Router, TypeScript, Tailwind CSS, Lucide Icons, and Zustand**.

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Production build
npm run build
```

Store will be live at `http://localhost:3000`.

---

## 🎨 How to Rebrand for a New Client in 2 Minutes

All brand assets, theme colors, currencies, payment providers, and feature flags are centralized in **one single file**:

📁 `config/store.config.ts`

### 1. Update Brand & Visual Identity
```typescript
brand: {
  logo: {
    text: "CLIENT BRAND",
    subtext: "NEW YORK • LONDON",
  },
  theme: {
    primary: "220 70% 36%", // HSL color: buttons, key accents
    primaryHover: "220 70% 30%",
    accent: "38 92% 50%",    // Badges, highlights
    borderRadius: "0.625rem",
  },
  contact: {
    email: "concierge@clientbrand.com",
    phone: "+1 (800) 555-0199",
    address: "450 Lexington Ave, New York, NY",
  }
}
```

### 2. Configure Currencies & Shipping
```typescript
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
  availablePaymentMethods: ["card", "paypal", "cod"],
}
```

### 3. Toggle Client Feature Flags
```typescript
features: {
  enableWishlist: true,
  enableReviews: true,
  enableQuickView: true,
  enableCurrencySwitcher: true,
  enableStockBadges: true,
  enableAnnouncementBar: true,
  announcementText: "✨ Spring Launch: Free Worldwide Shipping on orders over $75 with code FREESHIP",
}
```

---

## 🚀 Instant Niche Presets CLI

Switch the entire store's aesthetic and industry niche with 1 command:

```bash
# High-Street / Minimalist Fashion
node scripts/setup-client.mjs --preset fashion

# Tech & Electronics Hardware
node scripts/setup-client.mjs --preset tech

# Artisan Coffee & Food
node scripts/setup-client.mjs --preset artisan
```

---

## 📱 Features Included Out-of-the-Box

1. **Header & Navigation**:
   - Announcement banner with live dismiss
   - Live search modal with instant matching
   - Real-time multi-currency switcher (`$`, `€`, `£`, `₹`)
   - Wishlist indicator & Cart count badge
   - Mobile responsive navigation drawer

2. **Homepage**:
   - Hero banner with CTA buttons and social proof
   - Value propositions bar (Free shipping, easy returns, encrypted checkout)
   - Category cards grid
   - Tabbed showcase ("Best Sellers", "New Arrivals", "Featured")
   - Editorial craftsmanship banner
   - Verified customer reviews & ratings

3. **Catalog & Search (`/products`)**:
   - Faceted category, price range, in-stock, and rating filters
   - Instant sorting (Low-to-High, High-to-Low, Top Rated, Newest)
   - Product cards with hover image zoom, sale badge, wishlist heart, and quick-add

4. **Product Detail Page (`/products/[slug]`)**:
   - Multi-angle gallery with clickable thumbnail selector
   - Dynamic variant picker (Sizes, Colors)
   - Real-time stock availability badge
   - Quantity stepper and 1-click "Buy Now" button
   - Technical specifications breakdown
   - Customer review breakdown and related products

5. **Cart Experience**:
   - Slide-over Cart Drawer accessible from any page
   - Dedicated full Cart Page (`/cart`)
   - Dynamic Free Shipping Progress Bar (e.g., *"Add $15 more for free shipping"*)
   - Promo coupon engine (sample codes: `WELCOME10`, `FREESHIP`, `VIP25`)

6. **Checkout Experience (`/checkout`)**:
   - Frictionless guest checkout
   - Customer info & shipping address intake
   - Shipping method selector (Standard vs Express)
   - Payment method selector (Credit Card / Stripe Elements UI, Cash on Delivery, PayPal)
   - Instant order confirmation screen (`/checkout/success`) with printable invoice

7. **Customer Portal (`/account`)**:
   - Order history with tracking timeline (`Processing` -> `Shipped` -> `Delivered`)
   - Wishlist manager with "Move all to cart" button
   - Saved delivery addresses book

8. **Merchant Admin Dashboard (`/admin`)**:
   - Business KPI metrics (Gross Revenue, Total Orders, Average Order Value, Warehouse Units)
   - Order fulfillment queue with live status update dropdown
   - Inventory stock level adjusters
   - Live store branding viewer and preset manager

---

## 📦 Directory Structure

```text
ecom/
├── app/
│   ├── (storefront)/
│   │   ├── page.tsx                  # Homepage
│   │   ├── products/
│   │   │   ├── page.tsx              # Catalog with faceted filters
│   │   │   └── [slug]/page.tsx       # Product Detail Page (PDP)
│   │   ├── cart/page.tsx             # Full Cart page
│   │   ├── checkout/
│   │   │   ├── page.tsx              # Checkout funnel
│   │   │   └── success/page.tsx      # Order confirmation & receipt
│   │   ├── account/page.tsx          # Customer portal & wishlist
│   │   └── admin/page.tsx            # Merchant admin dashboard
│   ├── layout.tsx                    # Root layout with dynamic theme tokens
│   └── globals.css                   # Tailwind base & CSS variables
├── components/
│   └── storefront/                   # Modular UI components
│       ├── AnnouncementBar.tsx
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── ProductCard.tsx
│       ├── CartDrawer.tsx
│       └── QuickViewModal.tsx
├── config/
│   └── store.config.ts               # MASTER CLIENT CONFIGURATION
├── data/
│   └── mockData.ts                   # Realistic sample catalog, categories & orders
├── lib/
│   └── utils.ts                      # Formatting & helper methods
├── scripts/
│   └── setup-client.mjs              # Rebranding CLI
├── store/
│   └── useCartStore.ts               # Zustand store with LocalStorage persistence
└── types/
    └── store.ts                      # TypeScript definitions
```
