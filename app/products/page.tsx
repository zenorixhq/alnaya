"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { categories as defaultCategories } from "@/data/mockData";
import { Category } from "@/types/store";
import { useProductStore } from "@/store/useProductStore";
import { ProductCard } from "@/components/storefront/ProductCard";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
  Search,
  Sparkles,
  ArrowDown,
} from "lucide-react";

const ITEMS_PER_ROW = 4;
const ROWS_PER_BATCH = 3;
const BATCH_SIZE = ITEMS_PER_ROW * ROWS_PER_BATCH; // 12 items (3 rows of 4 items)

const categoryIconMap: Record<string, string> = {
  all: "/images/category-cards/all.png",
  necklace: "/images/category-cards/necklace.png",
  necklaces: "/images/category-cards/necklace.png",
  "minimal-chains": "/images/category-cards/necklace.png",
  "hanging-chains": "/images/category-cards/necklace.png",
  "necklaces-and-chains": "/images/category-cards/necklace.png",
  "traditional-sets": "/images/category-cards/necklace.png",
  ring: "/images/category-cards/ring.png",
  rings: "/images/category-cards/ring.png",
  bracelet: "/images/category-cards/bracelet.png",
  bracelets: "/images/category-cards/bracelet.png",
  bangles: "/images/category-cards/bracelet.png",
  "bangles-kada": "/images/category-cards/bracelet.png",
  earring: "/images/category-cards/earrings.png",
  earrings: "/images/category-cards/earrings.png",
  "stud-and-hoops": "/images/category-cards/earrings.png",
  jhumkas: "/images/category-cards/earrings.png",
  "traditional-earrings": "/images/category-cards/earrings.png",
  anklet: "/images/category-cards/bracelet.png",
  anklets: "/images/category-cards/bracelet.png",
  nosepin: "/images/category-cards/ring.png",
  "offer-products": "/images/category-cards/necklace.png",
};

function ProductCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";

  const products = useProductStore((s) => s.products);
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const hasLoaded = useProductStore((s) => s.hasLoaded);
  const [categoryList, setCategoryList] = useState<Category[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem("alnaya_categories");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return defaultCategories;
  });

  // Sync with database on mount
  useEffect(() => {
    fetchProducts();
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategoryList(data);
          try {
            sessionStorage.setItem("alnaya_categories", JSON.stringify(data));
          } catch (e) {}
        }
      })
      .catch(() => {});
  }, [fetchProducts]);

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [priceRange, setPriceRange] = useState<string>("all");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [visibleCount, setVisibleCount] = useState<number>(BATCH_SIZE);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false);

  // Sentinel ref for infinite scroll
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Reset batch count when filters change
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [selectedCategory, searchTerm, priceRange, inStockOnly, sortBy]);

  // Sync category if URL searchParams changes
  useEffect(() => {
    if (searchParams.get("category")) {
      setSelectedCategory(searchParams.get("category") || "all");
    }
  }, [searchParams]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== "all") {
          if (selectedCategory === "minimal-chains") {
            const isMatch = p.category === "minimal-chains" || p.tags.some(t => /minimal/i.test(t)) || /chain|pendant/i.test(p.title);
            if (!isMatch) return false;
          } else if (selectedCategory === "hanging-chains") {
            const isMatch = p.category === "hanging-chains" || p.tags.some(t => /hanging/i.test(t)) || /hanging|lariat|drop/i.test(p.title);
            if (!isMatch) return false;
          } else if (selectedCategory === "jhumkas") {
            const isMatch = p.category === "jhumkas" || /jhumka|jhumki|temple/i.test(p.title);
            if (!isMatch) return false;
          } else if (selectedCategory === "stud-and-hoops") {
            const isMatch = p.category === "stud-and-hoops" || /stud|hoop|huggie/i.test(p.title);
            if (!isMatch) return false;
          } else if (selectedCategory === "traditional-earrings") {
            const isMatch = p.category === "traditional-earrings" || /chandbali|traditional|earring/i.test(p.title);
            if (!isMatch) return false;
          } else if (selectedCategory === "traditional-sets") {
            const isMatch = p.category === "traditional-sets" || /set|bridal|necklace set/i.test(p.title);
            if (!isMatch) return false;
          } else if (selectedCategory === "offer-products") {
            const isMatch = p.category === "offer-products" || p.tags.some(t => /offer/i.test(t)) || !!p.salePrice || p.isBestSeller;
            if (!isMatch) return false;
          } else if (selectedCategory === "anklets") {
            const isMatch = p.category === "anklets" || /anklet|payal/i.test(p.title);
            if (!isMatch) return false;
          } else if (selectedCategory === "bangles") {
            const isMatch = p.category === "bangles" || p.category === "bangles-kada" || /bangle|kada|chooda/i.test(p.title);
            if (!isMatch) return false;
          } else if (selectedCategory === "bracelet") {
            const isMatch = p.category === "bracelet" || p.category === "bracelets" || /bracelet/i.test(p.title);
            if (!isMatch) return false;
          } else if (selectedCategory === "ring") {
            const isMatch = p.category === "ring" || p.category === "rings" || /ring|band/i.test(p.title);
            if (!isMatch) return false;
          } else if (selectedCategory === "nosepin") {
            const isMatch = p.category === "nosepin" || p.category === "charms" || /nosepin|nath|nose/i.test(p.title);
            if (!isMatch) return false;
          } else if (p.category !== selectedCategory) {
            return false;
          }
        }

        // Search filter
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(query);
          const matchDesc = p.description.toLowerCase().includes(query);
          const matchCategory = p.category.toLowerCase().includes(query);
          const matchTags = p.tags.some((t) => t.toLowerCase().includes(query));
          if (!matchTitle && !matchDesc && !matchCategory && !matchTags) return false;
        }

        // Price filter
        const currentPrice = p.salePrice || p.price;
        if (priceRange === "under200" && currentPrice >= 200) return false;
        if (priceRange === "200to350" && (currentPrice < 200 || currentPrice > 350)) return false;
        if (priceRange === "over350" && currentPrice <= 350) return false;

        // In Stock filter
        if (inStockOnly && (!p.inStock || p.stockCount === 0)) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = a.salePrice || a.price;
        const priceB = b.salePrice || b.price;

        if (sortBy === "price-asc") return priceA - priceB;
        if (sortBy === "price-desc") return priceB - priceA;
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "newest") return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, searchTerm, priceRange, inStockOnly, sortBy]);

  // Slice down to 3 rows (12 items) at a time
  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  // Auto-load next 3 rows when scrolling down to sentinel
  useEffect(() => {
    if (!sentinelRef.current) return;
    if (visibleCount >= filteredProducts.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filteredProducts.length));
        }
      },
      { rootMargin: "250px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [visibleCount, filteredProducts.length]);

  const loadMoreRows = () => {
    setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filteredProducts.length));
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setSearchTerm("");
    setPriceRange("all");
    setInStockOnly(false);
    setSortBy("featured");
    setVisibleCount(BATCH_SIZE);
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    searchTerm !== "" ||
    priceRange !== "all" ||
    inStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      {/* 1. Header & Title Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold mb-1">
            <Sparkles className="w-3 h-3" />
            <span>Waterproof • Hypoallergenic • Everyday Luxury</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            {selectedCategory === "all"
              ? "All Jewelry Collection"
              : categoryList.find((c) => c.slug === selectedCategory)?.name || "Jewelry Collection"}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Showing {displayedProducts.length} of {filteredProducts.length} pieces • 4 items per row
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search clover, hoops, bangles, rings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-muted/40 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Visual Category Cards Bar (Matching user's reference) */}
      <div className="bg-[#F3F4F6] sm:bg-[#F3F4F6]/90 p-3 sm:p-4 rounded-3xl border border-stone-200/70 shadow-sm">
        <div className="flex items-start gap-3 sm:gap-4 md:gap-5 overflow-x-auto pb-1 scrollbar-none scroll-smooth -mx-1 px-1">
          {/* "All Pieces" Card */}
          <button
            onClick={() => setSelectedCategory("all")}
            className="flex flex-col items-center shrink-0 group focus:outline-none w-[72px] sm:w-[84px] md:w-[92px]"
          >
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl p-2 flex items-center justify-center transition-all duration-300 ${
                selectedCategory === "all"
                  ? "bg-white ring-2 ring-[#7E22CE] border-[#7E22CE] shadow-md -translate-y-0.5"
                  : "bg-white border border-stone-200/90 shadow-sm hover:border-purple-300 hover:shadow-md hover:-translate-y-0.5"
              }`}
            >
              <img
                src="/images/category-cards/all.png"
                alt="All Pieces"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span
              className={`text-xs sm:text-[13px] text-center whitespace-nowrap mt-2 transition-colors ${
                selectedCategory === "all"
                  ? "font-bold text-[#7E22CE]"
                  : "font-medium text-stone-700 group-hover:text-stone-900"
              }`}
            >
              All
            </span>
            <span className="text-[10px] text-stone-400 font-mono -mt-0.5">
              ({products.length})
            </span>
          </button>

          {/* Category Cards */}
          {categoryList.map((cat) => {
            const count = products.filter((p) => {
              if (cat.slug === "new-arrivals") return p.isNewArrival || p.category === "new-arrivals";
              if (cat.slug === "necklaces-and-chains" || cat.slug === "necklaces") return p.category === "necklaces-and-chains" || p.category === "necklaces" || /necklace|chain|pendant/i.test(p.title);
              if (cat.slug === "bangles-kada") return p.category === "bangles-kada" || p.category === "bangles" || /bangle|kada|cuff/i.test(p.title);
              if (cat.slug === "bracelets") return (p.category === "bracelets" && !/bangle|kada|cuff/i.test(p.title)) || /bracelet/i.test(p.title);
              if (cat.slug === "watches") return p.category === "watches" || /watch/i.test(p.title);
              if (cat.slug === "charms") return p.category === "charms" || /charm/i.test(p.title);
              if (cat.slug === "hip-chains") return p.category === "hip-chains" || /hip chain|waist/i.test(p.title);
              if (cat.slug === "kids-collection") return p.category === "kids-collection" || p.category === "kids" || /kid|child/i.test(p.title);
              if (cat.slug === "anklets") return p.category === "anklets" || /anklet/i.test(p.title);
              if (cat.slug === "rings") return p.category === "rings" || /ring/i.test(p.title);
              if (cat.slug === "earrings") return p.category === "earrings" || /earring|stud|hoop/i.test(p.title);
              return p.category === cat.slug;
            }).length;

            const iconSrc =
              categoryIconMap[cat.slug] ||
              cat.image ||
              "/images/category-cards/necklace.png";

            const displayName = cat.name.replace(/\s*Collection/gi, "").trim();

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className="flex flex-col items-center shrink-0 group focus:outline-none w-[72px] sm:w-[84px] md:w-[92px]"
              >
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl p-2 flex items-center justify-center transition-all duration-300 ${
                    selectedCategory === cat.slug
                      ? "bg-white ring-2 ring-[#7E22CE] border-[#7E22CE] shadow-md -translate-y-0.5"
                      : "bg-white border border-stone-200/90 shadow-sm hover:border-purple-300 hover:shadow-md hover:-translate-y-0.5"
                  }`}
                >
                  <img
                    src={iconSrc}
                    alt={displayName}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span
                  className={`text-xs sm:text-[13px] text-center whitespace-nowrap mt-2 transition-colors truncate max-w-full ${
                    selectedCategory === cat.slug
                      ? "font-bold text-[#7E22CE]"
                      : "font-medium text-stone-700 group-hover:text-stone-900"
                  }`}
                  title={displayName}
                >
                  {displayName}
                </span>
                <span className="text-[10px] text-stone-400 font-mono -mt-0.5">
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Filter Controls & Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-card border border-border">
        {/* Left: Quick Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          {/* Price Selector */}
          <div className="relative">
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="appearance-none bg-muted/50 border border-border rounded-lg pl-3 pr-7 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="all">Price: All</option>
              <option value="under200">Under ₹200</option>
              <option value="200to350">₹200 to ₹350</option>
              <option value="over350">Over ₹350</option>
            </select>
            <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
          </div>

          {/* In Stock toggle */}
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-muted/30 cursor-pointer text-xs font-medium hover:bg-muted/60">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="accent-primary rounded"
            />
            <span className="text-foreground">In Stock Only</span>
          </label>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/10 rounded-lg transition-colors font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right: Sort selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:inline">Sort:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-muted/50 border border-border rounded-lg pl-3 pr-7 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Arrivals</option>
            </select>
            <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* 4. Product Grid: Exactly 4 Items per Row on Desktop */}
      {!hasLoaded && products.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 py-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] rounded-2xl bg-[#EADBBE]/20 animate-pulse border border-[#EADBBE]/40 flex flex-col justify-end p-4 space-y-2"
            >
              <div className="h-4 bg-stone-200/80 rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-stone-200/60 rounded w-1/2 animate-pulse" />
            </div>
          ))}
        </div>
      ) : displayedProducts.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-dashed border-border bg-card p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-muted mx-auto flex items-center justify-center text-muted-foreground">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">No pieces match your filters</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Try choosing another category or clearing your active price filter.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
          >
            Show All Products
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* 4 Items Listed in a Row Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* 5. Infinite Scroll Sentinel & Batch Control (3 rows at a time) */}
          {visibleCount < filteredProducts.length ? (
            <div className="pt-6 pb-8 flex flex-col items-center justify-center space-y-3">
              {/* Invisible sentinel for automatic scroll-down loading */}
              <div ref={sentinelRef} className="h-4 w-full pointer-events-none" />

              <div className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                <span>Showing {displayedProducts.length} of {filteredProducts.length} pieces</span>
                <span>•</span>
                <span>Scroll down for next 3 rows</span>
              </div>

              {/* Progress bar indicator */}
              <div className="w-48 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 rounded-full"
                  style={{
                    width: `${Math.min(100, (displayedProducts.length / filteredProducts.length) * 100)}%`,
                  }}
                />
              </div>

              {/* Click button fallback to load next 3 rows */}
              <button
                onClick={loadMoreRows}
                className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-card border border-border hover:bg-muted text-foreground text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-98"
              >
                <span>Load Next 3 Rows (12 Pieces)</span>
                <ArrowDown className="w-3.5 h-3.5 text-primary" />
              </button>
            </div>
          ) : (
            <div className="py-8 text-center border-t border-border/50 text-xs text-muted-foreground">
              ✨ You&apos;ve viewed all {filteredProducts.length} pieces in this collection!
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProductCatalogPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12 text-center text-xs">Loading collection...</div>}>
      <ProductCatalogContent />
    </Suspense>
  );
}
