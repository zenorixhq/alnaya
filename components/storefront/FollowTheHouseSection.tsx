"use client";

import { useState, useEffect, useRef } from "react";
import { Instagram, Play, Volume2, VolumeX, X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

export interface HousePanel {
  id: string | number;
  image: string;
  videoUrl?: string;
  alt: string;
  caption?: string;
  handle?: string;
  instagramLink?: string;
}

const defaultPanels: HousePanel[] = [
  {
    id: 1,
    image: "/images/follow-house/panel-1.jpg",
    alt: "Alnaya Fine Jewelry - Celestial star, crescent moon, and cross charm pendant chains",
    caption: "Celestial Charms & Star Pendants",
    handle: "@alnaya.in",
    instagramLink: "https://www.instagram.com/alnaya.in?psln=cDNzY3liNjltb203",
  },
  {
    id: 2,
    image: "/images/follow-house/panel-2.jpg",
    alt: "Alnaya Fine Jewelry - Dainty gold waist chain worn with traditional festive attire",
    caption: "Dainty Gold Waist Chain",
    handle: "@alnaya.in",
    instagramLink: "https://www.instagram.com/alnaya.in?psln=cDNzY3liNjltb203",
  },
  {
    id: 3,
    image: "/images/follow-house/panel-3.jpg",
    alt: "Alnaya Fine Jewelry - Minimalist crystal cross neck chain",
    caption: "Minimal Cross Neck Chain",
    handle: "@alnaya.in",
    instagramLink: "https://www.instagram.com/alnaya.in?psln=cDNzY3liNjltb203",
  },
  {
    id: 4,
    image: "/images/follow-house/panel-4.jpg",
    alt: "Alnaya Fine Jewelry - Artisan statement jhumka earrings in gold and silver finish",
    caption: "Artisan Jhumka Collection",
    handle: "@alnaya.in",
    instagramLink: "https://www.instagram.com/alnaya.in?psln=cDNzY3liNjltb203",
  },
  {
    id: 5,
    image: "/images/follow-house/panel-5.jpg",
    alt: "Alnaya Fine Jewelry - Pavé crystal cross pendant necklace",
    caption: "Pavé Cross Pendant Necklace",
    handle: "@alnaya.in",
    instagramLink: "https://www.instagram.com/alnaya.in?psln=cDNzY3liNjltb203",
  },
];

export function FollowTheHouseSection() {
  const instagramUrl = "https://www.instagram.com/alnaya.in?psln=cDNzY3liNjltb203";
  const [panels, setPanels] = useState<HousePanel[]>(defaultPanels);
  const [activeVideoModal, setActiveVideoModal] = useState<HousePanel | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch live Follow The House items from Admin Panel / API
  useEffect(() => {
    const fetchPanels = () => {
      fetch("/api/reviews?t=" + Date.now(), { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.instagramVideos)) {
            if (data.instagramVideos.length > 0) {
              const mapped: HousePanel[] = data.instagramVideos.map((item: any, idx: number) => {
                const isCorrupted =
                  !item.poster ||
                  typeof item.poster !== "string" ||
                  item.poster.includes("radiant finish") ||
                  (item.poster.startsWith("data:") && item.poster.length > 50000);
                const cleanImage = !isCorrupted
                  ? item.poster
                  : (defaultPanels[idx % defaultPanels.length]?.image || `/images/follow-house/panel-${(idx % 5) + 1}.jpg`);

                return {
                  id: item.id || idx + 1,
                  image: cleanImage,
                  videoUrl: item.videoUrl || "",
                  alt: item.title ? `Alnaya Fine Jewelry - ${item.title}` : `Alnaya Fine Jewelry`,
                  caption: item.title || item.caption || "",
                  handle: item.handle ? item.handle.replace(/@?gleamnest\.in/gi, "@alnaya.in").replace(/gleamnest/gi, "alnaya") : "@alnaya.in",
                  instagramLink:
                    item.instagramLink && !item.instagramLink.includes("gleamnest")
                      ? item.instagramLink
                      : instagramUrl,
                };
              });
              setPanels(mapped);
            } else {
              setPanels([]);
            }
          }
        })
        .catch(() => {});
    };

    fetchPanels();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "alnaya_admin_instavideos" || e.key === "alnaya_follow_house_updated") {
        fetchPanels();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [instagramUrl]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollContainerRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handlePanelClick = (e: React.MouseEvent, panel: HousePanel) => {
    const isDirectVideo =
      panel.videoUrl &&
      (panel.videoUrl.endsWith(".mp4") ||
        panel.videoUrl.endsWith(".webm") ||
        panel.videoUrl.includes("blob.vercel-storage.com") ||
        panel.videoUrl.startsWith("/uploads/") ||
        panel.videoUrl.startsWith("data:video") ||
        panel.videoUrl.includes("assets.mixkit.co"));

    if (isDirectVideo) {
      e.preventDefault();
      setActiveVideoModal(panel);
    }
  };

  if (panels.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-[#FAF7F2] pt-14 sm:pt-20 md:pt-24 text-[#1C1917] overflow-hidden border-t border-[#EADBBE]/60">
      {/* Section Header matching Maison editorial reference */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8 sm:mb-12">
        <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-[#7E22CE] block mb-2 sm:mb-3">
          FOLLOW THE HOUSE
        </span>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-editorial text-4xl sm:text-6xl md:text-7xl font-normal text-[#1A150D] hover:opacity-75 transition-opacity duration-300 tracking-tight inline-block lowercase"
        >
          @alnaya.in
        </a>
      </div>

      {/* Full-Bleed Edge-to-Edge Scrollable Strip (Filling the page and scrollable) */}
      <div className="relative w-full group/strip">
        {/* Left Arrow Button (Desktop) */}
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-stone-900 shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-300 opacity-0 group-hover/strip:opacity-100 hover:scale-105 active:scale-95 hidden md:flex"
        >
          <ChevronLeft className="w-5 h-5 text-stone-800" />
        </button>

        {/* Right Arrow Button (Desktop) */}
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-stone-900 shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-300 opacity-0 group-hover/strip:opacity-100 hover:scale-105 active:scale-95 hidden md:flex"
        >
          <ChevronRight className="w-5 h-5 text-stone-800" />
        </button>

        {/* The Scrollable Horizontal Strip Filling the Entire Page Width */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-0 w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] select-none"
        >
          {panels.map((panel, idx) => {
            const hasPlayableVideo =
              panel.videoUrl &&
              (panel.videoUrl.endsWith(".mp4") ||
                panel.videoUrl.endsWith(".webm") ||
                panel.videoUrl.includes("blob.vercel-storage.com") ||
                panel.videoUrl.startsWith("/uploads/") ||
                panel.videoUrl.startsWith("data:video") ||
                panel.videoUrl.includes("assets.mixkit.co"));

            return (
              <a
                key={panel.id || idx}
                href={panel.instagramLink || instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => handlePanelClick(e, panel)}
                className="group relative flex-shrink-0 w-[70vw] sm:w-[42vw] md:w-[30vw] lg:w-[20vw] xl:w-[16.666vw] aspect-[3/5] snap-start overflow-hidden bg-stone-900 focus:outline-none cursor-pointer"
                title={`Follow @alnaya.in on Instagram - ${panel.caption || panel.alt}`}
              >
                <img
                  src={panel.image}
                  alt={panel.alt}
                  onError={(e) => {
                    const fallback = defaultPanels[idx % defaultPanels.length]?.image || `/images/follow-house/panel-${(idx % 5) + 1}.jpg`;
                    if ((e.currentTarget as HTMLImageElement).src !== fallback) {
                      (e.currentTarget as HTMLImageElement).src = fallback;
                    }
                  }}
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Play Video Badge if Reel has video file */}
                {hasPlayableVideo && (
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-md group-hover:scale-110 transition-transform">
                    <Play className="w-3.5 h-3.5 fill-white translate-x-0.5 text-white" />
                  </div>
                )}

                {/* Hover Darkening & Centered Instagram Badge */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors duration-300 flex items-center justify-center p-4">
                  <div className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-[#1C1917] px-3.5 py-1.5 rounded-full shadow-xl text-xs font-medium">
                    {hasPlayableVideo ? (
                      <>
                        <Play className="w-3.5 h-3.5 text-[#7E22CE] fill-[#7E22CE]" />
                        <span className="font-editorial text-xs sm:text-sm tracking-wide">Watch Reel</span>
                      </>
                    ) : (
                      <>
                        <Instagram className="w-3.5 h-3.5 text-[#7E22CE]" />
                        <span className="font-editorial text-xs sm:text-sm tracking-wide lowercase">@alnaya.in</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Editorial Caption Gradient Overlay */}
                {panel.caption && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 sm:p-4 pt-8 transition-opacity duration-300 opacity-90 lg:opacity-0 lg:group-hover:opacity-100">
                    <p className="text-white text-xs sm:text-sm font-medium tracking-wide line-clamp-1">
                      {panel.caption}
                    </p>
                    <p className="text-purple-200 text-[10px] sm:text-xs font-light tracking-wider uppercase mt-0.5">
                      {hasPlayableVideo ? "Play Video Reel 🎬" : "View on Instagram →"}
                    </p>
                  </div>
                )}
              </a>
            );
          })}
        </div>
      </div>

      {/* Playable Instagram Video Reel Modal */}
      {activeVideoModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveVideoModal(null)}
        >
          <div
            className="relative w-full max-w-sm sm:max-w-md bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 inset-x-0 z-10 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-pink-500/20 text-[#E1306C] flex items-center justify-center border border-white/20">
                  <Instagram className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-editorial text-sm font-semibold leading-tight text-white">
                    {activeVideoModal.caption || activeVideoModal.alt}
                  </h4>
                  <p className="text-[10px] text-stone-300 lowercase font-mono">
                    {activeVideoModal.handle || "@alnaya.in"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black transition-colors"
                  aria-label="Toggle mute"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveVideoModal(null)}
                  className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Video Player */}
            <div className="relative aspect-[9/16] w-full bg-black flex items-center justify-center">
              {activeVideoModal.videoUrl ? (
                <video
                  ref={modalVideoRef}
                  src={activeVideoModal.videoUrl}
                  poster={activeVideoModal.image}
                  autoPlay
                  loop
                  playsInline
                  muted={isMuted}
                  controls={false}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={activeVideoModal.image}
                  alt={activeVideoModal.alt}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/images/follow-house/panel-1.jpg";
                  }}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Modal Footer with Instagram CTA */}
            <div className="p-4 bg-stone-950 border-t border-white/10 flex items-center justify-between gap-3">
              <span className="text-xs text-stone-300 font-light truncate">
                {activeVideoModal.caption || "Follow @alnaya.in on Instagram"}
              </span>
              <a
                href={activeVideoModal.instagramLink || instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-[#E1306C] hover:bg-[#c9245c] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
              >
                <span>Instagram</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}