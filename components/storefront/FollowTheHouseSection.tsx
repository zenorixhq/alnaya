"use client";

import { Instagram } from "lucide-react";

interface HousePanel {
  id: number;
  image: string;
  alt: string;
  caption?: string;
}

const defaultPanels: HousePanel[] = [
  {
    id: 1,
    image: "/images/follow-house/panel-1.jpg",
    alt: "Alnaya Fine Jewelry - Celestial star, crescent moon, and cross charm pendant chains",
    caption: "Celestial Charms & Star Pendants",
  },
  {
    id: 2,
    image: "/images/follow-house/panel-2.jpg",
    alt: "Alnaya Fine Jewelry - Dainty gold waist chain worn with traditional festive attire",
    caption: "Dainty Gold Waist Chain",
  },
  {
    id: 3,
    image: "/images/follow-house/panel-3.jpg",
    alt: "Alnaya Fine Jewelry - Minimalist crystal cross neck chain",
    caption: "Minimal Cross Neck Chain",
  },
  {
    id: 4,
    image: "/images/follow-house/panel-4.jpg",
    alt: "Alnaya Fine Jewelry - Artisan statement jhumka earrings in gold and silver finish",
    caption: "Artisan Jhumka Collection",
  },
  {
    id: 5,
    image: "/images/follow-house/panel-5.jpg",
    alt: "Alnaya Fine Jewelry - Pavé crystal cross pendant necklace",
    caption: "Pavé Cross Pendant Necklace",
  },
];

export function FollowTheHouseSection() {
  const instagramUrl = "https://www.instagram.com/alnaya.in?psln=cDNzY3liNjltb203";

  return (
    <section className="w-full bg-[#FAF7F2] pt-14 sm:pt-20 md:pt-24 text-[#1C1917] overflow-hidden">
      {/* Section Header matching Maison editorial reference */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8 sm:mb-12">
        <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-[#8F7234] block mb-2 sm:mb-3">
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

      {/* Seamless 5-Tile Mosaic: Smooth Horizontal Scroll on Mobile, Full-width 5-Panel Mosaic on Desktop */}
      <div className="w-full">
        <div className="flex overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-0 px-4 sm:px-6 lg:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-6 lg:pb-0">
          {defaultPanels.map((panel) => (
            <a
              key={panel.id}
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex-shrink-0 w-[72vw] sm:w-[42vw] md:w-[32vw] lg:w-full snap-center aspect-[3/4] sm:aspect-[3/5] overflow-hidden rounded-2xl lg:rounded-none bg-stone-900 focus:outline-none shadow-sm lg:shadow-none"
              title={`Follow @alnaya.in on Instagram - ${panel.caption || panel.alt}`}
            >
              <img
                src={panel.image}
                alt={panel.alt}
                className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />

              {/* Hover Darkening & Centered Instagram Badge */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors duration-300 flex items-center justify-center p-4">
                <div className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-[#1C1917] px-3.5 py-1.5 rounded-full shadow-xl text-xs font-medium">
                  <Instagram className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span className="font-editorial text-xs sm:text-sm tracking-wide lowercase">@alnaya.in</span>
                </div>
              </div>

              {/* Editorial Caption Gradient Overlay */}
              {panel.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 sm:p-4 pt-8 transition-opacity duration-300 opacity-90 lg:opacity-0 lg:group-hover:opacity-100">
                  <p className="text-white text-xs sm:text-sm font-medium tracking-wide">
                    {panel.caption}
                  </p>
                  <p className="text-[#F3DFB0] text-[10px] sm:text-xs font-light tracking-wider uppercase mt-0.5">
                    View on Instagram →
                  </p>
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
