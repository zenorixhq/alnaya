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
      {/* MOBILE HERO: Vertical portrait with Heading, Subheading & Subtext on Left */}
      {/* ========================================================================= */}
      <div className="lg:hidden flex flex-col w-full pt-16">
        
        {/* 1. Mobile Portrait Image with Full Editorial Story on Left Side */}
        <div className="w-full relative aspect-[9/13] sm:aspect-[9/12] overflow-hidden select-none bg-[#FAF7F2]">
          <picture>
            <source srcSet="/images/founder-aleena-mobile.webp" type="image/webp" />
            <img
              src="/images/founder-aleena-mobile.jpg"
              alt="Aleena - Founder & Creative Soul, ALNAYA Timeless Jewellery"
              className="w-full h-full object-cover object-top"
              loading="eager"
              decoding="sync"
              style={{ imageRendering: "-webkit-optimize-contrast" }}
            />
          </picture>

          {/* Left ambient feather gradient: ensures perfect contrast & legibility for all text */}
          <div className="absolute inset-y-0 left-0 w-[64%] bg-gradient-to-r from-[#FAF7F2]/80 via-[#FAF7F2]/45 to-transparent pointer-events-none" />

          {/* Bottom subtle transition feather into the action area */}
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/60 to-transparent pointer-events-none" />

          {/* Heading, Subheading, Subtext Manifesto & Signature Positioned on the Left Side of the Image */}
          <div className="absolute top-3.5 sm:top-5 left-3.5 sm:left-6 w-[56%] sm:w-[50%] z-10 space-y-1.5 sm:space-y-2 pointer-events-none">
            {/* Brand Eyebrow */}
            <div className="flex items-center gap-1.5">
              <span className="font-editorial text-[9px] sm:text-xs font-semibold tracking-[0.24em] uppercase text-[#1C1917]">
                {storeConfig?.meta?.name || "ALNAYA"}
              </span>
              <span className="w-1 h-1 rounded-full bg-[#9A7B4F]" />
              <span className="text-[7.5px] sm:text-[9px] font-medium tracking-[0.16em] uppercase text-[#786E5E]">
                JEWELLERY
              </span>
            </div>

            {/* Handwritten Script Kicker */}
            <div>
              <span className="font-script text-lg sm:text-2xl text-[#9A7B4F] select-none block leading-none">
                From my heart
              </span>
            </div>

            {/* Headline Display */}
            <h1 className="font-editorial text-2xl sm:text-3xl font-normal tracking-tight text-[#1C1917] leading-[1.08]">
              <span>Hi, I&apos;m </span>
              <span className="font-medium text-[#1C1917]">Aleena</span>
            </h1>

            {/* Subheading / Role with Gold Divider Line */}
            <div className="space-y-1 pt-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[8.5px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-[#786E5E]">
                  FOUNDER &amp; CREATIVE SOUL
                </span>
                <Sparkles className="w-2.5 h-2.5 text-[#9A7B4F] shrink-0" />
              </div>
              <div className="w-10 h-[1.5px] bg-gradient-to-r from-[#9A7B4F] via-[#C5A059] to-transparent rounded-full" />
            </div>

            {/* Subtext: Founder Manifesto (On Left Side as Requested) */}
            <p className="text-[10px] sm:text-xs text-[#3D352A] font-light leading-relaxed max-w-[210px] sm:max-w-xs font-sans pt-0.5">
              I started ALNAYA with a simple belief — that jewellery is more than just an accessory, it&apos;s a part of your story. Every piece is thoughtfully designed to bring out your unique beauty, celebrate your moments, and stay with you for a lifetime.
            </p>

            {/* Real Scanned Calligraphy Signature */}
            <div className="pt-0.5">
              <img
                src="/images/aleena-signature-dark.png"
                alt="Aleena Signature"
                className="h-6 sm:h-8 w-auto object-contain select-none opacity-95"
              />
            </div>
          </div>
        </div>

        {/* 2. Mobile Action Buttons & Trust Assurances (Below the image) */}
        <div className="relative z-10 px-4 sm:px-8 pt-3 pb-6 space-y-2.5 text-center sm:text-left">
          
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
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
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[10px] text-[#786E5E]">
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

    </section>
  );
}
