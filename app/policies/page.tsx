"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Ruler,
  RotateCcw,
  AlertCircle,
  Sparkles,
  Truck,
  CheckCircle2,
  Phone,
  MessageCircle,
  Video,
  FileText,
  Maximize2,
  X,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { storeConfig } from "@/config/store.config";
import { useSiteImages } from "@/hooks/useSiteImages";

type PolicyTab =
  | "shipping"
  | "care-guide"
  | "return-refund"
  | "ordering-instructions";

function PoliciesContent() {
  const searchParams = useSearchParams();
  const requestedTab = (searchParams?.get("tab") as PolicyTab) || "shipping";
  const [activeTab, setActiveTab] = useState<PolicyTab>(requestedTab);
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const { images: siteImages } = useSiteImages();

  useEffect(() => {
    if (requestedTab) {
      setActiveTab(requestedTab);
    }
  }, [requestedTab]);

  const tabs: { id: PolicyTab; label: string; icon: typeof Ruler; badge?: string }[] = [
    { id: "return-refund", label: "Return & Refund Policy", icon: RotateCcw, badge: "Important" },
    { id: "ordering-instructions", label: "Before Ordering", icon: AlertCircle, badge: "Must Read" },
    { id: "care-guide", label: "Jewelry Care Guide", icon: Sparkles, badge: "Care & Standards" },
    { id: "shipping", label: "Shipping (DTDC & India Post)", icon: Truck, badge: "Pan-India" },
  ];

  return (
    <div className="min-h-screen bg-background py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-semibold">Store Policies & Guides</span>
        </nav>

        {/* Hero Header */}
        <div className="space-y-3 border-b border-border pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Alnaya Standards</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground">
            Customer Care, Sizing & Store Policies
          </h1>
          <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
            Everything you need to know about measuring your bangle and ring size, our replacement guidelines with continuous 360° unboxing video, pre-order instructions, and pan-India shipping via DTDC Express & India Post.
          </p>
        </div>

        {/* Main Content Layout with Side/Top Navigation Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-4 space-y-2">
            <div className="p-3 bg-card border border-border rounded-2xl shadow-sm space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl text-xs font-bold transition-all text-left ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{tab.label}</span>
                    </div>
                    {tab.badge && (
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
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

            {/* WhatsApp Quick Help Card */}
            <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <MessageCircle className="w-4 h-4" />
                <span>Personal Concierge</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Have a question about bangle sizing, bulk gifting, or custom orders? Our team is available on WhatsApp daily.
              </p>
              <a
                href={`https://wa.me/${storeConfig.brand.contact.whatsappNumber}?text=${encodeURIComponent(
                  "Hello Alnaya! I have a question about sizing and store policies."
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat with us on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-sm space-y-8">
            {/* ======================================================== */}
            {/* TAB 2: RETURN & REFUND POLICY                           */}
            {/* ======================================================== */}
            {activeTab === "return-refund" && (
              <div className="space-y-6 animate-in fade-in-50">
                <div className="border-b border-border pb-4">
                  <h2 className="text-2xl font-bold text-foreground">
                    Return, Refund & Replacement Policy
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Please read our return policy carefully before placing your order.
                  </p>
                </div>

                {/* Return Policy Image */}
                <div className="relative group rounded-xl overflow-hidden border border-border bg-muted/20">
                  <img
                    src={siteImages.returnPolicyImage || "/images/return-refund-policy.jpg"}
                    alt="Alnaya Return, Refund & Replacement Policy"
                    className="w-full h-auto max-h-[460px] object-contain mx-auto"
                  />
                  <button
                    onClick={() => setZoomedImage(siteImages.returnPolicyImage || "/images/return-refund-policy.jpg")}
                    className="absolute bottom-4 right-4 px-3.5 py-2 rounded-xl bg-background/95 backdrop-blur border border-border shadow-lg text-xs font-semibold flex items-center gap-2 text-foreground hover:bg-background"
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span>Click to Enlarge Policy</span>
                  </button>
                </div>

                {/* Policies Details */}
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20 space-y-1.5">
                    <div className="flex items-center gap-2 text-destructive font-bold text-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>No Cancellations, Returns or Refunds</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Once an order is confirmed and placed, we strictly DO NOT accept cancellations, returns, or refunds. Please double-check product details and measurements prior to confirming payment.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      <span>Replacements for Transit Damage Only</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      We offer free replacements only in the rare case that you receive a damaged piece during courier transit.
                    </p>
                  </div>

                  {/* 360 Video Requirements */}
                  <div className="p-5 rounded-xl bg-background border-2 border-primary/40 space-y-3">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm">
                      <Video className="w-5 h-5 flex-shrink-0" />
                      <span>Mandatory Continuous 360° Unboxing Video</span>
                    </div>
                    <p className="text-xs text-foreground leading-relaxed">
                      To qualify for a replacement, a continuous 360-degree unboxing video is <strong>MANDATORY</strong> without exception:
                    </p>

                    <ul className="space-y-2 text-xs text-muted-foreground pl-1">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        <span>
                          <strong>Recording Must Start from Sealed Parcel:</strong> Begin recording before opening the sealed outer courier parcel.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        <span>
                          <strong>Full 360° View of Parcel:</strong> Clearly show the courier package from all sides, including the shipping label and tracking barcode.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        <span>
                          <strong>Continuous & Uncut:</strong> The video must be completely continuous without pauses, cuts, or edits.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        <span>
                          <strong>Clear Inspection on Camera:</strong> Open the package on camera and inspect the damaged item clearly.
                        </span>
                      </li>
                    </ul>

                    <div className="pt-2 text-xs text-destructive font-medium border-t border-border/80">
                      ⚠️ Without a complete, continuous unboxing video starting from the sealed outer package, replacement claims cannot be accepted or processed under any circumstances.
                    </div>
                  </div>

                  {/* Reporting Window */}
                  <div className="p-4 rounded-xl bg-background border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        24-Hour Reporting Window
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Damage must be reported within 24 hours of delivery confirmation with the unboxing video and Order ID.
                      </p>
                    </div>
                    <a
                      href={`https://wa.me/${storeConfig.brand.contact.whatsappNumber}?text=${encodeURIComponent(
                        "Hello Alnaya! I would like to report damage on my order. Here is my unboxing video and Order ID."
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-[#25D366] text-white font-bold text-xs flex items-center gap-2 hover:bg-[#20bd5a] transition-all self-start sm:self-auto"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>Contact WhatsApp Support</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 3: IMPORTANT INSTRUCTIONS BEFORE ORDERING            */}
            {/* ======================================================== */}
            {activeTab === "ordering-instructions" && (
              <div className="space-y-6 animate-in fade-in-50">
                <div className="border-b border-border pb-4">
                  <h2 className="text-2xl font-bold text-foreground">
                    Important Instructions Before Ordering
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Kindly read these pre-order instructions for seamless fulfillment.
                  </p>
                </div>


                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-background border border-border space-y-2">
                    <div className="flex items-center gap-2 font-bold text-primary text-sm">
                      <Phone className="w-4 h-4" />
                      <span>1. Provide 2 Active Numbers</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Please provide 2 active, reachable mobile contact numbers (preferably WhatsApp) when placing your order. This helps the courier partner (DTDC / India Post) coordinate delivery without failed attempts.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-background border border-border space-y-2">
                    <div className="flex items-center gap-2 font-bold text-primary text-sm">
                      <FileText className="w-4 h-4" />
                      <span>2. Photo Confirmation Before Dispatch</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      We share real product photos and packaging confirmation directly on WhatsApp before courier handover, ensuring total transparency.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-background border border-border space-y-2">
                    <div className="flex items-center gap-2 font-bold text-primary text-sm">
                      <Sparkles className="w-4 h-4" />
                      <span>3. Surprise & Gift Orders</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      If ordering a surprise gift, let us know via order notes or WhatsApp so we can enclose special luxury gift packaging and exclude price tags from the invoice package.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-background border border-border space-y-2">
                    <div className="flex items-center gap-2 font-bold text-primary text-sm">
                      <ShieldCheck className="w-4 h-4" />
                      <span>4. 100% Prepaid (No COD)</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      All orders are 100% prepaid via UPI (GPay, PhonePe, Paytm, QR Code) or Bank Transfer to enable immediate courier booking and dispatch. COD is not available.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-xs text-foreground flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <strong>5. Complete Shipping Address:</strong> Ensure complete door/flat number, street, nearby landmark, and correct 6-digit postal PIN code are accurately entered.
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 4: JEWELRY CARE GUIDE                               */}
            {/* ======================================================== */}
            {activeTab === "care-guide" && (
              <div className="space-y-6 animate-in fade-in-50">
                <div className="border-b border-border pb-4">
                  <h2 className="text-2xl font-bold text-foreground">
                    Jewelry Care Guide
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Engineered in hallmark stainless steel with radiant 18K gold finish.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-background border border-border text-center space-y-1">
                    <span className="text-xs font-bold text-primary uppercase">Base Metal</span>
                    <p className="text-sm font-black text-foreground">Premium Stainless Steel</p>
                    <p className="text-[11px] text-muted-foreground">Surgical grade & non-corrosive</p>
                  </div>

                  <div className="p-4 rounded-xl bg-background border border-border text-center space-y-1">
                    <span className="text-xs font-bold text-primary uppercase">Gold Coating</span>
                    <p className="text-sm font-black text-foreground">Radiant 18K Gold Finish</p>
                    <p className="text-[11px] text-muted-foreground">Vacuum bonded for durability</p>
                  </div>

                  <div className="p-4 rounded-xl bg-background border border-border text-center space-y-1">
                    <span className="text-xs font-bold text-primary uppercase">Skin Safety</span>
                    <p className="text-sm font-black text-foreground">100% Hypoallergenic</p>
                    <p className="text-[11px] text-muted-foreground">Zero nickel, zero lead</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                    Care & Maintenance Recommendations
                  </h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="p-4 rounded-xl bg-background border border-border flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-foreground">Waterproof & Shower Friendly:</strong>
                        <p className="text-muted-foreground mt-0.5 leading-relaxed">
                          Feel free to wear your Alnaya jewelry in the shower, swimming pool, gym workouts, or during daily chores. Our fine jewelry pieces will not rust or discolor your skin.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-background border border-border flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-foreground">Perfumes, Lotions & Sprays:</strong>
                        <p className="text-muted-foreground mt-0.5 leading-relaxed">
                          Allow cosmetics, body lotions, and perfumes to absorb and dry before putting on your jewelry. While the steel will not corrode, heavy chemicals can create a temporary surface film over the gold polish.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-background border border-border flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-foreground">Gentle Cleaning:</strong>
                        <p className="text-muted-foreground mt-0.5 leading-relaxed">
                          Wipe periodically with a soft microfiber cloth. For deeper cleaning, rinse under lukewarm water with mild soap and pat dry thoroughly.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-background border border-border flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-foreground">Protective Storage:</strong>
                        <p className="text-muted-foreground mt-0.5 leading-relaxed">
                          Store each piece in your complimentary Alnaya zip pouch to prevent friction and surface scratches when not in use.
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
                <div className="border-b border-border pb-4">
                  <h2 className="text-2xl font-bold text-foreground">
                    Shipping Policy (DTDC & India Post)
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Fast, reliable courier delivery across India & Qatar.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-background border border-border flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm border border-primary/20">
                      DTDC
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">DTDC Express Courier</h4>
                      <p className="text-xs text-muted-foreground">
                        Fast air & surface express delivery with doorstep delivery.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-background border border-border flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm border border-primary/20">
                      SPEED
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">India Post (Speed Post)</h4>
                      <p className="text-xs text-muted-foreground">
                        100% Pan-India PIN code coverage reaching every city and village.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                    Rates & Delivery Estimates
                  </h3>
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-muted/60 text-foreground font-bold border-b border-border">
                        <tr>
                          <th className="p-3 sm:p-4">Destination</th>
                          <th className="p-3 sm:p-4">Courier Fee</th>
                          <th className="p-3 sm:p-4">Transit Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr className="hover:bg-muted/20">
                          <td className="p-3 sm:p-4 font-semibold text-foreground">Within Kerala (All 14 Districts) Below ₹799</td>
                          <td className="p-3 sm:p-4 font-bold text-primary">₹50</td>
                          <td className="p-3 sm:p-4 text-muted-foreground">2 – 3 Business Days</td>
                        </tr>
                        <tr className="hover:bg-muted/20">
                          <td className="p-3 sm:p-4 font-semibold text-foreground">Outside Kerala (Rest of India) Below ₹799</td>
                          <td className="p-3 sm:p-4 font-bold text-primary">₹60</td>
                          <td className="p-3 sm:p-4 text-muted-foreground">3 – 5 Business Days</td>
                        </tr>
                        <tr className="bg-primary/5 hover:bg-primary/10">
                          <td className="p-3 sm:p-4 font-bold text-primary">Orders Above ₹799</td>
                          <td className="p-3 sm:p-4 font-bold text-emerald-600">FREE Express Delivery</td>
                          <td className="p-3 sm:p-4 font-semibold text-foreground">Priority Express</td>
                        </tr>
                        <tr className="hover:bg-muted/20">
                          <td className="p-3 sm:p-4 font-semibold text-foreground">Qatar (Doha & All Zones) Orders</td>
                          <td className="p-3 sm:p-4 font-bold text-emerald-600">FREE Delivery</td>
                          <td className="p-3 sm:p-4 text-muted-foreground">Within 14 Days</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-background border border-border space-y-2">
                  <div className="flex items-center gap-2 font-bold text-primary text-xs uppercase tracking-wider">
                    <Truck className="w-4 h-4" />
                    <span>Real-Time Tracking</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Once your order is dispatched, a live DTDC / India Post tracking consignment link is sent to your registered WhatsApp number and SMS. You can monitor the progress until it is safely delivered.
                  </p>
                </div>
              </div>
            )}
          </div>
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

export default function PoliciesPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 py-24 text-center">
          <p className="text-xs text-muted-foreground animate-pulse">Loading store policies...</p>
        </div>
      }
    >
      <PoliciesContent />
    </Suspense>
  );
}
