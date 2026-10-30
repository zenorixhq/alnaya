"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { storeConfig } from "@/config/store.config";

export function HeroEditorial() {
  return (
    <section className="relative w-full min-h-[90svh] sm:min-h-screen bg-[#FAF7F2] text-[#1C1917] overflow-hidden select-none flex flex-col justify-between pt-16 sm:pt-20 lg:pt-24">
      {/* 1. Desktop Full-Bleed Unframed Hero Image (Photo only, zero frame) */}
      <div className="hidden lg:block absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <img
          src="/images/founder-aleena-hero.jpg"
          alt="Aleena - Founder & Creative Soul, ALNAYA Timeless Jewellery"
          className="w-full h-full object-cover object-[78%_center] xl:object-[82%_center]"
          loading="eager"
          decoding="sync"
          style={{ imageRendering: "-webkit-optimize-contrast" }}
        />
        {/* Soft Left Ambient Feather: ensures typography on the left wall is 100% crisp while keeping Aleena's photo pristine */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/85 to-transparent w-full max-w-2xl xl:max-w-3xl pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FAF7F2] to-transparent pointer-events-none" />
      </div>

      {/* 2. Mobile Clean Unframed Image (Image only at top, zero border/frame) */}
      <div className="lg:hidden w-full relative aspect-[16/11] sm:aspect-[16/10] overflow-hidden select-none">
        <img
          src="/images/founder-aleena-hero.jpg"
          alt="Aleena - Founder & Creative Soul, ALNAYA Timeless Jewellery"
          className="w-full h-full object-cover object-[72%_center]"
          loading="eager"
          decoding="sync"
        />
        {/* Soft transition into the content section */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FAF7F2] to-transparent pointer-events-none" />
      </div>

      {/* 3. Subtle Corner Botanical Line Art (Inspired by Aleena's original graphic) */}
      <div className="hidden sm:block absolute -bottom-8 -left-8 w-64 h-64 sm:w-80 sm:h-80 opacity-20 pointer-events-none select-none z-0">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-[#9A7B4F]">
          <path
            d="M20,180 C50,150 70,120 75,80 C80,40 100,20 120,20 C100,45 95,80 90,120 C85,150 55,175 20,180 Z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M30,170 C70,140 110,120 150,110 C120,125 90,145 60,170 Z"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            d="M75,80 C110,65 145,55 180,50 C150,70 120,80 90,95"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* 4. Main Editorial Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 my-auto py-6 sm:py-10 lg:py-16">
        
        {/* Subtle Signature Watermark in Background (Requested: subtle signature in background) */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-4 sm:left-2 lg:left-6 font-script text-7xl sm:text-9xl md:text-[11rem] lg:text-[13rem] xl:text-[15rem] text-[#9A7B4F]/[0.08] select-none pointer-events-none -rotate-6 z-0 leading-none tracking-wide whitespace-nowrap">
          Aleena ♡
        </div>

        <div className="relative z-10 w-full lg:max-w-xl xl:max-w-2xl space-y-4 sm:space-y-6 text-left">
          
          {/* Brand Eyebrow (A L N A Y A • TIMELESS JEWELLERY) */}
          <div className="flex items-center gap-3">
            <span className="font-editorial text-sm sm:text-base font-semibold tracking-[0.32em] uppercase text-[#1C1917]">
              {storeConfig?.meta?.name || "ALNAYA"}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B4F]" />
            <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.22em] uppercase text-[#786E5E]">
              TIMELESS JEWELLERY
            </span>
          </div>

          {/* Handwritten Script Kicker (From my heart) */}
          <div className="pt-1">
            <span className="font-script text-3xl sm:text-4xl text-[#9A7B4F] select-none block leading-none">
              From my heart
            </span>
          </div>

          {/* Display Headline (Hi, I'm Aleena) */}
          <div className="space-y-2">
            <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl lg:text-[3.85rem] xl:text-[4.35rem] font-normal tracking-tight text-[#1C1917] leading-[1.06]">
              <span>Hi, I&apos;m </span>
              <span className="font-medium text-[#1C1917]">Aleena</span>
            </h1>

            {/* Subheading / Role with Warm Gold Divider Line */}
            <div className="space-y-2 pt-1">
              <div className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.28em] text-[#786E5E] flex items-center gap-2">
                <span>FOUNDER &amp; CREATIVE SOUL</span>
                <Sparkles className="w-3.5 h-3.5 text-[#9A7B4F]" />
              </div>
              <div className="w-16 h-[1.5px] bg-gradient-to-r from-[#9A7B4F] via-[#C5A059] to-transparent rounded-full" />
            </div>
          </div>

          {/* Founder's Personal Manifesto */}
          <p className="text-sm sm:text-base md:text-[16px] text-[#4A4235] font-light leading-relaxed max-w-xl font-sans">
            I started ALNAYA with a simple belief — that jewellery is more than just an accessory, it&apos;s a part of your story. Every piece is thoughtfully designed to bring out your unique beauty, celebrate your moments, and stay with you for a lifetime.
          </p>

          {/* Handwritten Signature (Aleena ♡) */}
          <div className="pt-1 flex items-baseline gap-2">
            <span className="font-script text-3xl sm:text-4xl text-[#1C1917] tracking-wider select-none">
              Aleena
            </span>
            <span className="text-[#9A7B4F] text-2xl select-none leading-none">♡</span>
          </div>

          {/* Interactive Action Buttons (Using "Browse Collection" as requested) */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#1C1917] hover:bg-[#7E22CE] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
            >
              <span>✦ Shop All Jewelry</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full bg-white hover:bg-[#FAF7F2] text-[#1C1917] hover:text-[#7E22CE] text-xs sm:text-sm font-semibold tracking-wide border border-[#EADBBE] shadow-2xs hover:shadow-sm transition-all duration-300 group"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#9A7B4F] group-hover:text-[#7E22CE] transition-colors" />
              <span>Browse Collection</span>
            </Link>
          </div>

          {/* Quality Commitment Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] sm:text-xs text-[#786E5E]">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              100% Waterproof
            </span>
            <span className="text-[#EADBBE]">•</span>
            <span className="font-medium">Radiant Mirror Gold</span>
            <span className="text-[#EADBBE]">•</span>
            <span className="font-medium">Hypoallergenic Everyday Luxury</span>
          </div>

        </div>
      </div>

      {/* 5. Elegant Curved Wave Transition to About Us Section */}
      <div className="relative z-10 w-full overflow-hidden leading-none pointer-events-none -mb-[1px]">
        <svg
          viewBox="0 0 1440 48"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-6 sm:h-10 text-[#FAF7F2] fill-current"
        >
          <path d="M0,24 C280,42 520,46 760,24 C1000,4 1240,8 1440,24 L1440,48 L0,48 Z" />
        </svg>
      </div>
    </section>
  );
}