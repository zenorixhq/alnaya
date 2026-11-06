"use client";

import { useState, useEffect } from "react";
import {
  X,
  Ruler,
  RotateCcw,
  AlertCircle,
  Sparkles,
  Truck,
  CheckCircle2,
  Phone,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Video,
  FileText,
  Maximize2,
} from "lucide-react";
import { storeConfig } from "@/config/store.config";
import { useSiteImages } from "@/hooks/useSiteImages";

export type PolicyTab =
  | "care-guide"
  | "shipping"
  | "return-refund"
  | "ordering-instructions";

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: PolicyTab;
}

export function PolicyModal({
  isOpen,
  onClose,
  initialTab = "care-guide",
}: PolicyModalProps) {
  const [activeTab, setActiveTab] = useState<PolicyTab>(initialTab);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const { images: siteImages } = useSiteImages();

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Listen to escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (zoomedImage) {
          setZoomedImage(null);
        } else if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, zoomedImage, onClose]);

  if (!isOpen) return null;

  const tabs: { id: PolicyTab; label: string; icon: any; badge?: string }[] = [
    { id: "care-guide", label: "Jewelry Care", icon: Sparkles, badge: "Care & Standards" },
    { id: "shipping", label: "Shipping Policy", icon: Truck, badge: "DTDC & India Post" },
    { id: "return-refund", label: "Return & Refund", icon: RotateCcw, badge: "Important" },
    { id: "ordering-instructions", label: "Before Ordering", icon: AlertCircle, badge: "Must Read" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => {
          if (zoomedImage) setZoomedImage(null);
          else onClose();
        }}
      />

      {/* Main Modal Card */}
      <div data-lenis-prevent className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-card rounded-2xl border border-border shadow-2xl overflow-hidden z-10 animate-in fade-in-0 zoom-in-95">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                Alnaya Customer Care & Policy Guide
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Official specifications, sizing charts, and store policies
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Buttons */}
        <div className="flex items-center gap-1 px-4 sm:px-6 py-2 border-b border-border bg-card overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`hidden sm:inline-block text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="p-5 sm:p-8 overflow-y-auto max-h-[calc(92vh-140px)] space-y-6 text-foreground">
          {/* ======================================================== */}
          {/* TAB 2: RETURN & REFUND POLICY                           */}
          {/* ======================================================== */}
          {activeTab === "return-refund" && (
            <div className="space-y-6 animate-in fade-in-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
                <div>
                  <h4 className="text-xl font-bold text-foreground">
                    Return, Refund & Replacement Policy
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Clear guidelines to protect both our valued customers and brand authenticity.
                  </p>
                </div>
                <span className="self-start sm:self-auto text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-purple-500/10 text-purple-700 border border-purple-500/20">
                  Strict Unboxing Video Required
                </span>
              </div>

              {/* Graphic Banner */}
              <div className="relative group rounded-xl overflow-hidden border border-border bg-muted/20">
                <img
                  src={siteImages.returnPolicyImage || "/images/return-refund-policy.jpg"}
                  alt="Alnaya Official Return, Refund and Damage Replacement Policy"
                  className="w-full h-auto max-h-[380px] object-contain mx-auto"
                />
                <button
                  onClick={() => setZoomedImage(siteImages.returnPolicyImage || "/images/return-refund-policy.jpg")}
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-background/90 backdrop-blur border border-border shadow text-xs font-semibold flex items-center gap-1.5 text-foreground hover:bg-background"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Click to Enlarge Policy</span>
                </button>
              </div>

              {/* Policy Key Points */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20 space-y-2">
                  <div className="flex items-center gap-2 text-destructive font-bold text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>No Cancellations, Returns or Refunds</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Once an order has been confirmed and placed with Alnaya, cancellations, returns, or refunds are strictly NOT accepted under any conditions. Please review your selected jewelry pieces, sizing, and shipping address carefully prior to confirming your order.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Replacements for Damaged Pieces Only</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    We stand firmly behind the quality of our craftsmanship. If you receive a damaged piece during transit, we provide an immediate, free replacement piece.
                  </p>
                </div>

                {/* 360 Video Requirements Box */}
                <div className="p-5 rounded-xl bg-card border-2 border-primary/40 space-y-3">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <Video className="w-5 h-5 flex-shrink-0" />
                    <span>Mandatory Continuous 360° Unboxing Video</span>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">
                    To be eligible for a replacement, a continuous, unedited 360-degree unboxing video is <strong>strictly mandatory</strong>:
                  </p>

                  <ul className="space-y-2 text-xs text-muted-foreground pl-1">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span>
                        <strong>Start Before Opening:</strong> The recording must start before the sealed courier package is opened.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span>
                        <strong>Clear 360° View of Parcel:</strong> Show all sides of the parcel, clearly displaying the shipping label, recipient details, and courier tracking barcode.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span>
                        <strong>No Cuts or Edits:</strong> The video must be continuous and uninterrupted without any cuts, pauses, or edits.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span>
                        <strong>Open on Camera:</strong> Open the package on camera and inspect the damaged item under clear lighting.
                      </span>
                    </li>
                  </ul>

                  <div className="pt-2 text-xs text-destructive font-medium border-t border-border/80">
                    ⚠️ Notice: Without a clear, continuous unboxing video starting from the sealed outer package, replacement claims cannot be entertained under any circumstances.
                  </div>
                </div>

                {/* Reporting Window */}
                <div className="p-4 rounded-xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Damage Reporting Window
                    </h5>
                    <p className="text-xs text-muted-foreground">
                      Must be reported within <strong>24 hours of delivery</strong> with video & Order ID.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/${storeConfig.brand.contact.whatsappNumber}?text=${encodeURIComponent(
                        "Hello Alnaya! I would like to report transit damage on my order. Here is my Order ID and unboxing video."
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-lg bg-[#25D366] text-white font-bold text-xs flex items-center gap-1.5 hover:bg-[#20bd5a] transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Report via WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: IMPORTANT INSTRUCTIONS BEFORE ORDERING            */}
          {/* ======================================================== */}
          {activeTab === "ordering-instructions" && (
            <div className="space-y-6 animate-in fade-in-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
                <div>
                  <h4 className="text-xl font-bold text-foreground">
                    Important Instructions Before Ordering
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Essential information to ensure smooth courier delivery and perfect fulfillment.
                  </p>
                </div>
                <span className="self-start sm:self-auto text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Pre-Order Checklist
                </span>
              </div>


              {/* Instructions Grid */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Point 1 */}
                  <div className="p-4 rounded-xl bg-card border border-border/80 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-primary text-sm">
                      <Phone className="w-4 h-4" />
                      <span>1. Provide 2 Active Contact Numbers</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Please provide 2 active contact numbers (preferably WhatsApp) when placing your order. This allows our courier partners (DTDC / India Post) to coordinate delivery seamlessly and prevents delivery delays or returns.
                    </p>
                  </div>

                  {/* Point 2 */}
                  <div className="p-4 rounded-xl bg-card border border-border/80 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-primary text-sm">
                      <FileText className="w-4 h-4" />
                      <span>2. Photo Confirmation Before Dispatch</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      We share real product photos and packaging confirmation directly on WhatsApp prior to courier handover. You see exactly what is being sent to you with complete peace of mind.
                    </p>
                  </div>

                  {/* Point 3 */}
                  <div className="p-4 rounded-xl bg-card border border-border/80 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-primary text-sm">
                      <Sparkles className="w-4 h-4" />
                      <span>3. Surprise & Gift Orders</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      If your order is a gift or surprise, please mention it in the order notes or message us on WhatsApp so we can provide special luxury packaging and exclude price tags from the invoice package.
                    </p>
                  </div>

                  {/* Point 4 */}
                  <div className="p-4 rounded-xl bg-card border border-border/80 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-primary text-sm">
                      <ShieldCheck className="w-4 h-4" />
                      <span>4. 100% Prepaid Orders (No COD)</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      To facilitate instant courier dispatch via DTDC Express & India Post, all orders are 100% prepaid via UPI (GPay, PhonePe, Paytm, QR Code) or Bank Transfer. Cash on Delivery (COD) is not available.
                    </p>
                  </div>
                </div>

                {/* Point 5 Banner */}
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-xs text-foreground flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <strong>5. Verify Address & PIN Code:</strong> Please ensure your complete door/flat number, building name, street, nearest landmark, and correct 6-digit postal PIN code are accurately entered at checkout.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: JEWELRY CARE GUIDE                               */}
          {/* ======================================================== */}
          {activeTab === "care-guide" && (
            <div className="space-y-6 animate-in fade-in-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
                <div>
                  <h4 className="text-xl font-bold text-foreground">
                    Jewelry Care Guide
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    How to care for your waterproof, skin-friendly everyday luxury pieces.
                  </p>
                </div>
                <span className="self-start sm:self-auto text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  100% Waterproof Certified
                </span>
              </div>

              {/* Steel Specs Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-card border border-border text-center space-y-1">
                  <span className="text-xs font-bold text-primary uppercase">Base Material</span>
                  <p className="text-sm font-black text-foreground">Premium Stainless Steel</p>
                  <p className="text-[11px] text-muted-foreground">Surgical grade & non-corrosive</p>
                </div>

                <div className="p-4 rounded-xl bg-card border border-border text-center space-y-1">
                  <span className="text-xs font-bold text-primary uppercase">Gold Coating</span>
                  <p className="text-sm font-black text-foreground">Radiant 18K Gold Finish</p>
                  <p className="text-[11px] text-muted-foreground">10x more durable than electroplate</p>
                </div>

                <div className="p-4 rounded-xl bg-card border border-border text-center space-y-1">
                  <span className="text-xs font-bold text-primary uppercase">Skin Safety</span>
                  <p className="text-sm font-black text-foreground">100% Hypoallergenic</p>
                  <p className="text-[11px] text-muted-foreground">Nickel-free & lead-free</p>
                </div>
              </div>

              {/* Care Tips */}
              <div className="space-y-3">
                <h5 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  Simple Care Instructions
                </h5>
                <div className="space-y-2.5 text-xs">
                  <div className="p-3.5 rounded-xl bg-card border border-border/80 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground">Waterproof & Shower Safe:</strong>
                      <p className="text-muted-foreground mt-0.5 leading-relaxed">
                        You can wear your Alnaya pieces freely in the shower, gym, pool, ocean, or while washing hands. They will not rust, fade, or lose their luster.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-card border border-border/80 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground">Perfumes & Lotions:</strong>
                      <p className="text-muted-foreground mt-0.5 leading-relaxed">
                        While our premium stainless steel does not oxidize, harsh chemicals in perfumes or body mists can leave a dull film over high-polish gold. We recommend applying cosmetics first, allowing them to dry, then putting on your jewelry.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-card border border-border/80 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground">Gentle Cleaning:</strong>
                      <p className="text-muted-foreground mt-0.5 leading-relaxed">
                        Wipe your pieces occasionally with a soft microfiber cloth or rinse with mild soapy warm water and pat dry to maintain instant mirror shine.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-card border border-border/80 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground">Proper Storage:</strong>
                      <p className="text-muted-foreground mt-0.5 leading-relaxed">
                        When not in use, store each piece separately in your complimentary Alnaya zip pouch to prevent friction against hard surfaces.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: SHIPPING POLICY (DTDC & INDIA POST)              */}
          {/* ======================================================== */}
          {activeTab === "shipping" && (
            <div className="space-y-6 animate-in fade-in-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
                <div>
                  <h4 className="text-xl font-bold text-foreground">
                    Shipping Policy (DTDC & India Post)
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Fast, secure Pan-India delivery with live SMS & WhatsApp tracking.
                  </p>
                </div>
                <span className="self-start sm:self-auto text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Flat ₹40 • Free Over ₹799
                </span>
              </div>

              {/* Courier Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-card border border-border flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm border border-primary/20">
                    DTDC
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-foreground">DTDC Express Courier</h5>
                    <p className="text-xs text-muted-foreground">
                      Air & Surface Express with direct doorstep courier dispatch.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-card border border-border flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm border border-primary/20">
                    SPEED
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-foreground">India Post (Speed Post)</h5>
                    <p className="text-xs text-muted-foreground">
                      100% Pan-India PIN code coverage reaching every city, town & village.
                    </p>
                  </div>
                </div>
              </div>

              {/* Rates & Timelines */}
              <div className="space-y-3">
                <h5 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  Shipping Rates & Delivery Timelines
                </h5>
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted/60 text-foreground font-bold border-b border-border">
                      <tr>
                        <th className="p-3">Destination / Order Value</th>
                        <th className="p-3">Courier Fee</th>
                        <th className="p-3">Estimated Transit Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr className="hover:bg-muted/20">
                        <td className="p-3 font-semibold text-foreground">Within Kerala (All 14 Districts) Below ₹799</td>
                        <td className="p-3 font-bold text-primary">₹50</td>
                        <td className="p-3 text-muted-foreground">2 – 3 Business Days</td>
                      </tr>
                      <tr className="hover:bg-muted/20">
                        <td className="p-3 font-semibold text-foreground">Outside Kerala (Rest of India) Below ₹799</td>
                        <td className="p-3 font-bold text-primary">₹60</td>
                        <td className="p-3 text-muted-foreground">3 – 5 Business Days</td>
                      </tr>
                      <tr className="bg-primary/5 hover:bg-primary/10">
                        <td className="p-3 font-bold text-primary">Orders Above ₹799</td>
                        <td className="p-3 font-bold text-emerald-600">FREE Delivery</td>
                        <td className="p-3 font-semibold text-foreground">Priority Express</td>
                      </tr>
                      <tr className="hover:bg-muted/20">
                        <td className="p-3 font-semibold text-foreground">State of Qatar Orders</td>
                        <td className="p-3 font-bold text-emerald-600">FREE Delivery</td>
                        <td className="p-3 text-muted-foreground">Within 14 Days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Live Tracking Information */}
              <div className="p-4 rounded-xl bg-card border border-border space-y-2">
                <div className="flex items-center gap-2 font-bold text-primary text-xs uppercase tracking-wider">
                  <Truck className="w-4 h-4" />
                  <span>Live Tracking & Order Updates</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  As soon as your parcel is packed and handed over to DTDC or India Post, you will receive an automated tracking link with consignment details directly via WhatsApp and SMS. You can follow your package in real-time until it safely arrives at your doorstep.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3 border-t border-border bg-muted/20 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MessageCircle className="w-3.5 h-3.5 text-primary" />
            <span>Need assistance? WhatsApp +91 90370 75227</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>

      {/* Fullscreen Image Zoom Lightbox */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in-0"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-auto">
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors z-10"
              aria-label="Close enlarged preview"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={zoomedImage}
              alt="Enlarged policy guide"
              className="w-auto h-auto max-w-full max-h-[85vh] rounded-xl object-contain mx-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
