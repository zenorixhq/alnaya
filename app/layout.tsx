import type { Metadata } from "next";
import "./globals.css";
import { storeConfig } from "@/config/store.config";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { QuickViewModal } from "@/components/storefront/QuickViewModal";
import { WhatsAppFloat } from "@/components/storefront/WhatsAppFloat";

export const metadata: Metadata = {
  title: {
    default: `${storeConfig.meta.name} | ${storeConfig.meta.tagline}`,
    template: `%s | ${storeConfig.meta.name}`,
  },
  description: storeConfig.meta.description,
  icons: {
    icon: storeConfig.meta.favicon,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = storeConfig.brand;

  const dynamicThemeStyles = {
    "--primary": theme.primary,
    "--primary-hover": theme.primaryHover,
    "--primary-foreground": theme.primaryForeground,
    "--accent": theme.accent,
    "--accent-foreground": theme.accentForeground,
    "--radius": theme.borderRadius,
  } as React.CSSProperties;

  return (
    <html lang="en" className="scroll-smooth" style={dynamicThemeStyles} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans bg-background text-foreground" suppressHydrationWarning>
        <AnnouncementBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />

        {/* Global Slide-overs & Modals */}
        <CartDrawer />
        <QuickViewModal />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
