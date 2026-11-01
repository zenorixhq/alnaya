"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { categories as defaultCategories } from "@/data/mockData";
import { Category, Product } from "@/types/store";
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
  ArrowUpDown,
  Filter,
  Check,
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
  jhumkas: "/images/category-cards/jhumkas.png",
  "traditional-earrings": "/images/category-cards/earrings.png",
  anklet: "/images/category-cards/bracelet.png",
  anklets: "/images/category-cards/bracelet.png",
  nosepin: "/images/category-cards/ring.png",
  "offer-products": "/images/category-cards/necklace.png",
};

// Robust Category Matcher for Collections
function matchesCategory(p: Product, catSlug: string): boolean {
  if (!catSlug || catSlug === "all") return true;
  if (catSlug === "new-arrivals") return !!p.isNewArrival || p.category === "new-arrivals";
  if (catSlug === "minimal-chains") {
    return p.category === "minimal-chains" || p.tags.some((t) => /minimal/i.test(t)) || /chain|pendant/i.test(p.title);
  }
  if (catSlug === "hanging-chains") {
    return p.category === "hanging-chains" || p.tags.some((t) => /hanging/i.test(t)) || /hanging|lariat|drop/i.test(p.title);
  }
  if (catSlug === "necklaces-and-chains" || catSlug === "necklaces") {
    return p.category === "necklaces-and-chains" || p.category === "necklaces" || /necklace|chain|pendant/i.test(p.title);
  }
  if (catSlug === "jhumkas") {
    return p.category === "jhumkas" || /jhumka|jhumki|temple/i.test(p.title);
  }
  if (catSlug === "stud-and-hoops") {
    return p.category === "stud-and-hoops" || /stud|hoop|huggie/i.test(p.title);
  }
  if (catSlug === "traditional-earrings") {
    return p.category === "traditional-earrings" || /chandbali|traditional|earring/i.test(p.title);
  }
  if (catSlug === "traditional-sets") {
    return p.category === "traditional-sets" || /set|bridal|necklace set/i.test(p.title);
  }
  if (catSlug === "offer-products") {
    return p.category === "offer-products" || p.tags.some((t) => /offer/i.test(t)) || !!p.salePrice || !!p.isBestSeller;
  }
  if (catSlug === "bangles-kada" || catSlug === "bangles") {
    return p.category === "bangles-kada" || p.category === "bangles" || /bangle|kada|cuff|chooda/i.test(p.title);
  }
  if (catSlug === "bracelets" || catSlug === "bracelet") {
    return p.category === "bracelets" || p.category === "bracelet" || /bracelet/i.test(p.title);
  }
  if (catSlug === "rings" || catSlug === "ring") {
    return p.category === "rings" || p.category === "ring" || /ring|band/i.test(p.title);
  }
  if (catSlug === "anklets") {
    return p.category === "anklets" || /anklet|payal/i.test(p.title);
  }
  if (catSlug === "nosepin") {
    return p.category === "nosepin" || p.category === "charms" || /nosepin|nath|nose/i.test(p.title);
  }
  if (catSlug === "earrings" || catSlug === "earring") {
    return p.category === "earrings" || p.category === "earring" || /earring|stud|hoop/i.test(p.title);
  }
  return p.category === catSlug;
}

const sortOptions = [
  { id: "featured", label: "Featured First", hint: "Curated by Maison Alnaya" },
  { id: "price-asc", label: "Price: Low to High", hint: "Affordable luxury first" },
  { id: "price-desc", label: "Price: High to Low", hint: "High-value statement pieces" },
  { id: "rating", label: "Customer Rating", hint: "Collector favorites & 5-stars" },
  { id: "newest", label: "Newest Arrivals", hint: "Latest collection drops" },
];

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

  // Primary filter & sort states
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [priceRange, setPriceRange] = useState<string>("all");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [visibleCount, setVisibleCount] = useState<number>(BATCH_SIZE);

  // Bottom Sheet states for Mobile
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  // Draft filter states (for the Filter Bottom Sheet)
  const [draftCategory, setDraftCategory] = useState<string>(initialCategory);
  const [draftPriceRange, setDraftPriceRange] = useState<string>("all");
  const [draftInStockOnly, setDraftInStockOnly] = useState<boolean>(false);
  const [draftSearchTerm, setDraftSearchTerm] = useState<string>("");

  // Synchronize draft filter states whenever the filter sheet opens
  useEffect(() => {
    if (isFilterOpen) {
      setDraftCategory(selectedCategory);
      setDraftPriceRange(priceRange);
      setDraftInStockOnly(inStockOnly);
      setDraftSearchTerm(searchTerm);
    }
  }, [isFilterOpen, selectedCategory, priceRange, inStockOnly, searchTerm]);

  // Sentinel ref for infinite scroll
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Reset batch count when filters or sort change
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [selectedCategory, searchTerm, priceRange, inStockOnly, sortBy]);

  // Sync category if URL searchParams changes
  useEffect(() => {
    if (searchParams.get("category")) {
      setSelectedCategory(searchParams.get("category") || "all");
    }
  }, [searchParams]);

  // Filter & Sort Logic for Main Grid
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (!matchesCategory(p, selectedCategory)) return false;

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

  // Live count calculation for the Draft Filter Bottom Sheet
  const draftFilteredCount = useMemo(() => {
    return products.filter((p) => {
      if (!matchesCategory(p, draftCategory)) return false;

      if (draftSearchTerm.trim()) {
        const query = draftSearchTerm.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(query);
        const matchDesc = p.description.toLowerCase().includes(query);
        const matchCategory = p.category.toLowerCase().includes(query);
        const matchTags = p.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchTitle && !matchDesc && !matchCategory && !matchTags) return false;
      }

      const currentPrice = p.salePrice || p.price;
      if (draftPriceRange === "under200" && currentPrice >= 200) return false;
      if (draftPriceRange === "200to350" && (currentPrice < 200 || currentPrice > 350)) return false;
      if (draftPriceRange === "over350" && currentPrice <= 350) return false;

      if (draftInStockOnly && (!p.inStock || p.stockCount === 0)) return false;

      return true;
    }).length;
  }, [products, draftCategory, draftPriceRange, draftInStockOnly, draftSearchTerm]);

  // Slice down to visible batch (12 items)
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

  const applyDraftFilters = () => {
    setSelectedCategory(draftCategory);
    setPriceRange(draftPriceRange);
    setInStockOnly(draftInStockOnly);
    setSearchTerm(draftSearchTerm);
    setIsFilterOpen(false);
  };

  const resetDraftFilters = () => {
    setDraftCategory("all");
    setDraftPriceRange("all");
    setDraftInStockOnly(false);
    setDraftSearchTerm("");
  };

  const activeFilterCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (priceRange !== "all" ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (searchTerm.trim() ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-24 sm:pb-12 space-y-4 sm:space-y-5 font-glacial">
      {/* 1. Visual Category Cards Bar (Positioned high at top for immediate browsing) */}
      <div className="bg-[#F3F4F6] sm:bg-[#F3F4F6]/90 p-2 sm:p-3 rounded-2xl sm:rounded-3xl border border-stone-200/70 shadow-xs font-glacial">
        <div className="flex items-start gap-2.5 sm:gap-4 md:gap-5 overflow-x-auto pt-2 pb-2.5 px-2 scrollbar-none scroll-smooth">
          {/* "All Pieces" Card */}
          <button
            onClick={() => setSelectedCategory("all")}
            className="flex flex-col items-center shrink-0 group focus:outline-none w-[72px] sm:w-[84px] md:w-[92px] p-0.5"
          >
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl p-2 flex items-center justify-center transition-all duration-300 border-2 ${
                selectedCategory === "all"
                  ? "bg-white border-[#7E22CE] shadow-md -translate-y-0.5"
                  : "bg-white border-stone-200/90 shadow-xs hover:border-[#7E22CE] hover:shadow-md hover:-translate-y-0.5"
              }`}
            >
              <img
                src="/images/category-cards/all.png"
                alt="Shop All Pieces"
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
              Shop All
            </span>
            <span className="text-[10px] text-stone-400 font-mono -mt-0.5">
              ({products.length})
            </span>
          </button>

          {/* Category Cards */}
          {categoryList.map((cat) => {
            const count = products.filter((p) => matchesCategory(p, cat.slug)).length;

            const iconSrc =
              categoryIconMap[cat.slug] ||
              cat.image ||
              "/images/category-cards/necklace.png";

            const displayName = cat.name.replace(/\s*Collection/gi, "").trim();

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className="flex flex-col items-center shrink-0 group focus:outline-none w-[72px] sm:w-[84px] md:w-[92px] p-0.5"
              >
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl p-2 flex items-center justify-center transition-all duration-300 border-2 ${
                    selectedCategory === cat.slug
                      ? "bg-white border-[#7E22CE] shadow-md -translate-y-0.5"
                      : "bg-white border-stone-200/90 shadow-xs hover:border-[#7E22CE] hover:shadow-md hover:-translate-y-0.5"
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

      {/* 2. Header & Title Banner + Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-3 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold mb-1">
            <Sparkles className="w-3 h-3" />
            <span>Waterproof • Hypoallergenic • Everyday Luxury</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground">
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

      {/* 3. Filter Controls & Sort Bar (Desktop & Tablet) */}
      <div className="hidden md:flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-card border border-border shadow-2xs">
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
              {sortOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* 4. Product Grid */}
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
              Try choosing another category or clearing your active filters.
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
          {/* 4 Items Listed in a Row Grid (2 on Mobile) */}
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

      {/* ========================================================================= */}
      {/* 6. MOBILE STICKY BOTTOM BAR (Sort By & Filter - Exactly like GIVA reference) */}
      {/* ========================================================================= */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-stone-200/95 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] md:hidden">
        <div className="grid grid-cols-2 divide-x divide-stone-200 h-13 items-center">
          {/* Left Button: Sort By */}
          <button
            onClick={() => setIsSortOpen(true)}
            className="flex items-center justify-center gap-2 h-full text-stone-900 font-semibold text-xs tracking-wider uppercase active:bg-stone-50 transition-colors"
          >
            <ArrowUpDown className="w-4 h-4 text-stone-700" />
            <span>Sort By</span>
            {sortBy !== "featured" && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#7E22CE]" />
            )}
          </button>

          {/* Right Button: Filter */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center justify-center gap-2 h-full text-stone-900 font-semibold text-xs tracking-wider uppercase active:bg-stone-50 transition-colors"
          >
            <Filter className="w-4 h-4 text-stone-700" />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="w-4.5 h-4.5 rounded-full bg-[#7E22CE] text-white text-[10px] font-bold flex items-center justify-center leading-none">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7. SORT BY BOTTOM SHEET MODAL */}
      {/* ========================================================================= */}
      {isSortOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsSortOpen(false)}
          />

          {/* Slide-Up Sheet */}
          <div className="relative z-10 bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[82vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Grab Handle */}
            <div className="w-12 h-1 bg-stone-300 rounded-full mx-auto mt-3 mb-1 shrink-0" />

            {/* Sheet Header */}
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-stone-100 shrink-0">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-[#7E22CE]" />
                <h3 className="font-editorial text-lg font-bold text-stone-900 tracking-wide">
                  Sort By
                </h3>
              </div>
              <button
                onClick={() => setIsSortOpen(false)}
                className="p-1.5 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                aria-label="Close sort modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sort Options List */}
            <div className="divide-y divide-stone-100 p-2 overflow-y-auto">
              {sortOptions.map((opt) => {
                const isSelected = sortBy === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSortBy(opt.id);
                      setIsSortOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-4 text-left rounded-xl transition-colors ${
                      isSelected ? "bg-purple-50/70" : "hover:bg-stone-50"
                    }`}
                  >
                    <div>
                      <span
                        className={`text-sm block ${
                          isSelected ? "font-bold text-[#7E22CE]" : "font-medium text-stone-800"
                        }`}
                      >
                        {opt.label}
                      </span>
                      <span className="text-[11px] text-stone-400 block mt-0.5">
                        {opt.hint}
                      </span>
                    </div>

                    {/* Radio Indicator */}
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-[#7E22CE] bg-[#7E22CE]"
                          : "border-stone-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. FILTER BOTTOM SHEET MODAL (Categories, Price, Availability, Search) */}
      {/* ========================================================================= */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsFilterOpen(false)}
          />

          {/* Slide-Up Drawer */}
          <div className="relative z-10 bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Grab Handle */}
            <div className="w-12 h-1 bg-stone-300 rounded-full mx-auto mt-3 mb-1 shrink-0" />

            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-stone-100 shrink-0">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#7E22CE]" />
                <h3 className="font-editorial text-lg font-bold text-stone-900 tracking-wide">
                  Filter Pieces
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={resetDraftFilters}
                  className="text-xs font-semibold text-[#7E22CE] hover:text-[#581C87] transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-1.5 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                  aria-label="Close filter modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Filter Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
              {/* Filter Section: Category */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-900 block mb-2.5">
                  Category
                </span>
                <div className="flex flex-wrap gap-2">
                  {/* Shop All Chip */}
                  <button
                    onClick={() => setDraftCategory("all")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                      draftCategory === "all"
                        ? "bg-[#7E22CE] text-white border-[#7E22CE] shadow-xs font-bold"
                        : "bg-stone-50 text-stone-700 border-stone-200 hover:border-purple-300"
                    }`}
                  >
                    <span>Shop All ({products.length})</span>
                  </button>

                  {/* Individual Categories */}
                  {categoryList.map((cat) => {
                    const count = products.filter((p) => matchesCategory(p, cat.slug)).length;
                    const isSelected = draftCategory === cat.slug;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setDraftCategory(cat.slug)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                          isSelected
                            ? "bg-[#7E22CE] text-white border-[#7E22CE] shadow-xs font-bold"
                            : "bg-stone-50 text-stone-700 border-stone-200 hover:border-purple-300"
                        }`}
                      >
                        <span>
                          {cat.name.replace(/\s*Collection/gi, "").trim()} ({count})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Filter Section: Price Range */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-900 block mb-2.5">
                  Price Range
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "all", label: "All Prices" },
                    { id: "under200", label: "Under ₹200" },
                    { id: "200to350", label: "₹200 to ₹350" },
                    { id: "over350", label: "Over ₹350" },
                  ].map((pOpt) => {
                    const isSelected = draftPriceRange === pOpt.id;
                    return (
                      <button
                        key={pOpt.id}
                        onClick={() => setDraftPriceRange(pOpt.id)}
                        className={`p-3 rounded-xl text-xs font-medium border text-center transition-all ${
                          isSelected
                            ? "bg-[#7E22CE] text-white border-[#7E22CE] shadow-xs font-bold"
                            : "bg-stone-50 text-stone-700 border-stone-200 hover:border-purple-300"
                        }`}
                      >
                        {pOpt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Filter Section: Availability */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-900 block mb-2.5">
                  Availability
                </span>
                <label className="flex items-center justify-between p-3.5 rounded-xl border border-stone-200 bg-stone-50 cursor-pointer hover:bg-stone-100 transition-colors">
                  <span className="text-xs font-medium text-stone-800">
                    In Stock Only (Hide Sold Out)
                  </span>
                  <input
                    type="checkbox"
                    checked={draftInStockOnly}
                    onChange={(e) => setDraftInStockOnly(e.target.checked)}
                    className="w-4 h-4 accent-[#7E22CE] rounded cursor-pointer"
                  />
                </label>
              </div>

              {/* Filter Section: Refine with Search Keyword */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-900 block mb-2.5">
                  Keyword Search
                </span>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search e.g. clover, evil eye, drop..."
                    value={draftSearchTerm}
                    onChange={(e) => setDraftSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#7E22CE]"
                  />
                  {draftSearchTerm && (
                    <button
                      onClick={() => setDraftSearchTerm("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="p-4 bg-white border-t border-stone-200 flex items-center gap-3 shrink-0">
              <button
                onClick={resetDraftFilters}
                className="w-1/3 py-3 px-4 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 font-semibold text-xs uppercase tracking-wider transition-colors text-center"
              >
                Reset
              </button>
              <button
                onClick={applyDraftFilters}
                className="w-2/3 py-3 px-4 rounded-xl bg-[#1C1917] hover:bg-[#7E22CE] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-[0.98] text-center"
              >
                Apply Filters ({draftFilteredCount})
              </button>
            </div>
          </div>
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
