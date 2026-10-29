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
    alt: "Alnaya Fine Jewelry - Botanical styling with handcrafted earrings",
    caption: "Handcrafted in hallmark gold finish",
  },
  {
    id: 2,
    image: "/images/follow-house/panel-2.jpg",
    alt: "Alnaya Fine Jewelry - Gold link chain and oval carabiner pendant on delicate white blossoms",
    caption: "Signature Oval Pendant Link Chain",
  },
  {
    id: 3,
    image: "/images/follow-house/panel-3.jpg",
    alt: "Alnaya Fine Jewelry - Marquise solitaire diamond ring with warm floral accent",
    caption: "Marquise Solitaire Statement Ring",
  },
  {
    id: 4,
    image: "/images/follow-house/panel-4.jpg",
    alt: "Alnaya Fine Jewelry - Everyday sparkle pavé eternity band ring",
    caption: "Everyday Pavé Eternity Band",
  },
  {
    id: 5,
    image: "/images/follow-house/panel-5.jpg",
    alt: "Alnaya Fine Jewelry - Cascading bridal crystal drop earrings",
    caption: "Cascading Drop Chandelier Earrings",
  },
  {
    id: 6,
    image: "/images/follow-house/panel-6.jpg",
    alt: "Alnaya Fine Jewelry - Gold huggie hoop earrings wrapped around floral garden stem",
    caption: "Classic Gold Huggie Hoops",
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

      {/* Seamless 6-Tile Photographic Mosaic Strip */}
      <div className="w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-0 w-full">
          {defaultPanels.map((panel) => (
            <a
              key={panel.id}
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-[3/5] overflow-hidden bg-stone-900 focus:outline-none"
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
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
