"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { storeConfig } from "@/config/store.config";

export function HeroEditorial() {
  return (
    <section className="relative w-full min-h-screen h-[100svh] bg-[#0A0D14] text-white overflow-hidden select-none flex flex-col justify-between pt-20 sm:pt-24 md:pt-28">
      {/* 1. Full-Bleed Video Background covering the entire screen right from the top edge */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/images/hero-necklace.png"
          className="w-full h-full object-cover object-center scale-[1.01]"
        >
          <source src="/videos/hero-jewelry.mp4" type="video/mp4" />
        </video>

        {/* Dynamic Luxury Vignette: Clear on left for emerald pendant, enriched on right for white typography contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-black/25 to-black/75 pointer-events-none" />
        <div className="absolute inset-0 bg-black/15 pointer-events-none" />
      </div>

      {/* 2. Main Content Container (Title, Description & Pill Button Placed on Right Side) */}
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
          <h1 className="font-editorial text-4xl xs:text-5xl sm:text-6xl lg:text-[4.2rem] xl:text-[4.75rem] font-normal tracking-tight text-white leading-[1.04] uppercase drop-shadow-[0_2px_16px_rgba(0,0,0,0.85)]">
            <span>Light, Rendered</span> <br />
            <span className="font-editorial italic font-light text-white/95">Eternal.</span>
          </h1>

          {/* Subtitle Description */}
          <p className="text-sm sm:text-base md:text-[17px] text-white/85 font-light leading-relaxed max-w-lg drop-shadow-sm font-sans">
            Hand-set emerald stones and 18K radiant gold finish, handcrafted by our artisans for everyday luxury and timeless statement.
          </p>

          {/* Signature Featured Piece Spotlight (Using the uploaded emerald necklace) */}
          <div className="pt-1">
            <Link
              href="/products/imperial-emerald-cuban-pendant"
              className="inline-flex items-center gap-2.5 px-3.5 sm:px-4 py-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 hover:border-amber-400/60 text-xs text-white/90 transition-all duration-300 group shadow-lg"
            >
              <img
                src="/images/emerald-necklace-product.jpg"
                alt="Imperial Emerald Cuban Pendant"
                className="w-6 h-6 rounded-full object-cover border border-amber-400/70 group-hover:scale-110 transition-transform"
              />
              <span className="font-medium truncate max-w-[220px] sm:max-w-none">
                Featured: Imperial Emerald Cuban Pendant • ₹1,899
              </span>
              <ArrowRight className="w-3 h-3 text-amber-300 group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>
          </div>

          {/* Pill Action Button (Dark emerald jewel tone) */}
          <div className="pt-2 sm:pt-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-3 px-8 sm:px-9 py-3.5 sm:py-4 rounded-full bg-[#0D3831] hover:bg-[#124B42] text-white text-xs sm:text-sm font-medium tracking-wide border border-emerald-400/30 shadow-[0_10px_30px_rgba(13,56,49,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
            >
              <span>Discover the Collection</span>
              <ArrowRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-1 transition-transform" />
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
          {/* Smooth couture wave curve matching reference design */}
          <path d="M0,70 C280,105 520,110 760,65 C1000,20 1240,25 1440,65 L1440,110 L0,110 Z" />
        </svg>
      </div>
    </section>
  );
}
