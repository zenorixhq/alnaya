"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Play,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  X,
  MessageCircle,
  Maximize2,
  ShieldCheck,
  Heart,
  Star,
  Quote,
} from "lucide-react";

export interface ReviewQuote {
  id: string | number;
  author: string;
  location: string;
  piece: string;
  rating?: number;
  quote: string;
}

export interface FeedbackScreenshot {
  id: string;
  title?: string;
  customerName?: string;
  location?: string;
  piece?: string;
  imageUrl: string;
  caption?: string;
  date?: string;
}

export interface VideoReel {
  id: number | string;
  influencer: string;
  handle: string;
  title: string;
  videoUrl: string;
  poster: string;
  views?: string;
  productTitle: string;
  productSlug: string;
  productPrice: number;
}

import initialReviewData from "@/data/clientReviews.json";

const defaultReviewQuotes: ReviewQuote[] = (initialReviewData.reviews || []) as ReviewQuote[];
const defaultVideoReels: VideoReel[] = (initialReviewData.videoReels || []) as VideoReel[];
const defaultScreenshots: FeedbackScreenshot[] = (initialReviewData.feedbackScreenshots || []) as FeedbackScreenshot[];

function AutoPlayingReelCard({
  reel,
  onClick,
}: {
  reel: VideoReel;
  onClick: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(video);
    video.play().catch(() => {});

    return () => {
      observer.disconnect();
    };
  }, [reel.videoUrl]);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const isDirectVideo =
    reel.videoUrl &&
    (reel.videoUrl.includes(".mp4") ||
      reel.videoUrl.includes(".webm") ||
      reel.videoUrl.includes("blob.vercel-storage.com") ||
      reel.videoUrl.startsWith("/uploads/") ||
      reel.videoUrl.startsWith("data:video") ||
      reel.videoUrl.includes("assets.mixkit.co"));

  return (
    <div
      onClick={onClick}
      className="group relative aspect-[9/15] rounded-xl sm:rounded-2xl overflow-hidden bg-stone-900 shadow-md cursor-pointer border border-stone-300/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-out"
    >
      {/* Autoplaying live video element */}
      {isDirectVideo ? (
        <video
          ref={videoRef}
          src={reel.videoUrl}
          poster={reel.poster}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      ) : (
        <img
          src={reel.poster}
          alt={reel.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/35 flex flex-col justify-between p-3 text-white pointer-events-none">
        {/* Top Sound Toggle (View count removed) */}
        <div className="flex items-center justify-end text-[10px] pointer-events-auto">
          {isDirectVideo && (
            <button
              type="button"
              onClick={toggleSound}
              className="w-6 h-6 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur flex items-center justify-center text-white transition-all shadow"
              title={isMuted ? "Unmute sound" : "Mute sound"}
            >
              {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-amber-400" />}
            </button>
          )}
        </div>

        {/* Center Hover Action */}
        <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-11 h-11 rounded-full bg-white/90 text-stone-900 flex items-center justify-center shadow-lg group-hover:scale-110">
          <Play className="w-4 h-4 fill-current ml-0.5 text-stone-900" />
        </div>

        {/* Bottom Details */}
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-white line-clamp-1 leading-snug drop-shadow-sm">
            {reel.title}
          </p>
          <p className="text-[10px] text-white/80 font-medium drop-shadow-sm">
            {reel.handle}
          </p>
          {reel.productTitle && (
            <span className="inline-block text-[9px] text-purple-300 font-semibold bg-white/10 px-1.5 py-0.5 rounded">
              {reel.productTitle}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function CustomerReviewsWithVideos() {
  const [videoReels, setVideoReels] = useState<VideoReel[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem("alnaya_cached_reels");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return defaultVideoReels;
  });

  const [feedbackScreenshots, setFeedbackScreenshots] = useState<FeedbackScreenshot[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem("alnaya_cached_screenshots");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return defaultScreenshots;
  });

  const [reviewQuotes, setReviewQuotes] = useState<ReviewQuote[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem("alnaya_cached_quotes");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return defaultReviewQuotes;
  });

  const [selectedVideo, setSelectedVideo] = useState<VideoReel | null>(null);
  const [selectedScreenshot, setSelectedScreenshot] = useState<FeedbackScreenshot | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isLeftDisabled, setIsLeftDisabled] = useState(true);
  const [isRightDisabled, setIsRightDisabled] = useState(false);

  const quotesScrollRef = useRef<HTMLDivElement>(null);
  const [isQuotesLeftDisabled, setIsQuotesLeftDisabled] = useState(true);
  const [isQuotesRightDisabled, setIsQuotesRightDisabled] = useState(false);

  // Fetch fresh data from API and cache in sessionStorage for 0ms subsequent loads
  useEffect(() => {
    fetch(`/api/reviews?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.videoReels) && data.videoReels.length > 0) {
          setVideoReels(data.videoReels);
          try {
            sessionStorage.setItem("alnaya_cached_reels", JSON.stringify(data.videoReels));
          } catch {}
        }
        if (Array.isArray(data.feedbackScreenshots) && data.feedbackScreenshots.length > 0) {
          setFeedbackScreenshots(data.feedbackScreenshots);
          try {
            sessionStorage.setItem("alnaya_cached_screenshots", JSON.stringify(data.feedbackScreenshots));
          } catch {}
        }
        if (Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviewQuotes(data.reviews);
          try {
            sessionStorage.setItem("alnaya_cached_quotes", JSON.stringify(data.reviews));
          } catch {}
        }
      })
      .catch((e) => console.error("Could not fetch reviews data:", e));
  }, []);

  // Update Left / Right Arrow states based on scroll position for Screenshots
  const updateScrollButtons = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setIsLeftDisabled(scrollLeft <= 6);
    setIsRightDisabled(scrollLeft + clientWidth >= scrollWidth - 6);
  };

  useEffect(() => {
    updateScrollButtons();
    const el = scrollContainerRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);

    const timer = setTimeout(updateScrollButtons, 100);

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
      clearTimeout(timer);
    };
  }, [feedbackScreenshots]);

  // Scroll screenshots 2 cards at a time (scrolls by container clientWidth)
  const scrollPrev = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollBy({ left: -el.clientWidth, behavior: "smooth" });
  };

  const scrollNext = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
  };

  // Update Left / Right Arrow states based on scroll position for Quotes
  const updateQuotesScrollButtons = () => {
    const el = quotesScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setIsQuotesLeftDisabled(scrollLeft <= 6);
    setIsQuotesRightDisabled(scrollLeft + clientWidth >= scrollWidth - 6);
  };

  useEffect(() => {
    updateQuotesScrollButtons();
    const el = quotesScrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateQuotesScrollButtons, { passive: true });
    window.addEventListener("resize", updateQuotesScrollButtons);

    const timer = setTimeout(updateQuotesScrollButtons, 100);

    return () => {
      el.removeEventListener("scroll", updateQuotesScrollButtons);
      window.removeEventListener("resize", updateQuotesScrollButtons);
      clearTimeout(timer);
    };
  }, [reviewQuotes]);

  // Scroll Quotes cards
  const scrollQuotesPrev = () => {
    const el = quotesScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: -Math.max(280, el.clientWidth * 0.75), behavior: "smooth" });
  };

  const scrollQuotesNext = () => {
    const el = quotesScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: Math.max(280, el.clientWidth * 0.75), behavior: "smooth" });
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedVideo || selectedScreenshot) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedVideo, selectedScreenshot]);

  // Handle keyboard escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedVideo(null);
        setSelectedScreenshot(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="w-full bg-[#FAF7F2] py-10 sm:py-12 md:py-14 border-t border-[#EADBBE]/80 text-[#1C1917]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Header: The love we get */}
        <div className="text-center space-y-2">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#7E22CE] font-medium block">
            IN THEIR WORDS
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl font-normal tracking-tight text-[#1C1917]">
            The love we get
          </h2>
        </div>

        {/* Dual Showcase: Video Reels on Left + Verified Customer Feedback Screenshots on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Side: Client Reels */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-300/60">
              <span className="text-xs uppercase tracking-widest font-semibold text-stone-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Client Reels</span>
              </span>
              <span className="text-[11px] text-stone-500">Real wear tests</span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {videoReels.map((reel) => (
                <AutoPlayingReelCard
                  key={reel.id}
                  reel={reel}
                  onClick={() => setSelectedVideo(reel)}
                />
              ))}
            </div>
          </div>

          {/* Right Side: Scrollable 2 Cards at a time Customer Feedback Screenshots */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4 sm:space-y-6">
            {/* Header for Screenshots */}
            <div className="flex items-center justify-between pb-2 border-b border-stone-300/60">
              <span className="text-xs uppercase tracking-widest font-semibold text-stone-700 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Client Feedback</span>
              </span>
              <span className="text-[11px] text-stone-500">Real WhatsApp & DM chats</span>
            </div>

            {/* Scrollable Container (Shows only screenshot like uploaded image, details reveal on hover) */}
            <div
              ref={scrollContainerRef}
              className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 no-scrollbar scroll-smooth snap-x snap-mandatory"
            >
              {feedbackScreenshots.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedScreenshot(item)}
                  className="group relative w-[calc(50%-6px)] sm:w-[calc(50%-8px)] min-w-[calc(50%-6px)] sm:min-w-[calc(50%-8px)] flex-shrink-0 snap-start aspect-[9/15] rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-950 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ease-out cursor-pointer border border-[#EADBBE]"
                >
                  {/* Clean Screenshot Image - Pure screenshot matching user reference */}
                  <img
                    src={item.imageUrl}
                    alt="Customer feedback screenshot"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* While hovering: Details Reveal smoothly */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 sm:p-4 flex flex-col justify-between text-white pointer-events-none">
                    {/* Top: Anonymous Verified badge */}
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full font-medium flex items-center gap-1 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified Chat</span>
                      </span>
                      <span className="w-6 h-6 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                        <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                      </span>
                    </div>

                    {/* Center: Tap to View Icon */}
                    <div className="self-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 text-stone-900 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Maximize2 className="w-4 h-4 text-stone-900" />
                    </div>

                    {/* Bottom: Piece & caption details revealed on hover */}
                    <div className="space-y-1">
                      {item.piece && (
                        <span className="inline-block text-[9px] sm:text-[10px] text-purple-300 font-semibold bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded">
                          Piece: {item.piece}
                        </span>
                      )}
                      {item.caption && (
                        <p className="text-[11px] sm:text-xs text-white/95 italic font-light line-clamp-2 leading-relaxed drop-shadow-sm">
                          &ldquo;{item.caption}&rdquo;
                        </p>
                      )}
                      <p className="text-[9px] text-white/70">
                        {item.date || "Verified WhatsApp Order"} • Click to enlarge
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Controls (Left disabled at first, enables after scrolling, right disabled at end) */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={scrollPrev}
                  disabled={isLeftDisabled}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                    isLeftDisabled
                      ? "border-stone-200 text-stone-300 bg-stone-100 cursor-not-allowed opacity-35"
                      : "border-stone-300 hover:border-stone-900 text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-50 active:scale-95 shadow-sm cursor-pointer"
                  }`}
                  aria-label="Previous screenshots"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={scrollNext}
                  disabled={isRightDisabled}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                    isRightDisabled
                      ? "border-stone-200 text-stone-300 bg-stone-100 cursor-not-allowed opacity-35"
                      : "border-stone-300 hover:border-stone-900 text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-50 active:scale-95 shadow-sm cursor-pointer"
                  }`}
                  aria-label="Next screenshots"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-stone-500">
                <CheckCircle2 className="w-4 h-4 text-[#114E45]" />
                <span className="hidden sm:inline">100% Genuine WhatsApp & DM Proof</span>
                <span className="sm:hidden">Verified Proof</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Review Quotes: Scrollable Cards (After the reels and screenshot proof) */}
        {reviewQuotes.length > 0 && (
          <div className="pt-8 sm:pt-10 border-t border-[#EADBBE]/80 space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-stone-300/60">
              <div>
                <span className="text-xs uppercase tracking-widest font-semibold text-stone-700 flex items-center gap-1.5">
                  <Quote className="w-3.5 h-3.5 text-[#7E22CE]" />
                  <span>Customer Review Quotes</span>
                </span>
                <p className="text-[11px] text-stone-500">Verified client testimonials & reviews</p>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={scrollQuotesPrev}
                  disabled={isQuotesLeftDisabled}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border flex items-center justify-center transition-all ${
                    isQuotesLeftDisabled
                      ? "border-stone-200 text-stone-300 bg-stone-100 cursor-not-allowed opacity-35"
                      : "border-stone-300 hover:border-stone-900 text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-50 active:scale-95 shadow-sm cursor-pointer"
                  }`}
                  aria-label="Previous review quotes"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={scrollQuotesNext}
                  disabled={isQuotesRightDisabled}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border flex items-center justify-center transition-all ${
                    isQuotesRightDisabled
                      ? "border-stone-200 text-stone-300 bg-stone-100 cursor-not-allowed opacity-35"
                      : "border-stone-300 hover:border-stone-900 text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-50 active:scale-95 shadow-sm cursor-pointer"
                  }`}
                  aria-label="Next review quotes"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Container with Snap */}
            <div
              ref={quotesScrollRef}
              className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 no-scrollbar scroll-smooth snap-x snap-mandatory"
            >
              {reviewQuotes.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="w-[280px] xs:w-[320px] sm:w-[380px] min-w-[280px] xs:min-w-[320px] sm:min-w-[380px] flex-shrink-0 snap-start bg-[#FFFDF9] border border-[#EADBBE] rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md hover:border-purple-400/50 transition-all"
                >
                  <div className="space-y-3">
                    {/* Rating Stars & Quote Glyph */}
                    <div className="flex items-center justify-between">
                      <div className="flex text-amber-500 gap-0.5">
                        {[...Array(item.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="w-6 h-6 rounded-full bg-[#114E45]/10 text-[#114E45] flex items-center justify-center text-xs font-serif font-black">
                        “
                      </span>
                    </div>

                    {/* Quote Body */}
                    <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-light italic">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-200/70 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-stone-900">{item.author}</p>
                      <p className="text-[11px] text-stone-500 font-light">{item.location}</p>
                      {item.piece && (
                        <p className="text-[10px] text-purple-700 font-medium pt-0.5 truncate max-w-[200px]">
                          Piece: {item.piece}
                        </p>
                      )}
                    </div>
                    <div className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Screenshot Lightbox Modal (Clickable with Full Details revealed on click, Anonymous) */}
      {selectedScreenshot && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedScreenshot(null)}
        >
          <div
            className="relative max-w-lg w-full bg-[#FFFDF9] rounded-2xl overflow-hidden shadow-2xl border border-[#EADBBE] animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header: Anonymous Verified Feedback */}
            <div className="px-4 sm:px-5 py-3.5 bg-[#FAF5EB] border-b border-[#EADBBE] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1C1917] flex items-center gap-1.5">
                    <span>Verified Customer Review</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    {selectedScreenshot.location || "Real Customer Conversation"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedScreenshot(null)}
                className="p-1.5 rounded-full hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Enlarged Screenshot Image */}
            <div className="p-3 bg-stone-950 overflow-y-auto flex items-center justify-center max-h-[55vh]">
              <img
                src={selectedScreenshot.imageUrl}
                alt="Customer feedback screenshot"
                className="w-auto h-auto max-w-full max-h-[50vh] object-contain rounded-xl shadow-md"
              />
            </div>

            {/* Modal Footer with Full Details Revealed on Click */}
            <div className="p-4 sm:p-5 bg-white border-t border-[#EADBBE] space-y-2.5 flex-shrink-0 overflow-y-auto max-h-[30vh]">
              {selectedScreenshot.piece && (
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold">
                  Verified Piece: {selectedScreenshot.piece}
                </span>
              )}
              {selectedScreenshot.caption && (
                <div className="space-y-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
                    Customer Review:
                  </p>
                  <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-light italic bg-[#FAF7F2] p-3 rounded-xl border border-[#EADBBE]/70">
                    &ldquo;{selectedScreenshot.caption}&rdquo;
                  </p>
                </div>
              )}
              <div className="pt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100">
                <span>{selectedScreenshot.date || "Verified WhatsApp Order"}</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  100% Authentic Customer Feedback
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal Player (Plays with sound when clicked) */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-sm sm:max-w-md bg-stone-900 rounded-2xl overflow-hidden shadow-2xl border border-stone-700 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedVideo(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
              aria-label="Close video player"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video Player */}
            <div className="relative aspect-[9/16] bg-black flex items-center justify-center">
              <video
                src={selectedVideo.videoUrl}
                poster={selectedVideo.poster}
                autoPlay
                controls
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Tag Bar */}
            <div className="p-4 bg-stone-950 flex items-center justify-between text-white border-t border-stone-800">
              <div>
                <p className="text-xs font-semibold">{selectedVideo.productTitle}</p>
                <p className="text-[11px] text-purple-300 font-mono">₹{selectedVideo.productPrice}</p>
              </div>

              {selectedVideo.productSlug && selectedVideo.productSlug !== "all" && (
                <Link
                  href={`/products/${selectedVideo.productSlug}`}
                  className="px-4 py-1.5 rounded-full bg-white text-stone-900 text-xs font-semibold hover:bg-stone-200 transition-colors"
                >
                  Shop Piece
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
