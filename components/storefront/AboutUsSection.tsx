"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useSiteImages } from "@/hooks/useSiteImages";

export function AboutUsSection() {
  const { images } = useSiteImages();

  return (
    <section
      id="about-us"
      className="relative w-full py-8 sm:py-16 lg:py-20 bg-[#FAF7F2] text-[#1C1917] overflow-hidden border-b border-[#EADBBE]/70 select-none scroll-mt-20 font-glacial"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-14 items-center">
          {/* 1. Left Editorial Text Column (Subtext positioned directly beneath headline) */}
          <div className="lg:col-span-5 flex flex-col justify-start space-y-6 sm:space-y-7 py-1">
            {/* Top Display Headline */}
            <div>
              <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#1C1917] leading-[1.1]">
                About Us
              </h2>
              <div className="w-14 sm:w-20 h-[2.5px] bg-gradient-to-r from-[#9A7B4F] to-transparent rounded-full mt-2.5 sm:mt-3" />
            </div>

            {/* Paragraph & Underlined Shop Now Action positioned directly in the designated area */}
            <div className="space-y-6 max-w-md">
              <p className="text-sm sm:text-base md:text-lg text-[#2C241B] font-normal leading-relaxed">
                Our shop offers thoughtfully crafted jewellery that blends timeless elegance with modern design. Each piece is created using premium materials and exceptional attention to detail.
              </p>

              <div>
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-2 text-sm sm:text-base font-bold uppercase tracking-[0.2em] text-[#1C1917] pb-1.5 border-b-2 border-[#1C1917] hover:text-[#7E22CE] hover:border-[#7E22CE] transition-all duration-300"
                >
                  <span>SHOP NOW</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>

          {/* 2. Right Dual Photography Spread (2 images in ONE row on mobile, editable via Admin) */}
          <div className="lg:col-span-7 grid grid-cols-2 lg:grid-cols-12 gap-2.5 sm:gap-4 md:gap-6 items-center">
            {/* Image 1: Celestial Star Drop Hanging Chain */}
            <div className="col-span-1 lg:col-span-7 relative aspect-[4/5] sm:aspect-[4/5] md:aspect-[5/6] overflow-hidden rounded-xl sm:rounded-2xl bg-stone-100 shadow-xs border border-[#EADBBE]/80 group">
              <img
                src={images.aboutImage1 || "/images/about-model-necklace.jpg"}
                alt="Alnaya Jewellery - About Us Showcase 1"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </div>

            {/* Image 2: Radiant Concentric Circles Cuff Bracelet */}
            <div className="col-span-1 lg:col-span-5 relative aspect-[4/5] sm:aspect-[4/5] md:aspect-[5/6] overflow-hidden rounded-xl sm:rounded-2xl bg-stone-100 shadow-xs border border-[#EADBBE]/80 group">
              <img
                src={images.aboutImage2 || "/images/about-model-cuff.jpg"}
                alt="Alnaya Jewellery - About Us Showcase 2"
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
