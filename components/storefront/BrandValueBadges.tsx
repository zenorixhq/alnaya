"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MessageCircle, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { storeConfig } from "@/config/store.config";

export function BrandValueBadges() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const badges = [
    {
      title: "100% Waterproof",
      desc: "Wear in shower, pool, gym & rain with total confidence",
      icon: (
        <svg viewBox="0 0 48 48" className="w-7 h-7 text-[#7E22CE]" fill="none" stroke="currentColor" strokeWidth="2">
          {/* Water Droplet */}
          <path d="M24 8 C24 8 13 22 13 30 C13 36.6 17.9 41 24 41 C30.1 41 35 36.6 35 30 C35 22 24 8 24 8 Z" fill="#F5EEFD" strokeLinecap="round" strokeLinejoin="round" />
          {/* Sparkle */}
          <path d="M24 23 Q24 27 27 27 Q24 27 24 31 Q24 27 21 27 Q24 27 24 23 Z" fill="#7E22CE" stroke="none" />
        </svg>
      ),
    },
    {
      title: "Hypoallergenic",
      desc: "Gentle on sensitive skin, 100% nickel & lead free",
      icon: (
        <svg viewBox="0 0 48 48" className="w-7 h-7 text-[#7E22CE]" fill="none" stroke="currentColor" strokeWidth="2">
          {/* Organic Leaf Motif */}
          <path d="M14 34 C14 34 17 21 34 14 C34 14 34 31 20 34 Z" fill="#F5EEFD" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 34 Q22 26 34 14" strokeLinecap="round" />
          <path d="M22 26 Q27 24 29 20" strokeLinecap="round" />
          <circle cx="36" cy="12" r="2.5" fill="#7E22CE" stroke="none" />
        </svg>
      ),
    },
    {
      title: "Artisan Handcrafted",
      desc: "Meticulously finished with hallmark jewelry precision",
      icon: (
        <svg viewBox="0 0 48 48" className="w-7 h-7 text-[#7E22CE]" fill="none" stroke="currentColor" strokeWidth="2">
          {/* Multifaceted Diamond Jewel */}
          <path d="M16 14 L32 14 L40 23 L24 38 L8 23 Z" fill="#F5EEFD" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="8" y1="23" x2="40" y2="23" />
          <line x1="16" y1="14" x2="24" y2="38" />
          <line x1="32" y1="14" x2="24" y2="38" />
          {/* Sparkle */}
          <path d="M38 10 Q38 13 41 13 Q38 13 38 16 Q38 13 35 13 Q38 13 38 10 Z" fill="#7E22CE" stroke="none" />
        </svg>
      ),
    },
    {
      title: "Lasting Luster",
      desc: "Deep radiant finish crafted for everyday elegance",
      icon: (
        <svg viewBox="0 0 48 48" className="w-7 h-7 text-[#7E22CE]" fill="none" stroke="currentColor" strokeWidth="2">
          {/* Starburst / Sunburst Emblem */}
          <circle cx="24" cy="24" r="8" fill="#F5EEFD" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="24" y1="6" x2="24" y2="12" strokeLinecap="round" />
          <line x1="24" y1="36" x2="24" y2="42" strokeLinecap="round" />
          <line x1="6" y1="24" x2="12" y2="24" strokeLinecap="round" />
          <line x1="36" y1="24" x2="42" y2="24" strokeLinecap="round" />
          <line x1="11" y1="11" x2="15.5" y2="15.5" strokeLinecap="round" />
          <line x1="32.5" y1="32.5" x2="37" y2="37" strokeLinecap="round" />
          <line x1="11" y1="37" x2="15.5" y2="32.5" strokeLinecap="round" />
          <line x1="32.5" y1="15.5" x2="37" y2="11" strokeLinecap="round" />
          <circle cx="24" cy="24" r="3" fill="#7E22CE" stroke="none" />
        </svg>
      ),
    },
    {
      title: "Safe Express Delivery",
      desc: "Secure insured door-to-door delivery across India",
      icon: (
        <svg viewBox="0 0 48 48" className="w-7 h-7 text-[#7E22CE]" fill="none" stroke="currentColor" strokeWidth="2">
          {/* Protective Shield */}
          <path d="M24 6 L38 12 V24 C38 33 24 41 24 41 C24 41 10 33 10 24 V12 Z" strokeLinecap="round" strokeLinejoin="round" fill="#F5EEFD" />
          {/* Sparkle */}
          <path d="M24 16 Q24 23 30 23 Q24 23 24 30 Q24 23 18 23 Q24 23 24 16 Z" fill="#7E22CE" stroke="none" />
        </svg>
      ),
    },
  ];

  // Auto-scroll every 3 seconds unless paused by touch or hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % badges.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused, badges.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) {
      setIsPaused(false);
      return;
    }
    const delta = touchStartX.current - touchEndX.current;
    if (delta > 40) {
      setActiveIndex((prev) => (prev + 1) % badges.length);
    } else if (delta < -40) {
      setActiveIndex((prev) => (prev - 1 + badges.length) % badges.length);
    }
    touchStartX.current = null;
    touchEndX.current = null;
    setIsPaused(false);
  };

  return (
    <section id="brand-values" className="w-full py-8 sm:py-10 md:py-12 bg-[#FAF7F2] border-b border-[#EADBBE]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Luxury Card Container */}
        <div className="rounded-3xl bg-[#FFFDF9] border border-[#EADBBE] shadow-[0_8px_30px_rgb(126,34,206,0.06)] p-5 sm:p-8 lg:p-10 space-y-6 sm:space-y-8">
          
          {/* MOBILE ONLY: Paginated 1-by-1 Carousel (< sm) */}
          <div
            className="sm:hidden relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Carousel Stage Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#FAF5FF]/80 to-[#FAF5FF]/30 border border-purple-200/80 p-6 text-center shadow-sm min-h-[220px] flex flex-col items-center justify-center">
              {/* Header Pill: Step Counter */}
              <div className="absolute top-3 right-3 text-[10px] font-semibold text-[#6B21A8] bg-[#FFFDF9] border border-purple-200 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3 h-3 text-[#7E22CE]" />
                <span>{activeIndex + 1} of {badges.length}</span>
              </div>

              {/* Quality Content */}
              <div
                key={activeIndex}
                className="flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300 space-y-3"
              >
                {/* Circular Purple Icon Container */}
                <div className="relative w-16 h-16 rounded-full border-[1.5px] border-[#7E22CE] flex items-center justify-center p-3 bg-gradient-to-br from-[#FFFDF9] to-[#F3E8FF] shadow-[0_4px_16px_rgba(126,34,206,0.18)]">
                  <div className="absolute inset-[3px] rounded-full border border-purple-300/60 pointer-events-none" />
                  {badges[activeIndex].icon}
                </div>

                <div className="space-y-1">
                  <h4 className="font-editorial text-base font-semibold tracking-wide text-[#1C1917]">
                    {badges[activeIndex].title}
                  </h4>
                  <p className="text-xs text-[#581C87]/80 leading-relaxed font-light max-w-[240px] mx-auto">
                    {badges[activeIndex].desc}
                  </p>
                </div>
              </div>

              {/* Prev / Next Circular Navigation Arrows */}
              <button
                onClick={() => {
                  setIsPaused(true);
                  setActiveIndex((prev) => (prev - 1 + badges.length) % badges.length);
                }}
                aria-label="Previous Quality"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FFFDF9] border border-purple-200 text-[#6B21A8] hover:text-[#1C1917] hover:bg-[#FAF5FF] shadow-sm flex items-center justify-center transition-all active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setIsPaused(true);
                  setActiveIndex((prev) => (prev + 1) % badges.length);
                }}
                aria-label="Next Quality"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FFFDF9] border border-purple-200 text-[#6B21A8] hover:text-[#1C1917] hover:bg-[#FAF5FF] shadow-sm flex items-center justify-center transition-all active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Pagination Dot Indicators */}
            <div className="flex items-center justify-center gap-2 pt-3.5">
              {badges.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsPaused(true);
                    setActiveIndex(idx);
                  }}
                  aria-label={`Go to quality ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    idx === activeIndex
                      ? "w-6 h-2 bg-[#7E22CE] shadow-xs"
                      : "w-2 h-2 bg-purple-200 hover:bg-[#7E22CE]/80"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* DESKTOP & TABLET: Clean 5-in-a-row Luxury Grid (sm:) */}
          <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8 items-start">
            {badges.map((badge, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center group cursor-default"
              >
                {/* Circular Purple Icon Container */}
                <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-full border-[1.5px] border-[#7E22CE] flex items-center justify-center p-3 mb-3 bg-gradient-to-br from-[#FFFDF9] to-[#F3E8FF] shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1 group-hover:shadow-[0_8px_24px_rgba(126,34,206,0.22)]">
                  {/* Inner Delicate Purple Ring */}
                  <div className="absolute inset-[3px] rounded-full border border-purple-300/60 pointer-events-none" />
                  {badge.icon}
                </div>

                {/* Title Matching Brand Card */}
                <h4 className="font-editorial text-sm lg:text-base font-semibold tracking-wide text-[#1C1917] group-hover:text-[#6B21A8] transition-colors">
                  {badge.title}
                </h4>
                <p className="text-[11px] text-[#581C87]/80 leading-tight font-light mt-1 max-w-[150px]">
                  {badge.desc}
                </p>
              </div>
            ))}
          </div>

          {/* 2. Elegant Pill Banner - Customer Care */}
          <div className="pt-2 border-t border-[#EADBBE]/80">
            <Link
              href={`https://wa.me/${storeConfig.brand.contact.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-row items-center justify-between gap-2.5 sm:gap-4 px-3.5 sm:px-6 py-2.5 sm:py-3.5 rounded-2xl bg-[#FAF5FF] hover:bg-[#F3E8FF] border border-[#7E22CE]/40 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide sm:tracking-widest uppercase text-[#581C87] truncate">
                <span className="text-[#7E22CE] text-[10px] sm:text-xs shrink-0">✦</span>
                <span className="truncate">CUSTOMER CARE & STYLING ASSISTANCE</span>
                <span className="text-[#7E22CE] text-[10px] sm:text-xs hidden md:inline shrink-0">✦</span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-4 py-1.5 rounded-full bg-[#1C1917] text-[#FAF5EB] group-hover:bg-[#000000] text-[11px] sm:text-xs md:text-sm font-bold tracking-wider transition-colors shadow-sm shrink-0 whitespace-nowrap">
                <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#25D366] fill-[#25D366]" />
                <span>{storeConfig.brand.contact.phone}</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}