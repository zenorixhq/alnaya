"use client";

import { useState } from "react";
import Link from "next/link";
import { storeConfig } from "@/config/store.config";
import {
  MessageCircle,
  Instagram,
  Facebook,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { BrandLogo } from "@/components/storefront/BrandLogo";
import { PolicyModal, PolicyTab } from "@/components/storefront/PolicyModal";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [policyModalTab, setPolicyModalTab] = useState<PolicyTab | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-[#0C0A09] text-[#FAF7F2] border-t border-stone-800/80 mt-16 sm:mt-24 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Main 4-Column Minimalist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Column 1: Brand & Atelier Essence (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <BrandLogo variant="full" showTagline={true} theme="dark" />
            
            <p className="text-xs sm:text-sm text-stone-400 font-light leading-relaxed max-w-sm">
              Fine jewelry for the skin, not the vault. Handcrafted in premium stainless steel with radiant mirror gold finish. 100% waterproof and skin-friendly.
            </p>

            {/* Social & WhatsApp Buttons */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href={storeConfig.brand.socials.instagram || "https://www.instagram.com/alnaya.in?psln=cDNzY3liNjltb203"}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-stone-400 hover:text-purple-400 hover:border-purple-400/60 hover:bg-purple-500/10 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={`https://wa.me/${storeConfig.brand.contact.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-stone-400 hover:text-[#25D366] hover:border-[#25D366]/60 hover:bg-[#25D366]/10 transition-all"
                aria-label="WhatsApp Concierge"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <a
                href={storeConfig.brand.socials.facebook || "https://www.facebook.com/share/1DXg9Puzkj/"}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-stone-400 hover:text-[#1877F2] hover:border-[#1877F2]/60 hover:bg-[#1877F2]/10 transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Collections (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-[11px] font-bold uppercase tracking-[0.2em] text-purple-300">
              Collections
            </h5>
            <ul className="space-y-2 text-xs sm:text-[13px] text-stone-400">
              <li>
                <Link href="/products?category=minimal-chains" className="hover:text-white transition-colors">
                  Minimal Chains
                </Link>
              </li>
              <li>
                <Link href="/products?category=jhumkas" className="hover:text-white transition-colors">
                  Ethnic Jhumkas
                </Link>
              </li>
              <li>
                <Link href="/products?category=traditional-sets" className="hover:text-white transition-colors">
                  Traditional Sets
                </Link>
              </li>
              <li>
                <Link href="/products?category=bangles" className="hover:text-white transition-colors">
                  Bangles & Kada
                </Link>
              </li>
              <li>
                <Link href="/products?category=offer-products" className="text-purple-300 hover:text-white transition-colors flex items-center gap-1 font-semibold">
                  <span>✦ Offer Products</span>
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-purple-300 hover:underline transition-colors flex items-center gap-1 pt-1 font-medium">
                  <span>All 12 Categories</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Client Care & Policies (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="text-[11px] font-bold uppercase tracking-[0.2em] text-purple-300">
              Client Concierge
            </h5>
            <ul className="space-y-2 text-xs sm:text-[13px] text-stone-400">
              <li>
                <button
                  onClick={() => setPolicyModalTab("size-guide")}
                  className="hover:text-white transition-colors text-left"
                >
                  Bangle & Ring Size Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPolicyModalTab("care-guide")}
                  className="hover:text-white transition-colors text-left"
                >
                  Jewelry Care Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPolicyModalTab("shipping")}
                  className="hover:text-white transition-colors text-left"
                >
                  Shipping via DTDC & India Post
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPolicyModalTab("return-refund")}
                  className="hover:text-white transition-colors text-left"
                >
                  360° Unboxing & Return Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPolicyModalTab("ordering-instructions")}
                  className="hover:text-white transition-colors text-left"
                >
                  Pre-Order Instructions
                </button>
              </li>
              <li className="pt-0.5">
                <Link href="/account" className="hover:text-white transition-colors text-stone-300">
                  Track Your Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter / Stay Informed (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="text-[11px] font-bold uppercase tracking-[0.2em] text-purple-300">
              Stay in Touch
            </h5>
            <p className="text-xs text-stone-400 leading-relaxed font-light">
              Receive private previews, secret seasonal catalogs, and 5% off your first purchase.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-purple-900/30 border border-purple-400/30 text-xs text-[#FAF7F2] font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-300 flex-shrink-0" />
                <span>Thank you! Your 5% first purchase voucher (ALNAYA5) has been sent.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative flex items-center pt-1">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-3.5 pr-20 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-stone-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all font-light"
                />
                <button
                  type="submit"
                  className="absolute right-1 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#7E22CE] text-white hover:bg-[#6B21A8] transition-all flex items-center gap-1 shadow-sm active:scale-95"
                >
                  <span>Join</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </form>
            )}

            <p className="text-[10px] text-stone-500 pt-1">
              WhatsApp Support: +{storeConfig.brand.contact.whatsappNumber}
            </p>
          </div>
        </div>

        {/* Bottom Legal & Minimal Trust Cues */}
        <div className="mt-12 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} {storeConfig.meta.name}. Fine Everyday Jewelry. All rights reserved.</p>
          <div className="flex items-center gap-3 text-[11px] text-stone-400">
            <span>Waterproof & Sweat-Safe</span>
            <span className="text-stone-700">•</span>
            <span>Hypoallergenic Comfort</span>
            <span className="text-stone-700">•</span>
            <span>Free Shipping Over ₹799</span>
          </div>
        </div>
      </div>

      {/* Interactive Policy & Size Guide Modal */}
      <PolicyModal
        isOpen={!!policyModalTab}
        onClose={() => setPolicyModalTab(null)}
        initialTab={policyModalTab || "size-guide"}
      />
    </footer>
  );
}
