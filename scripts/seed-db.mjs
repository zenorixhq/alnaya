import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const gleamNestProducts = [
  {
    id: "prod-clover-necklace",
    slug: "four-leaf-clover-pearl-necklace",
    title: "18K Gold Four-Leaf Clover Pearl Necklace",
    shortDescription: "Signature anti-tarnish four-leaf clover pendant with natural iridescent mother of pearl.",
    description: "GleamNest's most beloved piece. Crafted from surgical-grade 316L stainless steel with thick 18K PVD gold plating that never fades. Completely waterproof, sweat-proof, and perfume-safe.",
    price: 999.0,
    salePrice: 799.0,
    category: "necklaces",
    tags: ["Necklace", "Clover", "Bestseller", "Waterproof"],
    images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"],
    rating: 4.9,
    reviewCount: 64,
    inStock: true,
    stockCount: 18,
    featured: true,
    isBestSeller: true,
    isNewArrival: false,
  },
  {
    id: "prod-croissant-hoops",
    slug: "twisted-chunky-croissant-gold-hoops",
    title: "Chunky Twisted Croissant Gold Hoops",
    shortDescription: "Ultra-lightweight hollow croissant hoops designed for effortless all-day wear.",
    description: "The ultimate everyday Parisian statement. Hollowed interior design ensures zero earlobe tugging while delivering bold, dimensional presence.",
    price: 699.0,
    salePrice: 499.0,
    category: "earrings",
    tags: ["Hoops", "Earrings", "Everyday", "Lightweight"],
    images: ["https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=800"],
    rating: 4.8,
    reviewCount: 42,
    inStock: true,
    stockCount: 15,
    featured: true,
    isBestSeller: true,
    isNewArrival: false,
  },
  {
    id: "prod-snake-chain",
    slug: "waterproof-herringbone-snake-chain",
    title: "Liquid Gold Herringbone Snake Chain",
    shortDescription: "Sleek liquid-flow flat herringbone chain that lays perfectly flat on your collarbone.",
    description: "Like liquid gold draped over your skin. Mirror-polished flat links reflect light effortlessly and resist kinking. Perfect for wearing solo or layering.",
    price: 849.0,
    salePrice: 649.0,
    category: "necklaces",
    tags: ["Chain", "Snake Chain", "Waterproof"],
    images: ["https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=800"],
    rating: 4.9,
    reviewCount: 38,
    inStock: true,
    stockCount: 12,
    featured: true,
    isBestSeller: false,
    isNewArrival: true,
  },
  {
    id: "prod-roman-cuff",
    slug: "roman-numeral-titanium-cuff-bangle",
    title: "Roman Numeral Luxury Oval Cuff Bangle",
    shortDescription: "Iconic high-fashion oval hinged cuff engraved with etched Roman numerals.",
    description: "An enduring design classic. Features a seamless push-lock hinge mechanism and precision laser-etched Roman numerals.",
    price: 1199.0,
    salePrice: 899.0,
    category: "bracelets",
    tags: ["Bangle", "Cuff", "Luxury", "Bestseller"],
    images: ["https://images.unsplash.com/photo-1611591475878-3861219b6748?auto=format&fit=crop&q=80&w=800"],
    rating: 5.0,
    reviewCount: 29,
    inStock: true,
    stockCount: 9,
    featured: true,
    isBestSeller: true,
    isNewArrival: false,
  },
  {
    id: "prod-tennis-bracelet",
    slug: "classic-zirconia-crystal-tennis-bracelet",
    title: "Dainty Bezel Zirconia Tennis Bracelet",
    shortDescription: "Ultra-sparkling 5A cubic zirconia stones set in waterproof protective bezel cups.",
    description: "Experience diamond-grade brilliance with everyday durability. Each stone is individually bezel-set in waterproof stainless steel.",
    price: 1099.0,
    salePrice: 849.0,
    category: "bracelets",
    tags: ["Tennis Bracelet", "Crystals", "Sparkle"],
    images: ["https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&q=80&w=800"],
    rating: 4.8,
    reviewCount: 25,
    inStock: true,
    stockCount: 10,
    featured: false,
    isBestSeller: false,
    isNewArrival: true,
  },
  {
    id: "prod-baguette-ring",
    slug: "dainty-baguette-solitaire-adjustable-ring",
    title: "Dainty Baguette Solitaire Adjustable Ring",
    shortDescription: "Modern architectural crystal ring with free-size open band fitting any finger.",
    description: "Eliminate ring size confusion. Crafted with a discreet open-cuff band that gently adjusts to comfortably fit ring sizes 5 through 9.",
    price: 549.0,
    salePrice: 399.0,
    category: "rings",
    tags: ["Ring", "Adjustable", "Crystal"],
    images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800"],
    rating: 4.7,
    reviewCount: 31,
    inStock: true,
    stockCount: 20,
    featured: true,
    isBestSeller: true,
    isNewArrival: false,
  },
];

async function seed() {
  console.log("Seeding GleamNest jewelry collection into prisma/dev.db...");

  await prisma.product.deleteMany({});
  await prisma.order.deleteMany({});

  for (const p of gleamNestProducts) {
    await prisma.product.create({
      data: {
        id: p.id,
        slug: p.slug,
        title: p.title,
        shortDescription: p.shortDescription,
        description: p.description,
        price: p.price,
        salePrice: p.salePrice || null,
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

  // Create sample WhatsApp orders
  await prisma.order.create({
    data: {
      orderNumber: "GN-8841",
      customerName: "Ananya Sharma",
      customerEmail: "ananya.s@gmail.com",
      customerPhone: "+91 98765 43210",
      shippingAddress: "Flat 402, Lotus Towers, MG Road, Kochi, Kerala 682001",
      itemsJson: JSON.stringify([
        { title: "18K Gold Four-Leaf Clover Pearl Necklace", price: 799.0, quantity: 1 },
      ]),
      subtotal: 799.0,
      discountTotal: 0.0,
      shippingFee: 0.0,
      taxTotal: 0.0,
      grandTotal: 799.0,
      paymentMethod: "whatsapp",
      paymentStatus: "paid",
      orderStatus: "processing",
    },
  });

  const pCount = await prisma.product.count();
  const oCount = await prisma.order.count();
  console.log(`✅ Database ready: ${pCount} GleamNest jewelry items & ${oCount} sample orders seeded!`);
}

seed()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
