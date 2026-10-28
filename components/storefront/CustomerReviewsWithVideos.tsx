"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Play, Volume2, VolumeX, ArrowLeft, ArrowRight, Sparkles, CheckCircle2, X } from "lucide-react";

interface Review {
  id: number | string;
  quote: string;
  author: string;
  location: string;
  piece: string;
}

interface VideoReel {
  id: number | string;
  influencer: string;
  handle: string;
  title: string;
  videoUrl: string;
  poster: string;
  views: string;
  productTitle: string;
  productSlug: string;
  productPrice: number;
}

import initialReviewData from "@/data/clientReviews.json";

const defaultReviews: Review[] = (initialReviewData.reviews || []) as Review[];
const defaultVideoReels: VideoReel[] = (initialReviewData.videoReels || []) as VideoReel[];

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
      className="group relative aspect-[9/15] rounded-xl overflow-hidden bg-stone-900 shadow-md cursor-pointer border border-stone-300/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-out"
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
        {/* Top Views & Sound Toggle */}
        <div className="flex items-center justify-between text-[10px] pointer-events-auto">
          <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{reel.views}</span>
          </span>

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
            <span className="inline-block text-[9px] text-amber-300 font-semibold bg-white/10 px-1.5 py-0.5 rounded">
              {reel.productTitle}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function CustomerReviewsWithVideos() {
  const [reviews, setReviews] = useState<Review[]>(defaultReviews);
  const [videoReels, setVideoReels] = useState<VideoReel[]>(defaultVideoReels);
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<VideoReel | null>(null);

  useEffect(() => {
    fetch(`/api/reviews?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        }
        if (Array.isArray(data.videoReels)) {
          setVideoReels(data.videoReels);
        }
      })
      .catch((e) => console.error("Could not fetch reviews:", e));
  }, []);

  const nextReview = () => {
    if (reviews.length === 0) return;
    setActiveReviewIdx((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    if (reviews.length === 0) return;
    setActiveReviewIdx((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section className="w-full bg-[#FAF7F2] py-10 sm:py-12 md:py-14 border-t border-[#EADBBE]/80 text-[#1C1917]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#8F7234] font-medium block">
            IN THEIR WORDS
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl font-normal tracking-tight text-[#1C1917]">
            From our customers
          </h2>
        </div>

        {/* Dual Showcase: Video Reels on Left + Review Quotes on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Side: Client & Influencer Video Reels */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-300/60">
              <span className="text-xs uppercase tracking-widest font-semibold text-stone-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Influencer & Client Reels</span>
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

          {/* Right Side: Editorial Customer Reviews Carousel */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
              {reviews
                .slice(activeReviewIdx, activeReviewIdx + 2)
                .concat(
                  reviews.slice(0, Math.max(0, activeReviewIdx + 2 - reviews.length))
                )
                .slice(0, 2)
                .map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[#FAF7F0] border-l-2 border-stone-400/80 p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-sm min-h-[220px]"
                  >
                    <div className="space-y-4">
                      {/* Teal Circular Quote Badge */}
                      <div className="w-7 h-7 rounded-full bg-[#114E45] text-white flex items-center justify-center text-sm font-serif font-black">
                        “
                      </div>

                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-light italic">
                        &ldquo;{item.quote}&rdquo;
                      </p>
                    </div>

                    <div className="pt-4 border-t border-stone-200/80 space-y-0.5">
                      <p className="text-xs font-semibold text-stone-900">{item.author}</p>
                      <p className="text-[11px] text-stone-500 font-light">{item.location}</p>
                      <p className="text-[10px] text-amber-700 font-medium pt-1">
                        Verified Piece: {item.piece}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={prevReview}
                  className="w-9 h-9 rounded-full border border-stone-300 hover:border-stone-900 flex items-center justify-center text-stone-700 hover:text-stone-900 transition-colors"
                  aria-label="Previous review"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextReview}
                  className="w-9 h-9 rounded-full border border-stone-300 hover:border-stone-900 flex items-center justify-center text-stone-700 hover:text-stone-900 transition-colors"
                  aria-label="Next review"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-stone-500">
                <CheckCircle2 className="w-4 h-4 text-[#114E45]" />
                <span>Verified buyers from Kerala, Karnataka & Pan-India</span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                <p className="text-[11px] text-amber-400 font-mono">₹{selectedVideo.productPrice}</p>
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
