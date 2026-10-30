"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { storeConfig } from "@/config/store.config";

export function HeroEditorial() {
  return (
    <section className="relative w-full min-h-[90svh] sm:min-h-screen bg-[#FAF7F2] text-[#1C1917] overflow-hidden select-none flex flex-col justify-between pt-20 sm:pt-24 lg:pt-28">
      {/* 1. Subtle Botanical Line Art (Inspired by Aleena's uploaded banner bottom-left) */}
      <div className="absolute -bottom-8 -left-8 w-64 h-64 sm:w-80 sm:h-80 opacity-25 pointer-events-none select-none z-0">
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

      {/* 2. Soft Ambient Radial Glow */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* 3. Main Editorial Content Container (2-Column Architecture) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 my-auto py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-14 items-center">
          
          {/* Left Column: Founder Manifesto & Typography (7 cols on lg, 6 cols on xl) */}
          <div className="lg:col-span-7 xl:col-span-6 space-y-4 sm:space-y-6 text-left order-2 lg:order-1">
            
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

            {/* Founder's Personal Message */}
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

            {/* Interactive Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#1C1917] hover:bg-[#7E22CE] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
              >
                <span>✦ Explore The Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/products?category=jhumkas"
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full bg-white hover:bg-[#FAF7F2] text-[#1C1917] hover:text-[#7E22CE] text-xs sm:text-sm font-semibold tracking-wide border border-[#EADBBE] shadow-2xs transition-all duration-300 group"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#9A7B4F] group-hover:text-[#7E22CE] transition-colors" />
                <span>Browse Jhumkas</span>
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

          {/* Right Column: Founder's Portrait with Arched Alcove (5 cols on lg, 6 cols on xl) */}
          <div className="lg:col-span-5 xl:col-span-6 relative flex justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
              
              {/* Warm Ambient Glow behind photo */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#9A7B4F]/20 via-purple-500/10 to-transparent rounded-[3rem] blur-2xl -z-10" />

              {/* Luxury Arched Editorial Card (Mirroring the architectural arch behind Aleena) */}
              <div className="relative rounded-t-[14rem] sm:rounded-t-[18rem] rounded-b-3xl overflow-hidden border-2 border-[#EADBBE] shadow-[0_25px_60px_rgba(28,25,23,0.15)] bg-[#EFE6D7] group">
                <img
                  src="/images/founder-aleena-portrait.jpg"
                  alt="Aleena - Founder & Creative Soul, ALNAYA Timeless Jewellery"
                  className="w-full h-auto object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                  loading="eager"
                />

                {/* Floating Atelier Badge on photo */}
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-[#EADBBE]/80 shadow-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center border border-purple-200">
                      <Sparkles className="w-4 h-4 text-[#7E22CE]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1C1917] leading-tight">Aleena</p>
                      <p className="text-[10px] text-[#786E5E] uppercase tracking-wider font-medium">Founder &amp; Creative Soul</p>
                    </div>
                  </div>
                  <Link
                    href="/products?category=jhumkas"
                    className="text-[11px] font-bold text-[#7E22CE] hover:text-[#581C87] flex items-center gap-0.5 group/btn"
                  >
                    <span>Jhumkas</span>
                    <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Elegant Curved Wave Transition to About Us Section */}
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