"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { storeConfig } from "@/config/store.config";
import { X, Sparkles } from "lucide-react";

export function AnnouncementBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // On the homepage, do not render announcement bar so the transparent navbar floats seamlessly over the full-bleed video hero
  if (!mounted || !storeConfig.features.enableAnnouncementBar || !visible || pathname === "/") {
    return null;
  }

  const tickerItems = [
    "100% Anti-Tarnish & Waterproof",
    "Handcrafted Ethnic & Daily Luxury",
    `Free Pan-India Delivery Above ₹${storeConfig.commerce.freeShippingThreshold}`,
    "Hypoallergenic & Shower Safe",
    "Fast Dispatch Within 24-48 Hours",
    "Secure UPI, Card & NetBanking Checkout",
  ];

  return (
    <aside
      aria-label="Store Announcement Ticker"
      className="bg-[#1C1917] text-[#FAF5EB] py-2 text-xs font-medium relative overflow-hidden select-none border-b border-[#332E27]"
    >
      <div className="flex items-center overflow-hidden w-full pr-10">
        <div className="animate-marquee flex items-center gap-8 py-0.5 whitespace-nowrap">
          {/* First sequence */}
          {tickerItems.map((item, idx) => (
            <div key={`ticker-a-${idx}`} className="flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-[#C5A059] flex-shrink-0 animate-pulse" />
              <span className="tracking-wide uppercase text-[11px] sm:text-xs font-semibold text-[#F7EEDD]">
                {item}
              </span>
              <span className="text-[#C5A059]/50 text-xs ml-3 font-serif">✦</span>
            </div>
          ))}

          {/* Duplicate sequence for continuous seamless scrolling */}
          {tickerItems.map((item, idx) => (
            <div key={`ticker-b-${idx}`} className="flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-[#C5A059] flex-shrink-0 animate-pulse" />
              <span className="tracking-wide uppercase text-[11px] sm:text-xs font-semibold text-[#F7EEDD]">
                {item}
              </span>
              <span className="text-[#C5A059]/50 text-xs ml-3 font-serif">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right gradient overlay so text glides behind dismiss button gracefully */}
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#1C1917] via-[#1C1917]/90 to-transparent pointer-events-none" />

      <button
        onClick={() => setVisible(false)}
        aria-label="Dismiss banner"
        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#FAF5EB]/70 hover:text-white transition-colors z-10"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
}
