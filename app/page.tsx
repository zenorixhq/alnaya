"use client";

import Link from "next/link";
import { categories } from "@/data/mockData";
import { HeroEditorial } from "@/components/storefront/HeroEditorial";
import { AboutUsSection } from "@/components/storefront/AboutUsSection";
import { BrandValueBadges } from "@/components/storefront/BrandValueBadges";
import { ClientFeedbackScreenshots } from "@/components/storefront/ClientFeedbackScreenshots";
import { CustomerReviewsWithVideos } from "@/components/storefront/CustomerReviewsWithVideos";
import { FollowTheHouseSection } from "@/components/storefront/FollowTheHouseSection";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="w-full bg-[#FAF7F2] overflow-x-hidden">
      {/* 1. Hero Section (Enclosed within entire screen window, full scroll) */}
      <HeroEditorial />

      {/* 2. About Us Section (Enclosed within entire screen window, full scroll) */}
      <AboutUsSection />

      {/* 3. Five Signature Brand Badges & WhatsApp Direct Contact Banner */}
      <BrandValueBadges />

      {/* 4. Curated Catalog / Shop by Category Grid (New Arrivals First) */}
      <section className="w-full py-16 sm:py-24 border-t border-[#EADBBE]/60 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#7E22CE] uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Curated Collections</span>
              </div>
              <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#1C1917] mt-1 tracking-wide">
                Shop by Category
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs sm:text-sm font-semibold text-[#7E22CE] hover:text-[#581C87] flex items-center gap-1 group transition-colors"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-5">
            {categories.map((cat, idx) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-[#EADBBE] shadow-sm bg-[#FFFDF9] hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(126,34,206,0.18)] transition-all duration-500 ease-out"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-3.5 sm:p-4 text-white transition-opacity duration-300">
                  {idx === 0 && (
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-purple-200 font-medium tracking-wider uppercase">
                        🔥 Latest Drop
                      </span>
                      <span className="text-[9px] font-bold bg-[#7E22CE] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                        New
                      </span>
                    </div>
                  )}
                  <h3 className="font-editorial text-sm sm:text-base font-semibold tracking-wide text-white group-hover:text-purple-200 transition-colors leading-snug mt-0.5">
                    {cat.name.replace(/\s*Collection/gi, "").trim()}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Client Feedback & Screenshot Reviews (WhatsApp / DM Proof) */}
      <ClientFeedbackScreenshots />

      {/* 6. Follow The House (Instagram Editorial Mosaic) */}
      <FollowTheHouseSection />

      {/* 7. Customer Testimonials & Influencer Video Reels ("IN THEIR WORDS") */}
      <CustomerReviewsWithVideos />
    </div>
  );
}
