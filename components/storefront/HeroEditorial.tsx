"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { storeConfig } from "@/config/store.config";

// Normalized coordinates of each gemstone in the 1024x764 source image
const GEMSTONE_ANCHORS = [
  { id: "sapphire-bottom", x: 0.508, y: 0.835, color: "rgba(96, 165, 250, 0.95)", glow: "rgba(37, 99, 235, 0.7)", size: 28, delay: 0 },
  { id: "ruby-right", x: 0.512, y: 0.610, color: "rgba(248, 113, 113, 0.95)", glow: "rgba(220, 38, 38, 0.7)", size: 24, delay: 1.2 },
  { id: "cyan-right", x: 0.473, y: 0.395, color: "rgba(103, 232, 249, 0.95)", glow: "rgba(6, 182, 212, 0.7)", size: 24, delay: 0.5 },
  { id: "emerald-top-right", x: 0.388, y: 0.232, color: "rgba(110, 231, 183, 0.95)", glow: "rgba(16, 185, 129, 0.7)", size: 22, delay: 1.8 },
  { id: "ruby-left", x: 0.340, y: 0.702, color: "rgba(248, 113, 113, 0.95)", glow: "rgba(220, 38, 38, 0.7)", size: 24, delay: 2.1 },
  { id: "cyan-left", x: 0.210, y: 0.512, color: "rgba(103, 232, 249, 0.95)", glow: "rgba(6, 182, 212, 0.7)", size: 22, delay: 0.9 },
  { id: "emerald-top-left", x: 0.104, y: 0.362, color: "rgba(110, 231, 183, 0.95)", glow: "rgba(16, 185, 129, 0.7)", size: 20, delay: 2.5 },
  { id: "sun-flare-origin", x: 0.140, y: 0.160, color: "rgba(254, 240, 138, 1)", glow: "rgba(234, 179, 8, 0.8)", size: 36, delay: 0.3 },
];

export function HeroEditorial() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Subtle interactive parallax on desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window === "undefined" || window.innerWidth < 768) return;
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const normX = (clientX - centerX) / centerX;
    const normY = (clientY - centerY) / centerY;
    setMouseOffset({
      x: normX * 12,
      y: normY * 10,
    });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  // 60FPS Canvas Animation: Twinkling Gemstone Starbursts, Sunlight Caustic Flare & Floating Gold Bokeh
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    // Golden dust particles drifting in the sunlight beam
    interface Particle {
      x: number;
      y: number;
      radius: number;
      alpha: number;
      baseAlpha: number;
      speedY: number;
      speedX: number;
      pulseSpeed: number;
      pulsePhase: number;
    }

    const particles: Particle[] = [];
    const PARTICLE_COUNT = 32;

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          // Cluster slightly towards the left & center where sunlight shines
          x: Math.random() * (width * 0.7),
          y: Math.random() * height,
          radius: Math.random() * 2.2 + 0.8,
          baseAlpha: Math.random() * 0.6 + 0.25,
          alpha: 0.3,
          speedY: -(Math.random() * 0.4 + 0.15),
          speedX: Math.random() * 0.3 + 0.05,
          pulseSpeed: Math.random() * 0.03 + 0.015,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    const handleResize = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      if (particles.length === 0) {
        initParticles();
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Helper: calculate object-cover placement for the 1024x764 image
    const getImageRenderRect = () => {
      const imgRatio = 1024 / 764;
      const contRatio = width / height;
      let rWidth = 0;
      let rHeight = 0;

      if (contRatio > imgRatio) {
        rWidth = width;
        rHeight = width / imgRatio;
      } else {
        rHeight = height;
        rWidth = height * imgRatio;
      }

      // Responsive anchor: slightly left of center on desktop, framed left-center on mobile
      const anchorX = width < 768 ? 0.28 : 0.26;
      const anchorY = 0.5;

      const rX = (width - rWidth) * anchorX;
      const rY = (height - rHeight) * anchorY;

      return { x: rX, y: rY, w: rWidth, h: rHeight };
    };

    // Draw an 8-pointed high-fashion diamond starburst sparkle
    const drawDiamondStar = (
      cx: number,
      cy: number,
      size: number,
      intensity: number,
      color: string,
      glowColor: string,
      rotation: number
    ) => {
      if (intensity <= 0.01) return;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);

      // 1. Soft radial halo bloom
      const haloRadius = size * 1.8 * intensity;
      const haloGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, haloRadius);
      haloGrad.addColorStop(0, glowColor);
      haloGrad.addColorStop(0.5, glowColor.replace(/[\d\.]+\)$/, `${0.25 * intensity})`));
      haloGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(0, 0, haloRadius, 0, Math.PI * 2);
      ctx.fill();

      // 2. Primary 4-pointed diamond star rays
      const rayLen = size * 1.5 * intensity;
      const rayWidth = Math.max(1.2, size * 0.12 * intensity);

      ctx.fillStyle = color;
      ctx.beginPath();
      // Vertical ray
      ctx.moveTo(0, -rayLen);
      ctx.lineTo(rayWidth, 0);
      ctx.lineTo(0, rayLen);
      ctx.lineTo(-rayWidth, 0);
      ctx.closePath();
      ctx.fill();

      // Horizontal ray
      ctx.beginPath();
      ctx.moveTo(-rayLen, 0);
      ctx.lineTo(0, rayWidth);
      ctx.lineTo(rayLen, 0);
      ctx.lineTo(0, -rayWidth);
      ctx.closePath();
      ctx.fill();

      // 3. Secondary 4 diagonal micro-rays
      const diagLen = rayLen * 0.45;
      const diagWidth = rayWidth * 0.7;
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.beginPath();
      ctx.moveTo(0, -diagLen);
      ctx.lineTo(diagWidth, 0);
      ctx.lineTo(0, diagLen);
      ctx.lineTo(-diagWidth, 0);
      ctx.closePath();
      ctx.fill();

      // 4. Brilliant pure white diamond center core
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(1.5, size * 0.1 * intensity), 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.shadowColor = "#FFFFFF";
      ctx.shadowBlur = 6 * intensity;
      ctx.fill();

      ctx.restore();
    };

    let startTime = performance.now();

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      ctx.clearRect(0, 0, width, height);

      const imgRect = getImageRenderRect();

      // 1. Render and drift golden atmospheric bokeh particles
      for (const p of particles) {
        p.y += p.speedY;
        p.x += p.speedX;
        p.pulsePhase += p.pulseSpeed;
        p.alpha = p.baseAlpha * (0.6 + 0.4 * Math.sin(p.pulsePhase));

        // Wrap around boundaries smoothly
        if (p.y < -10) p.y = height + 10;
        if (p.x > width * 0.8) p.x = 0;

        ctx.save();
        const pGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
        pGrad.addColorStop(0, `rgba(253, 230, 138, ${p.alpha})`);
        pGrad.addColorStop(0.6, `rgba(245, 158, 11, ${p.alpha * 0.4})`);
        pGrad.addColorStop(1, "rgba(245, 158, 11, 0)");
        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 2. Render realistic gemstone starburst glints with staggered breathing cycles
      for (const gem of GEMSTONE_ANCHORS) {
        // Map normalized image position to exact rendered screen coords
        const screenX = imgRect.x + imgRect.w * gem.x;
        const screenY = imgRect.y + imgRect.h * gem.y;

        // Skip if outside visible viewport
        if (screenX < -50 || screenX > width + 50 || screenY < -50 || screenY > height + 50) {
          continue;
        }

        // Individual sinusoidal twinkling cycle with period of ~3.2 seconds
        const cycleSpeed = 1.95;
        const wave = Math.sin((elapsed + gem.delay) * cycleSpeed);
        // Intensity curve: sharp glint peak, quiet resting state
        const intensity = Math.max(0, Math.pow(Math.max(0, wave), 3.5));
        const rotation = (elapsed + gem.delay) * 0.35;

        drawDiamondStar(screenX, screenY, gem.size, intensity, gem.color, gem.glow, rotation);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-screen h-[100svh] bg-[#070A10] text-white overflow-hidden select-none flex flex-col justify-between pt-20 sm:pt-24 md:pt-28"
    >
      {/* 1. Full-Bleed Animated Hero Background Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        
        {/* Continuous Cinematic Ken Burns Zoom & Subtle Pan */}
        <div
          className="relative w-full h-full will-change-transform"
          style={{
            transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <img
            src="/images/hero-royal-necklace.jpg"
            alt="Royal Multi-Gemstone Teardrop Necklace on Velvet"
            loading="eager"
            decoding="sync"
            className="w-full h-full object-cover object-[25%_center] sm:object-[26%_center] md:object-[26%_center] scale-105 animate-hero-breathe"
          />

          {/* Shimmering Sunlight Caustic Light Sweep Overlay (Originating from top-left) */}
          <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-60 animate-light-shimmer">
            <div className="w-[180%] h-[180%] -top-[40%] -left-[40%] absolute bg-[radial-gradient(ellipse_at_25%_20%,rgba(254,240,138,0.28)_0%,rgba(251,191,36,0.12)_35%,rgba(14,30,56,0)_70%)]" />
          </div>

          {/* Dynamic Luxury Vignette Gradients: Keeps left necklace crystal clear, enriches right for typography contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/35 to-black/85 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070A10]/90 via-transparent to-black/25 pointer-events-none" />
        </div>

        {/* 60 FPS HTML5 Canvas Sparkle & Particle System */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-10 w-full h-full"
        />
      </div>

      {/* 2. Main Editorial Typography & Action Container (Placed on the right side) */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 my-auto flex justify-end">
        <div className="w-full sm:max-w-lg lg:max-w-xl xl:max-w-2xl text-left space-y-4 sm:space-y-6 pt-4 sm:pt-0">
          
          {/* Subtle Atelier / Brand Eyebrow */}
          <div className="flex items-center gap-2">
            <span className="w-6 h-[1px] bg-amber-400/80" />
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] font-medium text-amber-200/90 flex items-center gap-1.5">
              <span>{storeConfig?.meta?.name || "ALNAYA"} ATELIER</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </span>
          </div>

          {/* Main Headline (All-caps Editorial Serif typography) */}
          <h1 className="font-editorial text-4xl xs:text-5xl sm:text-6xl lg:text-[4.2rem] xl:text-[4.75rem] font-normal tracking-tight text-white leading-[1.04] uppercase drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)]">
            <span>Light, Rendered</span> <br />
            <span className="font-editorial italic font-light text-white/95">Eternal.</span>
          </h1>

          {/* Subtitle Description */}
          <p className="text-sm sm:text-base md:text-[17px] text-white/85 font-light leading-relaxed max-w-lg drop-shadow-md font-sans">
            Handcrafted teardrop gemstones set in anti-tarnish 18K radiant gold finish. Designed by master artisans for everyday royalty and timeless luxury.
          </p>

          {/* Signature Featured Piece Spotlight (Direct link to the newly added hanging chain) */}
          <div className="pt-1">
            <Link
              href="/products/celestial-jewel-drop-hanging-chain"
              className="inline-flex items-center gap-2.5 px-3.5 sm:px-4 py-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/25 hover:border-amber-400/70 text-xs text-white/90 transition-all duration-300 group shadow-lg"
            >
              <img
                src="/images/hero-royal-necklace.jpg"
                alt="Celestial Jewel Drop Hanging Chain"
                className="w-6 h-6 rounded-full object-cover border border-amber-400/70 group-hover:scale-110 transition-transform"
              />
              <span className="font-medium truncate max-w-[220px] sm:max-w-none">
                Featured: Celestial Jewel Drop Hanging Chain • ₹299
              </span>
              <ArrowRight className="w-3 h-3 text-amber-300 group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>
          </div>

          {/* Pill Action Button */}
          <div className="pt-2 sm:pt-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-3 px-8 sm:px-9 py-3.5 sm:py-4 rounded-full bg-[#0E1E38] hover:bg-[#152B4F] text-white text-xs sm:text-sm font-medium tracking-wide border border-blue-400/40 shadow-[0_10px_35px_rgba(14,30,56,0.7)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
            >
              <span>Discover the Collection</span>
              <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Reference-Matched Organic Curved Wave Divider at the bottom */}
      <div className="relative z-20 w-full overflow-hidden leading-none pointer-events-none -mb-[1px]">
        <svg
          viewBox="0 0 1440 110"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-12 sm:h-20 md:h-24 lg:h-28 text-[#FAF7F2] fill-current"
        >
          {/* Smooth couture wave curve blending into the rest of the page */}
          <path d="M0,70 C280,105 520,110 760,65 C1000,20 1240,25 1440,65 L1440,110 L0,110 Z" />
        </svg>
      </div>

      {/* Embedded High-Performance Keyframe Animations */}
      <style jsx>{`
        @keyframes heroBreathe {
          0% {
            transform: scale(1.03) translate(0%, 0%);
          }
          50% {
            transform: scale(1.08) translate(-1.2%, -0.8%);
          }
          100% {
            transform: scale(1.03) translate(0%, 0%);
          }
        }

        @keyframes lightShimmer {
          0% {
            opacity: 0.45;
            transform: rotate(-3deg) scale(1);
          }
          50% {
            opacity: 0.75;
            transform: rotate(2deg) scale(1.06);
          }
          100% {
            opacity: 0.45;
            transform: rotate(-3deg) scale(1);
          }
        }

        .animate-hero-breathe {
          animation: heroBreathe 22s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
        }

        .animate-light-shimmer {
          animation: lightShimmer 9s ease-in-out infinite alternate;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-hero-breathe,
          .animate-light-shimmer {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
