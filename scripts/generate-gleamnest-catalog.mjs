import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const rawItems = [
  // RINGS (12 items)
  {
    category: "rings",
    title: "Statement Ring",
    price: 140.0,
    tags: ["Rings", "Statement", "Everyday"],
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800",
    description: "Bold gold-finish statement ring designed for modern daily styling. Hypoallergenic and lightweight.",
  },
  {
    category: "rings",
    title: "Adjustable Ring",
    price: 230.0,
    tags: ["Rings", "Adjustable", "Gold"],
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=800",
    description: "Easy comfort fit adjustable gold ring. Fits all finger sizes seamlessly.",
  },
  {
    category: "rings",
    title: "Flower Ring",
    price: 230.0,
    tags: ["Rings", "Floral", "Dainty"],
    image: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&q=80&w=800",
    description: "Delicate floral bloom motif ring crafted in 18K gold PVD finish. Beautiful solo or stacked.",
  },
  {
    category: "rings",
    title: "Dainty Adjustable Ring",
    price: 240.0,
    tags: ["Rings", "Adjustable", "Minimalist"],
    image: "https://images.unsplash.com/photo-1611591475806-039775089201?auto=format&fit=crop&q=80&w=800",
    description: "Subtle open band design offering flexible sizing and daily wear durability.",
  },
  {
    category: "rings",
    title: "Minimalist Adjustable Ring",
    price: 250.0,
    tags: ["Rings", "Minimalist", "Waterproof"],
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=800",
    description: "Clean aesthetic ring with polished luster that resists tarnish and sweat.",
  },
  {
    category: "rings",
    title: "Combo Ring Set",
    price: 290.0,
    tags: ["Rings", "Stackable", "Combo Set"],
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800",
    description: "Curated stackable multi-ring combo set. Mix, match, and stack across multiple fingers.",
  },
  {
    category: "rings",
    title: "Simple Dome Ring",
    price: 300.0,
    tags: ["Rings", "Simple", "Dome"],
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=800",
    description: "Smooth domed contour gold band. Elegant mirror shine that stays brilliant every day.",
  },
  {
    category: "rings",
    title: "Classic Anti-Tarnish Ring",
    price: 310.0,
    tags: ["Rings", "Classic", "Bestseller"],
    image: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&q=80&w=800",
    description: "Timeless ring silhouette designed to withstand daily chores, sanitizing, and water exposure.",
  },
  {
    category: "rings",
    title: "Gold Plated Adjustable Ring",
    price: 310.0,
    tags: ["Rings", "Gold Plated", "Adjustable"],
    image: "https://images.unsplash.com/photo-1611591475806-039775089201?auto=format&fit=crop&q=80&w=800",
    description: "Premium 18K gold-plated adjustable ring featuring open comfort band construction.",
  },
  {
    category: "rings",
    title: "Lavender Adjustable Finger Ring",
    price: 310.0,
    tags: ["Rings", "Lavender", "Enamel"],
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=800",
    description: "Pastel lavender enamel inlay paired with high-shine gold plating. A charming pop of color.",
  },
  {
    category: "rings",
    title: "Blue Adjustable Finger Ring",
    price: 310.0,
    tags: ["Rings", "Blue", "Enamel"],
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800",
    description: "Vibrant sapphire blue accent adjustable ring with anti-tarnish stainless steel base.",
  },
  {
    category: "rings",
    title: "Multicoloured Round Adjustable Ring",
    price: 310.0,
    tags: ["Rings", "Multicoloured", "Round"],
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=800",
    description: "Playful multicoloured enamel stone round centerpiece on an adjustable golden shank.",
  },

  // BANGLES & BRACELETS (32 items)
  {
    category: "bracelets",
    title: "Clover Black Bracelet",
    price: 150.0,
    tags: ["Bracelets", "Clover", "Black", "Bestseller"],
    image: "https://images.unsplash.com/photo-1611591475806-039775089201?auto=format&fit=crop&q=80&w=800",
    description: "Iconic four-leaf clover motif with black onyx-style inlay on a dainty gold cable chain.",
  },
  {
    category: "bracelets",
    title: "Clover Bracelet - Gold",
    price: 150.0,
    tags: ["Bracelets", "Clover", "Gold"],
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800",
    description: "Full gold-finish lucky clover motif bracelet. Lightweight, dainty, and effortlessly layerable.",
  },
  {
    category: "bracelets",
    title: "White and Black Clover Bracelet",
    price: 150.0,
    tags: ["Bracelets", "Clover", "Duo Tone"],
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800",
    description: "Alternating mother-of-pearl white and black clover motifs along a shimmering golden chain.",
  },
  {
    category: "bracelets",
    title: "Evil Eye Trendy Bangle",
    price: 210.0,
    tags: ["Bangles", "Evil Eye", "Trendy"],
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    description: "Protective evil eye emblem centered on a sleek open cuff bangle. Ward off negativity in style.",
  },
  {
    category: "bracelets",
    title: "Green Pearl Bracelet GNBR003",
    price: 218.0,
    tags: ["Bracelets", "Pearl", "Green", "GNBR003"],
    image: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&q=80&w=800",
    description: "Freshwater-style green pearl beads interspersed with golden accents. SKU: GNBR003.",
  },
  {
    category: "bracelets",
    title: "Charm Bracelet",
    price: 249.0,
    tags: ["Bracelets", "Charm", "Dainty"],
    image: "https://images.unsplash.com/photo-1611591475806-039775089201?auto=format&fit=crop&q=80&w=800",
    description: "Playful dangling golden charms that chime softly with movement. Daily anti-tarnish finish.",
  },
  {
    category: "bracelets",
    title: "Charm Bracelet (Size - 2.4 to 2.6)",
    price: 249.0,
    tags: ["Bracelets", "Charm", "Sized"],
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800",
    description: "Tailored fit charm bracelet sized specifically for standard 2.4 to 2.6 wrist dimensions.",
  },
  {
    category: "bracelets",
    title: "Deluxe Charm Bracelet",
    price: 270.0,
    tags: ["Bracelets", "Charm", "Deluxe"],
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800",
    description: "Richly detailed charms with pavé cubic zirconia micro-accents. 18K gold luster.",
  },
  {
    category: "bracelets",
    title: "Statement Bangle GNBL001",
    price: 270.0,
    tags: ["Bangles", "Statement", "GNBL001"],
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    description: "Architectural structured statement bangle. Precision clasp closure. SKU: GNBL001.",
  },
  {
    category: "bracelets",
    title: "Statement Bangle GNBL002",
    price: 270.0,
    tags: ["Bangles", "Statement", "GNBL002"],
    image: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&q=80&w=800",
    description: "Modern minimalist sculpted statement bangle. Smooth mirror gold polish. SKU: GNBL002.",
  },
  {
    category: "bracelets",
    title: "Statement Bangle GNBL003",
    price: 270.0,
    tags: ["Bangles", "Statement", "GNBL003"],
    image: "https://images.unsplash.com/photo-1611591475806-039775089201?auto=format&fit=crop&q=80&w=800",
    description: "Twisted textured statement bangle designed for effortless stacking. SKU: GNBL003.",
  },
  {
    category: "bracelets",
    title: "Green Bracelet",
    price: 280.0,
    tags: ["Bracelets", "Green", "Stone"],
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800",
    description: "Emerald green crystal faceted beads on an anti-tarnish stainless steel link chain.",
  },
  {
    category: "bracelets",
    title: "Bamboo Bracelet (White & Black)",
    price: 299.0,
    tags: ["Bracelets", "Bamboo", "Enamel"],
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800",
    description: "Organically contoured bamboo node links highlighted with white & black enamel (per piece).",
  },
  {
    category: "bracelets",
    title: "Clover Black Luxury Bracelet",
    price: 299.0,
    tags: ["Bracelets", "Clover", "Black", "Luxury"],
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    description: "Upgraded multi-motif black clover bracelet with weighted gold cable links.",
  },
  {
    category: "bracelets",
    title: "Heart Charm Bracelet",
    price: 299.0,
    tags: ["Bracelets", "Heart", "Charm"],
    image: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&q=80&w=800",
    description: "Romantic puffed heart pendant suspended from a glossy paperclip chain.",
  },
  {
    category: "bracelets",
    title: "White Clover Bracelet",
    price: 299.0,
    tags: ["Bracelets", "Clover", "White"],
    image: "https://images.unsplash.com/photo-1611591475806-039775089201?auto=format&fit=crop&q=80&w=800",
    description: "Iridescent mother-of-pearl white clover motifs bordered in beaded golden edging.",
  },
  {
    category: "bracelets",
    title: "White Stone Bracelet",
    price: 320.0,
    tags: ["Bracelets", "Zircon", "White Stone"],
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800",
    description: "Bezel-set brilliant white cubic zirconia stones with continuous everyday brilliance.",
  },
  {
    category: "bracelets",
    title: "Charm Bangle",
    price: 340.0,
    tags: ["Bangles", "Charm", "Hinged"],
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800",
    description: "Rigid hinged oval bangle featuring delicate dangling charm accents.",
  },
  {
    category: "bracelets",
    title: "Bangle (Green)",
    price: 350.0,
    tags: ["Bangles", "Green", "Emerald"],
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    description: "Lush emerald green stone centerpiece set into a polished golden cuff bangle.",
  },
  {
    category: "bracelets",
    title: "Evil Eye Bangle",
    price: 350.0,
    tags: ["Bangles", "Evil Eye", "Protection"],
    image: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&q=80&w=800",
    description: "Fine enamel and crystal evil eye embedded in a solid anti-tarnish bangle.",
  },
  {
    category: "bracelets",
    title: "Flower Bangle",
    price: 350.0,
    tags: ["Bangles", "Flower", "Floral"],
    image: "https://images.unsplash.com/photo-1611591475806-039775089201?auto=format&fit=crop&q=80&w=800",
    description: "Sculpted floral petals forming the focal point of a luxury golden wrist cuff.",
  },
  {
    category: "bracelets",
    title: "Heart Themed Bangle",
    price: 350.0,
    tags: ["Bangles", "Heart", "Love"],
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800",
    description: "Intertwined heart motif bangle celebrating affection. Secure click-lock clasp.",
  },
  {
    category: "bracelets",
    title: "Simple Gold Bangle",
    price: 350.0,
    tags: ["Bangles", "Simple", "Minimalist"],
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800",
    description: "Minimalist seamless gold oval bangle that pairs effortlessly with all outfits.",
  },
  {
    category: "bracelets",
    title: "Tulip Bracelet - Colour Blue GN",
    price: 350.0,
    tags: ["Bracelets", "Tulip", "Blue", "GN"],
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    description: "Artistic blue tulip blossom charms set in warm 18K gold. Signature GN piece.",
  },
  {
    category: "bracelets",
    title: "Diamond Bangle - Green",
    price: 360.0,
    tags: ["Bangles", "Diamond", "Green Zircon"],
    image: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&q=80&w=800",
    description: "Channel-set green cubic zirconia diamonds glittering along a sleek gold bangle.",
  },
  {
    category: "bracelets",
    title: "Diamond Bangle White",
    price: 360.0,
    tags: ["Bangles", "Diamond", "White Zircon"],
    image: "https://images.unsplash.com/photo-1611591475806-039775089201?auto=format&fit=crop&q=80&w=800",
    description: "Pavé white diamonds line this luxury bangle for an elevated evening and daily sparkle.",
  },
  {
    category: "bracelets",
    title: "Polished Classic Bangle",
    price: 360.0,
    tags: ["Bangles", "Classic", "Polished"],
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800",
    description: "Heavyweight mirror polished oval cuff with smooth beveled edges.",
  },
  {
    category: "bracelets",
    title: "White Stone Bangle",
    price: 360.0,
    tags: ["Bangles", "White Stone", "Sparkle"],
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800",
    description: "Solitaire and accent white stones mounted on a refined gold-plated framework.",
  },
  {
    category: "bracelets",
    title: "White Flower Bangle",
    price: 370.0,
    tags: ["Bangles", "White Flower", "Enamel"],
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    description: "Crisp white enamel flower blossoms with golden pistil centers on a luxury cuff.",
  },
  {
    category: "bracelets",
    title: "Textured Artisan Bangle",
    price: 390.0,
    tags: ["Bangles", "Textured", "Artisan"],
    image: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&q=80&w=800",
    description: "Intricately hammered tactile finish capturing and diffusing ambient light beautifully.",
  },
  {
    category: "bracelets",
    title: "Luxury Look Bangle",
    price: 390.0,
    tags: ["Bangles", "Luxury Look", "Roman Numerals"],
    image: "https://images.unsplash.com/photo-1611591475806-039775089201?auto=format&fit=crop&q=80&w=800",
    description: "High-end designer inspired cuff with engraved Roman numerals and center crystal.",
  },
  {
    category: "bracelets",
    title: "Multi-Charm Bangle",
    price: 450.0,
    tags: ["Bangles", "Multi Charm", "Premium"],
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800",
    description: "Opulent multi-drop charm bangle featuring hearts, stars, and celestial motifs.",
  },

  // CHAINS & NECKLACES (17 items)
  {
    category: "necklaces",
    title: "Everyday Minimal Chain (Perfect with all outfits)",
    price: 120.0,
    tags: ["Necklaces", "Everyday", "Minimalist"],
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    description: "Versatile lightweight golden chain that pairs seamlessly with any shirt, dress, or tee.",
  },
  {
    category: "necklaces",
    title: "Simple Pearl Chain",
    price: 150.0,
    tags: ["Necklaces", "Pearl", "Dainty"],
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800",
    description: "Lustrous white freshwater-style pearl drop on a whisper-thin golden cable link.",
  },
  {
    category: "necklaces",
    title: "Snowflake Chain",
    price: 150.0,
    tags: ["Necklaces", "Snowflake", "Pendant"],
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800",
    description: "Delicate crystalline snowflake pendant with micro zircon sparkle in the core.",
  },
  {
    category: "necklaces",
    title: "Heart Cross Chain",
    price: 160.0,
    tags: ["Necklaces", "Heart", "Cross"],
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800",
    description: "Meaningful intertwined heart and cross motif suspended from a delicate chain.",
  },
  {
    category: "necklaces",
    title: "Rubi Red Chain",
    price: 160.0,
    tags: ["Necklaces", "Ruby Red", "Solitaire"],
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    description: "Deep ruby red faceted solitaire gem set in a 4-prong golden basket pendant.",
  },
  {
    category: "necklaces",
    title: "Heart Themed Chain",
    price: 200.0,
    tags: ["Necklaces", "Heart", "Romantic"],
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800",
    description: "Polished hollow heart charm that slides effortlessly along a sleek gold chain.",
  },
  {
    category: "necklaces",
    title: "Black Pendent GNCN001",
    price: 220.0,
    tags: ["Necklaces", "Black Pendant", "GNCN001"],
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800",
    description: "Deep obsidian black stone set in a geometric gold bezel. SKU: GNCN001.",
  },
  {
    category: "necklaces",
    title: "Flower Chain",
    price: 240.0,
    tags: ["Necklaces", "Flower", "Floral"],
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800",
    description: "Graceful sculpted flower blossom pendant on a glistening 18K gold chain.",
  },
  {
    category: "necklaces",
    title: "White Pendent Chain",
    price: 260.0,
    tags: ["Necklaces", "White Pendant", "Mother of Pearl"],
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    description: "Iridescent white mother-of-pearl disc pendant framed by textured gold edging.",
  },
  {
    category: "necklaces",
    title: "Double Layer Chain",
    price: 270.0,
    tags: ["Necklaces", "Double Layer", "Layered"],
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800",
    description: "Pre-layered two-tier necklace providing an instant stacked collarbone look.",
  },
  {
    category: "necklaces",
    title: "Baroque Pearl Chain",
    price: 270.0,
    tags: ["Necklaces", "Pearl", "Baroque"],
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800",
    description: "Organic freeform baroque pearl centerpiece with warm gold satellite beads.",
  },
  {
    category: "necklaces",
    title: "Simple Herringbone Chain",
    price: 280.0,
    tags: ["Necklaces", "Herringbone", "Snake Chain"],
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800",
    description: "Sleek flat liquid herringbone snake chain resting flush against the collarbone.",
  },
  {
    category: "necklaces",
    title: "Simple Charm Chain - White",
    price: 290.0,
    tags: ["Necklaces", "White Charm", "Dainty"],
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    description: "Tiny white enamel charm drop necklace. Dainty, understated, and waterproof.",
  },
  {
    category: "necklaces",
    title: "Trending Paperclip Chain",
    price: 290.0,
    tags: ["Necklaces", "Paperclip", "Trending"],
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800",
    description: "Modern elongated paperclip links in rich 18K gold finish. Wear solo or add charms.",
  },
  {
    category: "necklaces",
    title: "Heart Trending Chain",
    price: 320.0,
    tags: ["Necklaces", "Heart", "Trending"],
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800",
    description: "Chunky puffed 3D heart pendant suspended from a substantial trending chain.",
  },
  {
    category: "necklaces",
    title: "Simple Chain Set",
    price: 320.0,
    tags: ["Necklaces", "Chain Set", "Stack"],
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800",
    description: "Coordinated dual necklace set designed for complementary everyday layering.",
  },
  {
    category: "necklaces",
    title: "White Stone Charm Chain GNCN",
    price: 350.0,
    tags: ["Necklaces", "White Stone", "GNCN"],
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    description: "Shimmering multi-facet white zircon charm on luxury link chain. SKU: GNCN series.",
  },

  // EARRINGS (13 items)
  {
    category: "earrings",
    title: "Contemporary Drop Earring",
    price: 118.0,
    tags: ["Earrings", "Drop", "Contemporary"],
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=800",
    description: "Streamlined linear drop earrings offering gentle sway and modern refinement.",
  },
  {
    category: "earrings",
    title: "Heart Themed Earring",
    price: 118.0,
    tags: ["Earrings", "Heart", "Petite"],
    image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=800",
    description: "Petite heart silhouette earrings designed for sensitive ears and everyday comfort.",
  },
  {
    category: "earrings",
    title: "Square Shaped Stud",
    price: 118.0,
    tags: ["Earrings", "Studs", "Square"],
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800",
    description: "Sharp geometric square studs with high-polish mirror gold finish.",
  },
  {
    category: "earrings",
    title: "Triangular Stud Earring",
    price: 118.0,
    tags: ["Earrings", "Studs", "Triangular"],
    image: "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&q=80&w=800",
    description: "Minimalist triangular posts that add subtle edge to any casual or formal outfit.",
  },
  {
    category: "earrings",
    title: "Simple Stud (Each Pair Price)",
    price: 120.0,
    tags: ["Earrings", "Studs", "Daily Wear"],
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=800",
    description: "Everyday gold ball stud earrings (per pair). Sleep-safe, shower-safe, and hypoallergenic.",
  },
  {
    category: "earrings",
    title: "Flower Earring",
    price: 150.0,
    tags: ["Earrings", "Flower", "Floral"],
    image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=800",
    description: "Golden blossom flower stud earrings with delicate petal detailing.",
  },
  {
    category: "earrings",
    title: "Heart Themed Stud",
    price: 200.0,
    tags: ["Earrings", "Heart", "Studs"],
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800",
    description: "Substantial polished heart studs with secure comfort butterfly backs.",
  },
  {
    category: "earrings",
    title: "Heart Earrings",
    price: 230.0,
    tags: ["Earrings", "Heart", "Dangle"],
    image: "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&q=80&w=800",
    description: "Dangling golden hearts on lever-back hoops for lightweight movement.",
  },
  {
    category: "earrings",
    title: "Floral Themed Earring",
    price: 250.0,
    tags: ["Earrings", "Floral", "Statement"],
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=800",
    description: "Ornate floral motif drop earrings with fine botanical curves in 18K gold.",
  },
  {
    category: "earrings",
    title: "Spiral Stud",
    price: 240.0,
    tags: ["Earrings", "Spiral", "Unique"],
    image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=800",
    description: "Swirling dimensional spiral studs that catch sunlight from every angle.",
  },
  {
    category: "earrings",
    title: "Xuping Hoop Earrings (Multicolour)",
    price: 269.0,
    tags: ["Earrings", "Xuping", "Hoops", "Multicolour"],
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800",
    description: "Authentic Xuping huggie hoops studded with vibrant multicolour rainbow crystals.",
  },
  {
    category: "earrings",
    title: "Trending Hoop Earring",
    price: 270.0,
    tags: ["Earrings", "Hoops", "Trending"],
    image: "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&q=80&w=800",
    description: "Chunky hollow croissant twist hoop earrings. Ultra-lightweight for all-day wear.",
  },
  {
    category: "earrings",
    title: "Heart Earring Deluxe",
    price: 320.0,
    tags: ["Earrings", "Heart", "Pavé", "Deluxe"],
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=800",
    description: "Pavé micro-zircon paved heart earrings delivering extraordinary luxury sparkle.",
  },

  // ANKLETS (7 items)
  {
    category: "anklets",
    title: "Bead Anklets (Adults)",
    price: 440.0,
    tags: ["Anklets", "Beads", "Adults", "Boho"],
    image: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&q=80&w=800",
    description: "Bohemian golden bead accents strung along a strong waterproof stainless steel chain.",
  },
  {
    category: "anklets",
    title: "Kids Anklet",
    price: 480.0,
    tags: ["Anklets", "Kids", "Dainty"],
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=800",
    description: "Dainty gentle bell charm anklet sized safely and comfortably for children.",
  },
  {
    category: "anklets",
    title: "Simple Rope Anklets - Adults",
    price: 480.0,
    tags: ["Anklets", "Rope Chain", "Adults"],
    image: "https://images.unsplash.com/photo-1611591475806-039775089201?auto=format&fit=crop&q=80&w=800",
    description: "Classic twisted rope chain anklet. High-polish golden weave that rests comfortably on the ankle.",
  },
  {
    category: "anklets",
    title: "Butterfly Charm Anklets - Adults",
    price: 500.0,
    tags: ["Anklets", "Butterfly", "Charm", "Adults"],
    image: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&q=80&w=800",
    description: "Whimsical fluttering butterfly charms suspended along a delicate dual-link anklet.",
  },
  {
    category: "anklets",
    title: "Multi Diamond Anklets",
    price: 620.0,
    tags: ["Anklets", "Diamond", "Zircon", "Sparkle"],
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=800",
    description: "Multiple glittering bezel-set cubic zirconia diamonds creating radiant sparkle with each step.",
  },
  {
    category: "anklets",
    title: "Multi Charm Anklets",
    price: 640.0,
    tags: ["Anklets", "Multi Charm", "Celestial"],
    image: "https://images.unsplash.com/photo-1611591475806-039775089201?auto=format&fit=crop&q=80&w=800",
    description: "Richly embellished anklet featuring celestial stars, crescent moons, and mini droplets.",
  },
  {
    category: "anklets",
    title: "Multi Heart Anklets",
    price: 640.0,
    tags: ["Anklets", "Multi Heart", "Romantic"],
    image: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&q=80&w=800",
    description: "Cascading polished golden hearts that catch light along the entire ankle circumference.",
  },
];

async function main() {
  console.log(`Processing ${rawItems.length} authentic GleamNest catalog products...`);

  const slugMap = new Map();

  const formattedProducts = rawItems.map((item, idx) => {
    let baseSlug = item.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    if (slugMap.has(baseSlug)) {
      const count = slugMap.get(baseSlug) + 1;
      slugMap.set(baseSlug, count);
      baseSlug = `${baseSlug}-${count}`;
    } else {
      slugMap.set(baseSlug, 1);
    }

    return {
      id: `gn-prod-${String(idx + 1).padStart(3, "0")}`,
      slug: baseSlug,
      title: item.title,
      shortDescription: item.description,
      description: `${item.description} Handcrafted with surgical-grade 316L stainless steel with thick 18K gold PVD plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.`,
      price: item.price,
      category: item.category,
      tags: item.tags,
      images: [item.image],
      rating: parseFloat((4.7 + (idx % 3) * 0.1).toFixed(1)),
      reviewCount: 12 + ((idx * 7) % 45),
      inStock: true,
      stockCount: 15 + ((idx * 3) % 25),
      featured: idx % 5 === 0,
      isNewArrival: idx % 3 === 0,
      isBestSeller: item.price <= 250 || idx % 4 === 0,
    };
  });

  // 1. Seed database
  console.log("Seeding SQLite Prisma database...");
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});

  for (const p of formattedProducts) {
    await prisma.product.create({
      data: {
        id: p.id,
        slug: p.slug,
        title: p.title,
        shortDescription: p.shortDescription,
        description: p.description,
        price: p.price,
        salePrice: p.salePrice,
        category: p.category,
        tags: JSON.stringify(p.tags),
        images: JSON.stringify(p.images),
        rating: p.rating,
        reviewCount: p.reviewCount,
        inStock: p.inStock,
        stockCount: p.stockCount,
        featured: p.featured,
        isNewArrival: p.isNewArrival,
        isBestSeller: p.isBestSeller,
      },
    });
  }

  // Create one sample order
  await prisma.order.create({
    data: {
      orderNumber: "GN-8841",
      customerName: "Ananya Sharma",
      customerEmail: "ananya@example.com",
      customerPhone: "9876543210",
      shippingAddress: "Flat 402, Lotus Towers, MG Road, Kochi, Kerala - 682001",
      itemsJson: JSON.stringify([
        {
          productId: formattedProducts[0].id,
          title: formattedProducts[0].title,
          price: formattedProducts[0].price,
          quantity: 1,
          image: formattedProducts[0].images[0],
        },
        {
          productId: formattedProducts[12].id,
          title: formattedProducts[12].title,
          price: formattedProducts[12].price,
          quantity: 1,
          image: formattedProducts[12].images[0],
        },
      ]),
      subtotal: formattedProducts[0].price + formattedProducts[12].price,
      discountTotal: 0,
      shippingFee: 0,
      taxTotal: 0,
      grandTotal: formattedProducts[0].price + formattedProducts[12].price,
      paymentMethod: "WhatsApp Direct UPI",
      paymentStatus: "paid",
      orderStatus: "processing",
    },
  });

  console.log(`✅ SQLite Prisma seeded with ${formattedProducts.length} authentic GleamNest products!`);

  // 2. Generate updated mockData.ts
  const mockDataContent = `import { Product, Category, Order } from "@/types/store";

export const categories: Category[] = [
  {
    id: "cat-necklaces",
    slug: "necklaces",
    name: "Chains & Necklaces",
    description: "Everyday anti-tarnish chains, pendants, and layering necklaces in 18K gold finish.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    productCount: ${formattedProducts.filter((p) => p.category === "necklaces").length},
  },
  {
    id: "cat-bracelets",
    slug: "bracelets",
    name: "Bangles & Bracelets",
    description: "Waterproof clover bracelets, statement bangles, and charm cuffs.",
    image: "https://images.unsplash.com/photo-1611591475806-039775089201?auto=format&fit=crop&q=80&w=800",
    productCount: ${formattedProducts.filter((p) => p.category === "bracelets").length},
  },
  {
    id: "cat-earrings",
    slug: "earrings",
    name: "Earrings",
    description: "Hypoallergenic hoops, contemporary drop earrings, and dainty daily studs.",
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=800",
    productCount: ${formattedProducts.filter((p) => p.category === "earrings").length},
  },
  {
    id: "cat-rings",
    slug: "rings",
    name: "Rings",
    description: "Adjustable 18K gold-plated rings, statement bands, and combo sets.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800",
    productCount: ${formattedProducts.filter((p) => p.category === "rings").length},
  },
  {
    id: "cat-anklets",
    slug: "anklets",
    name: "Anklets",
    description: "Boho bead anklets, butterfly charms, and shimmering multi-diamond anklets.",
    image: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&q=80&w=800",
    productCount: ${formattedProducts.filter((p) => p.category === "anklets").length},
  },
];

export const products: Product[] = ${JSON.stringify(formattedProducts, null, 2)};

export const sampleOrders: Order[] = [
  {
    id: "ord-8841",
    orderNumber: "GN-8841",
    createdAt: "2024-10-12T09:30:00Z",
    status: "processing",
    customer: {
      fullName: "Ananya Sharma",
      email: "ananya@example.com",
      phone: "+91 98765 43210",
      address: {
        street: "Flat 402, Lotus Towers, MG Road",
        city: "Kochi",
        state: "Kerala",
        postalCode: "682001",
        country: "India",
      },
    },
    items: [
      {
        id: "ci-1",
        productId: "${formattedProducts[0].id}",
        title: "${formattedProducts[0].title}",
        slug: "${formattedProducts[0].slug}",
        price: ${formattedProducts[0].price},
        image: "${formattedProducts[0].images[0]}",
        quantity: 1,
      },
      {
        id: "ci-2",
        productId: "${formattedProducts[12].id}",
        title: "${formattedProducts[12].title}",
        slug: "${formattedProducts[12].slug}",
        price: ${formattedProducts[12].price},
        image: "${formattedProducts[12].images[0]}",
        quantity: 1,
      },
    ],
    subtotal: ${formattedProducts[0].price + formattedProducts[12].price},
    discountTotal: 0,
    shippingFee: 0,
    taxTotal: 0,
    grandTotal: ${formattedProducts[0].price + formattedProducts[12].price},
    paymentMethod: "cod",
    trackingNumber: "DTDC-KL-982341",
  },
];
`;

  fs.writeFileSync("data/mockData.ts", mockDataContent, "utf8");
  console.log("✅ Updated data/mockData.ts with authentic GleamNest products!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
