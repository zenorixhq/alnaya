import { prisma } from "../lib/prisma.js";
import { products } from "../data/mockData.js";

async function main() {
  console.log("Seeding database with initial catalog...");

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
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
        rating: p.rating || 5.0,
        reviewCount: p.reviewCount || 0,
        inStock: p.inStock,
        stockCount: p.stockCount,
        featured: !!p.featured,
        isNewArrival: !!p.isNewArrival,
        isBestSeller: !!p.isBestSeller,
        variantJson: p.variantAttributes ? JSON.stringify(p.variantAttributes) : null,
        specsJson: p.specifications ? JSON.stringify(p.specifications) : null,
      },
    });
  }

  console.log(`✅ Successfully seeded ${products.length} products into database.`);
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
