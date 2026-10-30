"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { storeConfig } from "@/config/store.config";

export function BrandValueBadges() {
  const [activeMobileIdx, setActiveMobileIdx] = useState(0);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const badges = [
    {
      id: "waterproof",
      title: "100% Waterproof",
      desc: "Wear in shower, pool, gym & rain with total peace of mind",
      tag: "All-Day Wear",
      icon: (
        <svg viewBox="0 0 48 48" className="w-8 h-8 text-[#7E22CE]" fill="none" stroke="currentColor" strokeWidth="1.35">
          {/* Teardrop Jewel Contour */}
          <path d="M24 6 C24 6 12 21 12 30.5 C12 37.4 17.4 42 24 42 C30.6 42 36 37.4 36 30.5 C36 21 24 6 24 6 Z" strokeLinecap="round" strokeLinejoin="round" />
          {/* Inner Facet / Refraction Lines */}
          <path d="M24 13 L18 29 C20.5 32 23 33 24 33 C25 33 27.5 32 30 29 Z" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
          {/* Delicate Surface Sparkle */}
          <path d="M24 20 L25 23.5 L28.5 24.5 L25 25.5 L24 29 L23 25.5 L19.5 24.5 L23 23.5 Z" fill="#7E22CE" stroke="none" />
          {/* Water Ripple Base */}
          <path d="M7 43 C12 41 18 41 24 41 C30 41 36 41 41 43" strokeLinecap="round" opacity="0.4" strokeDasharray="1 3" />
        </svg>
      ),
    },
    {
      id: "hypoallergenic",
      title: "Pure & Hypoallergenic",
      desc: "Gentle on delicate skin, 100% nickel, lead & irritation free",
      tag: "Sensitive Skin",
      icon: (
        <svg viewBox="0 0 48 48" className="w-8 h-8 text-[#7E22CE]" fill="none" stroke="currentColor" strokeWidth="1.35">
          {/* Twin Botanical Laurel Leaves */}
          <path d="M13 36 C13 36 15 22 35 13 C35 13 33 29 17 36 Z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 35 Q23 26 35 13" strokeLinecap="round" />
          {/* Delicate Secondary Leaf */}
          <path d="M22 27 C22 27 28 26 33 20 C33 20 28 17 24 22 Z" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
          {/* Gentle Pearl / Purity Halo */}
          <circle cx="36" cy="12" r="2.5" fill="#7E22CE" stroke="none" />
          <circle cx="24" cy="24" r="18" strokeLinecap="round" strokeDasharray="2 4" opacity="0.35" />
        </svg>
      ),
    },
    {
      id: "artisan",
      title: "Artisan Handcrafted",
      desc: "Meticulously hand-finished with authentic fine jewelry precision",
      tag: "Master Cut",
      icon: (
        <svg viewBox="0 0 48 48" className="w-8 h-8 text-[#7E22CE]" fill="none" stroke="currentColor" strokeWidth="1.35">
          {/* Brilliant-Cut Solitaire Diamond */}
          <path d="M15 14 L33 14 L41 23 L24 40 L7 23 Z" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="7" y1="23" x2="41" y2="23" />
          <line x1="15" y1="14" x2="24" y2="40" />
          <line x1="33" y1="14" x2="24" y2="40" />
          <line x1="24" y1="14" x2="24" y2="23" />
          <line x1="15" y1="14" x2="19" y2="23" />
          <line x1="33" y1="14" x2="29" y2="23" />
          {/* Starburst Glint */}
          <path d="M38 9 L39 12 L42 13 L39 14 L38 17 L37 14 L34 13 L37 12 Z" fill="#7E22CE" stroke="none" />
        </svg>
      ),
    },
    {
      id: "radiance",
      title: "Lasting Luster",
      desc: "Deep luminous radiant finish crafted to never fade or darken",
      tag: "Everlasting",
      icon: (
        <svg viewBox="0 0 48 48" className="w-8 h-8 text-[#7E22CE]" fill="none" stroke="currentColor" strokeWidth="1.35">
          {/* Concentric Halo Orbit */}
          <circle cx="24" cy="24" r="16" strokeLinecap="round" strokeDasharray="2 3" opacity="0.45" />
          {/* 8-Point Radiant Celestial Star */}
          <path d="M24 5 L26.5 18.5 L39.5 15.5 L30 24 L39.5 32.5 L26.5 29.5 L24 43 L21.5 29.5 L8.5 32.5 L18 24 L8.5 15.5 L21.5 18.5 Z" strokeLinecap="round" strokeLinejoin="round" />
          {/* Central Diamond Core */}
          <circle cx="24" cy="24" r="3.5" fill="#7E22CE" stroke="none" />
          <circle cx="24" cy="24" r="7" strokeLinecap="round" opacity="0.6" />
        </svg>
      ),
    },
    {
      id: "delivery",
      title: "Safe Express Delivery",
      desc: "Tamper-proof insured packaging dispatched fast across all of India",
      tag: "Insured Transit",
      icon: (
        <svg viewBox="0 0 48 48" className="w-8 h-8 text-[#7E22CE]" fill="none" stroke="currentColor" strokeWidth="1.35">
          {/* Royal Wax Seal / Heraldic Shield */}
          <path d="M24 6 L38 11.5 V23.5 C38 32.5 24 41 24 41 C24 41 10 32.5 10 23.5 V11.5 Z" strokeLinecap="round" strokeLinejoin="round" />
          {/* Inner Regal Crown / Check Emblem */}
          <path d="M18 23.5 L22.5 28 L30 18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          {/* Delicate Seal Ribbons */}
          <path d="M19 40 L16 44 L20 42.5 L24 44 L24 41" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
          <path d="M29 40 L32 44 L28 42.5 L24 44" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
        </svg>
      ),
    },
  ];

  // Sync mobile scroll position to active dot index
  const handleMobileScroll = () => {
    if (mobileScrollRef.current) {
      const { scrollLeft, clientWidth } = mobileScrollRef.current;
      const idx = Math.round(scrollLeft / (clientWidth * 0.75));
      setActiveMobileIdx(Math.min(badges.length - 1, Math.max(0, idx)));
    }
  };

  const scrollMobile = (direction: "left" | "right") => {
    if (mobileScrollRef.current) {
      const { clientWidth } = mobileScrollRef.current;
      const delta = direction === "left" ? -clientWidth * 0.75 : clientWidth * 0.75;
      mobileScrollRef.current.scrollBy({ left: delta, behavior: "smooth" });
    }
  };

  return (
    <section id="brand-values" className="w-full py-12 sm:py-16 md:py-20 bg-[#FAF7F2] border-b border-[#EADBBE]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        
        {/* Section Editorial Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-[#7E22CE] block">
            MAISON STANDARDS
          </span>
          <h3 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-normal text-[#1C1917] tracking-tight">
            The Alnaya Commitments
          </h3>
          <p className="text-xs sm:text-sm text-[#5C5346] font-light max-w-md mx-auto leading-relaxed">
            Every piece is thoughtfully designed to blend modern elegance with lasting durability.
          </p>
        </div>

        {/* MOBILE ( < sm ): Elegant Horizontal Snap Carousel with Indicators */}
        <div className="sm:hidden relative">
          <div
            ref={mobileScrollRef}
            onScroll={handleMobileScroll}
            className="flex gap-3.5 overflow-x-auto snap-x snap-mandatory pb-3 pt-1 px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {badges.map((badge, idx) => (
              <div
                key={badge.id}
                className="w-[78vw] max-w-[300px] flex-shrink-0 snap-center rounded-2xl bg-[#FFFDF9] border border-[#EADBBE] p-6 text-center shadow-[0_4px_20px_rgba(126,34,206,0.05)] flex flex-col items-center justify-between space-y-4"
              >
                {/* Top Badge Tag */}
                <span className="text-[9px] font-semibold tracking-widest uppercase text-[#7E22CE] bg-[#FAF5FF] border border-purple-200/60 px-2.5 py-0.5 rounded-full">
                  {badge.tag}
                </span>

                {/* Insignia Medallion */}
                <div className="relative w-18 h-18 rounded-2xl border border-purple-200/80 bg-gradient-to-br from-[#FFFDF9] via-[#FAF5FF] to-[#F3E8FF] flex items-center justify-center p-3.5 shadow-sm">
                  <div className="absolute inset-[3px] rounded-xl border border-purple-300/40 pointer-events-none" />
                  {badge.icon}
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  <h4 className="font-editorial text-base font-semibold tracking-wide text-[#1C1917]">
                    {badge.title}
                  </h4>
                  <p className="text-xs text-[#5C5346] font-light leading-relaxed">
                    {badge.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Dot Navigation */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {badges.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (mobileScrollRef.current) {
                    const { clientWidth } = mobileScrollRef.current;
                    mobileScrollRef.current.scrollTo({
                      left: idx * (clientWidth * 0.75),
                      behavior: "smooth",
                    });
                  }
                }}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  idx === activeMobileIdx
                    ? "w-6 h-1.5 bg-[#7E22CE]"
                    : "w-1.5 h-1.5 bg-purple-200 hover:bg-[#7E22CE]/60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* DESKTOP & TABLET ( sm+ ): 5-Column Haute Joaillerie Showcase */}
        <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 items-stretch">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="group relative rounded-2xl bg-[#FFFDF9] border border-[#EADBBE] hover:border-[#7E22CE]/60 p-6 lg:p-7 text-center shadow-[0_4px_16px_rgba(28,25,23,0.03)] hover:shadow-[0_16px_36px_rgba(126,34,206,0.12)] hover:-translate-y-1.5 transition-all duration-500 ease-out flex flex-col items-center justify-between cursor-default"
            >
              {/* Top Mini Pill */}
              <span className="text-[9px] font-semibold tracking-widest uppercase text-[#7E22CE] bg-[#FAF5FF] border border-purple-200/60 px-2.5 py-0.5 rounded-full mb-4">
                {badge.tag}
              </span>

              {/* Insignia Medallion */}
              <div className="relative w-18 h-18 lg:w-20 lg:h-20 rounded-2xl border border-purple-200/80 bg-gradient-to-br from-[#FFFDF9] via-[#FAF5FF] to-[#F3E8FF] flex items-center justify-center p-3.5 mb-4 shadow-sm group-hover:scale-105 group-hover:border-[#7E22CE] group-hover:shadow-[0_8px_24px_rgba(126,34,206,0.2)] transition-all duration-500">
                <div className="absolute inset-[3px] rounded-xl border border-purple-300/40 group-hover:border-purple-400/60 transition-colors pointer-events-none" />
                {badge.icon}
              </div>

              {/* Title & Benefit */}
              <div className="space-y-1.5 flex-1 flex flex-col justify-start">
                <h4 className="font-editorial text-base lg:text-lg font-semibold tracking-wide text-[#1C1917] group-hover:text-[#7E22CE] transition-colors leading-snug">
                  {badge.title}
                </h4>
                <p className="text-xs text-[#5C5346] font-light leading-relaxed mt-1">
                  {badge.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp Customer Care & Styling Assistance Banner */}
        <div className="pt-2">
          <Link
            href={`https://wa.me/${storeConfig.brand.contact.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-row items-center justify-between gap-3 sm:gap-4 px-4 sm:px-8 py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-[#FAF5FF] via-[#FFFDF9] to-[#FAF5FF] hover:from-[#F3E8FF] hover:to-[#F3E8FF] border border-[#7E22CE]/35 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-2 text-[11px] sm:text-xs md:text-sm font-semibold tracking-wide sm:tracking-widest uppercase text-[#581C87] truncate">
              <span className="text-[#7E22CE] text-xs shrink-0">✦</span>
              <span className="truncate">CUSTOMER CARE & STYLING ASSISTANCE</span>
              <span className="text-[#7E22CE] text-xs hidden md:inline shrink-0">✦</span>
            </div>

            <div className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#1C1917] text-[#FAF5EB] group-hover:bg-[#000000] text-xs sm:text-sm font-bold tracking-wider transition-colors shadow-sm shrink-0 whitespace-nowrap">
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#25D366] fill-[#25D366]" />
              <span>{storeConfig.brand.contact.phone}</span>
            </div>
          </Link>
        </div>

      </div>
    </section>
  );
}