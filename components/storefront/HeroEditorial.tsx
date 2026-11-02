"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { storeConfig } from "@/config/store.config";
import { useSiteImages } from "@/hooks/useSiteImages";

export function HeroEditorial() {
  const { images } = useSiteImages();

  const scrollToCollection = () => {
    const target = document.getElementById("shop-collection") || document.getElementById("about-us");
    if (target) {
      if (typeof window !== "undefined" && (window as any).__lenis) {
        (window as any).__lenis.scrollTo(target, { offset: -30, duration: 1.2 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.location.href = "/products";
    }
  };
  return (
    <section className="relative w-full bg-[#FAF7F2] text-[#1C1917] overflow-hidden select-none border-b border-[#EADBBE]/40 lg:border-none lg:h-[100svh] lg:max-h-[100svh] flex flex-col justify-between">
      
      {/* ========================================================= */}
      {/* DESKTOP HERO: Strictly enclosed within the window (100svh) */}
      {/* ========================================================= */}
      <div className="hidden lg:block absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <picture>
          <source srcSet="/images/founder-aleena-saree-hero-hd.webp" type="image/webp" />
          <source srcSet="/images/founder-aleena-saree-hero-hd.png" type="image/png" />
          <img
            src={images.heroDesktop || "/images/founder-aleena-saree-hero-hd.png"}
            alt="Aleena - Founder & Creative Soul, ALNAYA Timeless Jewellery"
            className="w-full h-full object-cover object-[80%_center] xl:object-[84%_center]"
            loading="eager"
            decoding="async"
            // @ts-ignore
            fetchPriority="high"
          />
        </picture>
        {/* Soft Left Ambient Feather: ensures typography has perfect contrast over sunlight */}
        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/60 to-transparent w-full max-w-xl xl:max-w-2xl pointer-events-none" />

        {/* Bottom Smooth Blur-to-White Transition */}
        <div className="absolute inset-x-0 bottom-0 h-32 lg:h-48 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none backdrop-blur-[2px]" />
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
            <span className="font-script text-2xl lg:text-3xl xl:text-4xl text-[#9A7B4F] select-none block leading-none">
              From my heart
            </span>
          </div>

          {/* Display Headline (Hi, I'm Aleena) */}
          <div className="space-y-2">
            <h1 className="font-editorial text-4xl lg:text-5xl xl:text-[4rem] font-normal tracking-tight text-[#1C1917] leading-[1.06]">
              <span>Hi, I&apos;m </span>
              <span className="font-medium text-[#1C1917]">Aleena</span>
            </h1>

            {/* Subheading / Role with Warm Gold Divider Line (Bigger, bolder presence) */}
            <div className="space-y-1.5 pt-1">
              <div className="text-xs lg:text-sm xl:text-[15px] font-bold uppercase tracking-[0.26em] text-[#786E5E] font-glacial">
                FOUNDER &amp; CREATIVE SOUL
              </div>
              <div className="w-16 lg:w-20 h-[2px] bg-gradient-to-r from-[#9A7B4F] via-[#C5A059] to-transparent rounded-full" />
            </div>
          </div>

          {/* Founder's Personal Manifesto */}
          <p className="text-sm lg:text-[15px] xl:text-base text-[#4A4235] font-light leading-relaxed max-w-xl font-glacial">
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

          {/* Interactive Action Button */}
          <div className="flex flex-wrap items-center gap-3 pt-2 font-glacial">
            <button
              type="button"
              onClick={scrollToCollection}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#1C1917] hover:bg-[#7E22CE] text-white text-xs lg:text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group font-glacial cursor-pointer"
            >
              <span>Discover Collection</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-6 py-3.5 rounded-full border border-stone-300/90 hover:border-[#7E22CE] text-[#1C1917] hover:text-[#7E22CE] text-xs lg:text-sm font-semibold transition-all hover:bg-white/40"
            >
              <span>Shop All Pieces</span>
            </Link>
          </div>

          {/* Quality Commitment Badges */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1 text-[11px] text-[#786E5E] font-glacial">
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

        {/* Subtle Editorial Scroll Down Prompt (Desktop) */}
        <div className="absolute bottom-3 xl:bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-auto">
          <button
            type="button"
            onClick={scrollToCollection}
            className="flex flex-col items-center gap-1 text-[10px] uppercase tracking-[0.22em] text-[#786E5E] hover:text-[#7E22CE] transition-all group cursor-pointer focus:outline-none"
            aria-label="Scroll down to explore collection"
          >
            <span className="font-semibold text-[9px] tracking-[0.25em]">Scroll to Explore</span>
            <div className="w-5 h-8 rounded-full border-2 border-stone-300/80 group-hover:border-[#7E22CE] flex items-start justify-center p-1 transition-colors shadow-2xs">
              <div className="w-1 h-2 bg-[#9A7B4F] group-hover:bg-[#7E22CE] rounded-full animate-bounce mt-0.5" />
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE HERO: Vertical portrait with Heading, Subheading & Subtext on Left */}
      {/* ========================================================================= */}
      <div className="lg:hidden flex flex-col w-full pt-16">
        
        {/* 1. Mobile Portrait Image with Full Editorial Story on Left Side */}
        <div className="w-full relative aspect-[9/13] sm:aspect-[9/12] overflow-hidden select-none bg-[#FAF7F2]">
          <picture>
            <source srcSet="/images/founder-aleena-mobile-hd.webp" type="image/webp" />
            <source srcSet="/images/founder-aleena-mobile-hd.png" type="image/png" />
            <img
              src={images.heroMobile || "/images/founder-aleena-mobile-hd.png"}
              alt="Aleena - Founder & Creative Soul, ALNAYA Timeless Jewellery"
              className="w-full h-full object-cover object-top"
              loading="eager"
              decoding="async"
              // @ts-ignore
              fetchPriority="high"
            />
          </picture>

          {/* Left ambient feather gradient: ensures perfect contrast & legibility for all text */}
          <div className="absolute inset-y-0 left-0 w-[68%] bg-gradient-to-r from-[#FAF7F2]/85 via-[#FAF7F2]/50 to-transparent pointer-events-none" />

          {/* Bottom subtle transition feather */}
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/50 to-transparent pointer-events-none" />

          {/* Heading, Subheading, Subtext Manifesto & Discover Collection Button Positioned on the Left Side */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 w-[60%] sm:w-[52%] max-w-[260px] sm:max-w-[310px] z-10 space-y-2 sm:space-y-2.5">
            {/* Brand Eyebrow */}
            <div className="flex items-center gap-1.5">
              <span className="font-editorial text-[10px] sm:text-xs font-semibold tracking-[0.26em] uppercase text-[#1C1917]">
                {storeConfig?.meta?.name || "ALNAYA"}
              </span>
              <span className="text-[10px] text-[#9A7B4F] select-none">✤</span>
              <span className="text-[8.5px] sm:text-[10px] font-medium tracking-[0.18em] uppercase text-[#786E5E]">
                JEWELLERY
              </span>
            </div>

            {/* Handwritten Script Kicker */}
            <div>
              <span className="font-script text-xl sm:text-2xl text-[#9A7B4F] select-none block leading-none">
                From my heart
              </span>
            </div>

            {/* Headline Display */}
            <h1 className="font-editorial text-3xl sm:text-4xl font-normal tracking-tight text-[#1C1917] leading-[1.06]">
              <span>Hi, I&apos;m </span>
              <span className="font-medium text-[#1C1917]">Aleena</span>
            </h1>

            {/* Subheading / Role with Ambient Signature Behind It (Not behind Discover Collection button) */}
            <div className="relative pt-0.5">
              {/* Cursive Signature Lines Positioned Directly Behind Subtitle & Headline */}
              <div className="absolute -top-12 sm:-top-14 -left-5 sm:-left-7 w-[230px] sm:w-[270px] opacity-[0.14] select-none pointer-events-none -rotate-6 z-0 mix-blend-multiply leading-none">
                <img
                  src={images.heroSignature || "/images/aleena-signature-dark.png"}
                  alt=""
                  className="w-full h-auto object-contain"
                />
              </div>

              <span className="relative z-10 text-xs sm:text-[13px] font-bold uppercase tracking-[0.24em] text-[#786E5E] block leading-none font-glacial">
                FOUNDER &amp; CREATIVE SOUL
              </span>
            </div>

            {/* Subtext: Founder Personal Manifesto (Increased size for enhanced mobile readability) */}
            <p className="text-[13px] sm:text-[14px] text-[#2C241B] font-normal leading-[1.56] max-w-[240px] sm:max-w-xs font-glacial pt-1">
              I started ALNAYA with a simple belief that jewellery is more than just an accessory, it&apos;s a part of your story. Every piece is thoughtfully designed to bring out your unique beauty, celebrate your moments, and stay with you for a lifetime.
            </p>

            {/* Discover Collection Button */}
            <div className="pt-2 sm:pt-2.5 flex items-center gap-2">
              <button
                type="button"
                onClick={scrollToCollection}
                className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#1C1917] hover:bg-[#7E22CE] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-md transition-all duration-300 active:scale-[0.98] font-glacial cursor-pointer"
              >
                <span>Discover Collection</span>
              </button>
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-4 py-2.5 sm:py-3 rounded-full border border-stone-300/90 text-[#1C1917] text-xs font-semibold hover:border-[#7E22CE] hover:text-[#7E22CE] transition-all font-glacial"
              >
                <span>Shop All</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 2. Mobile Trust Assurances (Below the image) */}
        <div className="w-full bg-[#FAF7F2] py-2.5 sm:py-3 px-4 border-t border-[#EADBBE]/40 flex flex-wrap items-center justify-center gap-2 text-[10px] text-[#786E5E] font-glacial">
          <span className="inline-flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            100% Waterproof
          </span>
          <span>•</span>
          <span className="font-medium">Radiant Mirror Gold</span>
          <span>•</span>
          <span className="font-medium">Skin Safe</span>
        </div>

        {/* Mobile Scroll Down Prompt */}
        <div className="w-full flex items-center justify-center py-1.5 pb-2.5 bg-[#FAF7F2]">
          <button
            type="button"
            onClick={scrollToCollection}
            className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#786E5E] hover:text-[#7E22CE] transition-colors cursor-pointer py-1 px-3 rounded-full hover:bg-stone-200/50"
          >
            <span>Scroll to Explore</span>
            <span className="text-xs animate-bounce font-bold">↓</span>
          </button>
        </div>
      </div>

    </section>
  );
}
