"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { storeConfig } from "@/config/store.config";

export function WebsiteLoadingAnimation() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Only show on the very first initial load of the website session
    const hasSeen = typeof window !== "undefined" && sessionStorage.getItem("alnaya_intro_shown");
    if (hasSeen) {
      setIsVisible(false);
      return;
    }

    // Sequence the luxury intro animation:
    // 0ms - 900ms: Brand monogram glow, letters reveal, gold accent line expands
    // 900ms: Begin graceful fade-out
    // 1450ms: Remove completely from DOM
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 900);

    const removeTimer = setTimeout(() => {
      setIsVisible(false);
      try {
        sessionStorage.setItem("alnaya_intro_shown", "true");
      } catch (e) {}
    }, 1450);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF7F2] select-none transition-all duration-700 ease-out ${
        isFading
          ? "opacity-0 pointer-events-none scale-[1.03]"
          : "opacity-100 pointer-events-auto"
      }`}
    >
      {/* Soft Ambient Radial Warm Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,173,27,0.09)_0%,transparent_70%)] pointer-events-none" />

      {/* Luxury Brand Monogram Container */}
      <div className="relative flex flex-col items-center text-center space-y-4 px-6">
        
        {/* Floating Sparkle Insignia */}
        <div className="flex items-center justify-center gap-2 text-[#9A7B4F] animate-pulse">
          <span className="text-xs">✦</span>
          <Sparkles className="w-4 h-4 text-[#C5A059]" />
          <span className="text-xs">✦</span>
        </div>

        {/* Brand Name with expanding tracking */}
        <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-light text-[#1C1917] tracking-[0.38em] sm:tracking-[0.48em] uppercase leading-none pl-[0.38em] sm:pl-[0.48em] drop-shadow-xs">
          {storeConfig?.meta?.name || "ALNAYA"}
        </h1>

        {/* Radiant Champagne Gold Line expanding from center */}
        <div className="w-20 sm:w-28 h-[1.5px] bg-gradient-to-r from-transparent via-[#9A7B4F] to-transparent rounded-full transform scale-x-0 animate-[lineExpand_0.8s_cubic-bezier(0.16,1,0.3,1)_0.1s_forwards]" />

        {/* Tagline / Subtitle */}
        <p className="font-glacial text-[10px] sm:text-[11px] font-semibold tracking-[0.28em] uppercase text-[#786E5E] pl-[0.28em] opacity-0 animate-[fadeIn_0.6s_ease-out_0.35s_forwards]">
          TIMELESS FINE JEWELLERY
        </p>
      </div>
    </div>
  );
}
