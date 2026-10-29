"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { storeConfig } from "@/config/store.config";

export function HeroEditorial() {
  return (
    <section className="relative w-full min-h-screen bg-[#070A10] text-white overflow-hidden select-none flex flex-col justify-between pt-20 sm:pt-24 md:pt-28">
      {/* 1. Optimized Visual Background Showcase (Scaled down, positioned upward, full necklace visible) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none flex items-center justify-start">
        {/* Left-Aligned High-Res Visual Frame */}
        <div className="relative w-full lg:w-[62%] h-full flex items-center lg:items-start justify-center lg:justify-start pt-2 lg:pt-6 pl-0 lg:pl-8">
          <img
            src="/images/hero-royal-necklace.jpg"
            alt="Royal Multi-Gemstone Teardrop Necklace on Velvet"
            loading="eager"
            decoding="sync"
            className="max-h-[72vh] sm:max-h-[80vh] lg:max-h-[86vh] w-auto max-w-full object-contain object-top lg:object-left-top transform -translate-y-2 sm:-translate-y-4 lg:-translate-y-6 scale-[0.92] sm:scale-[0.88] lg:scale-[0.84] drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
            style={{ imageRendering: "-webkit-optimize-contrast" }}
          />

          {/* Smooth Velvet Feathering into Background */}
          <div className="absolute inset-y-0 right-0 w-32 sm:w-48 bg-gradient-to-r from-transparent to-[#070A10] pointer-events-none hidden lg:block" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#070A10] via-[#070A10]/60 to-transparent pointer-events-none" />
        </div>

        {/* Global Lighting Vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#070A10]/35 to-[#070A10]/95 pointer-events-none hidden lg:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070A10] via-black/40 to-black/30 pointer-events-none lg:hidden" />
      </div>

      {/* 2. Main Editorial Typography & Action Container (Placed on the right side) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 my-auto flex justify-end">
        <div className="w-full sm:max-w-lg lg:max-w-xl xl:max-w-2xl text-left space-y-4 sm:space-y-6 pt-4 sm:pt-0">
          
          {/* Subtle Atelier / Brand Eyebrow */}
          <div className="flex items-center gap-2">
            <span className="w-6 h-[1px] bg-amber-400/80" />
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] font-medium text-amber-200/90 flex items-center gap-1.5">
              <span>{storeConfig?.meta?.name || "ALNAYA"} ATELIER</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </span>
          </div>

          {/* Main Headline (All-caps Editorial Serif typography) */}
          <h1 className="font-editorial text-4xl xs:text-5xl sm:text-6xl lg:text-[4.2rem] xl:text-[4.75rem] font-normal tracking-tight text-white leading-[1.04] uppercase drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)]">
            <span>Light, Rendered</span> <br />
            <span className="font-editorial italic font-light text-white/95">Eternal.</span>
          </h1>

          {/* Subtitle Description - Zero mention of 304, 306, anti-tarnish, or PVD */}
          <p className="text-sm sm:text-base md:text-[17px] text-white/85 font-light leading-relaxed max-w-lg drop-shadow-md font-sans">
            Handcrafted teardrop gemstones set in radiant 18K gold finish. Designed by master artisans for everyday royalty and timeless luxury.
          </p>

          {/* Signature Featured Piece Spotlight */}
          <div className="pt-1">
            <Link
              href="/products/celestial-jewel-drop-hanging-chain"
              className="inline-flex items-center gap-2.5 px-3.5 sm:px-4 py-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/25 hover:border-amber-400/70 text-xs text-white/90 transition-all duration-300 group shadow-lg"
            >
              <img
                src="/images/hero-royal-necklace.jpg"
                alt="Celestial Jewel Drop Hanging Chain"
                className="w-6 h-6 rounded-full object-cover border border-amber-400/70 group-hover:scale-110 transition-transform"
              />
              <span className="font-medium truncate max-w-[220px] sm:max-w-none">
                Featured: Celestial Jewel Drop Hanging Chain • ₹299
              </span>
              <ArrowRight className="w-3 h-3 text-amber-300 group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>
          </div>

          {/* Pill Action Button */}
          <div className="pt-2 sm:pt-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-3 px-8 sm:px-9 py-3.5 sm:py-4 rounded-full bg-[#0E1E38] hover:bg-[#152B4F] text-white text-xs sm:text-sm font-medium tracking-wide border border-blue-400/40 shadow-[0_10px_35px_rgba(14,30,56,0.7)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
            >
              <span>Discover the Collection</span>
              <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Reference-Matched Organic Curved Wave Divider at the bottom */}
      <div className="relative z-10 w-full overflow-hidden leading-none pointer-events-none -mb-[1px]">
        <svg
          viewBox="0 0 1440 110"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-12 sm:h-20 md:h-24 lg:h-28 text-[#FAF7F2] fill-current"
        >
          <path d="M0,70 C280,105 520,110 760,65 C1000,20 1240,25 1440,65 L1440,110 L0,110 Z" />
        </svg>
      </div>
    </section>
  );
}