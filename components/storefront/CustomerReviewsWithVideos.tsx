"use client";
import { useReviewsData } from "@/hooks/useReviewsData";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useProductStore } from "@/store/useProductStore";
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
  Star,
  ShoppingBag,
  ArrowRight,
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
  productTitle?: string;
  productSlug?: string;
  productPrice?: number;
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
  productSlug?: string;
  productPrice?: number;
}

export function resolveReelProduct(
  item: { productSlug?: string; productTitle?: string; productPrice?: number } | null | undefined,
  products: any[]
): { href: string; title: string; price?: number; image?: string } | null {
  if (!item) return null;
  const rawSlug = (item.productSlug || "").trim();
  const rawTitle = (item.productTitle || "").trim();
  const rawPrice = item.productPrice;

  // 1. Direct valid slug match
  if (rawSlug && rawSlug !== "all" && rawSlug !== "none" && rawSlug !== "#") {
    const directMatch = Array.isArray(products)
      ? products.find((p) => p?.slug && p.slug.toLowerCase() === rawSlug.toLowerCase())
      : null;

    if (directMatch) {
      return {
        href: `/products/${directMatch.slug}`,
        title: directMatch.title || rawTitle || "Shop Piece",
        price: directMatch.price ?? rawPrice,
        image: Array.isArray(directMatch.images) && directMatch.images.length > 0 ? directMatch.images[0] : undefined,
      };
    }

    return {
      href: `/products/${rawSlug}`,
      title: rawTitle || "Shop Piece",
      price: rawPrice,
    };
  }

  // 2. If productTitle exists, match against store catalog
  if (rawTitle) {
    const q = rawTitle.toLowerCase();
    if (Array.isArray(products) && products.length > 0) {
      const match = products.find((p) => {
        if (!p) return false;
        const pTitle = (p.title || "").toLowerCase();
        const pSlug = (p.slug || "").toLowerCase();
        return (
          pTitle === q ||
          pSlug === q ||
          pTitle.includes(q) ||
          q.includes(pTitle) ||
          pSlug.includes(q)
        );
      });

      if (match) {
        return {
          href: `/products/${match.slug}`,
          title: match.title,
          price: match.price ?? rawPrice,
          image: Array.isArray(match.images) && match.images.length > 0 ? match.images[0] : undefined,
        };
      }
    }

    // 3. Fallback to catalog search query
    return {
      href: `/products?search=${encodeURIComponent(rawTitle)}`,
      title: rawTitle,
      price: rawPrice,
    };
  }

  return null;
}

type CarouselItem =
  | { kind: "video"; id: string; data: VideoReel }
  | { kind: "screenshot"; id: string; data: FeedbackScreenshot };

function VideoCardPreview({
  reel,
  products = [],
  onClick,
}: {
  reel: VideoReel;
  products?: any[];
  onClick: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const productInfo = useMemo(() => resolveReelProduct(reel, products), [reel, products]);

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
      className="group relative w-[calc((100vw-42px)/2)] sm:w-[calc((100vw-56px)/3)] md:w-[30vw] lg:w-[24vw] xl:w-[20vw] flex-shrink-0 aspect-[9/15] snap-start rounded-xl sm:rounded-2xl overflow-hidden bg-stone-900 shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-[#7E22CE] transition-all duration-300 ease-out cursor-pointer border border-[#EADBBE] select-none"
    >
      {/* Video / Poster Media */}
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
          loading="lazy"
        />
      )}

      {/* Top Floating Badges */}
      <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10 pointer-events-none">
        <span className="bg-black/60 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full flex items-center gap-1 sm:gap-1.5 border border-white/20 shadow-sm pointer-events-auto">
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>Video Reel</span>
        </span>

        {isDirectVideo && (
          <button
            type="button"
            onClick={toggleSound}
            className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur flex items-center justify-center text-white transition-all shadow pointer-events-auto"
            title={isMuted ? "Unmute sound" : "Mute sound"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
          </button>
        )}
      </div>

      {/* Center Hover Action */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 text-stone-900 flex items-center justify-center shadow-xl">
          <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5 text-stone-900" />
        </div>
      </div>

      {/* Bottom Editorial Details Gradient */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2.5 sm:p-3.5 pt-7 sm:pt-10 text-white space-y-1 sm:space-y-1.5 pointer-events-none">
        <p className="text-xs sm:text-sm font-semibold text-white line-clamp-1 leading-snug drop-shadow-sm">
          {reel.title}
        </p>
        <p className="text-[11px] text-white/80 font-medium drop-shadow-sm">
          {reel.handle}
        </p>
        <div className="flex items-center justify-between pt-0.5">
          {productInfo ? (
            <Link
              href={productInfo.href}
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto inline-flex items-center gap-1 text-[9px] sm:text-[10px] text-purple-200 hover:text-white font-semibold bg-white/20 hover:bg-purple-700/80 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/25 hover:border-purple-300 transition-all truncate max-w-[140px] shadow-sm active:scale-95"
              title={`Shop piece: ${productInfo.title}`}
            >
              <ShoppingBag className="w-2.5 h-2.5 text-purple-300 shrink-0" />
              <span className="truncate">{productInfo.title}</span>
              {productInfo.price ? (
                <span className="font-mono text-purple-200 ml-0.5">₹{productInfo.price}</span>
              ) : null}
            </Link>
          ) : reel.productTitle ? (
            <span className="text-[9px] sm:text-[10px] text-purple-200 font-semibold bg-white/15 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/10 truncate max-w-[140px]">
              {reel.productTitle}
            </span>
          ) : (
            <span />
          )}
          <span className="text-[10px] text-purple-300 font-medium group-hover:text-white transition-colors">
            Play Reel →
          </span>
        </div>
      </div>
    </div>
  );
}

function ScreenshotCardPreview({
  item,
  products = [],
  onClick,
}: {
  item: FeedbackScreenshot;
  products?: any[];
  onClick: () => void;
}) {
  const productInfo = useMemo(
    () =>
      resolveReelProduct(
        {
          productSlug: item.productSlug,
          productTitle: item.productTitle || item.piece,
          productPrice: item.productPrice,
        },
        products
      ),
    [item.productSlug, item.productTitle, item.piece, item.productPrice, products]
  );

  return (
    <div
      onClick={onClick}
      className="group relative w-[calc((100vw-42px)/2)] sm:w-[calc((100vw-56px)/3)] md:w-[30vw] lg:w-[24vw] xl:w-[20vw] flex-shrink-0 aspect-[9/15] snap-start rounded-xl sm:rounded-2xl overflow-hidden bg-stone-950 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer border border-[#EADBBE] select-none"
    >
      {/* High Quality Screenshot Preview */}
      <img
        src={item.imageUrl}
        alt={item.caption || "Customer feedback screenshot"}
        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
        loading="lazy"
      />

      {/* Top Floating Badge */}
      <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10 pointer-events-none">
        <span className="bg-black/60 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full flex items-center gap-1 sm:gap-1.5 border border-white/20 shadow-sm pointer-events-auto">
          <MessageCircle className="w-3 h-3 text-purple-400 fill-purple-400" />
          <span>Review</span>
        </span>
        <span className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-xs flex items-center justify-center text-white text-[11px] shadow pointer-events-auto group-hover:scale-105 transition-transform">
          <Maximize2 className="w-3.5 h-3.5" />
        </span>
      </div>

      {/* Center Hover Action */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 w-12 h-12 rounded-full bg-white/95 text-stone-900 flex items-center justify-center shadow-xl">
          <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-stone-800" />
        </div>
      </div>

      {/* Bottom Editorial Details Gradient */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-2.5 sm:p-3.5 pt-7 sm:pt-12 text-white space-y-1 sm:space-y-1.5 pointer-events-none">
        <div className="flex items-center gap-1.5">
          <p className="text-xs sm:text-sm font-semibold text-white drop-shadow-sm truncate">
            {item.customerName || "Verified Collector"}
          </p>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        </div>

        {item.caption && (
          <p className="text-[11px] text-stone-200 italic line-clamp-2 leading-relaxed drop-shadow-sm font-light">
            &ldquo;{item.caption}&rdquo;
          </p>
        )}

        <div className="flex items-center justify-between pt-0.5">
          {productInfo ? (
            <Link
              href={productInfo.href}
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto inline-flex items-center gap-1 text-[9px] sm:text-[10px] text-purple-200 hover:text-white font-semibold bg-white/20 hover:bg-purple-700/80 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/25 hover:border-purple-300 transition-all truncate max-w-[140px] shadow-sm active:scale-95"
              title={`Shop piece: ${productInfo.title}`}
            >
              <ShoppingBag className="w-2.5 h-2.5 text-purple-300 shrink-0" />
              <span className="truncate">{productInfo.title}</span>
              {productInfo.price ? (
                <span className="font-mono text-purple-200 ml-0.5">₹{productInfo.price}</span>
              ) : null}
            </Link>
          ) : item.piece ? (
            <span className="text-[9px] sm:text-[10px] text-purple-200 font-medium bg-white/15 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/10 truncate max-w-[140px]">
              {item.piece}
            </span>
          ) : (
            <span />
          )}
          <span className="text-[10px] text-purple-300 font-medium group-hover:text-white transition-colors">
            View Review →
          </span>
        </div>
      </div>
    </div>
  );
}

export function CustomerReviewsWithVideos() {
  const products = useProductStore((s) => s.products);
  const { videoReels, feedbackScreenshots, reviews: reviewQuotes } = useReviewsData();
  const [selectedVideo, setSelectedVideo] = useState<VideoReel | null>(null);
  const [selectedScreenshot, setSelectedScreenshot] = useState<FeedbackScreenshot | null>(null);

  const modalProduct = useMemo(
    () => (selectedVideo ? resolveReelProduct(selectedVideo, products) : null),
    [selectedVideo, products]
  );

  const screenshotProductInfo = useMemo(
    () =>
      selectedScreenshot
        ? resolveReelProduct(
            {
              productSlug: selectedScreenshot.productSlug,
              productTitle: selectedScreenshot.productTitle || selectedScreenshot.piece,
              productPrice: selectedScreenshot.productPrice,
            },
            products
          )
        : null,
    [selectedScreenshot, products]
  );

  const [activeTab, setActiveTab] = useState<"all" | "videos" | "screenshots">("all");

  const carouselRef = useRef<HTMLDivElement>(null);
  const [isLeftDisabled, setIsLeftDisabled] = useState(true);
  const [isRightDisabled, setIsRightDisabled] = useState(false);

  const quotesScrollRef = useRef<HTMLDivElement>(null);
  const [isQuotesLeftDisabled, setIsQuotesLeftDisabled] = useState(true);
  const [isQuotesRightDisabled, setIsQuotesRightDisabled] = useState(false);

  // Interleave Video Reels & Feedback Screenshots into a single curated stream
  const allItems = useMemo<CarouselItem[]>(() => {
    const list: CarouselItem[] = [];
    const maxLen = Math.max(videoReels.length, feedbackScreenshots.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < videoReels.length) {
        list.push({ kind: "video", id: `video-${videoReels[i].id}`, data: videoReels[i] });
      }
      if (i < feedbackScreenshots.length) {
        list.push({ kind: "screenshot", id: `screenshot-${feedbackScreenshots[i].id}`, data: feedbackScreenshots[i] });
      }
    }
    return list;
  }, [videoReels, feedbackScreenshots]);

  const visibleItems = useMemo<CarouselItem[]>(() => {
    if (activeTab === "videos") return allItems.filter((it) => it.kind === "video");
    if (activeTab === "screenshots") return allItems.filter((it) => it.kind === "screenshot");
    return allItems;
  }, [allItems, activeTab]);

  // Update carousel scroll buttons
  const updateScrollButtons = () => {
    const el = carouselRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setIsLeftDisabled(scrollLeft <= 6);
    setIsRightDisabled(scrollLeft + clientWidth >= scrollWidth - 6);
  };

  useEffect(() => {
    updateScrollButtons();
    const el = carouselRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);

    const timer = setTimeout(updateScrollButtons, 100);

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
      clearTimeout(timer);
    };
  }, [visibleItems]);

  const scrollPrev = () => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({ left: -Math.max(200, el.clientWidth * 0.9), behavior: "smooth" });
  };

  const scrollNext = () => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({ left: Math.max(200, el.clientWidth * 0.9), behavior: "smooth" });
  };

  // Quotes scroll logic
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
    <section className="w-full bg-[#FAF7F2] py-12 sm:py-16 md:py-20 border-t border-[#EADBBE]/80 text-[#1C1917] font-glacial">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-8 sm:space-y-10">
        
        {/* Editorial Section Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] text-[#7E22CE] font-bold block">
            IN THEIR WORDS
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#1C1917]">
            The love we get
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light max-w-lg mx-auto">
            Real wear tests, customer styling, and unedited WhatsApp chats from women cherishing their ALNAYA heirlooms.
          </p>
        </div>

        {/* Carousel Filter Pills & Scroll Controls Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#EADBBE]/70 pb-3">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "all"
                  ? "bg-[#1C1917] text-white shadow-xs"
                  : "bg-white text-stone-600 hover:text-stone-900 border border-stone-200/90"
              }`}
            >
              All Moments ({allItems.length})
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === "videos"
                  ? "bg-[#7E22CE] text-white shadow-xs"
                  : "bg-white text-stone-600 hover:text-[#7E22CE] border border-stone-200/90"
              }`}
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Video Reels ({videoReels.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("screenshots")}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === "screenshots"
                  ? "bg-[#7E22CE] text-white shadow-xs"
                  : "bg-white text-stone-600 hover:text-[#7E22CE] hover:border-[#7E22CE]/60 border border-stone-200/90"
              }`}
            >
              <MessageCircle className="w-3 h-3 text-[#7E22CE] fill-[#7E22CE]" />
              <span>Reviews ({feedbackScreenshots.length})</span>
            </button>
          </div>

          {/* Left / Right Chevron Navigation Controls */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={isLeftDisabled}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                isLeftDisabled
                  ? "border-stone-200 text-stone-300 bg-stone-100/50 cursor-not-allowed opacity-40"
                  : "border-stone-300 hover:border-stone-900 text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-50 active:scale-95 shadow-xs cursor-pointer"
              }`}
              aria-label="Previous carousel cards"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={isRightDisabled}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                isRightDisabled
                  ? "border-stone-200 text-stone-300 bg-stone-100/50 cursor-not-allowed opacity-40"
                  : "border-stone-300 hover:border-stone-900 text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-50 active:scale-95 shadow-xs cursor-pointer"
              }`}
              aria-label="Next carousel cards"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ONE SINGLE SCROLLABLE CARD CAROUSEL FOR BOTH VIDEOS AND SCREENSHOTS */}
        <div
          ref={carouselRef}
          className="flex gap-2.5 sm:gap-4 md:gap-5 overflow-x-auto pb-4 pt-1 px-0.5 no-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {visibleItems.map((item) => {
            if (item.kind === "video") {
              return (
                <VideoCardPreview
                  key={item.id}
                  reel={item.data}
                  products={products}
                  onClick={() => setSelectedVideo(item.data)}
                />
              );
            }
            return (
              <ScreenshotCardPreview
                key={item.id}
                item={item.data}
                products={products}
                onClick={() => setSelectedScreenshot(item.data)}
              />
            );
          })}
        </div>

        {/* Editorial Customer Review Quotes Ticker */}
        {reviewQuotes && reviewQuotes.length > 0 && (
          <div className="pt-6 sm:pt-10 border-t border-[#EADBBE]/70 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-editorial text-xl sm:text-2xl text-[#1C1917]">
                  What Our Collectors Say
                </h3>
                <p className="text-xs text-stone-500 font-light">
                  Verified heirloom feedback from across India
                </p>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={scrollQuotesPrev}
                  disabled={isQuotesLeftDisabled}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border flex items-center justify-center transition-all ${
                    isQuotesLeftDisabled
                      ? "border-stone-200 text-stone-300 bg-stone-100/50 cursor-not-allowed opacity-35"
                      : "border-stone-300 hover:border-stone-900 text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-50 active:scale-95 shadow-xs cursor-pointer"
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
                      ? "border-stone-200 text-stone-300 bg-stone-100/50 cursor-not-allowed opacity-35"
                      : "border-stone-300 hover:border-stone-900 text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-50 active:scale-95 shadow-xs cursor-pointer"
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
                  className="w-[280px] xs:w-[320px] sm:w-[380px] min-w-[280px] xs:min-w-[320px] sm:min-w-[380px] flex-shrink-0 snap-start bg-[#FFFDF9] border border-[#EADBBE] rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-md hover:border-purple-400/50 transition-all"
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

      {/* Screenshot Lightbox Modal (Clickable with Full Details revealed on click) */}
      {selectedScreenshot && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedScreenshot(null)}
        >
          <div
            className="relative max-w-lg w-full bg-[#FFFDF9] rounded-2xl overflow-hidden shadow-2xl border border-[#EADBBE] animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-4 sm:px-5 py-3.5 bg-[#FAF5EB] border-b border-[#EADBBE] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-[#7E22CE] flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1C1917] flex items-center gap-1.5">
                    <span>{selectedScreenshot.customerName || "Verified Customer"}</span>
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

            {/* Modal Footer with Tagged Product Bar & Authentic Feedback */}
            <div className="p-3.5 sm:p-4 bg-white border-t border-[#EADBBE] space-y-3 flex-shrink-0">
              {/* Tagged Product Showcase Bar */}
              {(screenshotProductInfo || selectedScreenshot.piece || selectedScreenshot.productTitle) && (
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EADBBE] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    {screenshotProductInfo?.image ? (
                      <img
                        src={screenshotProductInfo.image}
                        alt={screenshotProductInfo.title}
                        className="w-11 h-11 rounded-lg object-cover border border-[#EADBBE] shrink-0"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 shrink-0 border border-purple-200">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold truncate text-stone-900">
                        {screenshotProductInfo?.title || selectedScreenshot.productTitle || selectedScreenshot.piece || "Alnaya Jewelry"}
                      </p>
                      {(screenshotProductInfo?.price || selectedScreenshot.productPrice) ? (
                        <p className="text-[11px] text-purple-700 font-bold font-mono">
                          ₹{screenshotProductInfo?.price || selectedScreenshot.productPrice}
                        </p>
                      ) : (
                        <p className="text-[10px] text-stone-500">Verified Client Purchase</p>
                      )}
                    </div>
                  </div>

                  {screenshotProductInfo?.href ? (
                    <Link
                      href={screenshotProductInfo.href}
                      className="px-4 py-2 rounded-full bg-[#1C1917] hover:bg-purple-900 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0 active:scale-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-purple-200" />
                      <span>Shop Piece</span>
                      <ArrowRight className="w-3 h-3 text-white/80" />
                    </Link>
                  ) : (
                    <Link
                      href="/products"
                      className="px-4 py-2 rounded-full bg-[#1C1917] hover:bg-purple-900 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0 active:scale-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-purple-200" />
                      <span>Explore Pieces</span>
                    </Link>
                  )}
                </div>
              )}

              {selectedScreenshot.caption && (
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                    Customer Review:
                  </p>
                  <p className="text-xs text-stone-800 leading-relaxed font-light italic bg-[#FAF7F2]/60 p-2.5 rounded-lg border border-stone-200">
                    &ldquo;{selectedScreenshot.caption}&rdquo;
                  </p>
                </div>
              )}

              <div className="pt-1 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100">
                <span>{selectedScreenshot.date || "Verified WhatsApp Order"}</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
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

            {/* Product Tag Bar & Details */}
            <div className="p-3.5 sm:p-4 bg-stone-950 flex items-center justify-between text-white border-t border-stone-800 gap-3">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                {modalProduct?.image && (
                  <img
                    src={modalProduct.image}
                    alt={modalProduct.title}
                    className="w-10 h-10 rounded-lg object-cover border border-stone-700 shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold truncate text-white">
                    {modalProduct?.title || selectedVideo.productTitle || selectedVideo.title}
                  </p>
                  <p className="text-[11px] text-purple-300 font-mono">
                    {modalProduct?.price || selectedVideo.productPrice
                      ? `₹${modalProduct?.price || selectedVideo.productPrice}`
                      : selectedVideo.handle}
                  </p>
                </div>
              </div>

              {modalProduct?.href ? (
                <Link
                  href={modalProduct.href}
                  className="px-4 py-2 rounded-full bg-white hover:bg-stone-100 text-stone-900 text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0 active:scale-95"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-purple-700" />
                  <span>Shop Piece</span>
                  <ArrowRight className="w-3 h-3 text-stone-600" />
                </Link>
              ) : (
                <Link
                  href="/products"
                  className="px-4 py-2 rounded-full bg-white hover:bg-stone-100 text-stone-900 text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0 active:scale-95"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-purple-700" />
                  <span>Explore Pieces</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
