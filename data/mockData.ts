import { Product, Category, Order } from "@/types/store";

export const categories: Category[] = [
  {
    "id": "cat-minimal-chains",
    "slug": "minimal-chains",
    "name": "Minimal Chains",
    "description": "Sleek, dainty daily-wear chains & delicate gold pendants made to live in.",
    "image": "/images/emerald-necklace-product.jpg",
    "productCount": 16
  },
  {
    "id": "cat-anklets",
    "slug": "anklets",
    "name": "Anklets",
    "description": "Shimmering anti-tarnish payals, dainty charms & waterproof evil eye anklets.",
    "image": "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&q=80&w=800",
    "productCount": 9
  },
  {
    "id": "cat-bangles",
    "slug": "bangles",
    "name": "Bangles",
    "description": "Royal Indian bangles, stackable gold kadas & openable everyday choodas.",
    "image": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800",
    "productCount": 18
  },
  {
    "id": "cat-bracelet",
    "slug": "bracelet",
    "name": "Bracelet",
    "description": "Clover charm bracelets, tennis bracelets & luxury paperclip link cuffs.",
    "image": "/images/category-bracelets.jpg",
    "productCount": 14
  },
  {
    "id": "cat-hanging-chains",
    "slug": "hanging-chains",
    "name": "Hanging Chains",
    "description": "Graceful layered hanging necklaces, lariat chains & statement drops.",
    "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    "productCount": 12
  },
  {
    "id": "cat-jhumkas",
    "slug": "jhumkas",
    "name": "Jhumkas",
    "description": "Authentic ethnic temple jhumkas, pearl drops & royal kundan bells.",
    "image": "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=800",
    "productCount": 15
  },
  {
    "id": "cat-ring",
    "slug": "ring",
    "name": "Ring",
    "description": "Waterproof adjustable rings, eternity emerald bands & solitaire statement rings.",
    "image": "/images/category-rings.jpg",
    "productCount": 17
  },
  {
    "id": "cat-nosepin",
    "slug": "nosepin",
    "name": "Nosepin",
    "description": "Dainty cubic zirconia clips, traditional maharashtrian naths & daily gold studs.",
    "image": "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=800",
    "productCount": 8
  },
  {
    "id": "cat-stud-and-hoops",
    "slug": "stud-and-hoops",
    "name": "Stud & Hoops",
    "description": "Everyday huggies, chunky gold hoops & sparkling solitaire studs.",
    "image": "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=800",
    "productCount": 13
  },
  {
    "id": "cat-traditional-earrings",
    "slug": "traditional-earrings",
    "name": "Traditional Earrings",
    "description": "Intricate chandbalis, bahubali ear-chains & festive kundan drops.",
    "image": "https://images.unsplash.com/photo-1611591475805-4c0d1e576fd3?auto=format&fit=crop&q=80&w=800",
    "productCount": 14
  },
  {
    "id": "cat-traditional-sets",
    "slug": "traditional-sets",
    "name": "Traditional Sets",
    "description": "Bridal & festive necklace sets, matching earrings & maang tikka ensembles.",
    "image": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800",
    "productCount": 11
  },
  {
    "id": "cat-offer-products",
    "slug": "offer-products",
    "name": "Offer Products",
    "description": "Curated bestsellers & festive gift sets at exclusive limited-time prices.",
    "image": "/images/hero-card-necklace.jpg",
    "productCount": 20
  }
];

export const products: Product[] = [
  {
  "id": "alnaya-prod-000",
  "slug": "imperial-emerald-cuban-pendant",
  "title": "Imperial Emerald & Gold Cuban Pendant",
  "shortDescription": "Signature 18K gold Cuban link chain featuring an emerald-cut radiant green stone in a double micro-pavé halo.",
  "description": "The crown jewel of the Alnaya Atelier. This masterpiece features a bold, fluid 18K PVD gold-finish Cuban link chain holding an exquisite emerald-cut radiant green stone, wrapped in a double halo of light-catching micro-pavé crystals. 100% anti-tarnish, waterproof, hypoallergenic, and crafted for everyday luxury and statement evenings.",
  "price": 2499,
  "salePrice": 1899,
  "category": "minimal-chains",
  "tags": [
    "Minimal Chains",
    "Hanging Chains",
    "Offer Products",
    "Bestseller",
    "Atelier Signature"
  ],
  "images": [
    "/images/emerald-necklace-product.jpg",
    "/images/hero-necklace.png",
    "/videos/hero-poster.webp"
  ],
  "rating": 5,
  "reviewCount": 128,
  "inStock": true,
  "stockCount": 15,
  "featured": true,
  "isNewArrival": true,
  "isBestSeller": true
},

  {
    "id": "gn-prod-001",
    "slug": "statement-ring",
    "title": "Statement Ring",
    "shortDescription": "Bold gold-finish statement ring designed for modern daily styling. Hypoallergenic and lightweight.",
    "description": "Bold gold-finish statement ring designed for modern daily styling. Hypoallergenic and lightweight. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 140,
    "priceQatar": 12,
    "category": "ring",
    "tags": [
      "Rings",
      "Statement",
      "Everyday"
    ],
    "images": [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.7,
    "reviewCount": 12,
    "inStock": true,
    "stockCount": 15,
    "featured": true,
    "isNewArrival": true,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-002",
    "slug": "adjustable-ring",
    "title": "Adjustable Ring",
    "shortDescription": "Easy comfort fit adjustable gold ring. Fits all finger sizes seamlessly.",
    "description": "Easy comfort fit adjustable gold ring. Fits all finger sizes seamlessly. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 230,
    "priceQatar": 18,
    "category": "ring",
    "tags": [
      "Rings",
      "Adjustable",
      "Gold"
    ],
    "images": [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.8,
    "reviewCount": 19,
    "inStock": true,
    "stockCount": 18,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-003",
    "slug": "flower-ring",
    "title": "Flower Ring",
    "shortDescription": "Delicate floral bloom motif ring crafted in gold finish PVD finish. Beautiful solo or stacked.",
    "description": "Delicate floral bloom motif ring crafted in gold finish PVD finish. Beautiful solo or stacked. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 230,
    "priceQatar": 18,
    "category": "ring",
    "tags": [
      "Rings",
      "Floral",
      "Dainty"
    ],
    "images": [
      "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.9,
    "reviewCount": 26,
    "inStock": true,
    "stockCount": 21,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-004",
    "slug": "dainty-adjustable-ring",
    "title": "Dainty Adjustable Ring",
    "shortDescription": "Subtle open band design offering flexible sizing and daily wear durability.",
    "description": "Subtle open band design offering flexible sizing and daily wear durability. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 240,
    "priceQatar": 20,
    "category": "ring",
    "tags": [
      "Rings",
      "Adjustable",
      "Minimalist"
    ],
    "images": [
      "https://images.unsplash.com/photo-1611591475806-039775089201?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.7,
    "reviewCount": 33,
    "inStock": true,
    "stockCount": 24,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-005",
    "slug": "minimalist-adjustable-ring",
    "title": "Minimalist Adjustable Ring",
    "shortDescription": "Clean aesthetic ring with polished luster that resists tarnish and sweat.",
    "description": "Clean aesthetic ring with polished luster that resists tarnish and sweat. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 250,
    "priceQatar": 20,
    "category": "ring",
    "tags": [
      "Rings",
      "Minimalist",
      "Waterproof"
    ],
    "images": [
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.8,
    "reviewCount": 40,
    "inStock": true,
    "stockCount": 27,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-006",
    "slug": "combo-ring-set",
    "title": "Combo Ring Set",
    "shortDescription": "Curated stackable multi-ring combo set. Mix, match, and stack across multiple fingers.",
    "description": "Curated stackable multi-ring combo set. Mix, match, and stack across multiple fingers. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 290,
    "priceQatar": 25,
    "category": "ring",
    "tags": [
      "Rings",
      "Stackable",
      "Combo Set"
    ],
    "images": [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.9,
    "reviewCount": 47,
    "inStock": true,
    "stockCount": 30,
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-007",
    "slug": "simple-dome-ring",
    "title": "Simple Dome Ring",
    "shortDescription": "Smooth domed contour gold band. Elegant mirror shine that stays brilliant every day.",
    "description": "Smooth domed contour gold band. Elegant mirror shine that stays brilliant every day. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 300,
    "priceQatar": 25,
    "category": "ring",
    "tags": [
      "Rings",
      "Simple",
      "Dome"
    ],
    "images": [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.7,
    "reviewCount": 54,
    "inStock": true,
    "stockCount": 33,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-008",
    "slug": "classic-anti-tarnish-ring",
    "title": "Classic Anti-Tarnish Ring",
    "shortDescription": "Timeless ring silhouette designed to withstand daily chores, sanitizing, and water exposure.",
    "description": "Timeless ring silhouette designed to withstand daily chores, sanitizing, and water exposure. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 310,
    "priceQatar": 29,
    "category": "ring",
    "tags": [
      "Rings",
      "Classic",
      "Bestseller"
    ],
    "images": [
      "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.8,
    "reviewCount": 16,
    "inStock": true,
    "stockCount": 36,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-009",
    "slug": "gold-plated-adjustable-ring",
    "title": "Gold Plated Adjustable Ring",
    "shortDescription": "Premium gold finish-plated adjustable ring featuring open comfort band construction.",
    "description": "Premium gold finish-plated adjustable ring featuring open comfort band construction. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 310,
    "priceQatar": 29,
    "category": "ring",
    "tags": [
      "Rings",
      "Gold Plated",
      "Adjustable"
    ],
    "images": [
      "https://images.unsplash.com/photo-1611591475806-039775089201?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.9,
    "reviewCount": 23,
    "inStock": true,
    "stockCount": 39,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-010",
    "slug": "lavender-adjustable-finger-ring",
    "title": "Lavender Adjustable Finger Ring",
    "shortDescription": "Pastel lavender enamel inlay paired with high-shine gold plating. A charming pop of color.",
    "description": "Pastel lavender enamel inlay paired with high-shine gold plating. A charming pop of color. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 310,
    "priceQatar": 29,
    "category": "ring",
    "tags": [
      "Rings",
      "Lavender",
      "Enamel"
    ],
    "images": [
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.7,
    "reviewCount": 30,
    "inStock": true,
    "stockCount": 17,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-011",
    "slug": "blue-adjustable-finger-ring",
    "title": "Blue Adjustable Finger Ring",
    "shortDescription": "Vibrant sapphire blue accent adjustable ring with anti-tarnish stainless steel base.",
    "description": "Vibrant sapphire blue accent adjustable ring with anti-tarnish stainless steel base. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 310,
    "priceQatar": 29,
    "category": "ring",
    "tags": [
      "Rings",
      "Blue",
      "Enamel"
    ],
    "images": [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.8,
    "reviewCount": 37,
    "inStock": true,
    "stockCount": 20,
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-012",
    "slug": "multicoloured-round-adjustable-ring",
    "title": "Multicoloured Round Adjustable Ring",
    "shortDescription": "Playful multicoloured enamel stone round centerpiece on an adjustable golden shank.",
    "description": "Playful multicoloured enamel stone round centerpiece on an adjustable golden shank. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 310,
    "priceQatar": 29,
    "category": "ring",
    "tags": [
      "Rings",
      "Multicoloured",
      "Round"
    ],
    "images": [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.9,
    "reviewCount": 44,
    "inStock": true,
    "stockCount": 23,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-013",
    "slug": "clover-black-bracelet",
    "title": "Clover Black Bracelet",
    "shortDescription": "Iconic four-leaf clover motif with black onyx-style inlay on a dainty gold cable chain.",
    "description": "Iconic four-leaf clover motif with black onyx-style inlay on a dainty gold cable chain. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 150,
    "priceQatar": 12,
    "category": "bracelet",
    "tags": [
      "Bracelets",
      "Clover",
      "Black",
      "Bestseller"
    ],
    "images": [
      "https://images.unsplash.com/photo-1611591475806-039775089201?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.7,
    "reviewCount": 51,
    "inStock": true,
    "stockCount": 26,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-014",
    "slug": "clover-bracelet-gold",
    "title": "Clover Bracelet - Gold",
    "shortDescription": "Full gold-finish lucky clover motif bracelet. Lightweight, dainty, and effortlessly layerable.",
    "description": "Full gold-finish lucky clover motif bracelet. Lightweight, dainty, and effortlessly layerable. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 150,
    "priceQatar": 12,
    "category": "bracelet",
    "tags": [
      "Bracelets",
      "Clover",
      "Gold"
    ],
    "images": [
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.8,
    "reviewCount": 13,
    "inStock": true,
    "stockCount": 29,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-015",
    "slug": "white-and-black-clover-bracelet",
    "title": "White and Black Clover Bracelet",
    "shortDescription": "Alternating mother-of-pearl white and black clover motifs along a shimmering golden chain.",
    "description": "Alternating mother-of-pearl white and black clover motifs along a shimmering golden chain. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 150,
    "priceQatar": 12,
    "category": "bracelet",
    "tags": [
      "Bracelets",
      "Clover",
      "Duo Tone"
    ],
    "images": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.9,
    "reviewCount": 20,
    "inStock": true,
    "stockCount": 32,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-016",
    "slug": "evil-eye-trendy-bangle",
    "title": "Evil Eye Trendy Bangle",
    "shortDescription": "Protective evil eye emblem centered on a sleek open cuff bangle. Ward off negativity in style.",
    "description": "Protective evil eye emblem centered on a sleek open cuff bangle. Ward off negativity in style. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 210,
    "priceQatar": 18,
    "category": "bangles",
    "tags": [
      "Bangles",
      "Evil Eye",
      "Trendy"
    ],
    "images": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.7,
    "reviewCount": 27,
    "inStock": true,
    "stockCount": 35,
    "featured": true,
    "isNewArrival": true,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-017",
    "slug": "green-pearl-bracelet-gnbr003",
    "title": "Green Pearl Bracelet GNBR003",
    "shortDescription": "Freshwater-style green pearl beads interspersed with golden accents. SKU: GNBR003.",
    "description": "Freshwater-style green pearl beads interspersed with golden accents. SKU: GNBR003. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 218,
    "priceQatar": 18,
    "category": "bracelet",
    "tags": [
      "Bracelets",
      "Pearl",
      "Green",
      "GNBR003"
    ],
    "images": [
      "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.8,
    "reviewCount": 34,
    "inStock": true,
    "stockCount": 38,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-018",
    "slug": "charm-bracelet",
    "title": "Charm Bracelet",
    "shortDescription": "Playful dangling golden charms that chime softly with movement. Daily anti-tarnish finish.",
    "description": "Playful dangling golden charms that chime softly with movement. Daily anti-tarnish finish. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 249,
    "priceQatar": 20,
    "category": "bracelet",
    "tags": [
      "Bracelets",
      "Charm",
      "Dainty"
    ],
    "images": [
      "https://images.unsplash.com/photo-1611591475806-039775089201?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.9,
    "reviewCount": 41,
    "inStock": true,
    "stockCount": 16,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-019",
    "slug": "charm-bracelet-size-2-4-to-2-6",
    "title": "Charm Bracelet (Size - 2.4 to 2.6)",
    "shortDescription": "Tailored fit charm bracelet sized specifically for standard 2.4 to 2.6 wrist dimensions.",
    "description": "Tailored fit charm bracelet sized specifically for standard 2.4 to 2.6 wrist dimensions. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 249,
    "priceQatar": 20,
    "category": "bracelet",
    "tags": [
      "Bracelets",
      "Charm",
      "Sized"
    ],
    "images": [
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.7,
    "reviewCount": 48,
    "inStock": true,
    "stockCount": 19,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-020",
    "slug": "deluxe-charm-bracelet",
    "title": "Deluxe Charm Bracelet",
    "shortDescription": "Richly detailed charms with pavé cubic zirconia micro-accents. gold finish luster.",
    "description": "Richly detailed charms with pavé cubic zirconia micro-accents. gold finish luster. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 270,
    "priceQatar": 22,
    "category": "bracelet",
    "tags": [
      "Bracelets",
      "Charm",
      "Deluxe"
    ],
    "images": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.8,
    "reviewCount": 55,
    "inStock": true,
    "stockCount": 22,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-021",
    "slug": "statement-bangle-gnbl001",
    "title": "Statement Bangle GNBL001",
    "shortDescription": "Architectural structured statement bangle. Precision clasp closure. SKU: GNBL001.",
    "description": "Architectural structured statement bangle. Precision clasp closure. SKU: GNBL001. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 270,
    "priceQatar": 22,
    "category": "bangles",
    "tags": [
      "Bangles",
      "Statement",
      "GNBL001"
    ],
    "images": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.9,
    "reviewCount": 17,
    "inStock": true,
    "stockCount": 25,
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-022",
    "slug": "statement-bangle-gnbl002",
    "title": "Statement Bangle GNBL002",
    "shortDescription": "Modern minimalist sculpted statement bangle. Smooth mirror gold polish. SKU: GNBL002.",
    "description": "Modern minimalist sculpted statement bangle. Smooth mirror gold polish. SKU: GNBL002. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 270,
    "priceQatar": 22,
    "category": "bangles",
    "tags": [
      "Bangles",
      "Statement",
      "GNBL002"
    ],
    "images": [
      "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.7,
    "reviewCount": 24,
    "inStock": true,
    "stockCount": 28,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-023",
    "slug": "statement-bangle-gnbl003",
    "title": "Statement Bangle GNBL003",
    "shortDescription": "Twisted textured statement bangle designed for effortless stacking. SKU: GNBL003.",
    "description": "Twisted textured statement bangle designed for effortless stacking. SKU: GNBL003. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 270,
    "priceQatar": 22,
    "category": "bangles",
    "tags": [
      "Bangles",
      "Statement",
      "GNBL003"
    ],
    "images": [
      "https://images.unsplash.com/photo-1611591475806-039775089201?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.8,
    "reviewCount": 31,
    "inStock": true,
    "stockCount": 31,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-024",
    "slug": "green-bracelet",
    "title": "Green Bracelet",
    "shortDescription": "Emerald green crystal faceted beads on an anti-tarnish stainless steel link chain.",
    "description": "Emerald green crystal faceted beads on an anti-tarnish stainless steel link chain. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 280,
    "priceQatar": 25,
    "category": "bracelet",
    "tags": [
      "Bracelets",
      "Green",
      "Stone"
    ],
    "images": [
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.9,
    "reviewCount": 38,
    "inStock": true,
    "stockCount": 34,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-025",
    "slug": "bamboo-bracelet-white-black",
    "title": "Bamboo Bracelet (White & Black)",
    "shortDescription": "Organically contoured bamboo node links highlighted with white & black enamel (per piece).",
    "description": "Organically contoured bamboo node links highlighted with white & black enamel (per piece). Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 299,
    "priceQatar": 25,
    "category": "bracelet",
    "tags": [
      "Bracelets",
      "Bamboo",
      "Enamel"
    ],
    "images": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.7,
    "reviewCount": 45,
    "inStock": true,
    "stockCount": 37,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-026",
    "slug": "clover-black-luxury-bracelet",
    "title": "Clover Black Luxury Bracelet",
    "shortDescription": "Upgraded multi-motif black clover bracelet with weighted gold cable links.",
    "description": "Upgraded multi-motif black clover bracelet with weighted gold cable links. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 299,
    "priceQatar": 25,
    "category": "bracelet",
    "tags": [
      "Bracelets",
      "Clover",
      "Black",
      "Luxury"
    ],
    "images": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.8,
    "reviewCount": 52,
    "inStock": true,
    "stockCount": 15,
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-027",
    "slug": "heart-charm-bracelet",
    "title": "Heart Charm Bracelet",
    "shortDescription": "Romantic puffed heart pendant suspended from a glossy paperclip chain.",
    "description": "Romantic puffed heart pendant suspended from a glossy paperclip chain. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 299,
    "priceQatar": 25,
    "category": "bracelet",
    "tags": [
      "Bracelets",
      "Heart",
      "Charm"
    ],
    "images": [
      "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.9,
    "reviewCount": 14,
    "inStock": true,
    "stockCount": 18,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-028",
    "slug": "white-clover-bracelet",
    "title": "White Clover Bracelet",
    "shortDescription": "Iridescent mother-of-pearl white clover motifs bordered in beaded golden edging.",
    "description": "Iridescent mother-of-pearl white clover motifs bordered in beaded golden edging. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 299,
    "priceQatar": 25,
    "category": "bracelet",
    "tags": [
      "Bracelets",
      "Clover",
      "White"
    ],
    "images": [
      "https://images.unsplash.com/photo-1611591475806-039775089201?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.7,
    "reviewCount": 21,
    "inStock": true,
    "stockCount": 21,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-029",
    "slug": "white-stone-bracelet",
    "title": "White Stone Bracelet",
    "shortDescription": "Bezel-set brilliant white cubic zirconia stones with continuous everyday brilliance.",
    "description": "Bezel-set brilliant white cubic zirconia stones with continuous everyday brilliance. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 320,
    "priceQatar": 29,
    "category": "bracelet",
    "tags": [
      "Bracelets",
      "Zircon",
      "White Stone"
    ],
    "images": [
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.8,
    "reviewCount": 28,
    "inStock": true,
    "stockCount": 24,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-030",
    "slug": "charm-bangle",
    "title": "Charm Bangle",
    "shortDescription": "Rigid hinged oval bangle featuring delicate dangling charm accents.",
    "description": "Rigid hinged oval bangle featuring delicate dangling charm accents. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 340,
    "priceQatar": 29,
    "category": "bangles",
    "tags": [
      "Bangles",
      "Charm",
      "Hinged"
    ],
    "images": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.9,
    "reviewCount": 35,
    "inStock": true,
    "stockCount": 27,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-031",
    "slug": "bangle-green",
    "title": "Bangle (Green)",
    "shortDescription": "Lush emerald green stone centerpiece set into a polished golden cuff bangle.",
    "description": "Lush emerald green stone centerpiece set into a polished golden cuff bangle. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 350,
    "priceQatar": 29,
    "category": "bangles",
    "tags": [
      "Bangles",
      "Green",
      "Emerald"
    ],
    "images": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.7,
    "reviewCount": 42,
    "inStock": true,
    "stockCount": 30,
    "featured": true,
    "isNewArrival": true,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-032",
    "slug": "evil-eye-bangle",
    "title": "Evil Eye Bangle",
    "shortDescription": "Fine enamel and crystal evil eye embedded in a solid anti-tarnish bangle.",
    "description": "Fine enamel and crystal evil eye embedded in a solid anti-tarnish bangle. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 350,
    "priceQatar": 29,
    "category": "bangles",
    "tags": [
      "Bangles",
      "Evil Eye",
      "Protection"
    ],
    "images": [
      "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.8,
    "reviewCount": 49,
    "inStock": true,
    "stockCount": 33,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-033",
    "slug": "flower-bangle",
    "title": "Flower Bangle",
    "shortDescription": "Sculpted floral petals forming the focal point of a luxury golden wrist cuff.",
    "description": "Sculpted floral petals forming the focal point of a luxury golden wrist cuff. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 350,
    "priceQatar": 29,
    "category": "bangles",
    "tags": [
      "Bangles",
      "Flower",
      "Floral"
    ],
    "images": [
      "https://images.unsplash.com/photo-1611591475806-039775089201?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.9,
    "reviewCount": 56,
    "inStock": true,
    "stockCount": 36,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-034",
    "slug": "heart-themed-bangle",
    "title": "Heart Themed Bangle",
    "shortDescription": "Intertwined heart motif bangle celebrating affection. Secure click-lock clasp.",
    "description": "Intertwined heart motif bangle celebrating affection. Secure click-lock clasp. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 350,
    "priceQatar": 29,
    "category": "bangles",
    "tags": [
      "Bangles",
      "Heart",
      "Love"
    ],
    "images": [
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.7,
    "reviewCount": 18,
    "inStock": true,
    "stockCount": 39,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-035",
    "slug": "simple-gold-bangle",
    "title": "Simple Gold Bangle",
    "shortDescription": "Minimalist seamless gold oval bangle that pairs effortlessly with all outfits.",
    "description": "Minimalist seamless gold oval bangle that pairs effortlessly with all outfits. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 350,
    "priceQatar": 29,
    "category": "bangles",
    "tags": [
      "Bangles",
      "Simple",
      "Minimalist"
    ],
    "images": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.8,
    "reviewCount": 25,
    "inStock": true,
    "stockCount": 17,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-036",
    "slug": "tulip-bracelet-colour-blue-gn",
    "title": "Tulip Bracelet - Colour Blue GN",
    "shortDescription": "Artistic blue tulip blossom charms set in warm gold finish. Signature GN piece.",
    "description": "Artistic blue tulip blossom charms set in warm gold finish. Signature GN piece. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 350,
    "priceQatar": 29,
    "category": "bracelet",
    "tags": [
      "Bracelets",
      "Tulip",
      "Blue",
      "GN"
    ],
    "images": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.9,
    "reviewCount": 32,
    "inStock": true,
    "stockCount": 20,
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-037",
    "slug": "diamond-bangle-green",
    "title": "Diamond Bangle - Green",
    "shortDescription": "Channel-set green cubic zirconia diamonds glittering along a sleek gold bangle.",
    "description": "Channel-set green cubic zirconia diamonds glittering along a sleek gold bangle. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 360,
    "priceQatar": 32,
    "category": "bangles",
    "tags": [
      "Bangles",
      "Diamond",
      "Green Zircon"
    ],
    "images": [
      "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.7,
    "reviewCount": 39,
    "inStock": true,
    "stockCount": 23,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-038",
    "slug": "diamond-bangle-white",
    "title": "Diamond Bangle White",
    "shortDescription": "Pavé white diamonds line this luxury bangle for an elevated evening and daily sparkle.",
    "description": "Pavé white diamonds line this luxury bangle for an elevated evening and daily sparkle. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 360,
    "priceQatar": 32,
    "category": "bangles",
    "tags": [
      "Bangles",
      "Diamond",
      "White Zircon"
    ],
    "images": [
      "https://images.unsplash.com/photo-1611591475806-039775089201?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.8,
    "reviewCount": 46,
    "inStock": true,
    "stockCount": 26,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-039",
    "slug": "polished-classic-bangle",
    "title": "Polished Classic Bangle",
    "shortDescription": "Heavyweight mirror polished oval cuff with smooth beveled edges.",
    "description": "Heavyweight mirror polished oval cuff with smooth beveled edges. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 360,
    "priceQatar": 32,
    "category": "bangles",
    "tags": [
      "Bangles",
      "Classic",
      "Polished"
    ],
    "images": [
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.9,
    "reviewCount": 53,
    "inStock": true,
    "stockCount": 29,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-040",
    "slug": "white-stone-bangle",
    "title": "White Stone Bangle",
    "shortDescription": "Solitaire and accent white stones mounted on a refined gold-plated framework.",
    "description": "Solitaire and accent white stones mounted on a refined gold-plated framework. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 360,
    "priceQatar": 32,
    "category": "bangles",
    "tags": [
      "Bangles",
      "White Stone",
      "Sparkle"
    ],
    "images": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.7,
    "reviewCount": 15,
    "inStock": true,
    "stockCount": 32,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-041",
    "slug": "white-flower-bangle",
    "title": "White Flower Bangle",
    "shortDescription": "Crisp white enamel flower blossoms with golden pistil centers on a luxury cuff.",
    "description": "Crisp white enamel flower blossoms with golden pistil centers on a luxury cuff. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 370,
    "priceQatar": 32,
    "category": "bangles",
    "tags": [
      "Bangles",
      "White Flower",
      "Enamel"
    ],
    "images": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.8,
    "reviewCount": 22,
    "inStock": true,
    "stockCount": 35,
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-042",
    "slug": "textured-artisan-bangle",
    "title": "Textured Artisan Bangle",
    "shortDescription": "Intricately hammered tactile finish capturing and diffusing ambient light beautifully.",
    "description": "Intricately hammered tactile finish capturing and diffusing ambient light beautifully. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 390,
    "priceQatar": 32,
    "category": "bangles",
    "tags": [
      "Bangles",
      "Textured",
      "Artisan"
    ],
    "images": [
      "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.9,
    "reviewCount": 29,
    "inStock": true,
    "stockCount": 38,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-043",
    "slug": "luxury-look-bangle",
    "title": "Luxury Look Bangle",
    "shortDescription": "High-end designer inspired cuff with engraved Roman numerals and center crystal.",
    "description": "High-end designer inspired cuff with engraved Roman numerals and center crystal. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 390,
    "priceQatar": 32,
    "category": "bangles",
    "tags": [
      "Bangles",
      "Luxury Look",
      "Roman Numerals"
    ],
    "images": [
      "https://images.unsplash.com/photo-1611591475806-039775089201?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.7,
    "reviewCount": 36,
    "inStock": true,
    "stockCount": 16,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-044",
    "slug": "multi-charm-bangle",
    "title": "Multi-Charm Bangle",
    "shortDescription": "Opulent multi-drop charm bangle featuring hearts, stars, and celestial motifs.",
    "description": "Opulent multi-drop charm bangle featuring hearts, stars, and celestial motifs. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 450,
    "priceQatar": 40,
    "category": "bangles",
    "tags": [
      "Bangles",
      "Multi Charm",
      "Premium"
    ],
    "images": [
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.8,
    "reviewCount": 43,
    "inStock": true,
    "stockCount": 19,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-045",
    "slug": "everyday-minimal-chain-perfect-with-all-outfits",
    "title": "Everyday Minimal Chain (Perfect with all outfits)",
    "shortDescription": "Versatile lightweight golden chain that pairs seamlessly with any shirt, dress, or tee.",
    "description": "Versatile lightweight golden chain that pairs seamlessly with any shirt, dress, or tee. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 120,
    "priceQatar": 10,
    "category": "hanging-chains",
    "tags": [
      "Necklaces",
      "Everyday",
      "Minimalist"
    ],
    "images": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.9,
    "reviewCount": 50,
    "inStock": true,
    "stockCount": 22,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-046",
    "slug": "simple-pearl-chain",
    "title": "Simple Pearl Chain",
    "shortDescription": "Lustrous white freshwater-style pearl drop on a whisper-thin golden cable link.",
    "description": "Lustrous white freshwater-style pearl drop on a whisper-thin golden cable link. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 150,
    "priceQatar": 12,
    "category": "minimal-chains",
    "tags": [
      "Necklaces",
      "Pearl",
      "Dainty"
    ],
    "images": [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.7,
    "reviewCount": 12,
    "inStock": true,
    "stockCount": 25,
    "featured": true,
    "isNewArrival": true,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-047",
    "slug": "snowflake-chain",
    "title": "Snowflake Chain",
    "shortDescription": "Delicate crystalline snowflake pendant with micro zircon sparkle in the core.",
    "description": "Delicate crystalline snowflake pendant with micro zircon sparkle in the core. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 150,
    "priceQatar": 12,
    "category": "hanging-chains",
    "tags": [
      "Necklaces",
      "Snowflake",
      "Pendant"
    ],
    "images": [
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.8,
    "reviewCount": 19,
    "inStock": true,
    "stockCount": 28,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-048",
    "slug": "heart-cross-chain",
    "title": "Heart Cross Chain",
    "shortDescription": "Meaningful intertwined heart and cross motif suspended from a delicate chain.",
    "description": "Meaningful intertwined heart and cross motif suspended from a delicate chain. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 160,
    "priceQatar": 14,
    "category": "minimal-chains",
    "tags": [
      "Necklaces",
      "Heart",
      "Cross"
    ],
    "images": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.9,
    "reviewCount": 26,
    "inStock": true,
    "stockCount": 31,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-049",
    "slug": "rubi-red-chain",
    "title": "Rubi Red Chain",
    "shortDescription": "Deep ruby red faceted solitaire gem set in a 4-prong golden basket pendant.",
    "description": "Deep ruby red faceted solitaire gem set in a 4-prong golden basket pendant. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 160,
    "priceQatar": 14,
    "category": "hanging-chains",
    "tags": [
      "Necklaces",
      "Ruby Red",
      "Solitaire"
    ],
    "images": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.7,
    "reviewCount": 33,
    "inStock": true,
    "stockCount": 34,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-050",
    "slug": "heart-themed-chain",
    "title": "Heart Themed Chain",
    "shortDescription": "Polished hollow heart charm that slides effortlessly along a sleek gold chain.",
    "description": "Polished hollow heart charm that slides effortlessly along a sleek gold chain. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 200,
    "priceQatar": 16,
    "category": "minimal-chains",
    "tags": [
      "Necklaces",
      "Heart",
      "Romantic"
    ],
    "images": [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.8,
    "reviewCount": 40,
    "inStock": true,
    "stockCount": 37,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-051",
    "slug": "black-pendent-gncn001",
    "title": "Black Pendent GNCN001",
    "shortDescription": "Deep obsidian black stone set in a geometric gold bezel. SKU: GNCN001.",
    "description": "Deep obsidian black stone set in a geometric gold bezel. SKU: GNCN001. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 220,
    "priceQatar": 18,
    "category": "hanging-chains",
    "tags": [
      "Necklaces",
      "Black Pendant",
      "GNCN001"
    ],
    "images": [
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.9,
    "reviewCount": 47,
    "inStock": true,
    "stockCount": 15,
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-052",
    "slug": "flower-chain",
    "title": "Flower Chain",
    "shortDescription": "Graceful sculpted flower blossom pendant on a glistening gold finish chain.",
    "description": "Graceful sculpted flower blossom pendant on a glistening gold finish chain. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 240,
    "priceQatar": 20,
    "category": "minimal-chains",
    "tags": [
      "Necklaces",
      "Flower",
      "Floral"
    ],
    "images": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.7,
    "reviewCount": 54,
    "inStock": true,
    "stockCount": 18,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-053",
    "slug": "white-pendent-chain",
    "title": "White Pendent Chain",
    "shortDescription": "Iridescent white mother-of-pearl disc pendant framed by textured gold edging.",
    "description": "Iridescent white mother-of-pearl disc pendant framed by textured gold edging. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 260,
    "priceQatar": 22,
    "category": "hanging-chains",
    "tags": [
      "Necklaces",
      "White Pendant",
      "Mother of Pearl"
    ],
    "images": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.8,
    "reviewCount": 16,
    "inStock": true,
    "stockCount": 21,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-054",
    "slug": "double-layer-chain",
    "title": "Double Layer Chain",
    "shortDescription": "Pre-layered two-tier necklace providing an instant stacked collarbone look.",
    "description": "Pre-layered two-tier necklace providing an instant stacked collarbone look. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 270,
    "priceQatar": 22,
    "category": "minimal-chains",
    "tags": [
      "Necklaces",
      "Double Layer",
      "Layered"
    ],
    "images": [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.9,
    "reviewCount": 23,
    "inStock": true,
    "stockCount": 24,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-055",
    "slug": "baroque-pearl-chain",
    "title": "Baroque Pearl Chain",
    "shortDescription": "Organic freeform baroque pearl centerpiece with warm gold satellite beads.",
    "description": "Organic freeform baroque pearl centerpiece with warm gold satellite beads. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 270,
    "priceQatar": 22,
    "category": "hanging-chains",
    "tags": [
      "Necklaces",
      "Pearl",
      "Baroque"
    ],
    "images": [
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.7,
    "reviewCount": 30,
    "inStock": true,
    "stockCount": 27,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-056",
    "slug": "simple-herringbone-chain",
    "title": "Simple Herringbone Chain",
    "shortDescription": "Sleek flat liquid herringbone snake chain resting flush against the collarbone.",
    "description": "Sleek flat liquid herringbone snake chain resting flush against the collarbone. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 280,
    "priceQatar": 25,
    "category": "minimal-chains",
    "tags": [
      "Necklaces",
      "Herringbone",
      "Snake Chain"
    ],
    "images": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.8,
    "reviewCount": 37,
    "inStock": true,
    "stockCount": 30,
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-057",
    "slug": "simple-charm-chain-white",
    "title": "Simple Charm Chain - White",
    "shortDescription": "Tiny white enamel charm drop necklace. Dainty, understated, and waterproof.",
    "description": "Tiny white enamel charm drop necklace. Dainty, understated, and waterproof. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 290,
    "priceQatar": 25,
    "category": "hanging-chains",
    "tags": [
      "Necklaces",
      "White Charm",
      "Dainty"
    ],
    "images": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.9,
    "reviewCount": 44,
    "inStock": true,
    "stockCount": 33,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-058",
    "slug": "trending-paperclip-chain",
    "title": "Trending Paperclip Chain",
    "shortDescription": "Modern elongated paperclip links in rich gold finish finish. Wear solo or add charms.",
    "description": "Modern elongated paperclip links in rich gold finish finish. Wear solo or add charms. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 290,
    "priceQatar": 25,
    "category": "minimal-chains",
    "tags": [
      "Necklaces",
      "Paperclip",
      "Trending"
    ],
    "images": [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.7,
    "reviewCount": 51,
    "inStock": true,
    "stockCount": 36,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-059",
    "slug": "heart-trending-chain",
    "title": "Heart Trending Chain",
    "shortDescription": "Chunky puffed 3D heart pendant suspended from a substantial trending chain.",
    "description": "Chunky puffed 3D heart pendant suspended from a substantial trending chain. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 320,
    "priceQatar": 29,
    "category": "hanging-chains",
    "tags": [
      "Necklaces",
      "Heart",
      "Trending"
    ],
    "images": [
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.8,
    "reviewCount": 13,
    "inStock": true,
    "stockCount": 39,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-060",
    "slug": "simple-chain-set",
    "title": "Simple Chain Set",
    "shortDescription": "Coordinated dual necklace set designed for complementary everyday layering.",
    "description": "Coordinated dual necklace set designed for complementary everyday layering. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 320,
    "priceQatar": 29,
    "category": "minimal-chains",
    "tags": [
      "Necklaces",
      "Chain Set",
      "Stack"
    ],
    "images": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.9,
    "reviewCount": 20,
    "inStock": true,
    "stockCount": 17,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-061",
    "slug": "white-stone-charm-chain-gncn",
    "title": "White Stone Charm Chain GNCN",
    "shortDescription": "Shimmering multi-facet white zircon charm on luxury link chain. SKU: GNCN series.",
    "description": "Shimmering multi-facet white zircon charm on luxury link chain. SKU: GNCN series. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 350,
    "priceQatar": 29,
    "category": "hanging-chains",
    "tags": [
      "Necklaces",
      "White Stone",
      "GNCN"
    ],
    "images": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.7,
    "reviewCount": 27,
    "inStock": true,
    "stockCount": 20,
    "featured": true,
    "isNewArrival": true,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-062",
    "slug": "contemporary-drop-earring",
    "title": "Contemporary Drop Earring",
    "shortDescription": "Streamlined linear drop earrings offering gentle sway and modern refinement.",
    "description": "Streamlined linear drop earrings offering gentle sway and modern refinement. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 118,
    "priceQatar": 10,
    "category": "stud-and-hoops",
    "tags": [
      "Earrings",
      "Drop",
      "Contemporary"
    ],
    "images": [
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.8,
    "reviewCount": 34,
    "inStock": true,
    "stockCount": 23,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-063",
    "slug": "heart-themed-earring",
    "title": "Heart Themed Earring",
    "shortDescription": "Petite heart silhouette earrings designed for sensitive ears and everyday comfort.",
    "description": "Petite heart silhouette earrings designed for sensitive ears and everyday comfort. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 118,
    "priceQatar": 10,
    "category": "traditional-earrings",
    "tags": [
      "Earrings",
      "Heart",
      "Petite"
    ],
    "images": [
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.9,
    "reviewCount": 41,
    "inStock": true,
    "stockCount": 26,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-064",
    "slug": "square-shaped-stud",
    "title": "Square Shaped Stud",
    "shortDescription": "Sharp geometric square studs with high-polish mirror gold finish.",
    "description": "Sharp geometric square studs with high-polish mirror gold finish. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 118,
    "priceQatar": 10,
    "category": "jhumkas",
    "tags": [
      "Earrings",
      "Studs",
      "Square"
    ],
    "images": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.7,
    "reviewCount": 48,
    "inStock": true,
    "stockCount": 29,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-065",
    "slug": "triangular-stud-earring",
    "title": "Triangular Stud Earring",
    "shortDescription": "Minimalist triangular posts that add subtle edge to any casual or formal outfit.",
    "description": "Minimalist triangular posts that add subtle edge to any casual or formal outfit. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 118,
    "priceQatar": 10,
    "category": "stud-and-hoops",
    "tags": [
      "Earrings",
      "Studs",
      "Triangular"
    ],
    "images": [
      "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.8,
    "reviewCount": 55,
    "inStock": true,
    "stockCount": 32,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-066",
    "slug": "simple-stud-each-pair-price",
    "title": "Simple Stud (Each Pair Price)",
    "shortDescription": "Everyday gold ball stud earrings (per pair). Sleep-safe, shower-safe, and hypoallergenic.",
    "description": "Everyday gold ball stud earrings (per pair). Sleep-safe, shower-safe, and hypoallergenic. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 120,
    "priceQatar": 10,
    "category": "traditional-earrings",
    "tags": [
      "Earrings",
      "Studs",
      "Daily Wear"
    ],
    "images": [
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.9,
    "reviewCount": 17,
    "inStock": true,
    "stockCount": 35,
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-067",
    "slug": "flower-earring",
    "title": "Flower Earring",
    "shortDescription": "Golden blossom flower stud earrings with delicate petal detailing.",
    "description": "Golden blossom flower stud earrings with delicate petal detailing. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 150,
    "priceQatar": 12,
    "category": "jhumkas",
    "tags": [
      "Earrings",
      "Flower",
      "Floral"
    ],
    "images": [
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.7,
    "reviewCount": 24,
    "inStock": true,
    "stockCount": 38,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-068",
    "slug": "heart-themed-stud",
    "title": "Heart Themed Stud",
    "shortDescription": "Substantial polished heart studs with secure comfort butterfly backs.",
    "description": "Substantial polished heart studs with secure comfort butterfly backs. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 200,
    "priceQatar": 16,
    "category": "stud-and-hoops",
    "tags": [
      "Earrings",
      "Heart",
      "Studs"
    ],
    "images": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.8,
    "reviewCount": 31,
    "inStock": true,
    "stockCount": 16,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-069",
    "slug": "heart-earrings",
    "title": "Heart Earrings",
    "shortDescription": "Dangling golden hearts on lever-back hoops for lightweight movement.",
    "description": "Dangling golden hearts on lever-back hoops for lightweight movement. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 230,
    "priceQatar": 18,
    "category": "traditional-earrings",
    "tags": [
      "Earrings",
      "Heart",
      "Dangle"
    ],
    "images": [
      "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.9,
    "reviewCount": 38,
    "inStock": true,
    "stockCount": 19,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-070",
    "slug": "floral-themed-earring",
    "title": "Floral Themed Earring",
    "shortDescription": "Ornate floral motif drop earrings with fine botanical curves in gold finish.",
    "description": "Ornate floral motif drop earrings with fine botanical curves in gold finish. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 250,
    "priceQatar": 20,
    "category": "jhumkas",
    "tags": [
      "Earrings",
      "Floral",
      "Statement"
    ],
    "images": [
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.7,
    "reviewCount": 45,
    "inStock": true,
    "stockCount": 22,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-071",
    "slug": "spiral-stud",
    "title": "Spiral Stud",
    "shortDescription": "Swirling dimensional spiral studs that catch sunlight from every angle.",
    "description": "Swirling dimensional spiral studs that catch sunlight from every angle. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 240,
    "priceQatar": 20,
    "category": "stud-and-hoops",
    "tags": [
      "Earrings",
      "Spiral",
      "Unique"
    ],
    "images": [
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.8,
    "reviewCount": 52,
    "inStock": true,
    "stockCount": 25,
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-072",
    "slug": "xuping-hoop-earrings-multicolour",
    "title": "Xuping Hoop Earrings (Multicolour)",
    "shortDescription": "Authentic Xuping huggie hoops studded with vibrant multicolour rainbow crystals.",
    "description": "Authentic Xuping huggie hoops studded with vibrant multicolour rainbow crystals. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 269,
    "priceQatar": 22,
    "category": "traditional-earrings",
    "tags": [
      "Earrings",
      "Xuping",
      "Hoops",
      "Multicolour"
    ],
    "images": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.9,
    "reviewCount": 14,
    "inStock": true,
    "stockCount": 28,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-073",
    "slug": "trending-hoop-earring",
    "title": "Trending Hoop Earring",
    "shortDescription": "Chunky hollow croissant twist hoop earrings. Ultra-lightweight for all-day wear.",
    "description": "Chunky hollow croissant twist hoop earrings. Ultra-lightweight for all-day wear. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 270,
    "priceQatar": 22,
    "category": "jhumkas",
    "tags": [
      "Earrings",
      "Hoops",
      "Trending"
    ],
    "images": [
      "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.7,
    "reviewCount": 21,
    "inStock": true,
    "stockCount": 31,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-074",
    "slug": "heart-earring-deluxe",
    "title": "Heart Earring Deluxe",
    "shortDescription": "Pavé micro-zircon paved heart earrings delivering extraordinary luxury sparkle.",
    "description": "Pavé micro-zircon paved heart earrings delivering extraordinary luxury sparkle. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 320,
    "priceQatar": 29,
    "category": "stud-and-hoops",
    "tags": [
      "Earrings",
      "Heart",
      "Pavé",
      "Deluxe"
    ],
    "images": [
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.8,
    "reviewCount": 28,
    "inStock": true,
    "stockCount": 34,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-075",
    "slug": "bead-anklets-adults",
    "title": "Bead Anklets (Adults)",
    "shortDescription": "Bohemian golden bead accents strung along a strong waterproof stainless steel chain.",
    "description": "Bohemian golden bead accents strung along a strong waterproof stainless steel chain. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 440,
    "priceQatar": 40,
    "category": "anklets",
    "tags": [
      "Anklets",
      "Beads",
      "Adults",
      "Boho"
    ],
    "images": [
      "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.9,
    "reviewCount": 35,
    "inStock": true,
    "stockCount": 37,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-076",
    "slug": "kids-anklet",
    "title": "Kids Anklet",
    "shortDescription": "Dainty gentle bell charm anklet sized safely and comfortably for children.",
    "description": "Dainty gentle bell charm anklet sized safely and comfortably for children. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 480,
    "priceQatar": 40,
    "category": "traditional-sets",
    "tags": [
      "Anklets",
      "Kids",
      "Dainty"
    ],
    "images": [
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.7,
    "reviewCount": 42,
    "inStock": true,
    "stockCount": 15,
    "featured": true,
    "isNewArrival": true,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-077",
    "slug": "simple-rope-anklets-adults",
    "title": "Simple Rope Anklets - Adults",
    "shortDescription": "Classic twisted rope chain anklet. High-polish golden weave that rests comfortably on the ankle.",
    "description": "Classic twisted rope chain anklet. High-polish golden weave that rests comfortably on the ankle. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 480,
    "priceQatar": 40,
    "category": "anklets",
    "tags": [
      "Anklets",
      "Rope Chain",
      "Adults"
    ],
    "images": [
      "https://images.unsplash.com/photo-1611591475806-039775089201?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.8,
    "reviewCount": 49,
    "inStock": true,
    "stockCount": 18,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": true
  },
  {
    "id": "gn-prod-078",
    "slug": "butterfly-charm-anklets-adults",
    "title": "Butterfly Charm Anklets - Adults",
    "shortDescription": "Whimsical fluttering butterfly charms suspended along a delicate dual-link anklet.",
    "description": "Whimsical fluttering butterfly charms suspended along a delicate dual-link anklet. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 500,
    "priceQatar": 40,
    "category": "anklets",
    "tags": [
      "Anklets",
      "Butterfly",
      "Charm",
      "Adults"
    ],
    "images": [
      "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.9,
    "reviewCount": 56,
    "inStock": true,
    "stockCount": 21,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-079",
    "slug": "multi-diamond-anklets",
    "title": "Multi Diamond Anklets",
    "shortDescription": "Multiple glittering bezel-set cubic zirconia diamonds creating radiant sparkle with each step.",
    "description": "Multiple glittering bezel-set cubic zirconia diamonds creating radiant sparkle with each step. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 620,
    "priceQatar": 50,
    "category": "anklets",
    "tags": [
      "Anklets",
      "Diamond",
      "Zircon",
      "Sparkle"
    ],
    "images": [
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.7,
    "reviewCount": 18,
    "inStock": true,
    "stockCount": 24,
    "featured": false,
    "isNewArrival": true,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-080",
    "slug": "multi-charm-anklets",
    "title": "Multi Charm Anklets",
    "shortDescription": "Richly embellished anklet featuring celestial stars, crescent moons, and mini droplets.",
    "description": "Richly embellished anklet featuring celestial stars, crescent moons, and mini droplets. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 640,
    "priceQatar": 50,
    "category": "anklets",
    "tags": [
      "Anklets",
      "Multi Charm",
      "Celestial"
    ],
    "images": [
      "https://images.unsplash.com/photo-1611591475806-039775089201?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.8,
    "reviewCount": 25,
    "inStock": true,
    "stockCount": 27,
    "featured": false,
    "isNewArrival": false,
    "isBestSeller": false
  },
  {
    "id": "gn-prod-081",
    "slug": "multi-heart-anklets",
    "title": "Multi Heart Anklets",
    "shortDescription": "Cascading polished golden hearts that catch light along the entire ankle circumference.",
    "description": "Cascading polished golden hearts that catch light along the entire ankle circumference. Handcrafted with premium 304 & 306 grade stainless steel with high-grade PVD gold plating. 100% waterproof, sweatproof, and hypoallergenic. Wear it everyday anywhere.",
    "price": 640,
    "priceQatar": 50,
    "category": "anklets",
    "tags": [
      "Anklets",
      "Multi Heart",
      "Romantic"
    ],
    "images": [
      "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&q=80&w=800"
    ],
    "rating": 4.9,
    "reviewCount": 32,
    "inStock": true,
    "stockCount": 30,
    "featured": true,
    "isNewArrival": false,
    "isBestSeller": true
  }
];

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
        productId: "gn-prod-001",
        title: "Statement Ring",
        slug: "statement-ring",
        price: 140,
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800",
        quantity: 1,
      },
      {
        id: "ci-2",
        productId: "gn-prod-013",
        title: "Clover Black Bracelet",
        slug: "clover-black-bracelet",
        price: 150,
        image: "https://images.unsplash.com/photo-1611591475806-039775089201?auto=format&fit=crop&q=80&w=800",
        quantity: 1,
      },
    ],
    subtotal: 290,
    discountTotal: 0,
    shippingFee: 0,
    taxTotal: 0,
    grandTotal: 290,
    paymentMethod: "cod",
    trackingNumber: "DTDC-KL-982341",
  },
];
