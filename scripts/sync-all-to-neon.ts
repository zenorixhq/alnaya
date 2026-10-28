import { PrismaClient } from "@prisma/client";
import { products as mockProducts } from "../data/mockData";

const prisma = new PrismaClient();

async function syncAll() {
  console.log(`Starting sync of ${mockProducts.length} mock products to Neon DB...`);

  let added = 0;
  let skipped = 0;

  for (const p of mockProducts) {
    try {
      const existing = await prisma.product.findFirst({
        where: {
          OR: [
            { id: p.id },
            { slug: p.slug }
          ]
        }
      });

      if (existing) {
        skipped++;
        continue;
      }

      await prisma.product.create({
        data: {
          id: p.id,
          slug: p.slug,
          title: p.title,
          shortDescription: p.shortDescription || p.description?.slice(0, 100) || "",
          description: p.description || "",
          price: p.price,
          salePrice: p.salePrice || null,
          category: p.category,
          tags: JSON.stringify(p.tags || [p.category]),
          images: JSON.stringify(p.images || []),
          rating: p.rating || 5.0,
          reviewCount: p.reviewCount || 0,
          inStock: p.inStock !== false,
          stockCount: p.stockCount || 10,
          featured: !!p.featured,
          isNewArrival: !!p.isNewArrival,
          isBestSeller: !!p.isBestSeller,
        }
      });
      added++;
    } catch (err: any) {
      console.error(`Error adding product ${p.slug}:`, err.message);
    }
  }

  const total = await prisma.product.count();
  console.log(`\n🎉 SYNC SUCCESS!`);
  console.log(`- Newly added: ${added}`);
  console.log(`- Skipped existing: ${skipped}`);
  console.log(`- Total products in database: ${total}`);
  await prisma.$disconnect();
}

syncAll().catch(console.error);
