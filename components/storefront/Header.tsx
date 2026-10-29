"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { storeConfig } from "@/config/store.config";
import { useCartStore } from "@/store/useCartStore";
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  ChevronDown,
  User,
  Sparkles,
} from "lucide-react";
import { useProductStore } from "@/store/useProductStore";
import { formatPrice } from "@/lib/utils";
import { BrandLogo } from "@/components/storefront/BrandLogo";

export function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const products = useProductStore((s) => s.products);
  const items = useCartStore((s) => s.items);
  const wishlist = useCartStore((s) => s.wishlist);
  const openCart = useCartStore((s) => s.openCart);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const searchResults = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 4)
    : [];

  const isHomePage = pathname === "/" || pathname === "";
  const isTransparent = mounted && isHomePage && !isScrolled;
  // Dark navigation styling applies ONLY on the homepage (transparent over dark hero, or dark charcoal #1C1917 on scroll)
  const isDarkNav = isHomePage;

  const primaryNavLinks = [
    { label: "Shop All", href: "/products" },
    { label: "Minimal Chains", href: "/products?category=minimal-chains" },
    { label: "Jhumkas", href: "/products?category=jhumkas" },
    { label: "Traditional Sets", href: "/products?category=traditional-sets" },
    { label: "Offer Products", href: "/products?category=offer-products", highlight: true },
  ];

  const allCategoryLinks = [
    { label: "Minimal Chains", href: "/products?category=minimal-chains" },
    { label: "Anklets", href: "/products?category=anklets" },
    { label: "Bangles", href: "/products?category=bangles" },
    { label: "Bracelet", href: "/products?category=bracelet" },
    { label: "Hanging Chains", href: "/products?category=hanging-chains" },
    { label: "Jhumkas", href: "/products?category=jhumkas" },
    { label: "Ring", href: "/products?category=ring" },
    { label: "Nosepin", href: "/products?category=nosepin" },
    { label: "Stud & Hoops", href: "/products?category=stud-and-hoops" },
    { label: "Traditional Earrings", href: "/products?category=traditional-earrings" },
    { label: "Traditional Sets", href: "/products?category=traditional-sets" },
    { label: "Offer Products", href: "/products?category=offer-products" },
  ];

  return (
    <>
      <header
        className={`w-full transition-all duration-300 ${
          isHomePage
            ? isScrolled
              ? "fixed top-0 left-0 right-0 z-50 bg-[#1C1917]/95 backdrop-blur-md shadow-xl border-b border-white/10 text-white"
              : "absolute top-0 left-0 right-0 z-40 bg-transparent text-white border-b border-white/10"
            : "sticky top-0 z-50 bg-[#FAF7F2] text-foreground border-b border-[#EADBBE]/80 shadow-2xs"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`p-2 -ml-2 rounded-md ${
                  isDarkNav
                    ? "text-white hover:bg-white/10"
                    : "text-[#1C1917] hover:bg-[#F0E6D2]"
                }`}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex items-center flex-shrink-0">
              <BrandLogo
                variant="full"
                showTagline={false}
                theme={isDarkNav ? "dark" : "light"}
              />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center justify-center flex-1 px-4 xl:px-8 gap-5 xl:gap-8">
              {primaryNavLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs xl:text-sm font-medium tracking-wide transition-colors whitespace-nowrap flex items-center gap-1 ${
                      isDarkNav
                        ? isActive
                          ? "text-purple-300 font-semibold"
                          : link.highlight
                          ? "text-purple-300 font-semibold hover:text-white"
                          : "text-white/90 hover:text-white"
                        : isActive
                        ? "text-[#7E22CE] font-bold"
                        : link.highlight
                        ? "text-[#7E22CE] font-bold hover:text-[#581C87]"
                        : "text-[#1C1917] hover:text-[#7E22CE]"
                    }`}
                  >
                    {link.highlight && <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {/* All Categories Dropdown */}
              <div className="relative group">
                <button
                  type="button"
                  className={`flex items-center gap-1 text-xs xl:text-sm font-medium transition-colors py-2 cursor-pointer whitespace-nowrap ${
                    isDarkNav
                      ? "text-white/90 hover:text-white"
                      : "text-[#1C1917] hover:text-[#7E22CE]"
                  }`}
                >
                  <span>Categories</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-200 ${
                      isDarkNav ? "text-white/70" : "text-[#786E5E]"
                    }`}
                  />
                </button>

                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
                  <div className="w-64 bg-[#FFFDF9] border border-[#EADBBE] rounded-2xl shadow-2xl p-3 grid grid-cols-1 gap-1">
                    {allCategoryLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-3 py-2 text-xs font-medium text-stone-800 hover:text-primary hover:bg-[#FAF7F2] rounded-lg transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                    <div className="pt-2 border-t border-[#EADBBE]/50 mt-1">
                      <Link
                        href="/products"
                        className="block px-3 py-1.5 text-xs font-bold text-[#7E22CE] hover:text-stone-900 transition-colors"
                      >
                        ✦ View All Catalog
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Search Trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  isDarkNav
                    ? "hover:bg-white/10 text-white"
                    : "hover:bg-[#EADBBE]/50 text-[#1C1917]"
                }`}
                aria-label="Search products"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* User Account */}
              <Link
                href="/account"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  isDarkNav
                    ? "hover:bg-white/10 text-white"
                    : "hover:bg-[#EADBBE]/50 text-[#1C1917]"
                }`}
                aria-label="Account"
              >
                <User className="w-4 h-4" />
              </Link>

              {/* Wishlist Link */}
              {storeConfig.features.enableWishlist && (
                <Link
                  href="/account?tab=wishlist"
                  className={`w-9 h-9 rounded-full transition-colors relative flex items-center justify-center ${
                    isDarkNav
                      ? "hover:bg-white/10 text-white"
                      : "hover:bg-[#EADBBE]/50 text-[#1C1917]"
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className="w-4 h-4" />
                  {mounted && wishlistCount > 0 && (
                    <span className="absolute top-0 right-0 bg-amber-500 text-stone-950 text-[9px] font-bold min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center shadow-sm">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Cart Drawer Trigger */}
              <button
                onClick={openCart}
                className={`w-9 h-9 rounded-full transition-colors relative flex items-center justify-center ${
                  isDarkNav
                    ? "hover:bg-white/10 text-white"
                    : "hover:bg-[#EADBBE]/50 text-[#1C1917]"
                }`}
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                {mounted && itemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[9px] font-bold min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center shadow-sm animate-in zoom-in-75">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-background shadow-2xl flex flex-col p-6 z-10 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between pb-6 border-b border-border">
              <BrandLogo variant="full" showTagline={false} />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-md hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-4 space-y-1 overflow-y-auto no-scrollbar">
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider px-2 pb-1">
                Categories
              </p>
              {allCategoryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium text-foreground hover:text-primary transition-colors py-1.5 px-2 rounded-lg hover:bg-muted/40"
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-3 border-t border-border space-y-0.5">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider px-2 py-1">
                  Customer Care
                </p>
                <Link
                  href="/policies?tab=shipping"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs font-medium text-muted-foreground hover:text-primary py-1.5 px-2 rounded-lg hover:bg-muted/40"
                >
                  🚚 Pan-India Shipping
                </Link>
                <Link
                  href="/policies?tab=return-refund"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs font-medium text-muted-foreground hover:text-primary py-1.5 px-2 rounded-lg hover:bg-muted/40"
                >
                  🔄 360° Unboxing Video Policy
                </Link>
              </div>

              <div className="pt-3 border-t border-border">
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium text-muted-foreground hover:text-primary py-2 px-2"
                >
                  Customer Account & Orders
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Global Quick Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="bg-[#FFFDF9] border border-[#EADBBE] rounded-2xl w-full max-w-xl p-4 shadow-2xl space-y-4 animate-in fade-in-0 zoom-in-95">
            <div className="flex items-center gap-3 border-b border-[#EADBBE] pb-3">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search chains, jhumkas, bangles, rings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground text-foreground"
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="p-1 hover:bg-muted rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {searchQuery.trim() && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Top Results ({searchResults.length})
                </p>
                {searchResults.length > 0 ? (
                  <div className="divide-y divide-[#EADBBE]/50">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-3 py-2.5 hover:bg-[#FAF7F2] px-2 rounded-xl transition-colors group"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-12 h-12 object-cover rounded-lg border border-[#EADBBE]"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-foreground truncate group-hover:text-primary">
                            {product.title}
                          </h4>
                          <p className="text-[11px] text-muted-foreground capitalize">
                            {product.category.replace("-", " ")}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-foreground">
                            {formatPrice(product.salePrice || product.price)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground py-4 text-center">
                    No jewelry matching &ldquo;{searchQuery}&rdquo;.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
