"use client";

import React from "react";
import Link from "next/link";
import { storeConfig } from "@/config/store.config";

interface BrandLogoProps {
  variant?: "full" | "compact" | "emblem-only";
  showTagline?: boolean;
  className?: string;
  theme?: "light" | "dark";
}

export function BrandLogo({
  variant = "full",
  showTagline = true,
  className = "",
  theme = "light",
}: BrandLogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}
      aria-label="Alnaya.in Home"
    >
      {/* 1. Official Alnaya Circular Emblem */}
      <div className="relative w-9 h-9 sm:w-11 sm:h-11 flex-shrink-0 flex items-center justify-center rounded-full overflow-hidden border border-primary/25 shadow-sm group-hover:scale-105 transition-all duration-300">
        <img
          src="/alnaya-logo.png"
          alt="Alnaya Logo"
          className="w-full h-full object-cover"
        />
      </div>

      {/* 2. Brand Wordmark & Tagline */}
      {variant !== "emblem-only" && (
        <div className="flex flex-col text-left justify-center">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-serif-luxury text-lg sm:text-xl font-bold tracking-[0.16em] uppercase transition-colors ${
                theme === "dark" ? "text-white" : "text-foreground"
              }`}
            >
              ALNAYA<span className={`text-sm ${theme === "dark" ? "text-purple-300 font-semibold" : "text-primary font-light"}`}>.IN</span>
            </span>
            <span className="text-[10px] text-[#7E22CE]">✦</span>
          </div>
          {showTagline && (
            <span
              className={`font-editorial italic text-[10px] sm:text-[11.5px] tracking-wide mt-[-2px] truncate max-w-[210px] sm:max-w-none ${
                theme === "dark" ? "text-purple-200/90" : "text-primary/90"
              }`}
            >
              {storeConfig.meta.tagline}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
