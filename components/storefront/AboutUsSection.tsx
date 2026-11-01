"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function AboutUsSection() {
  return (
    <section
      id="about-us"
      className="relative w-full py-8 sm:py-16 lg:py-20 bg-[#FAF7F2] text-[#1C1917] overflow-hidden border-b border-[#EADBBE]/70 select-none scroll-mt-20 font-glacial"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-14 items-center">
          {/* 1. Left Editorial Text Column (Compact on mobile, editorial on desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-between self-stretch space-y-4 sm:space-y-8 lg:space-y-0 py-1">
            {/* Top Display Headline */}
            <div>
              <span className="text-[9.5px] sm:text-xs font-semibold uppercase tracking-[0.26em] text-[#7E22CE] block mb-1.5 sm:mb-3">
                ABOUT THE HOUSE
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-normal tracking-tight text-[#1C1917] leading-[1.12]">
                Elegant and Professional Jewellery Design
              </h2>
            </div>

            {/* Paragraph & Underlined Shop Now Action */}
            <div className="space-y-3 sm:space-y-5 pt-1 lg:pt-12 max-w-md">
              <p className="text-[11.5px] sm:text-xs md:text-sm text-[#5C5346] font-light leading-relaxed">
                Our shop offers thoughtfully crafted jewellery that blends timeless elegance with modern design. Each piece is created using premium materials and exceptional attention to detail.
              </p>

              <div>
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold uppercase tracking-[0.2em] text-[#1C1917] pb-1 border-b border-[#1C1917] hover:text-[#7E22CE] hover:border-[#7E22CE] transition-all duration-300"
                >
                  <span>SHOP NOW</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>

          {/* 2. Right Dual Photography Spread (2 images in ONE row on mobile, editorial spread on desktop) */}
          <div className="lg:col-span-7 grid grid-cols-2 lg:grid-cols-12 gap-2.5 sm:gap-4 md:gap-6 items-center">
            {/* Image 1: Celestial Star Drop Hanging Chain */}
            <div className="col-span-1 lg:col-span-7 relative aspect-[4/5] sm:aspect-[4/5] md:aspect-[5/6] overflow-hidden rounded-xl sm:rounded-2xl bg-stone-100 shadow-xs border border-[#EADBBE]/80 group">
              <img
                src="/images/about-model-necklace.jpg"
                alt="Alnaya Jewellery - Celestial Star Drop Hanging Chain"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </div>

            {/* Image 2: Radiant Concentric Circles Cuff Bracelet */}
            <div className="col-span-1 lg:col-span-5 relative aspect-[4/5] sm:aspect-[4/5] md:aspect-[5/6] overflow-hidden rounded-xl sm:rounded-2xl bg-stone-100 shadow-xs border border-[#EADBBE]/80 group">
              <img
                src="/images/about-model-cuff.jpg"
                alt="Alnaya Jewellery - Radiant Concentric Circles Cuff Bracelet"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
