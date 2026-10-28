"use client";

import { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  CheckCircle2,
  Heart,
  ShieldCheck,
} from "lucide-react";

export interface FeedbackScreenshot {
  id: string;
  title: string;
  customerName: string;
  location: string;
  piece?: string;
  imageUrl: string;
  caption?: string;
  date?: string;
}

import initialReviewData from "@/data/clientReviews.json";

interface ClientFeedbackScreenshotsProps {
  className?: string;
}

export function ClientFeedbackScreenshots({ className = "" }: ClientFeedbackScreenshotsProps) {
  const [screenshots, setScreenshots] = useState<FeedbackScreenshot[]>(
    () => (initialReviewData.feedbackScreenshots || []) as FeedbackScreenshot[]
  );
  const [zoomedScreenshot, setZoomedScreenshot] = useState<FeedbackScreenshot | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const fetchScreenshots = () => {
    fetch(`/api/reviews?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.feedbackScreenshots)) {
          setScreenshots(data.feedbackScreenshots);
        }
      })
      .catch((e) => console.error("Error fetching feedback screenshots:", e));
  };

  useEffect(() => {
    fetchScreenshots();
  }, []);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (zoomedScreenshot) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [zoomedScreenshot]);

  // Handle keyboard escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && zoomedScreenshot) {
        setZoomedScreenshot(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomedScreenshot]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: "smooth" });
    }
  };

  if (!screenshots || screenshots.length === 0) {
    return null;
  }

  return (
    <section className={`w-full bg-[#FAF7F2] py-10 sm:py-12 md:py-14 border-t border-[#EADBBE]/70 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#8F7234] uppercase tracking-widest">
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Real Customer Conversations</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-[#1C1917] tracking-tight">
              Client Feedback & Screenshots
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl font-light">
              Real WhatsApp chats, direct messages, and unboxing reviews sent by our verified jewelry collectors across India & Qatar.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={scrollLeft}
              aria-label="Scroll left"
              className="w-10 h-10 rounded-full border border-[#EADBBE] bg-[#FFFDF9] hover:bg-[#1C1917] hover:text-white text-[#1C1917] flex items-center justify-center transition-all shadow-sm active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollRight}
              aria-label="Scroll right"
              className="w-10 h-10 rounded-full border border-[#EADBBE] bg-[#FFFDF9] hover:bg-[#1C1917] hover:text-white text-[#1C1917] flex items-center justify-center transition-all shadow-sm active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Screenshots Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth"
        >
          {screenshots.map((item) => (
            <div
              key={item.id}
              onClick={() => setZoomedScreenshot(item)}
              className="flex-shrink-0 w-[280px] sm:w-[320px] rounded-2xl bg-[#FFFDF9] border border-[#EADBBE] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between group"
            >
              {/* Top WhatsApp-styled header */}
              <div className="px-4 py-3 bg-[#FAF5EB] border-b border-[#EADBBE]/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1C1917] leading-tight">
                      {item.customerName}
                    </p>
                    <p className="text-[10px] text-stone-500">{item.location}</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Verified</span>
                </span>
              </div>

              {/* Screenshot Image Frame */}
              <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur text-stone-900 text-xs font-bold flex items-center gap-1.5 shadow-lg scale-90 group-hover:scale-100 transition-transform">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>View Full Chat</span>
                  </div>
                </div>
              </div>

              {/* Bottom Caption / Quote */}
              <div className="p-4 bg-[#FFFDF9] space-y-2 border-t border-[#EADBBE]/50">
                {item.piece && (
                  <div className="inline-block px-2 py-0.5 rounded-md bg-[#FAF5EB] text-[#8F7234] text-[10px] font-semibold">
                    Piece: {item.piece}
                  </div>
                )}
                {item.caption && (
                  <p className="text-xs text-stone-700 italic font-light line-clamp-2 leading-relaxed">
                    {item.caption}
                  </p>
                )}
                <div className="flex items-center justify-between pt-1 text-[10px] text-stone-500">
                  <span>{item.date || "Verified WhatsApp Order"}</span>
                  <span className="text-[#C5A059] font-medium flex items-center gap-0.5">
                    <Heart className="w-3 h-3 fill-current text-rose-500" />
                    <span>Loved</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal for Fullscreen Screenshot Preview */}
      {zoomedScreenshot && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in-0 duration-200"
          onClick={() => setZoomedScreenshot(null)}
        >
          <div
            className="relative max-w-lg w-full bg-[#FFFDF9] rounded-2xl overflow-hidden shadow-2xl border border-[#EADBBE] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 bg-[#FAF5EB] border-b border-[#EADBBE] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1C1917] flex items-center gap-1.5">
                    <span>{zoomedScreenshot.customerName}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </h4>
                  <p className="text-[11px] text-stone-500">{zoomedScreenshot.location}</p>
                </div>
              </div>
              <button
                onClick={() => setZoomedScreenshot(null)}
                className="p-1.5 rounded-full hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-colors"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Enlarged Screenshot Image */}
            <div className="p-3 bg-stone-950/5 max-h-[65vh] overflow-y-auto flex items-center justify-center">
              <img
                src={zoomedScreenshot.imageUrl}
                alt={zoomedScreenshot.title}
                className="w-auto h-auto max-w-full max-h-[60vh] object-contain rounded-xl shadow-md"
              />
            </div>

            {/* Modal Footer Caption */}
            <div className="p-5 bg-white border-t border-[#EADBBE] space-y-2">
              {zoomedScreenshot.piece && (
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FAF5EB] text-[#8F7234] text-xs font-semibold">
                  Verified Piece: {zoomedScreenshot.piece}
                </span>
              )}
              {zoomedScreenshot.caption && (
                <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-light italic">
                  {zoomedScreenshot.caption}
                </p>
              )}
              <div className="pt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100">
                <span>{zoomedScreenshot.date || "Verified WhatsApp Order"}</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  100% Authentic Customer Feedback
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
