"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { categories } from "@/data/mockData";
import { Category } from "@/types/store";
import { HeroEditorial } from "@/components/storefront/HeroEditorial";
import { AboutUsSection } from "@/components/storefront/AboutUsSection";
import { BrandValueBadges } from "@/components/storefront/BrandValueBadges";
import { CustomerReviewsWithVideos } from "@/components/storefront/CustomerReviewsWithVideos";
import { FollowTheHouseSection } from "@/components/storefront/FollowTheHouseSection";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HomePage() {
  const [categoryList, setCategoryList] = useState<Category[]>(categories);

  useEffect(() => {
    fetch(`/api/categories?t=${Date.now()}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategoryList(data);
        }
      })
      .catch(() => {});
  }, []);
  return (
    <div className="w-full bg-[#FAF7F2] overflow-x-hidden font-glacial">
      {/* 1. Hero Section (Enclosed within entire screen window, full scroll) */}
      <HeroEditorial />

      {/* 2. About Us Section (Positioned right after Hero as requested) */}
      <div id="about-us" className="scroll-mt-16 sm:scroll-mt-20">
        <AboutUsSection />
      </div>

      {/* 3. The Maison Archive / Shop by Category Grid - Enclosed within a compact window container */}
      <div id="shop-collection" className="scroll-mt-16 sm:scroll-mt-20">
        <section className="w-full py-6 sm:py-8 lg:py-10 bg-[#FAF7F2] border-b border-[#EADBBE]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full">
          <div className="bg-white/85 backdrop-blur-xs border border-[#EADBBE] rounded-3xl p-4 sm:p-6 lg:p-7 shadow-xs space-y-4 sm:space-y-5">
            {/* Window Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#EADBBE]/50 pb-3">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#7E22CE] uppercase tracking-widest font-glacial">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>The Maison Archive</span>
                </div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-normal text-[#1C1917] mt-0.5 tracking-wide">
                  Shop by Category
                </h2>
              </div>
              <Link
                href="/products"
                className="text-xs sm:text-sm font-semibold text-[#7E22CE] hover:text-[#581C87] flex items-center gap-1 group transition-colors font-glacial"
              >
                <span>View All Categories</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Editorial Framed Arch Category Cards: Exactly 6 cards in a 2*3 grid on desktop fitting within the window */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
              {categoryList.slice(0, 6).map((cat, idx) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="group relative bg-[#FFFDF9] border border-[#EADBBE]/80 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 shadow-2xs hover:shadow-xl hover:border-[#7E22CE]/60 hover:-translate-y-1.5 transition-all duration-500 ease-out flex flex-col justify-between card-shine"
                >
                  {/* Arched Top Silhouette Image Frame with compact viewport height */}
                  <div className="w-full h-36 xs:h-40 sm:h-48 md:h-52 lg:h-56 rounded-t-[1.3rem] sm:rounded-t-[1.8rem] rounded-b-xl overflow-hidden bg-[#FAF7F2] relative flex items-center justify-center border border-stone-100/80 shadow-2xs group-hover:shadow-md transition-shadow duration-500">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    {idx === 0 && (
                      <span className="absolute top-2 right-2 text-[8px] sm:text-[9px] font-bold bg-[#7E22CE] text-white px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider font-glacial">
                        NEW DROP
                      </span>
                    )}
                  </div>

                  {/* Bottom Typography & Action */}
                  <div className="pt-2 pb-0.5 px-0.5 flex flex-col items-center text-center">
                    <h3 className="font-editorial text-sm sm:text-base md:text-[17px] font-semibold tracking-wide text-[#1C1917] group-hover:text-[#7E22CE] transition-colors leading-tight truncate max-w-full">
                      {cat.name.replace(/\s*Collection/gi, "").trim()}
                    </h3>
                    <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold tracking-widest uppercase text-[#9A7B4F] group-hover:text-[#7E22CE] transition-colors font-glacial mt-1">
                      <span>EXPLORE</span>
                      <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* 4. Five Signature Brand Badges & WhatsApp Direct Contact Banner */}
      <BrandValueBadges />

      {/* 5. Follow The House (Instagram Editorial Mosaic) */}
      <FollowTheHouseSection />

      {/* 7. Customer Testimonials & Influencer Video Reels ("IN THEIR WORDS") */}
      <CustomerReviewsWithVideos />
    </div>
  );
}
