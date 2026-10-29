"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function AboutUsSection() {
  return (
    <section
      id="about-us"
      className="relative w-full py-16 sm:py-20 lg:py-24 bg-[#FAF7F2] text-[#1C1917] overflow-hidden border-b border-[#EADBBE]/70 select-none scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center">
          {/* 1. Left Editorial Text Column (Headline at top, story and SHOP NOW at bottom) */}
          <div className="lg:col-span-5 flex flex-col justify-between self-stretch space-y-8 sm:space-y-12 lg:space-y-0 py-1">
            {/* Top Display Headline */}
            <div>
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-[#7E22CE] block mb-2 sm:mb-3">
                ABOUT THE HOUSE
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] xl:text-[3.25rem] font-normal tracking-tight text-[#1C1917] leading-[1.12]">
                Elegant and Professional Jewellery Design
              </h2>
            </div>

            {/* Bottom Paragraph & Underlined Shop Now Action */}
            <div className="space-y-5 sm:space-y-6 pt-4 lg:pt-16 max-w-md">
              <p className="text-xs sm:text-sm text-[#5C5346] font-light leading-relaxed">
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

          {/* 2. Right Dual Photography Spread (Showcasing authentic pieces) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 items-center">
            {/* Primary Image: Model wearing Celestial Star Drop Hanging Chain */}
            <div className="sm:col-span-7 relative aspect-[3/4] sm:aspect-[4/5] md:aspect-[5/6] overflow-hidden rounded-md bg-stone-100 shadow-sm border border-[#EADBBE]/80 group">
              <img
                src="/images/about-model-necklace.jpg"
                alt="Alnaya Jewellery - Celestial Star Drop Hanging Chain"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </div>

            {/* Secondary Image: Model wearing Radiant Concentric Circles Cuff Bracelet */}
            <div className="sm:col-span-5 relative aspect-[3/4] sm:aspect-[4/5] md:aspect-[5/6] overflow-hidden rounded-md bg-stone-100 shadow-sm border border-[#EADBBE]/80 group">
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
