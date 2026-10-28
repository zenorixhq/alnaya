import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

function getQatarPriceForInr(inrPrice: number): number {
  if (inrPrice <= 130) return 10;
  if (inrPrice <= 150) return 12;
  if (inrPrice <= 170) return 14;
  if (inrPrice <= 200) return 16;
  if (inrPrice <= 230) return 18;
  if (inrPrice <= 250) return 20;
  if (inrPrice <= 275) return 22;
  if (inrPrice <= 300) return 25;
  if (inrPrice <= 350) return 29;
  if (inrPrice <= 400) return 32;
  if (inrPrice <= 500) return 40;
  if (inrPrice <= 650) return 50;
  return Math.round(inrPrice / 12);
}

async function run() {
  console.log("=== Updating Qatar Prices in Neon DB & mockData.ts ===");

  // 1. Update Neon PostgreSQL Database
  const dbProducts = await prisma.product.findMany();
  console.log(`Found ${dbProducts.length} products in Neon PostgreSQL DB.`);

  let updatedCount = 0;
  for (const prod of dbProducts) {
    const qatarPrice = getQatarPriceForInr(prod.price);
    const qatarSalePrice = prod.salePrice ? getQatarPriceForInr(prod.salePrice) : null;

    await prisma.product.update({
      where: { id: prod.id },
      data: {
        priceQatar: qatarPrice,
        salePriceQatar: qatarSalePrice,
      },
    });
    updatedCount++;
  }
  console.log(`Updated ${updatedCount} products in Neon DB with Qatar prices.`);

  // 2. Update data/mockData.ts
  const mockDataPath = path.resolve(__dirname, "../data/mockData.ts");
  let mockContent = fs.readFileSync(mockDataPath, "utf-8");

  // Regex replace: for each "price": <number> that does NOT have "priceQatar" following it
  // Let's parse mockData or safely inject "priceQatar"
  const regex = /"price":\s*(\d+),(\r?\n\s*"category":)/g;
  let matches = 0;
  mockContent = mockContent.replace(regex, (match, priceStr, rest) => {
    matches++;
    const inr = parseInt(priceStr, 10);
    const qar = getQatarPriceForInr(inr);
    return `"price": ${inr},\n    "priceQatar": ${qar},${rest}`;
  });

  fs.writeFileSync(mockDataPath, mockContent, "utf-8");
  console.log(`Updated ${matches} products in data/mockData.ts with priceQatar.`);

  // 3. Verification sample
  const sample = await prisma.product.findMany({
    take: 5,
    select: { title: true, price: true, priceQatar: true },
  });
  console.log("\nSample updated products from DB:");
  console.table(sample);

  await prisma.$disconnect();
  console.log("\nAll products updated with India (₹) and Qatar (QAR) prices successfully!");
}

run().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
