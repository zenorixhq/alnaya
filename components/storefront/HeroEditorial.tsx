"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { storeConfig } from "@/config/store.config";

export function HeroEditorial() {
  return (
    <section className="relative w-full bg-[#FAF7F2] text-[#1C1917] overflow-hidden select-none border-b border-[#EADBBE]/60 lg:h-[100svh] lg:max-h-[100svh] flex flex-col justify-between">
      
      {/* ========================================================= */}
      {/* DESKTOP HERO: Strictly enclosed within the window (100svh) */}
      {/* ========================================================= */}
      <div className="hidden lg:block absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <img
          src="/images/founder-aleena-saree-hero.jpg"
          alt="Aleena - Founder & Creative Soul, ALNAYA Timeless Jewellery"
          className="w-full h-full object-cover object-[80%_center] xl:object-[84%_center]"
          loading="eager"
          decoding="sync"
          style={{ imageRendering: "-webkit-optimize-contrast" }}
        />
        {/* Soft Left Ambient Feather: blends smoothly into the #FAF7F2 canvas */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/80 to-transparent w-full max-w-2xl xl:max-w-3xl pointer-events-none" />
      </div>

      {/* Desktop Content Container (Vertically centered, fits 100% within viewport without scrolling) */}
      <div className="hidden lg:flex relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-full flex-col justify-center pt-20 pb-6">
        
        {/* Subtle Signature Watermark in Background (Real uploaded signature, reduced opacity, minimal blend) */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-6 xl:-left-8 w-[480px] xl:w-[580px] opacity-[0.06] select-none pointer-events-none -rotate-6 z-0 leading-none">
          <img
            src="/images/aleena-signature-gold.png"
            alt=""
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Left Column Typography (Strictly sized to fit window) */}
        <div className="relative z-10 w-full max-w-lg lg:max-w-xl xl:max-w-2xl space-y-3.5 xl:space-y-4 text-left">
          
          {/* Brand Eyebrow (A L N A Y A • TIMELESS JEWELLERY) */}
          <div className="flex items-center gap-3">
            <span className="font-editorial text-sm font-semibold tracking-[0.32em] uppercase text-[#1C1917]">
              {storeConfig?.meta?.name || "ALNAYA"}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B4F]" />
            <span className="text-[10px] font-medium tracking-[0.22em] uppercase text-[#786E5E]">
              TIMELESS JEWELLERY
            </span>
          </div>

          {/* Handwritten Script Kicker (From my heart) */}
          <div>
            <span className="font-script text-2xl lg:text-3xl text-[#9A7B4F] select-none block leading-none">
              From my heart
            </span>
          </div>

          {/* Display Headline (Hi, I'm Aleena) */}
          <div className="space-y-1.5">
            <h1 className="font-editorial text-4xl lg:text-5xl xl:text-[3.85rem] font-normal tracking-tight text-[#1C1917] leading-[1.06]">
              <span>Hi, I&apos;m </span>
              <span className="font-medium text-[#1C1917]">Aleena</span>
            </h1>

            {/* Subheading / Role with Warm Gold Divider Line */}
            <div className="space-y-1.5 pt-0.5">
              <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#786E5E] flex items-center gap-2">
                <span>FOUNDER &amp; CREATIVE SOUL</span>
                <Sparkles className="w-3.5 h-3.5 text-[#9A7B4F]" />
              </div>
              <div className="w-14 h-[1.5px] bg-gradient-to-r from-[#9A7B4F] via-[#C5A059] to-transparent rounded-full" />
            </div>
          </div>

          {/* Founder's Personal Manifesto */}
          <p className="text-xs lg:text-sm xl:text-[15px] text-[#4A4235] font-light leading-relaxed max-w-xl font-sans">
            I started ALNAYA with a simple belief — that jewellery is more than just an accessory, it&apos;s a part of your story. Every piece is thoughtfully designed to bring out your unique beauty, celebrate your moments, and stay with you for a lifetime.
          </p>

          {/* Scanned Real Signature */}
          <div className="pt-0.5">
            <img
              src="/images/aleena-signature-dark.png"
              alt="Aleena Signature"
              className="h-9 lg:h-10 w-auto object-contain select-none opacity-95"
            />
          </div>

          {/* Interactive Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#1C1917] hover:bg-[#7E22CE] text-white text-xs lg:text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
            >
              <span>✦ Shop All Jewelry</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-[#FAF7F2] text-[#1C1917] hover:text-[#7E22CE] text-xs lg:text-sm font-semibold tracking-wide border border-[#EADBBE] shadow-2xs hover:shadow-sm transition-all duration-300 group"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#9A7B4F] group-hover:text-[#7E22CE] transition-colors" />
              <span>Browse Collection</span>
            </Link>
          </div>

          {/* Quality Commitment Badges */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1 text-[11px] text-[#786E5E]">
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

      {/* ========================================================================= */}
      {/* MOBILE HERO: Image only at top, then title, subtitle, story & buttons after */}
      {/* ========================================================================= */}
      <div className="lg:hidden flex flex-col w-full pt-16">
        
        {/* 1. Mobile Image Only (Unframed raw photo, perfectly proportioned) */}
        <div className="w-full relative aspect-[16/10] sm:aspect-[16/9] max-h-[38vh] overflow-hidden select-none">
          <img
            src="/images/founder-aleena-saree-hero.jpg"
            alt="Aleena - Founder & Creative Soul, ALNAYA Timeless Jewellery"
            className="w-full h-full object-cover object-[80%_center]"
            loading="eager"
            decoding="sync"
          />
          {/* Subtle bottom transition feather into content */}
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#FAF7F2] to-transparent pointer-events-none" />
        </div>

        {/* 2. Mobile Typography & Actions (Title, subtitle, story and buttons within mobile hero) */}
        <div className="relative z-10 px-5 sm:px-8 py-5 sm:py-6 space-y-3 text-left">
          
          {/* Subtle signature watermark in background on mobile */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-72 sm:w-80 opacity-[0.06] select-none pointer-events-none -rotate-6 z-0">
            <img
              src="/images/aleena-signature-gold.png"
              alt=""
              className="w-full h-auto object-contain"
            />
          </div>

          <div className="relative z-10 space-y-2.5">
            
            {/* Brand Eyebrow */}
            <div className="flex items-center gap-2">
              <span className="font-editorial text-[11px] font-semibold tracking-[0.28em] uppercase text-[#1C1917]">
                {storeConfig?.meta?.name || "ALNAYA"}
              </span>
              <span className="w-1 h-1 rounded-full bg-[#9A7B4F]" />
              <span className="text-[9px] font-medium tracking-[0.2em] uppercase text-[#786E5E]">
                TIMELESS JEWELLERY
              </span>
            </div>

            {/* Script Kicker */}
            <div>
              <span className="font-script text-2xl text-[#9A7B4F] select-none block leading-none">
                From my heart
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1">
              <h1 className="font-editorial text-3xl font-normal tracking-tight text-[#1C1917] leading-tight">
                <span>Hi, I&apos;m </span>
                <span className="font-medium text-[#1C1917]">Aleena</span>
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#786E5E]">
                  FOUNDER &amp; CREATIVE SOUL
                </span>
                <Sparkles className="w-3 h-3 text-[#9A7B4F]" />
              </div>
            </div>

            {/* Manifesto Message */}
            <p className="text-xs text-[#4A4235] font-light leading-relaxed max-w-md font-sans">
              I started ALNAYA with a simple belief — that jewellery is more than just an accessory, it&apos;s a part of your story. Every piece is thoughtfully designed to bring out your unique beauty, celebrate your moments, and stay with you for a lifetime.
            </p>

            {/* Real Scanned Signature */}
            <div className="pt-0.5">
              <img
                src="/images/aleena-signature-dark.png"
                alt="Aleena Signature"
                className="h-8 w-auto object-contain select-none opacity-90"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#7E22CE] text-white text-xs font-semibold tracking-wide shadow-md transition-all duration-300"
              >
                <span>✦ Shop All Jewelry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-[#FAF7F2] text-[#1C1917] text-xs font-semibold tracking-wide border border-[#EADBBE] shadow-2xs transition-all duration-300"
              >
                <Sparkles className="w-3 h-3 text-[#9A7B4F]" />
                <span>Browse Collection</span>
              </Link>
            </div>

            {/* Trust Assurances */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-[#786E5E]">
              <span className="inline-flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                100% Waterproof
              </span>
              <span>•</span>
              <span className="font-medium">Radiant Mirror Gold</span>
              <span>•</span>
              <span className="font-medium">Skin Safe</span>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
}
